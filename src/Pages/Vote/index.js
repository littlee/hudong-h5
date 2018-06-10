import React from 'react';

import Page from 'components/Page';
import styled from 'styled-components';
import VoteBlock from './VoteBlock';
import Modal from 'react-modal';
Modal.setAppElement('#root');

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  content: {
    position: 'absolute',
    width: '90%',
    top: '5%',
    bottom: '5%',
    left: 0,
    right: 0,
    margin: 'auto',
    border: 'none',
    background: 'transparent',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 0,
    outline: 'none',
    padding: 0
  }
};

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

// const FormErr = styled.div`
//   background-color: #ffebee;
//   color: #f44336;
//   padding: 10px;
// `;

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

const ModalImg = styled.img`
  display: block;
  width: 100%;
`;

class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: '',
      showModal: false,
      modalImg: null
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
              <VoteBlock
                activity_id={this.props.query.id}
                key={index}
                {...item}
                onClickVote={this._clickVote.bind(this, item, index)}
                onClickImg={this._openModal}
              />
            ))}
          </VoteBlockWrap>

          <BtnWrap>
            <Btn onClick={this._clickBtn}>
              <img src={images_config.detail_btn} alt="" />
            </Btn>
          </BtnWrap>
        </Inner>

        <Modal
          isOpen={this.state.showModal}
          onRequestClose={this._closeModal}
          shouldCloseOnOverlayClick={false}
          style={modalStyle}
        >
          <ModalImg
            src={this.state.modalImg}
            onClick={this._closeModal}
          />
        </Modal>
      </Page>
    );
  }

  _clickBtn = () => {
    if (this.props.query.editMode) {
      return;
    }
    this.props.changePage('Result');
  };

  _clickVote = (item, index) => {
    this.props.onVote && this.props.onVote(item, index);
  };

  _openModal = modalImg => {
    this.setState({
      showModal: true,
      modalImg
    });
  };

  _closeModal = () => {
    this.setState({
      showModal: false,
      modalImg: null
    });
  };
}

export default Vote;
