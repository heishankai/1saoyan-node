'use strict';

const Controller = require('egg').Controller;

class CollectController extends Controller {
  /**
   * 收藏/取消收藏撰稿人
   */
  async collectOrUncollect() {
    const { ctx, service } = this;

    // 校验请求体中的参数
    ctx.validate(
      {
        writerId: { type: 'nullValue', required: true, tips: '撰稿人ID不能为空' },
      },
      ctx.request.body
    );

    const { writerId } = ctx.request.body;

    const res = await service.wechat.collect.collectOrUncollect(writerId);

    ctx.send(res);
  }

  /**
   * 获取当前登录用户：收藏的撰稿人列表
   */
  async getCollectList() {
    const { ctx, service } = this;

    const openid = ctx.auth.uid;

    const res = await service.wechat.collect.getCollectList(openid);

    // 返回结果
    ctx.send(res);
  }
}

module.exports = CollectController;
