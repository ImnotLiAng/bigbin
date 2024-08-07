import "./devServer";
import "./watch";

const testFun: myType.fun = (a: string) => {
  console.log("test:", a);
}

testFun("222");

export {
  testFun
}
