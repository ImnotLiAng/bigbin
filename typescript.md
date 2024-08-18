todos: 声明合并、moduleResolution、条件类型、infer

## tsconfig.json

### include、typeRoots、types

ts 会递归查找 include 目录中所有的文件进行编译，在 include 中配置 types 目录，tsc 虽然不会编译输出对应的类型文件，但会将这些类型文件应用于类型检查;

ts 会查找 typeRoots 目录下所有类型文件用于类型检查，但不会递归查找子目录。

types 用于指定希望 ts 寻找 typeRoots 中目录下哪个包的类型。


## 全局类型声明与模块类型声明 

ts 通过文件中的**最外层** import 或 export 语句来判断是全局还是模块

对于模块类型文件，必须通过 import 引入， 而全局类型文件可以通过 reference 来引用

### declare 

declare 关键字用于声明已经存在于某个地方的变量、函数、类、命名空间或模块。它通常用于提供外部 JavaScript 代码的类型信息，
1.  声明全局变量
`declare const jQuery: (selector: string) => any;`

2. 声明全局函数
`declare function greet(name: string): void;`

3. 声明外部模块: 通常用于为没有类型定义的第三方库添加类型信息。
```ts
declare module "example-lib" {
  export function exampleFunction(param: string): number;
}

declare module "*.css";
```

4. 声明命名空间
`declare namespace MyLibrary {}`

5. 声明类
`declare class MyClass {}`

### @types
@types 作用域下的类型声明是由社区维护的中心化仓库(DefinitelyTyped)

当第三方库没有自带类型声明，且 @types 下也没有对应类型声明式，此时就需要通过 declare module 手动添加类型。

### namespace

namespace 可嵌套，内部 export 控制成员是否可在命名空间外部访问， 但当使用 declare namespace 时，其内部的 export 没有任何作用。