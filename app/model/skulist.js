/**
 * @description: sku列表
 */
module.exports = (app) => {
  const mongoose = app.mongoose;
  mongoose.pluralize(null);
  const Schema = mongoose.Schema;
  const SkulistSchema = new Schema(
    {
      goods_id: {
        // 关联商品id
        type: mongoose.Types.ObjectId,
        ref: 'Goods',
        required: true,
      },
      price: {
        //sku价格
        type: Number,
        required: true,
      },
      stock: {
        //sku库存
        type: Number,
        required: true,
      },
      specs: {
        //sku组合，文本存储
        type: [String],
        required: true,
      },
      skuId: {
        //sku组合id
        type: [String],
        required: true,
      },
    },
    { versionKey: false, timestamps: true }
  );
  return mongoose.model('Skulist', SkulistSchema);
};
