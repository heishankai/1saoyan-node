'use strict';

const Controller = require('egg').Controller;

class LikeController extends Controller {
  /**
   * 点赞/取消点赞撰稿人
   */
  async likeOrUnlike() {
    const { ctx, service } = this;

    // 校验请求体中的参数
    ctx.validate(
      {
        writerId: { type: 'nullValue', required: true, tips: '撰稿人ID不能为空' },
      },
      ctx.request.body
    );

    const { writerId } = ctx.request.body;

    const res = await service.wechat.like.likeOrUnlike(writerId);

    ctx.send(res);
  }

  /**
   * 获取当前登录用户：点赞的撰稿人列表
   */
  async getLikeList() {
    const { ctx, service } = this;

    const openid = ctx.auth.uid;

    const res = await service.wechat.like.getLikeList(openid);

    // 返回结果
    ctx.send(res);
  }
}

module.exports = LikeController;
