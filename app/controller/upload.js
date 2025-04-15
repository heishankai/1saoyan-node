'use strict';

const Controller = require('egg').Controller;
const OSS = require('ali-oss');

class UploadController extends Controller {
  async uploadFile() {
    const { ctx, app } = this;
    console.log(ctx.request.files);

    if (ctx.request.files.length <= 0) {
      ctx.send([], 422, '上传图片不能为空');
      return;
    }

    // 重命名文件
    const fileFormat = ctx.request.files[0].filename.split('.');
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    const uploadKey = `${app.config.oss.folder}${timestamp}${randomNum}.${fileFormat.pop()}`;

    const client = new OSS({
      region: app.config.oss.region,
      accessKeyId: app.config.oss.accessKeyId,
      accessKeySecret: app.config.oss.accessKeySecret,
      bucket: app.config.oss.bucket,
      secure: true, // 是否使用https
    });

    // 动态设置文件类型
    const fileType = ctx.request.files[0].filename.split('.').pop().toLowerCase();

    const mimeTypes = {
      mp3: 'audio/mpeg',
      mp4: 'video/mp4',
      wav: 'audio/wav',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      pdf: 'application/pdf',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    // 设置响应头
    const headers = {
      'Content-Disposition': 'inline',
      'Content-Type': mimeTypes[fileType] || 'application/octet-stream',
    };

    try {
      const result = await client.put(uploadKey, ctx.request.files[0].filepath, { headers });

      if (result.res.statusCode === 200) {
        ctx.send(result.url);
      } else {
        throw result;
      }
    } catch (error) {
      ctx.send([], 500, '上传失败', error);
    }
  }
}

module.exports = UploadController;
