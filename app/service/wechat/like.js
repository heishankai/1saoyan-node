'use strict';

const Service = require('egg').Service;

class LikeService extends Service {
  /**
   * 点赞/取消点赞撰稿人
   */
  async likeOrUnlike(writerId) {
    const openid = this.ctx.auth.uid;

    const writerdb = this.ctx.model.Writer;
    const Likedb = this.ctx.model.Like;

    // 查询撰稿人是否存在
    const writer = await writerdb.findById(writerId);

    if (!writer) {
      return {
        code: 404,
        message: '撰稿人不存在',
      };
    }

    const existing = await Likedb.findOne({ openid, writerId });

    if (existing) {
      // 如果已点赞，取消点赞
      await Likedb.deleteOne({ _id: existing._id });
      return {
        data: false,
        code: 200,
        message: '取消点赞成功',
      };
    } else {
      // 如果未点赞，添加点赞
      await Likedb.create({ openid, writerId });
      return {
        data: true,
        code: 200,
        message: '点赞成功',
      };
    }
  }

  /**
   * 获取当前登录用户：点赞的撰稿人列表
   */
  async getLikeList(openid) {
    const likedb = this.ctx.model.Like;

    // 获取当前用户收藏的所有撰稿人
    const collects = await likedb.find({ openid }).populate('writerId').sort({ updatedAt: -1 });

    const writers = collects
      .map((item) => {
        if (item.writerId) {
          return {
            ...item.writerId._doc,
            isLike: true,
          };
        }
        return null;
      })
      .filter(Boolean); // 避免 null

    return writers;
  }
}

module.exports = LikeService;
