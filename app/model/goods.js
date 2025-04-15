/**
 * 商品集合
 */
module.exports = (app) => {
  const { mongoose } = app;

  mongoose.pluralize(null);

  const { Schema } = mongoose;

  const GoodsSchema = new Schema(
    {
      category_id: {
        // 关联分类表的_id
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      goods_image: {
        // 商品图片
        type: String,
        required: true,
      },
      goods_name: {
        // 商品名称
        type: String,
        required: true,
      },
      goods_describe: {
        // 商品描述
        type: String,
        required: true,
      },
      goods_price: {
        //商品价格
        type: Number,
        required: true,
      },
      goods_stock: {
        //商品库存
        type: Number,
        required: true,
      },
      quantity: {
        //商品数量，用作前端的逻辑处理
        type: Number,
        default: 0,
      },
      sales_valume: {
        //商品销量
        type: Number,
        default: 0,
      },
      goods_stats: [
        //商品规格，属性
        {
          name: String, //父属性
          selected: {
            // 前端选择的规格属性
            type: String,
            default: '',
          },
          disabled: {
            // 前端选择属性使用
            type: Boolean,
            default: false,
          },
          subAttributes: [
            //子属性
            {
              name: String, //子属性名称
              statsId: String, //子属性id
              selected: {
                // 用作前端选择属性使用
                type: String,
                default: '',
              },
              disabled: {
                // 用作前端选择属性使用
                type: Boolean,
                default: false,
              },
            },
          ],
        },
      ],
    },
    { versionKey: false, timestamps: true }
  );

  return mongoose.model('Goods', GoodsSchema);
};
