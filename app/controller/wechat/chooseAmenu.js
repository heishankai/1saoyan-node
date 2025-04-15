'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');

class ChooseAmenuController extends Controller {
  // 获取用户位置信息
  async getLocationInfo() {
    const { ctx, app } = this;
    const { latitude, longitude } = ctx.request.body;

    ctx.validate(
      {
        latitude: { type: 'nullValue', tips: '维度不能为空' },
        longitude: { type: 'nullValue', tips: '经度不能为空' },
      },
      ctx.request.body
    );

    const url = 'https://apis.map.qq.com/ws/geocoder/v1?';

    const params = {
      key: app.config.wxqq.key,
      location: `${latitude},${longitude}`,
    };

    const queryString = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    const res = await axios.get(url + queryString);

    ctx.send(res?.data);
  }
}

module.exports = ChooseAmenuController;
