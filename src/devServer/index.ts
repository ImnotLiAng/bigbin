import http2 from 'http2';
import fs from 'fs';
import path from 'path';
import config from "../config";
import ts from "typescript";

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
    if (!url.endsWith(".ts")) {
      fs.readFile(url, ((err, data) => {
        if (err) {
          res.end("read File error");
          return;
        }
        res.end(data);
      }))
    } else {
      fs.readFile(url, {encoding :'utf-8'}, (err, source) => {
        if (err) {
          res.end("read File error");
          return;   
        }
        const result = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.ESNext }
        });
        const data = Buffer.from(result.outputText, 'utf-8');
        res.end(data);
      })
    }
});

// 监听端口
server.listen(config.port, () => {
  console.log(`HTTP/2 server is listening on https://localhost:${config.port}`);
});
