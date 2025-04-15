module.exports = (app) => {
  const mongoose = app.mongoose;

  mongoose.pluralize(null);

  const Schema = mongoose.Schema;

  const CollectSchema = new Schema(
    {
      openid: {
        type: String,
        required: true,
      },
      writerId: {
        type: Schema.Types.ObjectId,
        ref: 'Writer',
        required: true,
      },
    },
    { versionKey: false, timestamps: true }
  );

  return mongoose.model('Collect', CollectSchema);
};
