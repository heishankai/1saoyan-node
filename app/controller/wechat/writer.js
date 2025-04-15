'use strict';

const Controller = require('egg').Controller;

class WriterController extends Controller {
  // 新增撰稿人
  async handleWriter() {
    const { ctx, service } = this;
    const obj = ctx.request.body;

    const res = await service.wechat.writer.handleWriter(obj);

    ctx.send(res);
  }

  // 查询撰稿人信息
  async getWriter() {
    const { ctx, service } = this;
    const res = await service.wechat.writer.getWriter();
    ctx.send(res);
  }

  // 获取所有撰稿人信息 - 分页（带收藏和点赞状态）
  async getAllWriter() {
    const { ctx } = this;

    const writerDB = ctx.model.Writer;
    const collectDB = ctx.model.Collect;
    const likeDB = ctx.model.Like;
    const openid = ctx.auth.uid;

    const { page = 1, limit = 10 } = ctx.query;

    ctx.validate(
      {
        page: { type: 'string', required: true },
        limit: { type: 'string', required: true },
      },
      ctx.query
    );

    const skip = (page - 1) * limit;
    const total = await writerDB.countDocuments();

    // 获取分页撰稿人数据
    const writers = await writerDB.find({}).skip(skip).limit(Number(limit)).lean();
    const writerIds = writers.map((w) => w._id);

    // 查询收藏状态
    const collects = await collectDB.find({ openid, writerId: { $in: writerIds } }).lean();

    const collectedSet = new Set(collects.map((item) => item.writerId.toString()));

    // 查询点赞状态
    const likes = await likeDB.find({ openid, writerId: { $in: writerIds } }).lean();

    const likedSet = new Set(likes.map((item) => item.writerId.toString()));

    // 整合收藏和点赞状态
    const data = writers.map((writer) => ({
      ...writer,
      isCollect: collectedSet.has(writer._id.toString()),
      isLike: likedSet.has(writer._id.toString()),
    }));

    ctx.send({
      total,
      data,
    });
  }

  // 模糊查询撰稿人信息 - 分页
  async searchWriter() {
    const { ctx, service } = this;

    const { page = 1, limit = 10, keyword } = ctx.request.body;

    ctx.validate(
      {
        page: { type: 'string', required: true },
        limit: { type: 'string', required: true },
        keyword: { type: 'nullValue', required: false, tips: '请输入昵称或简介查询' },
      },
      ctx.request.body
    );

    const openid = ctx.auth.uid; // 获取当前登录用户的 openid

    const { data } = await service.wechat.writer.searchWriter(keyword, parseInt(page), parseInt(limit), openid);

    ctx.send(data);
  }

  // 根据openid查询撰稿人信息（含收藏与点赞状态）
  async getOnewriter() {
    const { ctx } = this;
    const { openid } = ctx.query;

    ctx.validate(
      {
        openid: { type: 'string', required: true, tips: '请输入openid' },
      },
      ctx.query
    );

    const Writer = ctx.model.Writer;
    const Collect = ctx.model.Collect;
    const Like = ctx.model.Like;

    // 查找撰稿人
    const writer = await Writer.findOne({ openid }).lean();

    if (!writer) {
      ctx.throw(404, '撰稿人不存在');
      return;
    }

    let isCollect = false;
    let isLike = false;

    const currentUserOpenid = ctx.auth?.uid;

    if (currentUserOpenid) {
      // 是否收藏
      const collect = await Collect.findOne({
        openid: currentUserOpenid,
        writerId: writer._id,
      });

      // 是否点赞
      const like = await Like.findOne({
        openid: currentUserOpenid,
        writerId: writer._id,
      });

      isCollect = !!collect;
      isLike = !!like;
    }

    ctx.send({
      ...writer,
      isCollect,
      isLike,
      code: 200,
      message: 'success',
    });
  }
}

module.exports = WriterController;
