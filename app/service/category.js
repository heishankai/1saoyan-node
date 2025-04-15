'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
  async addCategory(categoryName, icon) {
    // 1. 获取数据库表集合
    const db = this.ctx.model.Category;
    // 2. 查询数据库，返回数组
    const res = await db.find({ categoryName });

    if (res.length > 0) {
      return {
        data: [],
        code: 422,
        message: '类目已存在',
      };
    }

    // 3. 插入数据
    await db.create({ categoryName, icon });
    return { data: [], message: 'success', code: 200 };
  }

  /**
   * 获取类目，一次10条，连表查询
   * @param {*} page
   * @returns
   */
  async getCategory(page) {
    const db = this.ctx.model.Category;

    const res = await db.aggregate([
      // 分页，每次取10条
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
      {
        // 连接商品表查询
        $lookup: {
          from: 'Goods', // 连接的表名
          localField: '_id', // 关联的是 Category 表的 id
          foreignField: 'category_id', // 关联分类的id
          as: 'quantity', // 连接后返回的字段
        },
      },
      {
        // 查询，筛选需要的字段，返回前端
        $project: {
          _id: 1, // 1表示返回，0表示不返回
          categoryName: 1, // 1表示返回，0表示不返回
          icon: 1, // 1表示返回，0表示不返回
          quantity: { $size: '$quantity' }, // 统计商品数量，关联到的数据
        },
      },
    ]);

    // 获取数据库里分类有多少条数据
    const total = await db.countDocuments();

    // 返回数据
    return { categoryData: res, total };
  }

  /**
   * 删除类目
   * @param {*} id
   * @returns
   */
  async deleteCategory(_id) {
    // 1. 获取数据库表集合
    const db = this.ctx.model.Category;
    // 2. 查询数据库，返回数组
    const res = await db.find({ _id });

    if (res.length <= 0) {
      return {
        data: [],
        code: 422,
        message: '类目不存在',
      };
    }

    // 3. 删除数据，findByIdAndDelete 是根据id来删除
    await db.findByIdAndDelete({ _id });
    return { data: [], message: 'success', code: 200 };
  }
}

module.exports = CategoryService;
