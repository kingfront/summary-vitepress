## 面试一

### 基础

1. 什么是闭包？

Node 官方说法：
在 js 中，实现外部作用域访问内部作用域中变量的方法叫做“闭包”。
个人总结：
为了避免变量参数重名、或者被篡改，通常会把一些变量放到一个函数作用域内部，然后外部作用域通过函数等其它方式访问内部作用域的变量，所以就形成了闭包。

```js
;(function (bi) {
  var test = 123
  make = function () {
    return test
  }
})()
console.log(make())
```

2. js 的垃圾回收(GC)

`原理：找出不再继续使用的变量，然后释放掉其占用的内存`

- 标记清除法（Mark-Sweep）

此算法分为 标记 和 清除 两个阶段，标记阶段即为所有活动对象做上标记，清除阶段则把没有标记（也就是非活动对象）销毁

- 引用计数法（Reference Counting）
  随着引用的次数，进行增减，当这个值的引用次数变为 0 的时候，说明没有变量在使用，这个值没法被访问了，回收空间，垃圾回收器会在运行的时候清理掉引用次数为 0 的值占用的内存

V8 对 GC 的优化
分代式垃圾回收
V8 内部将堆内存分为新生代和老生代两块区域，采用不同的策略管理垃圾回收。新生代的对象为存活时间比较短的对象（1-8m），老生代对象为存活时间比较长或常驻内存的对象。

分代式机制把一些新、小、存活时间短的对象作为新生代，采用一小块内存频率较高的快速清理，而一些大、老、存活时间长的对象作为老生代，使其很少接受检查，新老生代的回收机制及频率是不同的，可以说此机制的出现很大程度提高了垃圾回收机制的效率

3. 了解的设计模式

- 发布订阅模式

在 js 中事件模型就相当于传统的发布订阅模式
应用场景：addEventListener 监听事件

- 策略模式

定义： 定义一系列算法，把它们一个个封装起来，并且使它们可以相互替换。

- 观察者模式

观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。观察者模式属于行为型模式。

应用场景：Promise 原理

4. 说说浏览器和 node 中的事件循环（EventLoop）

- Node

  当 Node.js 启动后，它会初始化事件循环，处理已提供的输入脚本（或丢入 REPL，本文不涉及到），它可能会调用一些异步的 API、调度定时器，或者调用 process.nextTick()，然后开始处理事件循环
  ┌───────────────────────────┐
  ┌─>│ timers │
  │ └─────────────┬─────────────┘
  │ ┌─────────────┴─────────────┐
  │ │ pending callbacks │
  │ └─────────────┬─────────────┘
  │ ┌─────────────┴─────────────┐
  │ │ idle, prepare │
  │ └─────────────┬─────────────┘ ┌───────────────┐
  │ ┌─────────────┴─────────────┐ │ incoming: │
  │ │ poll │<─────┤ connections, │
  │ └─────────────┬─────────────┘ │ data, etc. │
  │ ┌─────────────┴─────────────┐ └───────────────┘
  │ │ check │
  │ └─────────────┬─────────────┘
  │ ┌─────────────┴─────────────┐
  └──┤ close callbacks │
  └───────────────────────────┘

- 浏览器 js

事件循环分为：宏任务与微任务

1. 宏任务（macrotask）：script（整体代码）、setTimeout/setInterval、I/O、UI rendering 等
2. 微任务（microtask）：Promise、MutationObserver 等

JS 执行过程中，是先执行一个宏任务，再执行这个宏任务产生的对应微任务，执行完毕后，再执行后面的宏任务，以此往复

5. http2.0

- 新的二进制格式（Binary Format）
- 多路复用（MultiPlexing
- header 压缩
- 服务端推送（server push），同 SPDY 一样，HTTP2.0 也具有 server push 功能。

HTTP2.0 的升级改造
前文说了 HTTP2.0 其实可以支持非 HTTPS 的，但是现在主流的浏览器像 chrome，firefox 表示还是只支持基于 TLS 部署的 HTTP2.0 协议，所以要想升级成 HTTP2.0 还是先升级 HTTPS 为好。

当你的网站已经升级 HTTPS 之后，那么升级 HTTP2.0 就简单很多，如果你使用 NGINX，只要在配置文件中启动相应的协议就可以了
使用了，NGINX 会自动向下兼容的。

6. 浏览器缓存机制

- 强缓存
  Exprires、Cache-Control

- 协商缓存
  If-None-Match 、If-Modified-Since

- 缓存位置
  memory-cache、disk-cache、service worker

7. 什么是原型什么是原型链?

- 原型

  在 JavaScript 中，每个函数 都有一个 prototype 属性，当一个函数被用作构造函数来创建实例时，这个函数的 prototype 属性值会被作为原型赋值给所有对象实例（也就是设置 实例的`__proto__`属性），也就是说，所有实例的原型引用的是函数的 prototype 属性

- 原型链

  因为每个对象和原型都有原型，对象的原型指向原型对象，
  而父的原型又指向父的父，这种原型层层连接起来的就构成了原型链。

8. HTTP2.0

-  二进制传输
  以二进制方式传输和Header 压缩 ,二进制协议解析起来更高效

-  Header压缩
  采用哈夫曼编码来压缩整数和字符串，可以达到50%~90%的高压缩率
     
-  多路复用
   多路复用允许同时通过单一的HTTP/2连接发起多重的请求-响应信息，很好的解决了浏览器限制同一个域名下的请求数量的问题，同时也更容易实现全速传输。

- 服务器推送
  HTTP2还在一定程度上改变了传统的“请求-应答”工作模式，服务器不再是完全被动地响应请求，也可以新建“流”主动向客户端发送消息。比如，在浏览器刚请求HTML的时候就提前把可能会用到的JS、CSS文件发给客户端，减少等待的延迟，这被称为”服务器推送”（ Server Push，也叫 Cache push）。

  注意：虽然HTTP/2也具备服务器推送功能，但HTTP/2 只能推送静态资源，无法推送指定的信息。不能像websocket那样，推送任意信息


9. Websocket

1、WebSocket是双向通信协议，模拟Socket协议，可以双向发送或接受信息，而HTTP是单向的； 2、WebSocket是需要浏览器和服务器握手进行建立连接的，而http是浏览器发起向服务器的连接。

优点：
WebSocket协议一旦建议后，互相沟通所消耗的请求头是很小的
服务器可以向客户端推送消息了

缺点：
少部分浏览器不支持，浏览器支持的程度与方式有区别（IE10）    

- 如何判断在线离线？
  客户端每次请求，记录时间戳，然后根据配置的离线时间，计算是否离线
- 如何解决断线问题
  1. websocket超时没有消息自动断开连接  
  客户端或者服务端，定时发送心跳包
  2. websocket异常包括服务端出现中断，交互切屏等等客户端异常中断等等
   针对这种异常的中断解决方案就是处理重连，下面我们给出的重连方案是使用js库处理：引入reconnecting-websocket.min.js

### 可视化

- canvas： 是html5新定义的一个标签，用于做图形容器
- webgl： 提供直接访问GPU绘图能力的一套API，这种绘图技术标准允许把JavaScript和OpenGL ES 2.0结合在一起，要依赖canvas运行
- three.js是以webgl为基础的库，封装了一些3D渲染需求中重要的工具方法与渲染循环
- D3.js是一个数据可视化的库，看看他们的DEMO就可以知道，技术基础是SVG。兼容性是IE9+