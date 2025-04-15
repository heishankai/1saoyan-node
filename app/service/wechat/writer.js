'use strict';

const Service = require('egg').Service;

class WriterService extends Service {
  // 新增和更新撰稿人信息
  async handleWriter(obj) {
    const { ctx } = this;
    const {
      openid,
      city,
      avatar,
      nickname,
      phone,
      age,
      gender,
      straw,
      synopsis,
      birthday,
      specialty,
      job,
      hobby,
      resume_images,
    } = obj;

    const writerDb = ctx.model.Writer;

    const writerRes = await writerDb.findOneAndReplace(
      { openid: ctx.auth.uid },
      {
        openid,
        avatar,
        nickname,
        phone,
        age: `${age}`,
        city,
        gender,
        straw: `${straw}`,
        synopsis,
        birthday,
        specialty,
        job,
        hobby,
        resume_images,
      },
      { upsert: true, new: true }
    );

    const userInfo = ctx.model.Wxuserinfo;

    const userInfoRes = await userInfo.findOneAndUpdate(
      { openid: ctx.auth.uid },
      { isWriter: true },
      { new: true } // 确保返回更新后的文档
    );

    return {
      writerData: writerRes,
      userInfoData: userInfoRes,
    };
  }

  // 获取当前登录用户的撰稿人信息
  async getWriter() {
    const db = this.ctx.model.Writer;
    const res = db.findOne({ openid: this.ctx.auth.uid }).lean();
    return res;
  }

  // 模糊查询撰稿人信息 - 分页（含收藏和点赞状态）
  async searchWriter(keyword = '', page = 1, limit = 10, openid) {
    const { ctx } = this;
    const skip = (page - 1) * limit;

    const query = keyword
      ? {
          $or: [{ nickname: { $regex: keyword, $options: 'i' } }, { synopsis: { $regex: keyword, $options: 'i' } }],
        }
      : {};

    const writerDB = ctx.model.Writer;
    const collectDB = ctx.model.Collect;
    const likeDB = ctx.model.Like;

    const writers = await writerDB.find(query).skip(skip).limit(limit).lean();
    const total = await writerDB.countDocuments(query);

    const writerIds = writers.map((w) => w._id);

    // 获取收藏列表
    const collectList = await collectDB.find({ openid, writerId: { $in: writerIds } }).lean();
    const collectedIds = new Set(collectList.map((item) => item.writerId.toString()));

    // 获取点赞列表
    const likeList = await likeDB.find({ openid, writerId: { $in: writerIds } }).lean();
    const likedIds = new Set(likeList.map((item) => item.writerId.toString()));

    const result = writers.map((writer) => ({
      ...writer,
      isCollect: collectedIds.has(writer._id.toString()),
      isLike: likedIds.has(writer._id.toString()),
    }));

    return {
      total,
      data: result,
    };
  }
}

module.exports = WriterService;
