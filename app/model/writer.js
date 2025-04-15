module.exports = (app) => {
  const mongoose = app.mongoose;
  mongoose.pluralize(null);

  const Schema = mongoose.Schema;

  const WriterSchema = new Schema(
    {
      avatar: {
        // 头像
        type: String,
        default: '',
      },
      nickname: {
        // 昵称
        type: String,
        default: '',
      },
      city: {
        // 城市
        type: String,
        default: '',
      },
      phone: {
        // 手机号
        type: String,
        default: '',
      },
      age: {
        // 年龄
        type: Number,
      },
      gender: {
        // 性别
        type: String,
      },
      straw: {
        // 稿龄
        type: Number,
      },
      synopsis: {
        // 简介
        type: String,
      },
      birthday: {
        // 生日
        type: String,
      },
      specialty: {
        // 专业
        type: String,
      },
      job: {
        // 职业
        type: String,
      },
      hobby: {
        // 爱好
        type: String,
      },
      resume_images: {
        // 爱好
        type: [String],
      },
      collectCount: {
        // 被收藏的数量
        type: Number,
        default: 0,
      },
      // isCollect: {
      //   // 撰稿人是否收藏
      //   type: Boolean,
      //   default: false,
      // },
      //用户唯一标识 openid
      openid: String,
    },
    { versionKey: false, timestamps: true } // 自动添加创建时间和更新时间
  );
  return mongoose.model('Writer', WriterSchema);
};
