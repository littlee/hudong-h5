import React from 'react';
import styled from 'styled-components';

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
`

class VoteBlock extends React.Component {
  render() {
    const { title, description, imageurl, vote_num } = this.props;

    return (
      <Wrap>
        <Content>
          <Title>{title}</Title>
          {description ? <Desc>{description}</Desc> : null}
          {imageurl ? <Img src={imageurl}/> : null}
        </Content>
        <Control>
          <Num>{vote_num}</Num>
          <Btn disabled={false}>给TA投一票</Btn>
        </Control>
      </Wrap>
    );
  }
}

export default VoteBlock;
