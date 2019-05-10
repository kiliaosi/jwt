const crypto = require("crypto");
//JWT
//header.payload.sign

//::header
let header = {
  alg: "HS256",
  typ: "JWT"
};
//payload
/* 
    iss (issuer)：签发人
    exp (expiration time)：过期时间
    sub (subject)：主题
    aud (audience)：受众
    nbf (Not Before)：生效时间
    iat (Issued At)：签发时间
    jti (JWT ID)：编号
*/

let payload = {
  iss: "thinkjs",
  exp: 1000 * 60 * 3,
  sub: "hello JWT",
  aud: "my son",
  nbf: 1557238937967,
  iat: 1557238937967,
  jti: 1234,
  admin: true
};

//sign:
//前两个的字段的签名秘钥
const secret = "1234567";

//生成JWT，默认算法：HMAC SHA256
//公式：HMACSHA256(base64UrlEncode(header)+'.'+base64UrlEncode(payload),secret)

//在算法中，将 '+ '变为 '-'  将 '/' 变换为 '_' 省略 '='
const base64UrlEncode = data => {
  let str = Buffer.from(JSON.stringify(data))
    .toString("base64")
    .replace(/\=/g, "")
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
  return str;
};
const base64UrlDecode = str => {
  //由于等号被省略，所以无法正常解码，但是，base64编码的字符串长度是4的倍数，所以缺少的补位就行
  let assignLength = str.length % 8;
  let decodeStr =
    str +
    "="
      .repeat(4 - assignLength)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  return Buffer.from(decodeStr, "base64").toString();
};

//签名实现,防止数据被篡改，需要Hmac加密
const signerEncode = (header, payload) => {
  return crypto
    .createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("hex");
};
let headerStr = base64UrlEncode(header);
let payloadStr = base64UrlEncode(payload);
let signerStr = signerEncode(headerStr, payloadStr);
console.log(`${headerStr}.${payloadStr}.${signerStr}`);
/*
最终生成token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJ0aGlua2pzIiwiZXhwIjoxODAwMDAsInN1YiI6ImhlbGxvIEpXVCIsImF1ZCI6Im15IHNvbiIsIm5iZiI6MTU1NzIzODkzNzk2NywiaWF0IjoxNTU3MjM4OTM3OTY3LCJqdGkiOjEyMzQsImFkbWluIjp
0cnVlfQ.
8e687c223a7594660b9db9a1729723fc3305142831234ddd8b34128b47d9a449
*/
