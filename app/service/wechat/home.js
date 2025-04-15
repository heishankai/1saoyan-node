'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  /**
   * 模糊查询用户列表
   */
  async searchUserList(keyword = '', page = 1, limit = 10) {
    const { ctx } = this;
    const skip = (page - 1) * limit;

    const query = keyword
      ? {
          $or: [{ nickname: { $regex: keyword, $options: 'i' } }, { city: { $regex: keyword, $options: 'i' } }],
        }
      : {};

    const wxuserinfoDB = ctx.model.Wxuserinfo;

    const result = await wxuserinfoDB.find(query).skip(skip).limit(limit).lean();
    const total = await wxuserinfoDB.countDocuments(query);

    return {
      total,
      data: result,
    };
  }
}

module.exports = HomeService;
