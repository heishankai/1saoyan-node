/**
 * 类目管理
 */
module.exports = (app) => {
  const { mongoose } = app;

  mongoose.pluralize(null);

  const { Schema } = mongoose;

  const CategorySchema = new Schema(
    {
      categoryName: {
        // 分类名称
        type: String,
        required: true,
      },
      icon: {
        // 图标
        type: String,
        required: true,
      },
    },
    { versionKey: false, timestamps: true } // 自动添加创建时间和更新时间
  );

  // 表名： 首字母必须大写
  return mongoose.model('Category', CategorySchema);
};
