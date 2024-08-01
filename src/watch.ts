import chokidar from "chokidar";
import { exec, ChildProcess } from "child_process";
import WebSocket from "ws";
import { buildSingal } from "./build/index";
import config from "./config";

const { appSrcDir } = config;

// watch app
(function() {
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
      handle(path);
    })
    .on('change', path => {
      handle(path);
    })
    .on('unlink', path => {
      handle(path);
    });

    function sendMessage() {
      if (socket) socket.send("update");
    }

    function handle(fullPath: string) {
      buildSingal(fullPath).then(sendMessage);
    }

})();

// watch buildTools
(function () {

  const watcher = chokidar.watch('src', {
    ignored: /^\./,  // 忽略以 . 开头的文件
    persistent: true, // 持续监听
    ignoreInitial: true, // 忽略初始添加事件
  });
  // 监听文件变化
  watcher
    .on('add', path => {
      runBuild(path);
    })
    .on('change', path => {
      runBuild(path);
    })
    .on('unlink', path => {
      runBuild(path);
    });

  let currentProcess: ChildProcess | null = null;

  function runBuild(path: string) {
    // 如果有正在执行的进程，先终止它
    if (currentProcess) {
      currentProcess.kill();
    }

    currentProcess = exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        return;
      }
      if (stderr) {
        return;
      }
    });
  }
})();