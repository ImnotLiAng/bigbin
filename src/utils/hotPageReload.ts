import watch from "node-watch";
import config from "../config";
import WebSocket from "ws";

const wss = new WebSocket.Server({ port: config.socketPort });

wss.on('connection', (ws) => {
  console.log('New client connected');

  watch(config.staticPath, { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`${filename} file changed: ${ eventType }`);
      ws.send("update");
    }
  });
});

