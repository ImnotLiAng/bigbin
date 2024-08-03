import http2 from 'http2';
import fs from 'fs';
import path from 'path';
import config from "../config";
import parse from "../parseFile";

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
  url = path.join(config.appSrcDir, url);
  if (!~url.indexOf(".")) url += ".ts"
  if (url.endsWith(".js") || url.endsWith(".ts")) {
    res.writeHead(200, {"Content-Type": "application/javascript" })
  }
  parse(url).then(data => {
    res.end(data);
  }).catch(() => {
    res.end("404");
  })
    
});

// 监听端口
server.listen(config.port, () => {
  console.log(`HTTP/2 server is listening on https://localhost:${config.port}`);
});
