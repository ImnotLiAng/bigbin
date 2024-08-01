const connectWebSocket = () => {
  const ws = new WebSocket('ws://localhost:8444')

  ws.onerror = console.error;
  
  ws.onopen =  function open() {
    console.log("opend");
  };
  ws.onclose = () => {
    console.log('WebSocket connection closed, retrying...');
    setTimeout(connectWebSocket, 1000); // 1秒后重试连接
};
  ws.onmessage = function message({data}) {
    console.log("receive:", data);
    if (data === "update") location.reload();
  };
}
connectWebSocket();
