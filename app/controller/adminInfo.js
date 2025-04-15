'use strict';

const Controller = require('egg').Controller;

class AdminInfoController extends Controller {
  /**
   * 商家注册
   * @route POST /admin/login
   * @param {string} phone - 手机号码
   * @param {string} password - 密码
   * @returns {object} - 返回登录结果
   */
  async adminRegister() {
    const { ctx, service } = this;
    const { phone, password } = ctx.request.body;

    // 校验参数
    ctx.validate(
      {
        phone: { type: 'adminPhone', tips: '请输入正确的手机号码' },
        password: { type: 'adminPassword', tips: '请输入6-8位的子母和数字组成' },
      },
      ctx.request.body
    );

    const { code, message } = await service.adminInfo.adminRegister(phone, password);

    // 返回结果
    ctx.send([], code, message);
  }

  /**
   * 商家登录
   * @route POST /admin/login
   * @param {string} phone - 手机号码
   * @param {string} password - 密码
   * @returns {object} - 返回登录结果
   */
  async adminLogin() {
    const { ctx, service } = this;
    const { phone, password } = ctx.request.body;

    ctx.validate(
      {
        phone: { type: 'adminPhone', tips: '请输入正确的手机号码' },
        password: { type: 'adminPassword', tips: '请输入6-8位的子母和数字组成' },
      },
      ctx.request.body
    );

    const { data, message, code } = await service.adminInfo.adminLogin(phone, password);
    ctx.send(data, code, message);
  }

  /**
   * 更新商家logo
   * @route POST /admin/upload-logo
   */
  async uploadLogo() {
    const { ctx, service } = this;
    const { value } = ctx.request.body;

    ctx.validate({ value: { type: 'nullValue', tips: '请上传logo' } }, ctx.request.body);

    const { data, code, message } = await service.adminInfo.uploadLogo(value, ctx.auth.uid);

    ctx.send(data, code, message);
  }

  /**
   * 更新店铺名称
   * @route POST /admin/upload-tradeName
   */
  async uploadTradeName() {
    const { ctx } = this;
    const { value } = ctx.request.body;
    ctx.validate({ value: { type: 'nullValue', tips: '请上传店铺名称' } }, ctx.request.body);
    await ctx.model.AdminInfo.findOneAndUpdate({ adminUid: ctx.auth.uid }, { tradeName: value });
    ctx.send();
  }

  /**
   * 更新店铺介绍
   * @route POST
   */
  async uploadShopIntroduction() {
    const { ctx } = this;
    const { value } = ctx.request.body;
    ctx.validate({ value: { type: 'nullValue', tips: '请上传店铺介绍' } }, ctx.request.body);
    await ctx.model.AdminInfo.findOneAndUpdate({ adminUid: ctx.auth.uid }, { shopIntroduction: value });
    ctx.send();
  }

  /**
   * 更新店铺营业时间
   * @route post
   */
  async uploadBusinessHours() {
    const { ctx } = this;
    const { time } = ctx.request.body;
    ctx.validate({ time: { type: 'isArray', tips: '请设置营业时间' } }, ctx.request.body);
    // $set: 会创建该字段并赋值；如果字段已存在，则会更新其值。
    await ctx.model.AdminInfo.findOneAndUpdate({ adminUid: ctx.auth.uid }, { $set: { businessHours: time } });
    ctx.send();
  }

  /**
   * 更新外卖起送价
   * @route post
   */
  async uploadInitialprice() {
    const { ctx } = this;
    const { value } = ctx.request.body;
    ctx.validate({ value: { type: 'nullValue', tips: '请设置起送价' } }, ctx.request.body);
    await ctx.model.AdminInfo.findOneAndUpdate({ adminUid: ctx.auth.uid }, { initialPrice: value });
    ctx.send();
  }
}

module.exports = AdminInfoController;
