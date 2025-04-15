'use strict';

const Service = require('egg').Service;

class CollectService extends Service {
  /**
   * 收藏/取消收藏撰稿人
   */
  async collectOrUncollect(writerId) {
    const openid = this.ctx.auth.uid;

    const writerdb = this.ctx.model.Writer;
    const collectdb = this.ctx.model.Collect;

    // 查询撰稿人是否存在
    const writer = await writerdb.findById(writerId);

    if (!writer) {
      return {
        code: 404,
        message: '撰稿人不存在',
      };
    }

    const existing = await collectdb.findOne({ openid, writerId });

    if (existing) {
      // 如果已收藏，取消收藏
      await collectdb.deleteOne({ _id: existing._id });
      return {
        data: false,
        code: 200,
        message: '取消收藏成功',
      };
    } else {
      // 如果未收藏，添加收藏
      await collectdb.create({ openid, writerId });
      return {
        data: true,
        code: 200,
        message: '收藏成功',
      };
    }
  }
  /**
   * 获取当前登录用户：收藏的撰稿人列表
   */
  async getCollectList(openid) {
    const collectdb = this.ctx.model.Collect;

    // 获取当前用户收藏的所有撰稿人
    const collects = await collectdb.find({ openid }).populate('writerId').sort({ updatedAt: -1 });

    // 提取撰稿人信息并手动加上 isCollect: true
    const writers = collects
      .map((item) => {
        if (item.writerId) {
          return {
            ...item.writerId._doc,
            isCollect: true,
          };
        }
        return null;
      })
      .filter(Boolean); // 避免 null

    return writers;
  }
}

module.exports = CollectService;
