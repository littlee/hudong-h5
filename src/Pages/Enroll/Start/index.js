import React from 'react';
import Page from 'components/Page';
import styled from 'styled-components';

const Inner = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const Btn = styled.div`
  margin-bottom: 5%;
`;

const StartPage = Page.extend`
  background-position: center;
`

class Start extends React.Component {
  render() {
    const { images_config } = this.props.data;
    return (
      <StartPage bg={`url(${images_config.home_bg})`}>
        <Inner>
          <Btn onClick={this._clickBtn}>
            <img src={images_config.home_btn} alt="" />
          </Btn>
        </Inner>
      </StartPage>
    );
  }

  _clickBtn = () => {
    this.props.changePage && this.props.changePage('Detail');
  }
}

export default Start;
