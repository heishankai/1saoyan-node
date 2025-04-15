module.exports = (app) => {
  const { validator } = app;

  // 手机号码格式不正确
  validator.addRule('adminPhone', (rule, value) => {
    if (!/^1\d{10}$/.test(value.trim())) {
      return rule.tips;
    }
  });

  // 6-8的数字和字母结合
  validator.addRule('adminPassword', (rule, value) => {
    if (!/^(?=.*\d)(?=.*[a-zA-Z]).{6,8}$/.test(value.trim())) {
      return rule.tips;
    }
  });

  // 不能为空
  validator.addRule('nullValue', (rule, value) => {
    if (value === null) {
      return rule.tips;
    }
    if (value.trim() === '') {
      return rule.tips;
    }
  });

  // 空数组
  validator.addRule('isArray', (rule, value) => {
    if (!Array.isArray(value)) {
      return '该字段必须是数组类型';
    }
    if (value.length <= 0) {
      return rule.tips;
    }
    if (value[0] === '' || value[1] === '') {
      return rule.tips;
    }
  });

  // 验证商品属性字段
  validator.addRule('goodsStatsIsArray', (rule, value) => {
    if (!Array.isArray(value)) {
      return '该字段必须是数组类型';
    }
  });

  // 验证商品价格和库存
  validator.addRule('goodsSkuVal', (rule, value) => {
    if (!Array.isArray(value)) {
      return '该字段必须是数组类型';
    } else {
      for (const item of value) {
        if (item.price === '' || item.stock === '') {
          return '价格和库存不能为空';
        }
      }
    }
  });

  // 外卖订单提交提示收货地址必传
  validator.addRule('receiverAddressVal', (rule, value) => {
    if (!Array.isArray(value)) {
      return '该字段必须是数组类型';
    }
    if (value.length <= 0) {
      return rule.tips;
    }
  });
};
