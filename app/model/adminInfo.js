/**
 * 管理员商家信息表
 * @description: 用于存储商家信息
 */
module.exports = (app) => {
  const { mongoose } = app;

  mongoose.pluralize(null); // 去掉集合后面的s

  const { Schema } = mongoose;

  const AdminInfoSchema = new Schema(
    {
      logo: {
        // 商家logo
        type: String,
        // required: true,
        default: '',
      },
      TradeName: {
        // 店铺名称
        type: String,
        // required: true,
        default: '',
      },
      account: {
        // 账号
        type: String,
        required: true,
        trim: true,
      },
      password: {
        // 密码 (加密存储)
        type: String,
        required: true,
        trim: true, // 去除空格
        select: false, // 查询时不返回
      },
      address: {
        // 商家详细地址
        type: String,
        // required: true,
        default: '',
      },
      location: {
        // 商家经纬度
        type: [Number],
        // required: true,
        default: [],
      },
      adminUid: {
        // 唯一标识
        type: String,
        default: () => new Date().getTime(),
      },
      shopIntroduction: {
        // 店铺介绍
        type: String,
        // required: true,
        default: '',
      },
      initialPrice: {
        // 外卖起送价格
        type: Number,
        // required: true,
        default: 0,
      },
      businessHours: {
        // 营业时间
        type: [String],
        // required: true,
        default: '',
      },
    },
    { versionKey: false, timestamps: true } // 自动添加创建时间和更新时间
  );

  // 表名： 首字母必须大写
  return mongoose.model('AdminInfo', AdminInfoSchema);
};
