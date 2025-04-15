/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  // ---------------登录注册：接口------------------
  // 商家注册账号
  router.post('/api/admin/adminRegister', controller.adminInfo.adminRegister);
  // 商家登录
  router.post('/api/admin/adminLogin', controller.adminInfo.adminLogin);

  // 文件上传
  router.post('/api/admin/uploadFile', controller.upload.uploadFile);

  // ---------------商家信息：接口------------------
  // 更新logo
  router.post('/api/admin/upload-logo', app.middleware.jwt(), controller.adminInfo.uploadLogo);
  // 更新店铺名称
  router.post('/api/admin/upload-tradeName', app.middleware.jwt(), controller.adminInfo.uploadTradeName);
  // 更新店铺介绍
  router.post('/api/admin/upload-shopintroduction', app.middleware.jwt(), controller.adminInfo.uploadShopIntroduction);
  // 更新营业时间
  router.post('/api/admin/upload-businesshours', app.middleware.jwt(), controller.adminInfo.uploadBusinessHours);
  // 更新外卖起送价
  router.post('/api/admin/upload-initialprice', app.middleware.jwt(), controller.adminInfo.uploadInitialprice);

  // ---------------类目接口------------------
  // 新增类目
  router.post('/api/admin/add-category', app.middleware.jwt(), controller.category.addCategory);
  // 获取类目
  router.get('/api/admin/get-category', app.middleware.jwt(), controller.category.getCategory);
  // 删除单个类目
  router.get('/api/admin/delete-category', app.middleware.jwt(), controller.category.deleteCategory);

  // ---------------商品接口------------------
  // 获取所有商品类目
  router.get('/api/admin/all-category', app.middleware.jwt(), controller.category.allCategory);
  // 提交新增商品
  router.post('/api/admin/add-goods', app.middleware.jwt(), controller.goods.addGoods);
  // 获取所有商品
  router.get('/api/admin/get-goods', app.middleware.jwt(), controller.goods.getGoods);
  // 删除单个商品数据
  router.get('/api/admin/delete-goods', app.middleware.jwt(), controller.goods.deleteGoods);

  // ---------------推荐接口------------------
  // 新增推荐商品
  router.post('/api/admin/add-recommend', app.middleware.jwt(), controller.recommendGoods.addRecommend);
  // 获取推荐商品列表
  router.get('/api/admin/get-recommend', app.middleware.jwt(), controller.recommendGoods.getRecommend);
  // 删除推荐商品
  router.get('/api/admin/delete-recommend', app.middleware.jwt(), controller.recommendGoods.deleteRecommend);

  // ---------------微信小程序接口 ------------------------
  //  用户登录
  router.post('/api/wechat/wxlogin', controller.wechat.userInfo.wxLogin);
  //  用户修改个人信息
  router.post('/api/wechat/updateUserInfo', app.middleware.jwt(), controller.wechat.userInfo.updateUserInfo);
  //  获取用户地址
  router.post('/api/wechat/getLocationInfo', app.middleware.jwt(), controller.wechat.chooseAmenu.getLocationInfo);

  //  新增 + 更新 撰稿人
  router.post('/api/wechat/addWriter', app.middleware.jwt(), controller.wechat.writer.handleWriter);
  // 查询登录人的撰稿人信息
  router.get('/api/wechat/getWriter', app.middleware.jwt(), controller.wechat.writer.getWriter);
  // 获取所有撰稿人信息 - 分页
  router.get('/api/wechat/getAllWriter', app.middleware.jwt(), controller.wechat.writer.getAllWriter);
  // 模糊查询撰稿人信息 - 分页
  router.post('/api/wechat/searchWriter', app.middleware.jwt(), controller.wechat.writer.searchWriter);
  // 根据openid查询撰稿人信息
  router.get('/api/wechat/getOnewriter', app.middleware.jwt(), controller.wechat.writer.getOnewriter);
  // 收藏和取消收藏撰稿人
  router.post('/api/wechat/collectOrUncollect', app.middleware.jwt(), controller.wechat.collect.collectOrUncollect);
  // 获取登录人的收藏列表
  router.get('/api/wechat/collectList', app.middleware.jwt(), controller.wechat.collect.getCollectList);
  // 点赞和取消点赞撰稿人
  router.post('/api/wechat/likeOrUnlike', app.middleware.jwt(), controller.wechat.like.likeOrUnlike);
  // 获取登录人的点赞列表
  router.get('/api/wechat/likeList', app.middleware.jwt(), controller.wechat.like.getLikeList);

  //  首页推荐故事的接口
  router.get('/api/wechat/home/getAllUserInfoList', controller.wechat.home.getAllUserInfoList);
  //  根据id获取用户信息
  router.get('/api/wechat/home/getUserInfoById', controller.wechat.home.getUserInfoById);
  // 模糊查询用户
  router.post('/api/wechat/home/searchUserList', controller.wechat.home.searchUserList);

  // 保存用户录音
  router.post('/api/wechat/saveRecord', app.middleware.jwt(), controller.wechat.taletelling.saveRecord);
  // 获取当前用户的录音列表
  router.get('/api/wechat/get-record-list', app.middleware.jwt(), controller.wechat.taletelling.getRecordList);
};
