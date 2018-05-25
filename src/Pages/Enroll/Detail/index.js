import React from 'react';

import Page from 'components/Page';
import styled from 'styled-components';
import axios from 'axios';
import config from '../../../config';
import Question from './Question';

const Inner = styled.div`
  padding: 15px;
`;

const BtnWrap = styled.div`
  padding: 15px 0;
  text-align: center;
`;

const Btn = styled.div`
  display: inline-block;
  max-width: 100%;
  margin: auto;
  opacity: ${props => (props.disabled ? '0.5' : '1')};

  > img {
    display: block;
    max-width: 100%;
  }
`;

const FormErr = styled.div`
  background-color: #ffebee;
  color: #f44336;
  padding: 10px;
`;

const Title = styled.h3`
  margin: 0;
  padding: 15px 0;
  font-size: 16px;
`;

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: '',
      submitting: false
    };
  }

  render() {
    const { name, images_config, questions_config } = this.props.data;
    const { changeAnswer, query } = this.props;
    return (
      <Page
        bg={`url(${images_config.content_bg})`}
        repeat={true}
        autoHeight={true}
      >
        <Inner>
          <Title>{name}</Title>

          {questions_config.map((item, index) => (
            <Question
              query={query}
              key={index}
              index={index}
              {...item}
              changeAnswer={changeAnswer}
            />
          ))}

          {this.state.err ? <FormErr>{this.state.err}</FormErr> : null}

          <BtnWrap>
            <Btn onClick={this._clickBtn} disabled={this.state.submitting}>
              <img src={images_config.detail_btn} alt="" />
            </Btn>
          </BtnWrap>
        </Inner>
      </Page>
    );
  }

  _clickBtn = () => {
    if (this.props.query.editMode) {
      return;
    }

    if (this.state.submitting) {
      return;
    }
    const { id, questions_config } = this.props.data;
    var formDate = questions_config.map(item => {
      let answers = item.answers;
      if (item.type === 'extra_file') {
        answers = item.answers.filter(file => {
          return file.value !== '';
        });
      }

      return {
        title: item.title,
        type: item.type,
        answers
      };
    });
    let hasErr = false;
    for (let i = 0; i < questions_config.length; i++) {
      let qItem = questions_config[i];
      if (qItem.required) {
        if (qItem.type === 'single_choose') {
          if (!qItem.answers.length) {
            this.setState({
              err: `请填写第 ${i + 1} 题`
            });
            hasErr = true;
            break;
          }
        } else if (qItem.type === 'multi_choose') {
          if (!qItem.answers.length) {
            this.setState({
              err: `请填写第 ${i + 1} 题`
            });
            hasErr = true;
            break;
          }
        } else if (qItem.type === 'extra_file') {
          const filledAns = qItem.answers.filter(item => {
            return item.value !== '';
          });

          if (!filledAns.length) {
            this.setState({
              err: `请填写第 ${i + 1} 题`
            });
            hasErr = true;
            break;
          }

          if (filledAns.length < qItem.min_num) {
            this.setState({
              err: `至少上传 ${qItem.min_num} 个附件`
            });
            hasErr = true;
            break;
          }

          for (let fi = 0; fi < filledAns.length; fi++) {
            if (!filledAns[fi].name) {
              this.setState({
                err: `请填写第 ${i + 1} 题第 ${fi + 1} 个附件名称`
              });
              hasErr = true;
              break;
            }
          }
        } else if (qItem.type === 'input') {
          if (!qItem.answers[0]) {
            this.setState({
              err: `请填写第 ${i + 1} 题`
            });
            hasErr = true;
            break;
          }
        }
      }
    }

    if (hasErr) {
      return;
    }

    this.setState({
      submitting: true
    });

    let userInfo = JSON.parse(localStorage.getItem(config.userinfo_key));

    if (!userInfo.city) {
      delete userInfo['city'];
    }

    axios
      .post(config.api_prefix + '/form', {
        ...userInfo,
        activity_id: id,
        openid: localStorage.getItem(config.openid_key),
        form: formDate
      })
      .then(res => {
        this.setState({
          submitting: false
        });
        const { code, message } = res.data;
        if (code !== 0) {
          alert(message);
        } else {
          this.props.changePage('Result');
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          submitting: false
        });
      });
  };
}

export default Detail;
