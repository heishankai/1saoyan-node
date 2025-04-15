'use strict';

const Controller = require('egg').Controller;

class UserInfoController extends Controller {
  /**
   * 小程序用户登录
   */
  async wxLogin() {
    const { ctx, service } = this;
    const { code } = ctx.request.body;

    ctx.validate(
      {
        code: { type: 'nullValue', tips: '缺少code参数' },
      },
      ctx.request.body
    );
    const res = await service.wechat.userInfo.wxLogin(code);

    ctx.send(res);
  }

  /**
   * 修改个人信息
   */
  async updateUserInfo() {
    const { ctx } = this;
    const { avatar, nickname, gender, age, phone, city, openid } = ctx.request.body;

    const db = ctx.model.Wxuserinfo;
    const token = { user_token: this.ctx.generateToken(openid) };
    
    const res = await db.findOneAndUpdate(
      { openid: ctx.auth.uid },
      { avatar, nickname, gender, age, phone, city },
      { new: true } // 确保返回更新后的文档
    );

    ctx.send({ ...res._doc, ...token });
  }
}

module.exports = UserInfoController;
