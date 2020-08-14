'use strict';

const Controller = require('egg').Controller;
const tinify = require("tinify");
const fs = require("fs");
const { resolve } = require('path');
const join = require('path').join;

// tinify.key = "KmyFh2OTwV3f6sgeepAAAV4qwG22Jk6U";
// tinify.proxy = "http://user:pass@192.168.0.1:8080";


const maxMonthCount = 500;
const keyList = [
  'KmyFh2OTwV3f6sgeepAAAV4qwG22Jk6U',
]



class HomeController extends Controller {
  async index() {
    const { ctx } = this;

    // 设置key 模拟请求验证是否key是合法的
    try {
      tinify.key = 'KmyFh2OTwV3f6sgeepAAAV4qwG22Jk6U'
      const validate = await tinify.validate();
      if (validate) { throw validate; }
    } catch (error) {
      console.error(' tinify api key error ', error);
    }

    // 每个key，每个月只能用500张图片
    console.log(' compressionCount ', tinify.compressionCount);
    if (tinify.compressionCount >= maxMonthCount) {
      console.error(' beyond max count ', tinify.compressionCount);
    }



    // 根目录下的image
    const imagePath = 'image'
    let files = fs.readdirSync(imagePath);
    files = files.map((item) => {
      if (this.isImage(item)) {
        return join(imagePath, item);
      }
    });
    files = files.filter(item => { return item && item.length });

    if (!files || !files.length) {
      console.error(' files count null', files);
    }

    

    tinify.fromFile(files[0]).toFile(files[0], (err) => {
      if (!err) {
        console.log('success');
      } else {
        if (err instanceof tinify.AccountError) {
          console.log("The error message is: " + err.message);
          // Verify your API key and account limit.
        } else if (err instanceof tinify.ClientError) {
          // Check your source image and request options.
        } else if (err instanceof tinify.ServerError) {
          // Temporary issue with the Tinify API.
        } else if (err instanceof tinify.ConnectionError) {
          // A network connection error occurred.
        } else {
          // Something else went wrong, unrelated to the Tinify API.

        }
      }
    });

    ctx.body = 'hi, egg';
  }
  optimized(path) {
    if (!path) return;
    return new Promise((resolve) => {
      tinify.fromFile(files[0]).toFile(files[0], (err) => {
        if (!err) {
          console.log('success');
          resolve(true)
        } else {
          resolve(err);
        }
      });
    })
  }
  isImage(str) {
    const reg = /\.(png|jpg|gif|jpeg|webp)$/;
    return reg.test(str);
  }
}

module.exports = HomeController;
