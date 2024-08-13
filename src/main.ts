import "./devServer";
import "./watch";

const testFun = (a: string) => {
  console.log("test:", a);
}

testFun("222");

export {
  testFun
}
