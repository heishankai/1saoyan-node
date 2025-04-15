'use strict';

const Controller = require('egg').Controller;

class RecommendGoodsController extends Controller {
  /**
   * 新增推荐商品
   */
  async addRecommend() {
    const { ctx, service } = this;
    const { carouselImages, categoryId, goodsId } = ctx.request.body;

    ctx.validate(
      {
        carouselImages: { type: 'nullValue', tips: '请上环轮播图' },
        categoryId: { type: 'nullValue', tips: '请选择关联商品' },
        goodsId: { type: 'nullValue', tips: '请选择关联商品' },
      },
      ctx.request.body
    );

    const db = ctx.model.RecommendGoods;
    await db.create({ carouselImages, categoryId, goodsId });

    ctx.send();
  }

  /**
   * 获取推荐商品列表
   */
  async getRecommend() {
    const { ctx, service } = this;

    const res = await service.recommendGoods.getRecommend();

    ctx.send(res);
  }

  /**
   * 删除推荐商品
   */
  async deleteRecommend() {
    const { ctx } = this;
    const { _id } = ctx.query;

    ctx.validate(
      {
        _id: { type: 'nullValue', tips: '缺少_id字段值' },
      },
      ctx.query
    );

    const db = ctx.model.RecommendGoods;
    await db.findByIdAndDelete({ _id });

    ctx.send();
  }
}

module.exports = RecommendGoodsController;
