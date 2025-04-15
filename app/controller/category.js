'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
  /**
   * 新增类目
   * @route POST /api/admin/add-category
   */
  async addCategory() {
    const { ctx, service } = this;
    const { category, icon } = ctx.request.body;

    ctx.validate(
      {
        category: { type: 'nullValue', tips: '请输入正确的手机号码' },
        icon: { type: 'nullValue', tips: '请输入6-8位的子母和数字组成' },
      },
      ctx.request.body
    );

    const { code, message } = await service.category.addCategory(category, icon);
    // 返回结果
    ctx.send([], code, message);
  }

  /**
   * 获取类目，一次10条
   * @route POST /api/admin/add-category
   */
  async getCategory() {
    const { ctx, service } = this;
    const { page } = ctx.query;

    ctx.validate(
      {
        page: { type: 'nullValue', required: false, tips: '分页值不能为空' },
      },
      ctx.query
    );

    // 调用service层
    const res = await service.category.getCategory(page);

    // 返回结果
    ctx.send(res);
  }

  /**
   * 删除单个类目
   * @param {string} id - 类目id
   * @route get /api/admin/delete-category
   */
  async deleteCategory() {
    const { ctx, service } = this;
    const { _id } = ctx.query;

    ctx.validate(
      {
        _id: { type: 'nullValue', tips: '类目id不能为空' },
      },
      ctx.query
    );

    const res = await service.category.deleteCategory(_id);

    ctx.send(res);
  }

  /**
   * 获取所有类目
   * @route get /api/admin/all-category
   */
  async allCategory() {
    const { ctx } = this;
    const db = ctx.model.Category;
    const res = await db.find({}, { icon: false });
    ctx.send(res);
  }
}

module.exports = CategoryController;
