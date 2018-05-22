import React, { Component } from 'react';
import qs from 'qs';
import Start from './Pages/Enroll/Start';
import Detail from './Pages/Enroll/Detail';
import Result from './Pages/Enroll/Result';
import axios from 'axios';
import config from './config';
import DocumentTitle from 'react-document-title';
import { range } from 'lodash';

const query = qs.parse(window.location.search.slice(1));

const PAGE_MAP = {
  Start,
  Detail,
  Result
};

function padAnswers(data) {
  data.questions_config = data.questions_config.map(item => {
    let answers = [];
    if (item.type === 'sort') {
      answers = range(item.options.length);
    } else if (item.type === 'extra_file') {
      answers = range(item.max_num).map(i => ({
        name: '',
        value: ''
      }));
    }

    return {
      ...item,
      answers
    };
  });
  return data;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      page: query.page || 'Start',
      data: {}
    };
  }

  componentDidMount() {
    if (query.editMode) {
      window.addEventListener('message', e => {
        let { data: msgData } = e;
        if (typeof msgData === 'string') {
          try {
            msgData = JSON.parse(msgData);
            if (msgData.fromHudong) {
              msgData = padAnswers(msgData);
              this.setState(prevState => {
                return {
                  loading: false,
                  data: {
                    ...prevState.data,
                    ...msgData
                  }
                };
              });
            }
          } catch (err) {
            console.log('INVALID JSON MESSAGE');
          }
        }
      });
      return;
    }

    if (query.debug) {
      localStorage.setItem(config.openid_key, 'debug_openid');
      localStorage.setItem(
        config.userinfo_key,
        JSON.stringify({ openid: 'debug_openid', nickname: 'debug_nickname' })
      );
    }

    if (localStorage.getItem(config.openid_key)) {
      this._init();
    } else {
      if (query.code) {
        window.WECHAT.getUserInfo((err, res) => {
          if (err) {
            alert(err);
            return;
          }
          localStorage.setItem(config.openid_key, res.openid);
          localStorage.setItem(config.userinfo_key, JSON.stringify(res));
          this._init();
        });
      } else {
        window.WECHAT.goTwoAuth(
          'snsapi_userinfo',
          'STATE',
          window.WECHAT.filter(['code'])
        );
      }
    }
  }

  render() {
    const CurrPage = PAGE_MAP[this.state.page] || Start;

    if (this.state.loading) {
      return null;
    }

    return (
      <DocumentTitle title={this.state.data.name}>
        <CurrPage
          query={query}
          data={this.state.data}
          changePage={this._changePage}
          changeAnswer={this._changeAns}
        />
      </DocumentTitle>
    );
  }

  _init() {
    let dataUrl = config.api_prefix + '/activity/get';
    if (query.mock) {
      dataUrl = '/mock/data.json';
    }
    axios
      .get(dataUrl, {
        params: {
          id: query.id
        }
      })
      .then(res => {
        let { code, message, data } = res.data;

        if (code !== 0) {
          return alert(message);
        }

        data = padAnswers(data);
        
        this.setState({
          loading: false,
          data
        });

        window.WECHAT.shareFriend(
          {
            appmessageTitle: data.share_config.title,
            appmessageDesc: data.share_config.desc,
            link:
              window.location.origin +
              window.location.pathname +
              '?id=' +
              data.id,
            imgUrl: data.share_config.icon
          },
          function() {}
        );
        window.WECHAT.shareTimeline(
          {
            timelineTitle: data.share_config.title,
            link:
              window.location.origin +
              window.location.pathname +
              '?id=' +
              data.id,
            imgUrl: data.share_config.icon
          },
          function() {}
        );
      });
  }

  _changePage = page => {
    this.setState({
      page
    });
  };

  _changeAns = (index, value) => {
    this.setState(prevState => {
      return {
        data: {
          ...prevState.data,
          questions_config: prevState.data.questions_config.map(
            (qu, quIndex) => {
              if (quIndex === index) {
                return {
                  ...qu,
                  answers: value
                };
              }
              return qu;
            }
          )
        }
      };
    });
  };
}

export default App;
