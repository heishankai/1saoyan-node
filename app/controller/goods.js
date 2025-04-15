'use strict';

const Controller = require('egg').Controller;

class GoodsController extends Controller {
  async addGoods() {
    const { ctx } = this;
    const { category_id, goods_image, goods_name, goods_describe, goods_stats, goods_sku } = ctx.request.body;

    ctx.validate(
      {
        category_id: { type: 'nullValue', tips: '请选择商品分类' },
        goods_image: { type: 'nullValue', tips: '请上传商品图片' },
        goods_name: { type: 'nullValue', tips: '请填写商品名称' },
        goods_describe: { type: 'nullValue', tips: '请填写商品描述' },
        goods_stats: { type: 'goodsStatsIsArray' },
        goods_sku: { type: 'goodsSkuVal', tips: '价格和库存不能为空' },
      },
      ctx.request.body
    );

    // 调用service层
    await ctx.service.goods.addGoods({
      category_id,
      goods_image,
      goods_name,
      goods_describe,
      goods_stats,
      goods_sku,
    });

    ctx.send();
  }

  /**
   * 获取所有商品
   */
  async getGoods() {
    const { ctx } = this;
    const { page } = ctx.query;

    ctx.validate(
      {
        page: { type: 'nullValue', tips: '页码不能为空' },
      },
      ctx.query
    );

    // 调用service层
    const res = await ctx.service.goods.getGoods(page);

    ctx.send(res);
  }

  /**
   * 删除商品
   */
  async deleteGoods() {
    const { ctx, service } = this;
    const { _id } = ctx.query;
    ctx.validate(
      {
        _id: { type: 'nullValue', tips: '商品ID不能为空' },
      },
      ctx.query
    );

    await service.goods.deleteGoods(_id);

    ctx.send();
  }
}

module.exports = GoodsController;
