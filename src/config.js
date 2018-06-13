const isProd = process.env.NODE_ENV === 'production';

export default {
  api_prefix: isProd ? 'http://plugin.dyyz1993.cn/api/user' : '/api/user',
  openid_key: 'hudong_openid',
  userinfo_key: 'hudong_userinfo'
}