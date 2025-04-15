'use strict';

const Controller = require('egg').Controller;

class TaletellingController extends Controller {
  /**
   * 保存录音文件
   */
  async saveRecord() {
    const { ctx } = this;
    const { recordList } = ctx.request.body;

    ctx.validate(
      {
        recordList: { type: 'isArray', tips: '必须是数组类型' },
      },
      ctx.request.body
    );

    const db = ctx.model.Wxuserinfo;

    await db.findOneAndUpdate({ openid: ctx.auth.uid }, { recordList });

    ctx.send({}, 200, '保存成功');
  }

  /**
   * 获取当前用户的录音列表
   */
  async getRecordList() {
    const { ctx } = this;

    // 数据库操作：查询用户的录音列表
    const db = ctx.model.Wxuserinfo;

    // 查询用户信息
    const user = await db.findOne({ openid: ctx.auth.uid }, { recordList: 1 }).lean();

    if (!user) {
      ctx.send({}, 404, '用户不存在');
    }

    // 返回录音列表
    ctx.send(user?.recordList || [], 200, '获取成功');
  }
}

module.exports = TaletellingController;
