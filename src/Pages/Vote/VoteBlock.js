import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import config from 'config';

const Wrap = styled.div`
  flex-basis: calc(50% - 5px);
  background-color: rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  height: 40vh;
`;

const Content = styled.div`
  padding: 5px;
  flex-grow: 1;
  overflow: auto;
  /* background-color: aqua; */
`;

const Title = styled.div`
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
`;
const Desc = styled.div`
  margin-bottom: 5px;
`;

const Control = styled.div`
  flex-shrink: 1;
  background-color: white;
  text-align: center;
  padding: 5px 0;
`;

const Num = styled.div`
  color: #999;
  margin-bottom: 5px;
`;

const Btn = styled.button.attrs({
  type: 'button'
})`
  border: 1px solid #2196f3;
  background-color: #42a5f5;
  color: white;
  padding: 6px 12px;
  border-radius: 5px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

const Img = styled.img`
  display: block;
  max-width: 100%;
`;

const BtnText = props => {
  if (props.ing) {
    return <span>...</span>;
  }

  if (props.is_vote) {
    return <span>已投</span>;
  }

  return <span>给 TA 投一票</span>;
};

class VoteBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ing: false
    };
  }

  render() {
    const { title, description, imageurl, all_vote_num, is_vote } = this.props;

    const { ing } = this.state;

    return (
      <Wrap>
        <Content>
          <Title>{title}</Title>
          {description ? <Desc>{description}</Desc> : null}
          {imageurl ? <Img src={imageurl} onClick={this._clickImg} /> : null}
        </Content>
        <Control>
          <Num>{all_vote_num}</Num>
          <Btn disabled={is_vote || ing} onClick={this._clickBtn}>
            <BtnText ing={ing} is_vote={is_vote} />
          </Btn>
        </Control>
      </Wrap>
    );
  }

  _clickBtn = () => {
    this.setState({
      ing: true
    });
    axios
      .post(`${config.api_prefix}/vote/activity/vote`, {
        activity_id: this.props.activity_id,
        item_id: this.props.id
      })
      .then(res => {
        this.setState({
          ing: false
        });

        if (res.data.code !== 0) {
          alert(res.data.message);
          return;
        }

        // update local is_vote
        this.props.onClickVote && this.props.onClickVote();
      })
      .catch(err => {
        console.log(err);
        this.setState({
          ing: false
        });
      });
  };

  _clickImg = () => {
    this.props.onClickImg && this.props.onClickImg(this.props.imageurl);
  };
}

export default VoteBlock;
