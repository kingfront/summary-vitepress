## node

### exports、module.exports 对比

经常分不清 exports、module.exports、import、require 的用法，下面针对总结一下：

- import : es6 支持的引入
- export : es6 支持的导出
- require: node 和 es6 都支持的引入
- module.exports: node 支持的导出

1. import 和 exports 配对使用

default 用法

```js
// 导出 util.js
export default {
  makeStr: (params) => {
    return `hello, ${params}`
  },
}

// 引入 index.js
import util from './util.js'
const str = util.makeStr('import用法')
console.log(str)
```

非 default 用法

```js
// 导出 util.js
export const makeStr = (params) => {
  return `hello, ${params}`
}
// 导入 index.js
import { makeStr } from './util.js'
console.log(makeStr('import用法2'))
```

2. require 和 module.exports 配对使用

```js
// 导出 util.js
module.exports = {
  makeStr: (params) => {
    return `hello,${params}`
  },
}

// 引入 index.js
const util = require('./util.js')
const str = util.makeStr('require用法')
console.log(str)
```

### Promise 理解

1. 先回忆一下 callback

```js
// 获取数据api
function getData(url, callback) {
  axios.get(`http://www.api.com/api/${url}`).then((result) => {
    callback(result)
  })
}

// 调用嵌套
getData('/login', function (res) {
  getData('/initData', function (rep) {
    console.log(rep)
  })
})
```

::: tip 缺点

1. callback 函数处理异步代码逻辑复杂，可读性差
2. 回调地狱，不可 return

:::

2. Promise

   Promise 的实现过程，其主要使用了设计模式中的观察者模式：

   通过 Promise.prototype.then 和 Promise.prototype.catch 方法将观察者方法注册到被观察者 Promise 对象中，同时返回一个新的 Promise 对象，以便可以链式调用。
   被观察者管理内部 pending、fulfilled 和 rejected 的状态转变，同时通过构造函数中传递的 resolve 和 reject 方法以主动触发状态转变和通知观察者。

```js
function getUserId() {
  return new Promise(function (resolve) {
    http.get(url, function (results) {
      resolve(results.id)
    })
  })
}

getUserId().then(function (id) {
  //一些处理
})
```

```js
// 自己实现的promise
function Promise(fn) {
  var state = 'pending',
    value = null,
    callbacks = []
  this.then = function (onFulfilled, onRejected) {
    return new Promise(function (resolve, reject) {
      handle({
        onFulfilled: onFulfilled || null,
        onRejected: onRejected || null,
        resolve: resolve,
        reject: reject,
      })
    })
  }
  function handle(callback) {
    if (state === 'pending') {
      callbacks.push(callback)
      return
    }
    var cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,
      ret
    if (cb === null) {
      cb = state === 'fulfilled' ? callback.resolve : callback.reject
      cb(value)
      return
    }
    ret = cb(value)
    callback.resolve(ret)
  }
  function resolve(newValue) {
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then
      if (typeof then === 'function') {
        then.call(newValue, resolve, reject)
        return
      }
    }
    state = 'fulfilled'
    value = newValue
    execute()
  }
  function reject(reason) {
    state = 'rejected'
    value = reason
    execute()
  }
  function execute() {
    setTimeout(function () {
      callbacks.forEach(function (callback) {
        handle(callback)
      })
    }, 0)
  }

  fn(resolve, reject)
}
```
