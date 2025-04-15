'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  /**
   * 获取用户列表
   */
  async getAllUserInfoList() {
    const { ctx } = this;

    ctx.validate(
      {
        page: { type: 'nullValue', required: true },
        limit: { type: 'nullValue', required: true },
        gender: { type: 'nullValue', required: false },
      },
      ctx.query
    );

    const { page = 1, limit = 10, gender } = ctx.query;

    const skip = (page - 1) * limit;

    const userInfodb = ctx.model.Wxuserinfo;

    // 总数根据筛选条件来统计
    const total = await userInfodb.countDocuments(gender === '0' ? {} : { gender }).lean();

    // 获取分页数据
    const res = await userInfodb
      .find(gender === '0' ? {} : { gender })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    ctx.send({
      total,
      data: res,
    });
  }
  /**
   * 根据id获取用户信息
   */
  async getUserInfoById() {
    const { ctx } = this;

    ctx.validate({ _id: { type: 'nullValue', required: true } }, ctx.query);

    const { _id } = ctx.query;

    const userInfodb = ctx.model.Wxuserinfo;

    // 根据id获取用户信息
    const res = await userInfodb.findById(_id).lean();

    ctx.send({
      data: res,
    });
  }

  /**
   * 模糊查询用户列表
   */
  async searchUserList() {
    const { ctx, service } = this;

    const { page = 1, limit = 10, keyword } = ctx.request.body;

    ctx.validate(
      {
        page: { type: 'string', required: true },
        limit: { type: 'string', required: true },
        keyword: { type: 'nullValue', required: false, tips: '请输入昵称或城市名称查询' },
      },
      ctx.request.body
    );

    const { data } = await service.wechat.home.searchUserList(keyword, parseInt(page), parseInt(limit));

    ctx.send(data);
  }
}

module.exports = HomeController;
