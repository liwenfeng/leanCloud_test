var crypto = require('crypto');
var config = require('cloud/config/weixin.js');
var debug = require('debug')('AV:weixin');
var https = require('https');

var appId = 'wxe1eed2f322602d9b';
var secret='e6ecb1bf103ecfd74eb658b200b155b3';
var access_token = '';

exports.exec = function(params, cb) {
  if (params.signature) {
    checkSignature(params.signature, params.timestamp, params.nonce, params.echostr, cb);
  } else {
    receiveMessage(params, cb)
  }
}

// 验证签名
var checkSignature = function(signature, timestamp, nonce, echostr, cb) {
  var oriStr = [config.token, timestamp, nonce].sort().join('')
  var code = crypto.createHash('sha1').update(oriStr).digest('hex');
  debug('code:', code)
  if (code == signature) {
    cb(null, echostr);
  } else {
    err.code = 401;
      var err = new Error('Unauthorized');
    cb(err);
  }
}

function update(){
    https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appId+'&secret='+secret, function(res) {
        res.on('data', function(d) {
            access_token=JSON.parse( d.toString()).access_token
        });
    })
    setTimeout(update,7100000)
}
update()

// 接收普通消息
var receiveMessage = function(msg, cb) {

    var result;
    result = {
        xml: {
            ToUserName: msg.xml.FromUserName[0],
            FromUserName: '' + msg.xml.ToUserName + '',
            CreateTime: new Date().getTime(),
            MsgType: 'voice',
            Voice: {
                MediaId:'LbI7wBbo5f2gJWpuFWQkj1Tp0qcRPCF_FPDdUsPwhg1nhUHr1Tat6KJn_mD--QlJ'
            }
        }

        
    };
    cb(null, result);
}
