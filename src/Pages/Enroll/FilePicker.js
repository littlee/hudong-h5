import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Loading from 'react-loading';
import config from 'config';
import shortid from 'shortid';

function isImage(file) {
  return /^image\/*/.test(file.type);
}

function getToken() {
  return axios.get(config.api_prefix + '/getToken');
}

function getFileKey() {
  return 'hudong/' + shortid.generate() + '' + Date.now();
}

const Wrap = styled.div`
  float: left;
  width: 45%;
  margin-right: 5%;
  margin-bottom: 5%;

  &:nth-child(2n) {
    margin-right: 0;
  }
`;

const Add = styled.div`
  padding-top: 100%;
  position: relative;
  border: 1px solid #aaa;
  border-radius: 5px;
  background-color: white;

  &:before,
  &:after {
    content: "";
    font-size: 3em;
    width: 1em;
    height: 0.15em;
    background-color: #aaa;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    display: block;
    position: absolute;
  }

  &:after {
    width: 0.15em;
    height: 1em;
  }
`;

const FileInput = styled.input.attrs({
  type: 'file'
})`
  display: none;
`;

const PreviewFrame = styled.div`
  padding-top: 100%;
  position: relative;
  border: 1px solid #aaa;
  border-radius: 5px;
  background-color: white;

  > span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: block;
    padding: 5px;
  }

  > img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 90%;
    max-height: 90%;
    display: block;
    margin: auto;
  }
`;

const SCLoading = styled(Loading)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  margin: auto;
`;

const Remove = styled.div`
  position: absolute;
  color: white;
  font-size: 2em;
  top: -0.3em;
  right: -0.3em;
  background-color: #f44336;
  width: 1em;
  height: 1em;
  line-height: 1em;
  text-align: center;
  border-radius: 50%;

  &:before {
    content: "";
    width: 0.5em;
    height: 0.1em;
    background-color: white;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    display: block;
    position: absolute;
  }
`;

const Preview = props => {
  return (
    <PreviewFrame uploading={props.uploading} onClick={props.onClick}>
      {props.isImg ? (
        <img src={props.preview} alt="" />
      ) : (
        <span>{props.preview}</span>
      )}
      {!props.uploading && props.preview ? (
        <Remove
          onClick={e => {
            e.stopPropagation();
            props.onClear && props.onClear();
          }}
        />
      ) : null}
      {props.uploading ? <SCLoading color="#333" type="spin" /> : null}
    </PreviewFrame>
  );
};

const FileNameInput = styled.input.attrs({
  type: 'text',
  placeholder: '请填写附件名称'
})`
  display: block;
  width: 100%;
  -webkit-appearance: none;
  border: 1px solid #999;
  padding: 5px;
  outline: 0;
  margin-top: 5px;
  border-radius: 5px;
`;

class FilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      isImg: false,
      preview: ''
    };
    this.fileReader = new FileReader();
    this.fileInput = React.createRef();
  }

  render() {
    const { preview, isImg, uploading } = this.state;

    return (
      <Wrap>
        {preview ? (
          <Preview
            preview={preview}
            isImg={isImg}
            uploading={uploading}
            onClick={this._chooseFile}
            onClear={this._clear}
          />
        ) : (
          <Add onClick={this._chooseFile} />
        )}

        <FileNameInput
          value={this.props.answer.name}
          onChange={e => {
            this.props.onChangeName && this.props.onChangeName(e.target.value);
          }}
        />
        <FileInput innerRef={this.fileInput} onChange={this._changeFile} />
      </Wrap>
    );
  }

  _clear = () => {
    this.setState({
      uploading: false,
      preview: ''
    });
    this.props.onClear && this.props.onClear();
  };

  _chooseFile = () => {
    if (this.props.editMode) {
      return;
    }
    if (this.state.uploading) {
      return;
    }
    this.fileInput.current.click();
  };

  _changeFile = e => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      this.setState({
        uploading: true
      });
      if (isImage(file)) {
        this.fileReader.onload = e => {
          this.setState({
            isImg: true,
            preview: e.target.result
          });
          this._uploadFile(file);
        };
        this.fileReader.readAsDataURL(file);
      } else {
        this.setState({
          isImg: false,
          preview: file.name
        });
        this._uploadFile(file);
      }
    }
  };

  _uploadFile = file => {
    getToken().then(res => {
      const {
        region,
        AccessKeyId: accessKeyId,
        AccessKeySecret: accessKeySecret,
        SecurityToken: stsToken,
        bucket
      } = res.data.data;

      let ossClient = new window.OSS.Wrapper({
        region,
        accessKeyId,
        accessKeySecret,
        stsToken,
        bucket
      });

      let fileKey = getFileKey();

      ossClient.multipartUpload(fileKey, file).then(ossRes => {
        this.setState({
          uploading: false
        });
        this.fileInput.current.value = '';
        this.props.onComplete &&
          this.props.onComplete(
            `http://${bucket}.${region}.aliyuncs.com/${fileKey}`
          );
      });
    });
  };
}

export default FilePicker;
