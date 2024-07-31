(function () {
  const ws = new WebSocket('ws://localhost:8444')

  ws.onerror = console.error;
  
  ws.onopen =  function open() {
    console.log("opend1111111");
  };
  ws.onmessage = function message({data}) {
    console.log("receive:", data);
    if (data === "update") location.reload();
  };
})()

try {

  console.log(11);
} catch(e) {
  console.error(e instanceof SyntaxError); // true
}


