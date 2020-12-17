'use strict';

const Controller = require('egg').Controller;
const tinify = require("tinify");
const fs = require("fs");
const join = require('path').join;

// tinify.key = "KmyFh2OTwV3f6sgeepAAAV4qwG22Jk6U";
// tinify.proxy = "http://user:pass@192.168.0.1:8080";


const maxMonthCount = 500;
const keyList = [
  'KmyFh2OTwV3f6sgeepAAAV4qwG22Jk6U',
  'YlLCVT0WDlPp9GzMlRlwfcCG3m4vzkPV',
  '6Rmm62dZsTZg5622vc127F9yQZP1ZDgp'
]



const path = require('path');
class HomeController extends Controller {

  async logPath() {

    const { ctx } = this;
    const imagePath = 'image/'
    let files = fs.readdirSync(imagePath);

    console.log('=== ', files)
  }
  async index() {
    const { ctx } = this;

    let files=[]
    function traverse(dir){
        fs.readdirSync(dir).forEach((file)=>{
            const pathname = path.join(dir,file)
            if(fs.statSync(pathname).isDirectory()){
                traverse(pathname)
            }else{
              files.push(pathname)
            }
        })
    }
    traverse('image/');
    console.log(' === ', JSON.stringify(files));
    // return;

    // 设置key 模拟请求验证是否key是合法的
    try {
      tinify.key = 'YlLCVT0WDlPp9GzMlRlwfcCG3m4vzkPV'
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



    // // 根目录下的image
    // const imagePath = 'image'
    // let files = fs.readdirSync(imagePath);
    // files = files.map((item) => {
    //   if (this.isImage(item)) {
    //     return join(imagePath, item);
    //   }
    // });
    // files = files.filter(item => { return item && item.length });

    // if (!files || !files.length) {
    //   console.error(' files count null', files);
    // }

    for (let i = 0; i < files.length; i++){
      let singlePath = files[i];
      if (singlePath.indexOf('.png') >= 0 ||
          singlePath.indexOf('.jpg') >= 0 ||
          singlePath.indexOf('.jpeg') >= 0) {

        tinify.fromFile(singlePath).toFile(singlePath, (err) => {
          console.log(`files ==`, singlePath)
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
      
      
      } 
    
    }


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
