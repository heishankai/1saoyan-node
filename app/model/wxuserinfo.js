module.exports = (app) => {
  const mongoose = app.mongoose;
  mongoose.pluralize(null);

  const Schema = mongoose.Schema;
  const WxuserinfoSchema = new Schema(
    {
      avatar: {
        // 头像
        type: String,
        default: 'https://img.yzcdn.cn/vant/cat.jpeg',
      },
      nickname: {
        // 昵称
        type: String,
        default: '一勺盐用户',
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
      isWriter: {
        // 是否是撰稿人
        type: Boolean,
        default: false,
      },
      recordList: {
        // 录音列表
        type: [],
        default: [],
      },
      //用户唯一标识 openid
      openid: String,
    },
    { versionKey: false, timestamps: true } // 自动添加创建时间和更新时间
  );
  return mongoose.model('Wxuserinfo', WxuserinfoSchema);
};
