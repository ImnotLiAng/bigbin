import http2 from 'http2';
import fs from 'fs';
import path from 'path';
import config from "../config";

// 读取自签名证书和私钥
const serverOptions = {
  key: fs.readFileSync(path.join(config.keyDir, './server-key.pem')),
  cert: fs.readFileSync(path.join(config.keyDir, './server-cert.pem'))
};

// 创建 HTTP/2 服务器
const server = http2.createSecureServer(serverOptions, (req, res) => {
  let url = "";
  switch(req.url) {
    case "/":
      url = "index.html";
      break;
    default:
      url = req.url;
  }
  if (req.url.endsWith(".js")) {
    res.writeHead(200, {"Content-Type": "application/javascript" })
  }
  let data;
  try {
    data = fs.readFileSync(path.join(config.appDistDir, url));
  } catch(err) {}
  if (data) {
    res.end(data);
  }
});

// 监听端口
server.listen(config.port, () => {
  console.log(`HTTP/2 server is listening on https://localhost:${config.port}`);
});