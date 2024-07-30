import * as http2 from 'http2';
import * as fs from 'fs';
import * as path from 'path';

// 读取自签名证书和私钥
const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, 'server-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'server-cert.pem'))
};

// 创建 HTTP/2 服务器
const server = http2.createSecureServer(serverOptions, (req, res) => {
  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'text/html' });
  // 发送响应
  res.end(fs.readFileSync(path.join(__dirname, "../frontend/index.html")));
});

// 监听端口
server.listen(8443, () => {
  console.log('HTTP/2 server is listening on https://localhost:8443');
});