import React from 'react';

import Page from 'components/Page';
import styled from 'styled-components';
import VoteBlock from './VoteBlock';
// import axios from 'axios';
// import config from 'config';

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
  padding: 10px 0;
  font-size: 16px;
  text-align: center;
`;

const VoteBlockWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: '',
      submitting: false
    };
  }

  render() {
    const { name, images_config, questions_config } = this.props.data;
    return (
      <Page
        bg={`url(${images_config.content_bg})`}
        repeat={true}
        autoHeight={true}
      >
        <Inner>
          <Title>{name}</Title>
          <VoteBlockWrap>
            {questions_config.map((item, index) => (
              <VoteBlock key={index} {...item} />
            ))}
          </VoteBlockWrap>
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
  };
}

export default Vote;
