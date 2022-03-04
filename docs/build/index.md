## 构建工具

在浏览器支持 ES 模块之前，JavaScript 并没有提供的原生机制让开发者以模块化的方式进行开发。这也正是我们对 “打包” 这个概念熟悉的原因：使用工具抓取、处理并将我们的源码模块串联成可以在浏览器中运行的文件

::: tip 常用的构建工具
Webpack、Vite、Rollup、Esbuild、Gulp
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

常用的 plugin 有：

- HtmlWebpackPlugin: 简单创建 HTML 文件，用于服务器访问
- Uglifyjs-webpack-plugin：用于 js 代码丑化压缩，一般用于生产环境
- CommonsChunkPlugin： 提高打包效率，将第三方库和业务代码分开打包。
- ProvidePlugin： 自动加载模块，而不必到处 import 或 require 。
- ExtractTextWebpackPlugin： 将 js 文件中引用的样式单独抽离成 css 文件，防止将样式打包在 js 中引起页面样式加载错乱的现象
- HotModuleReplacementPlugin： 热更新

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

- 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
- 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，通过执行对象的 run 方法开始执行编译；
- 确定入口：根据配置中的 entry 找出所有入口文件；
- 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
- 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容及它们之间的依赖关系；
- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再将每个 Chunk 转换成一个单独的文件加入输出列表中，这是可以修改输出内容的最后机会；
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，将文件的内容写入文件系统中

7. 多页面打包

```js
module.exports = {
  entry: {
    page1: './src/pages/page1/app.js', // 页面1
    page2: './src/pages/page2/app.js', // 页面2
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name]/[name]-bundle.js', // filename不能写死，只能通过[name]获取bundle的名字
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/page1/index.html',
      chunks: ['page1'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/page2/index.html',
      chunks: ['page2'],
    }),
  ],
}
```

### gulp

Gulp 是基于 NodeJS 的项目，一个用作自动化构建的工具，业界一般用来建造前端的工作流。

它的核心原理其实很简单，最主要是通过各种 Transform Stream 来实现文件的处理，然后再进行输出。Transform Streams 是 NodeJS Stream 的一种，是可读又可写的，它会对传给它的对象做一些转换的操作。

文件输入 → Gulp 插件处理 → 文件输出

原则上，gulp 可以针对文件做任何有趣、有创造力事情。
而自动化构建，只是大家主要比较喜欢使用的方向。

Gulp 的特点：

- 自动化 - Gulp 为你的工作流而服务，自动运行那些费事费力任务。

- 平台透明 - Gulp 被集成到各种 IDE 中，并且除了 NodeJS 之外，其他如 PHP、.NET、Java 平台都可以使用 Gulp。

- 强大生态系统 - 你可以使用 npm 上 2000+ 的插件来构造你的工作流。

- 简单 - Gulp 只提供几个 API，这可以很快地学习和上手。

### webpack VS gulp

#### Gulp 构建工具

gulp 是工具链，构建工具，可以配合各种插件做 JS 压缩，CSS 压缩，less 编译替代手动实现自动化工作.
所以它的主要作用是

1. 构建工具
2. 自动化
3. 提高效率

gulp 是为了规范前端开发流程，实现前后端分离、模块化开发、版本控制、文件合并、压缩、Mock 数据等功能的一个前端自动化构建工具。
强调的是前端开发的工作流程，我们可以通过配置一系列的 task（Gulp 中的 gulp.task()方法配置），定义 task 处理的事务（例如文件压缩合并、雪碧图、启动 server、sass/less 预编译、版本控制等）然后定义执行顺序，来让 gulp 执行这些 task，从而构建项目的整个前端开发流程。核心是 task runner。
::: tip
Gulp 侧重于开发整个过程的控制管理
:::

#### Webpack 打包工具

web 是文件打包工具，可以把项目的各种 js 文件，css 文件等打包合成一个或多个文件，主要用于模块化方案，预编译模块的方案
所以它的主要作用是

1. 打包工具
2. 模块化识别
3. 编译模块代码方案

webpack 是当下最热门的前端资源模块化管理和打包工具，成为模块打包机。
它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。通过 loader 的转换，任何形式的资源都可以视作模块，比如 CommonJs 模块、AMD 模块、ES6 模块、CSS、图片、JSON、Coffeescript、Less 等
::: tip
Webpack 更侧重于模块打包
:::

### [vite](https://vitejs.cn/guide/why.html#the-problems)

当项目逐渐变大时，使用 webpack 等工具打包太慢了，即使使用 HMR，文件修改后的效果也需要几秒钟才能在浏览器中反映出来。极大地影响开发者的开发效率和幸福感。

Vite 以 原生 ESM 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作，Vite 只需要在浏览器请求源码时进行转换并按需提供源码

| 环境     | 构建依赖 | 构建方式                                     | 源码类型 |
| -------- | -------- | -------------------------------------------- | -------- |
| 开发环境 | Esbuild  | 启动时提前构建依赖包、HMR 热更新指定页面源码 | ESM      |
| 生产环境 | Rollup   | 构建打包依赖、源码                           | ESM      |

::: tip Esbuild 和 Rollup
Esbuild 使用 Go 编写，构建依赖非常的快，但一些针对构建 应用 的重要功能仍然还在持续开发中 —— 特别是代码分割和 CSS 处理方面，Rollup 在应用打包方面更加成熟和灵活，所以生产环境暂时先使用 Rollup。
:::

Vite 通过在一开始将应用中的模块区分为 依赖 和 源码 两类，改进了开发服务器启动时间。

- 依赖：在服务器启动时，把第三方依赖的包或者不常变动的包，通过 esbuild 预构建依赖 进行提前打包
- 源码：例如 JSX，CSS 或者 Vue/Svelte 组件，时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）

![流程图](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa4444159ea14eb583dc787d5f399b56~tplv-k3u1fbpfcp-watermark.awebp?)

更详细参考：https://juejin.cn/post/7064853960636989454

### Esbuild

Esbuild 为什么那么快？

- 它是用 Go 语言编写的，该语言可以编译为原生代码；
- 解析，打印和源映射生成全部完全并行化；
- 无需昂贵的数据转换，只需很少的几步即可完成所有操作；
- 编写代码时处处注意速度表现，并尽量避免不必要的配置。

支持：

- commonJS 模块
- ES6 模块
- 使用’–bundle’与 ES6 模块的静态绑定打包
- 使用’–minify’完全压缩（空格、标识符和修饰符）
- 启用’–sourcemap’时，完全支持源映射
- .jsx 文件的 JSX 到 JavaScript 转换
- 通过’–define’进行编译时标识符替换
- 使用 package.json 中的’browser’字段进行路径替换
- 自动检测 tsconfig.json 中的’baseUrl’

### Rollup

Rollup 优势：

- 输出结果更加扁平，执行效率自然更高
- 自动移除未引用代码
- 打包结果依然完全可读

Rollup 缺陷：

- 加载非 ESM 的第三方模块比较复杂
- 模块最终打包到一个函数中，无法实现 HMR
- 浏览器环境中，代码拆分依赖 amd

Webpack 大而全，Rollup 小而美
所以，vue 目前在开发环境下使用 Esbuild，生产环境打包使用 Rollup

### package.json

package.json 文件就是一个 JSON 对象，该对象的每一个成员就是当前项目的一项设置
依赖版本号

1. 版本号说明：

- 指定版本：比如 1.2.2，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装指定版本。
- 波浪号 ：比如~1.2.2，表示安装 1.2.x 的最新版本，不低于 1.2.2，但是不安装 1.3.x
- 插入号 ：比如 ˆ1.2.2，表示安装 1.x.x 的最新版本，不低于 1.2.2，但是不安装 2.x.x，需要注意的是，如果大版本号为 0，则插入号的行为与波浪号相同

2. 文件属性说明：

- latest ：安装最新版本
- name：项目/模块名称，长度必须小于等于 214 个字符，不能以"."(点)或者"\_"(下划线)开头，不能包含大写- 字母。
- version：项目版本。
- author：项目开发者，它的值是你在https://npmjs.org网站的有效账户名，遵循“账户名<邮件>”的规则，- 例如：zhangsan zhangsan@163.com。
- description：项目描述，是一个字符串。它可以帮助人们在使用 npm search 时找到这个包。
- keywords：项目关键字，是一个字符串数组。它可以帮助人们在使用 npm search 时找到这个包。
- private：是否私有，设置为 true 时，npm 拒绝发布。
- license：软件授权条款，让用户知道他们的使用权利和限制。
- bugs：bug 提交地址。
- contributors：项目贡献者 。
- repository：项目仓库地址。
- homepage：项目包的官网 URL。
- dependencies：生产环境下，项目运行所需依赖。
- devDependencies：开发环境下，项目所需依赖。
- scripts：执行 npm 脚本命令简写，比如 “start”: “react-scripts start”, 执行 npm start 就- 是运行 “react-scripts start”。
- bin：内部命令对应的可执行文件的路径。
- main：项目默认执行文件，比如 require(‘webpack’)；就会默认加载 lib 目录下的 webpack.js 文- 件，如果没有设置，则默认加载项目跟目录下的 index.js 文件。
- module：是以 ES Module(也就是 ES6)模块化方式进行加载，因为早期没有 ES6 模块化方案时，都是遵- 循 CommonJS 规范，而 CommonJS 规范的包是以 main 的方式表示入口文件的，为了区分就新增了 - module 方式，但是 ES6 模块化方案效率更高，所以会优先查看是否有 module 字段，没有才使用 main - 字段。
- eslintConfig：EsLint 检查文件配置，自动读取验证。
- engines：项目运行的平台。
- browserslist：供浏览器使用的版本列表。
- style：供浏览器使用时，样式文件所在的位置；样式文件打包工具 parcelify，通过它知道样式文件的打包- 位置。
- files：被项目包含的文件名数组
