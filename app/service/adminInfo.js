'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

class AdminInfoService extends Service {
  /**
   * 注册商家账号
   * @param {*} account
   * @param {*} password
   * @returns
   */
  async adminRegister(account, password) {
    // 1. 获取数据库表集合
    const db = this.ctx.model.AdminInfo;
    // 2. 查询数据库，返回数组
    const res = await db.find({ account }); // 根据账号查询

    if (res.length > 0) {
      return {
        code: 202,
        message: '账号已存在',
      };
    }

    // 密码加密：生成哈希值
    const hash = crypto.createHash('sha256').update(password);
    const passwordHash = hash.digest('hex');

    // 3. 插入数据
    await db.create({ account, password: passwordHash });
    return { message: 'success', code: 200 };
  }

  /**
   * 商家登录
   * @param {*} account
   * @param {*} password
   * @returns
   */ 
  async adminLogin(account, password) {
    const hash = crypto.createHash('sha256').update(password);
    const passwordHash = hash.digest('hex');

    // 1. 获取数据库表集合
    const db = this.ctx.model.AdminInfo;

    // 2 . 查询数据库，（lean可以性能优化，并且转为javaScript数据）
    const res = await db
      .find(
        // 匹配账号和密码
        { account, password: passwordHash },
        // 设置不返回的数据
        { account: false, location: false, createdAt: false, updatedAt: false }
      )
      .lean();

    if (res.length > 0) {
      // 3. 生成token，加密 adminUid
      const token = { admin_token: this.ctx.generateToken(res[0].adminUid) };

      // 4. 返回结果
      return {
        data: { ...res[0], ...token },
        message: 'success',
        code: 200,
      };
    }
    return { data: {}, message: '账号/密码错误', code: 422 };
  }

  /**
   * 更新商家logo
   * @param {*} logo
   * @returns
   */
  async uploadLogo(logo, adminUid) {
    const db = this.ctx.model.AdminInfo;

    // 第一个参数是查询条件，第二个参数是更新的内容
    // 第三个参数是选项，{ new: true }表示返回更新后的文档
    const res = await db.findOneAndUpdate({ adminUid }, { logo }, { new: true });

    return {
      code: 200,
      message: 'success',
      data: res,
    };
  }
}

module.exports = AdminInfoService;
