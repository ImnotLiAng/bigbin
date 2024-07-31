(function () {
  const ws = new WebSocket('ws://localhost:8444')

  ws.onerror = console.error;
  
  ws.onopen =  function open() {
    console.log("opend");
  };
  ws.onmessage = function message({data}) {
    console.log("receive:", data);
    if (data === "update") location.reload();
  };
})()

try {
  throw new SyntaxError("test");
} catch(e) {
  console.error(e instanceof SyntaxError); // true
}


