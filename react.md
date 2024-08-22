## React.forwardRef()
默认每个组件的 DOM 节点都是私有的， 为了将 DOM 节点暴露出去，可以将组件定义包装在 forwardRef () 内：
```js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <Input ref={ref}/>
})

// 此时父组件就能直接访问 MyInput 暴露的 DOM 节点
function Form() {
  const ref = useRef(null);
  return <MyInput ref={ref}/>
}

// MyInput 组件也可以继续将 ref 向下分发
const MyInput = forwardRef((props, ref) => {
  return <CustomInput ref={ref} />
})
```

### 暴露命令式句柄而非 DOM 节点
将接收到的 ref 传递给 useImperativeHandle， 并指定想要暴露的方法。
```js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      }
    }
  })

  return <Input ref={inputRef} />;
})

// 此时父组件只能接收到 { foucus } 对象

```
暴露的方法不一定需要匹配 DOM 节点相关的方法，也可以是其他子节点中的方法。


## memo 与 PureComponent
在父组件重新渲染时，一般会对子组件进行重新渲染，
此时可以使用 PureComponent 在 props 和 state 不变的情况下规避掉重新渲染：
默认对 props 和 state 进行浅比较，可以通过定义 shouldComponentUpdate 方法来自定比较函数.
```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```
函数式组件则使用 memo, 当传递给组件的 props 发生变化时，才会触发组件的重新渲染。
默认情况下进行浅比较，可以通过第二个参数设置自定义比较函数
```js
const Greeting = memo(function Greeting({ name }) {
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```


## context
 `const SomeContext =  React.createContext(defaultValue) // 这里的 defaultValue 为组件没有匹配的上下文时的默认值`

 `<SomeContext.Provider value={someValue}>` 使用 provider 包裹组件，可嵌套，被包裹组件获取最近的上下文

 `<SomeContext.Consumer>{someValue => <button>{someValue}</button>}</SomeContext.Consumer>` 使用 consumer 读取上下文（遗留方法）， 也可嵌套

 `const someValue = React.useContext(SomeContext)` 使用 useContext 读取， 没有匹配到上下文时，即为 React.createContext(defaultValue) 中的 defaultValue

`static contextType = SomeContext;` 在类式组件中，通过 ‘static contextType’ 声明要读取的 context， 仅支持读取单个 context， 在实例方法中，使用 this.context 获取值