'use strict';

const Service = require('egg').Service;

class GoodsService extends Service {
  async addGoods(obj) {
    // 计算总库存
    const totalStock = obj.goods_sku.reduce((total, sku) => total + Number(sku.stock), 0);

    // 取出最小的价格
    const minPrice = Math.min(...obj.goods_sku.map((sku) => Number(sku.price)));

    const db = this.ctx.model.Goods;

    // 存储商品列表  （create:返回插入的对象，包括id）
    const goodsId = await db.create({
      category_id: obj.category_id,
      goods_image: obj.goods_image,
      goods_name: obj.goods_name,
      goods_describe: obj.goods_describe,
      goods_stats: obj.goods_stats,
      goods_price: minPrice,
      goods_stock: totalStock,
    });

    if (obj.goods_stats.length <= 0) {
      return;
    }

    // 存储sku列表
    const dbSku = this.ctx.model.Skulist;

    const newskuArray = obj.goods_sku.map((sku) => ({
      goods_id: goodsId._id,
      price: sku.price,
      stock: sku.stock,
      specs: sku.specs,
      skuId: sku.skuId,
    }));

    // insertMany 会将 newskuArray 中的所有对象一次性插入到数据库中。
    await dbSku.insertMany(newskuArray);
  }

  /**
   * 获取商品列表
   * @param {Object} query 查询条件
   * @param {Number} page 页码
   */
  async getGoods(page) {
    const db = this.ctx.model.Goods;

    const res = await db.aggregate([
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
      {
        // 连接类目表
        $lookup: {
          from: 'Category',
          localField: 'category_id', // 这个是商品和类目都有的字段
          foreignField: '_id', // 这个是类目表的字段
          as: 'category', // 输出的字段
        },
      },
      // $unwind: 是 MongoDB 聚合管道中的一个操作符，得到的都是数组对象，可以将数组中的每个元素都拆分成单独的文档。
      { $unwind: '$category' },
      {
        // 查询两个表里面的字段，筛选需要的字段，返回前端
        $project: {
          _id: 1,
          goods_image: 1,
          goods_name: 1,
          goods_price: 1,
          goods_stock: 1,
          sales_valume: 1,
          category_id: 1,
          // 类目表
          category: '$category',
          // 类目表的字段
          goods_category: '$category.categoryName',
        },
      },
    ]);

    // 查询商品总数
    const total = await db.countDocuments();
    return { goodsData: res, total };
  }

  /**
   * 删除商品
   * @param {String} id 商品ID
   */
  async deleteGoods(_id) {
    const db = this.ctx.model.Goods;

    const res = await db.find({ _id });

    if (res.length <= 0) {
      return {
        data: [],
        code: 422,
        message: '商品不存在',
      };
    }

    // 删除商品
    await db.findByIdAndDelete({ _id });

    // 删除关联的sku，删除goods_id，这个就是存的时候用 商品的id存的字段
    // deleteMany 是删除符合条件的多条数据
    const sku = this.ctx.model.Skulist;
    await sku.deleteMany({ goods_id: _id });
  }
}

module.exports = GoodsService;
