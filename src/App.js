import React, { Component } from 'react';
import qs from 'qs';
import Start from './components/Start';
import Result from './components/Result';

import Enroll from './Pages/Enroll';
import Vote from './Pages/Vote';
import axios from 'axios';
import config from './config';
import DocumentTitle from 'react-document-title';
import { range } from 'lodash';

const query = qs.parse(window.location.search.slice(1));

const PAGE_MAP = {
  Start,
  Result,
  detailPage: {
    enroll: Enroll,
    vote: Vote
  }
};

const DATA_URL_MAP = {
  enroll: config.api_prefix + '/collect/activity/get',
  vote: config.api_prefix + '/vote/activity/get'
};

function getCurrPage(page, type) {
  if (page === 'Detail') {
    return PAGE_MAP.detailPage[type];
  }
  return PAGE_MAP[page];
}

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
      type: query.type || 'enroll',
      loading: true,
      page: query.page || 'Start',
      data: {},
      err: ''
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
    const CurrPage = getCurrPage(this.state.page, this.state.type) || Start;

    if (this.state.loading) {
      return null;
    }

    if (this.state.err) {
      return <h3>{this.state.err}</h3>;
    }

    return (
      <DocumentTitle title={this.state.data.name}>
        <CurrPage
          query={query}
          data={this.state.data}
          changePage={this._changePage}
          changeAnswer={this._changeAns}
          onVote={this._onVote}
        />
      </DocumentTitle>
    );
  }

  _init() {
    const { type } = this.state;
    let dataUrl = DATA_URL_MAP[this.state.type];
    if (type === 'vote') {
      axios
        .post(config.api_prefix + '/vote/login', {
          openid: localStorage.getItem(config.openid_key),
          activity_id: query.id
        })
        .then(res => {
          axios
            .get(dataUrl, {
              params: {
                id: query.id
              }
            })
            .then(res => {
              let { code, message, data } = res.data;
              if (code !== 0) {
                return this.setState({
                  loading: false,
                  err: message
                });
              }
              data.questions_config = data.vote_config;
              this.setState({
                loading: false,
                data
              });
              this._wechatConfig(data);
            });
        });
      return;
    }

    // collect default behavior
    axios
      .get(dataUrl, {
        params: {
          id: query.id
        }
      })
      .then(res => {
        let { code, message, data } = res.data;
        if (code !== 0) {
          return this.setState({
            loading: false,
            err: message
          });
        }
        data = padAnswers(data);
        this.setState({
          loading: false,
          data
        });
        this._wechatConfig(data);
      });
  }

  _wechatConfig = data => {
    window.WECHAT.shareFriend(
      {
        appmessageTitle: data.share_config.title,
        appmessageDesc: data.share_config.desc,
        link:
          window.location.origin + window.location.pathname + '?id=' + data.id,
        imgUrl: data.share_config.icon
      },
      function() {}
    );
    window.WECHAT.shareTimeline(
      {
        timelineTitle: data.share_config.title,
        link:
          window.location.origin + window.location.pathname + '?id=' + data.id,
        imgUrl: data.share_config.icon
      },
      function() {}
    );
  };

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

  _onVote = (item, index) => {
    this.setState(prevState => {
      return {
        data: {
          ...prevState.data,
          questions_config: prevState.data.questions_config.map(
            (qu, quIndex) => {
              if (quIndex === index) {
                return {
                  ...qu,
                  is_vote: true
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
