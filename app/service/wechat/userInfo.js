'use strict';

const Service = require('egg').Service;
const qs = require('querystring');
const axios = require('axios');

class UserInfoService extends Service {
  /**
   * 小程序用户登录
   */
  async wxLogin(code) {
    const { appid, secret } = this.app.config.wxAppid;
    const WX_LOGIN_URL = 'https://api.weixin.qq.com/sns/jscode2session?';
    
    const param = qs.stringify({
      appid,
      secret,
      js_code: code,
      grant_type: 'authorization_code',
    });

    const { data } = await axios.get(WX_LOGIN_URL + param);
    const { openid } = data;

    const db = this.ctx.model.Wxuserinfo;

    // 已有用户 - 返回查到的数据（不返回openid）
    // const userInfo = await db.find({ openid: openid }, { openid: false }).lean();
    const userInfo = await db.find({ openid: openid }).lean();
    
    const token = { user_token: this.ctx.generateToken(openid) };
    
    if (userInfo.length > 0) {
      return { ...userInfo[0], ...token };
    }

    // 新用户 - 返回新建的数据
    const newUser = await db.create({ openid });
    return { ...newUser.toObject(), ...token };
  }
}

module.exports = UserInfoService;
