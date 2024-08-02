import chokidar from "chokidar";
import WebSocket from "ws";
import config from "./config";

const { appSrcDir } = config;

// watch app
const socketServer = (function() {
  let socket: null | WebSocket = null;
  const wss = new WebSocket.Server({ port: 8444 });
  wss.on('connection', (ws) => {
    socket = ws;
  });
  const watcher = chokidar.watch(appSrcDir, {
    ignored: /^\./,  // 忽略以 . 开头的文件
    persistent: true, // 持续监听
    ignoreInitial: true, // 忽略初始添加事件
  });

  watcher
    .on('add', path => {
      sendMessage();
    })
    .on('change', path => {
      sendMessage();
    })
    .on('unlink', path => {
      sendMessage();
    });

    function sendMessage() {
      if (socket) socket.send("update");
    }
    return wss;
})();
