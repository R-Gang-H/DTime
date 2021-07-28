import Crypto from 'lib/crypto.js';
import 'lib/hmac.js';
import 'lib/sha1.js';
import { Base64 } from 'lib/base64.js';


//正式
const AccessId = 'LTAI4FzHWxrdLPpuhPiMYWjJ';
const AccessKey = 'QXIjLLq8UuQgSyUZ5vvdw6xc09DxgL';
const host = 'https://dtime.oss-cn-beijing.aliyuncs.com';
const boken = "/dtime";
const timeout = 87600 //这个是上传文件时Policy的失效时间
//测试

const upload = function (params) {
  if (!params.filePath || params.filePath.length < 9) {
    wx.showModal({
      title: '图片错误',
      content: '请重试',
      showCancel: false,
    })
    return;
  }
  // host + "/" + 
  const aliyunFileKey = params.dir + (params.filePath.replace('wxfile://', '').replace('https://', '').replace('http://', ''));

  const aliyunServerURL = host;
  const accessid = AccessId;
  const policyBase64 = getPolicyBase64();
  const signature = getSignature(policyBase64);

  console.log('aliyunFileKey=', aliyunFileKey);
  console.log('aliyunServerURL', aliyunServerURL);
  wx.uploadFile({
    url: aliyunServerURL,
    filePath: params.filePath,
    name: 'file',
    formData: {
      'key': aliyunFileKey,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'signature': signature,
      'success_action_status': '200',
    },
    success: function (res) {
      if (res.statusCode != 200) {
        if (params.fail) {
          params.fail(res)
        }
        return;
      }
      if (params.success) {
        params.success(host + "/" + aliyunFileKey);
      }
    },
    fail: function (err) {
      err.wxaddinfo = aliyunServerURL;
      if (params.fail) {
        params.fail(err)
      }
    },
  })
}

const getPolicyBase64 = function () {
  let date = new Date();
  date.setHours(date.getHours() + timeout);
  let srcT = date.toISOString();
  const policyText = {
    "expiration": srcT, //设置该Policy的失效时间
    "conditions": [
      ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
    ]
  };

  const policyBase64 = Base64.encode(JSON.stringify(policyText));
  return policyBase64;
}

const getSignature = function (policyBase64) {
  const accesskey = AccessKey;

  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature = Crypto.util.bytesToBase64(bytes);

  return signature;
}


function UrlSign(img) {
  // /BugManagement/11431586500916.png
  var time = Math.floor(new Date().getTime() / 1000) + (60 * 30);//失效时间,当前时间的十分钟后失效
  var SignStr = "GET\n" +
    "\n" +
    "\n" +
    time + "\n" +
    boken + img;
  // console.log("签名字符串:"+SignStr)
  var sign = Crypto.HMAC(Crypto.SHA1, SignStr, accesskey, { asBytes: true });
  // console.log("加密后:"+sign)
  var base64sign = Crypto.util.bytesToBase64(sign);
  // console.log("最终签名:"+base64sign)
  // console.log(host+img+
  //   "?OSSAccessKeyId="+accessid+
  //   "&Expires="+time+
  //   "&Signature="+encodeURIComponent(base64sign)
  //   );
  return host + img +
    "?OSSAccessKeyId=" + accessid +
    "&Expires=" + time +
    "&Signature=" + encodeURIComponent(base64sign);
}

module.exports = {
  upload, host, UrlSign
}