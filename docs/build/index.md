## 构建工具

在浏览器支持 ES 模块之前，JavaScript 并没有提供的原生机制让开发者以模块化的方式进行开发。这也正是我们对 “打包” 这个概念熟悉的原因：使用工具抓取、处理并将我们的源码模块串联成可以在浏览器中运行的文件

::: tip 常用的构建工具
webpack、Snowpack、vite、Rollup 、grunt、gulp
:::

### webpack

是模块化管理工具和打包工具。通过 loader 的转换，任何形式的资源都可以视作模块，比如 CommonJs 模块、AMD 模块、ES6 模块、CSS、图片等。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。它定位是模块打包器，而 <span style="color:green">Gulp/Grunt</span> 属于构建工具。Webpack 可以代替 Gulp/Grunt 的一些功能，但不是一个职能的工具，可以配合使用。

#### 原理

本质上，webpack 是一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 bundles，它们均为静态资源，用于展示你的内容。

#### 核心概念

1. 入口(entry)

入口起点(entry point) 指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。

```javascript
module.exports = {
  entry: './path/to/my/entry/file.js',
}
```

2. 输出(output)

output 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。主要输出文件的默认值是 ./dist/main.js，其他生成文件默认放置在 ./dist 文件夹中。

3. loader

webpack 本身只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。

常用的 loader 有：

- babel-loader：把 ES6 转换成 ES5
- style-loader：用于将 css 编译完成的样式，挂载到页面 style 标签上
- css-loader：用于识别.css 文件, 处理 css 必须配合 style-loader 共同使用
- sass-loader：css 预处理器，就是为了转换和编译 scss 文件为 css 文件
- postcss-loader：用于补充 css 样式各种浏览器内核前缀
- ts-loader：编译 typescript 文件为 js

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
        include: /src/,
      },
    ],
  },
}
```

4. 插件(plugin)

loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过 npm 安装
const webpack = require('webpack') // 用于访问内置插件

const config = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
}

module.exports = config
```

5. 模式

通过选择 development 或 production 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化

```js
module.exports = {
  mode: 'production',
}
```

6. 模块 (modules)

- 对比 Node.js 模块，webpack 模块能够以各种方式表达它们的依赖关系，几个例子如下：
- ES2015 import 语句
- CommonJS require() 语句
- AMD define 和 require 语句
- css/sass/less 文件中的 @import 语句。
- 样式(url(...))或 HTML 文件(< img src=... >)中的图片链接(image url)

#### 面试题

1. 前端为什么要进行打包和构建？

代码层面：

- 体积更小（Tree-shaking、压缩、合并），加载更快
- 编译高级语言和语法（TS、ES6、模块化、scss）
- 兼容性和错误检查（polyfill,postcss,eslint）

研发流程层面：

- 统一、高效的开发环境
- 统一的构建流程和产出标准
- 集成公司构建规范（提测、上线）

2. loader 和 plugin 的区别

- loader 模块转换器 （less->css）
- plugin 是扩展插件，如 HtmlWebpackPlugin

3. babel-polyfill babel-runtime 区别

- babel-polyfill 会污染全局
- babel-runtime 不会污染全局，产出第三方 lib 时要用 babel-runtime

4. webpack 优化构建速度

生产环境：

- babel-loader
- IgnorePlugin
- noParse
- happyPack
- ParallelUglifyPlugin

不能用于生产环境：

- 自动刷新
- 热更新
- DllPlugin

5. webpack 优化产出代码

- 小图片 base64 编码
- bundle 加 hash
- 懒加载
- 提取公共代码
- 使用 cdn 加速
- IgnorePlugin
- 使用 production
- Scope Hosting
- (场景、效果、原理)

6. webpack 打包原理和流程
