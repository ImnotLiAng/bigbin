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