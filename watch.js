const chokidar = require('chokidar');
const { exec } = require('child_process');
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");


// watch app
(function() {
  let socket;
  const wss = new WebSocket.Server({ port: 8444 });
  wss.on('connection', (ws) => {
    socket = ws;
  });
  const watcher = chokidar.watch("app/src", {
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

    const getTartgeFilePath = url =>  path.join(...[
      "dist", ...url.split(path.sep).slice(2)
    ]);

    function handle(url) {
      if (!url.endsWith(".ts")) {
        copyFile(url).then(sendMessage);
        return;
      }

      const source = fs.readFileSync(url, 'utf-8');
      const result = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.ESNext }
      });
      const TargetPath = getTartgeFilePath(url);
      const parsedPath = path.parse(TargetPath);
      const outPutPath = path.format({
        ...parsedPath,
        base: undefined, // 避免 base 覆盖
        ext: '.js'
      });
      fs.writeFileSync(outPutPath, result.outputText, 'utf8');
      sendMessage();
    }


    async function copyFile(url) {
      const sourceFile = url;
      const targetFile = getTartgeFilePath(url);
      try {
        await fs.copyFile(sourceFile, targetFile, () => {});
      } catch (err) {
        console.log(err)
      }
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

  let currentProcess = null;

  function runBuild(path) {
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