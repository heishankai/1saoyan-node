var jwt = require('jsonwebtoken');

module.exports = {
  get ctx() {
    return this;
  },

  // 自定义返回前端的接口数据结构
  send(data = [], status = 200, message = 'success', error = null) {
    this.body = { message, data, error };
    this.status = status;
  },

  // 加密生成token
  generateToken(uid) {
    // 1. 获取配置文件中的密钥和过期时间
    const { secret, expiresIn } = this.app.config.jwt;
    // 2. 加密uid，生成token
    return jwt.sign({ uid }, secret, { expiresIn });
  },
};
