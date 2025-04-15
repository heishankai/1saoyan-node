module.exports = (app) => {
  const mongoose = app.mongoose;
  mongoose.pluralize(null);
  const Schema = mongoose.Schema;
  const RecommendGoodsSchema = new Schema(
    {
      goodsId: {
        //关联商品id
        type: mongoose.Types.ObjectId,
        ref: 'Goods',
        required: true,
      },
      categoryId: {
        //关联商品所属类目id
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      carouselImages: {
        //宣传图链接
        type: String,
        required: true,
      },
    },
    { versionKey: false }
  );
  return mongoose.model('RecommendGoods', RecommendGoodsSchema);
};
