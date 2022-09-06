## 面试二

### 基础

1. vue生命周期
   
`. vue2.x`

  1. 初始化阶段

     beforeCreate ：实例刚刚创建完，此时还没有data和methods属性
     created：vue实例data和methods刚刚创建完，此时还没有编译模板

  2. 实例挂载阶段
     beforeMount: 挂载前，模板刚刚编译完，此时el还没有挂载
     mounted：挂载完成后，模板编译完成，el已经挂载成功
  
  3. 数据更新阶段

     beforeCreate：数据更新时执行，data数据此时已经是最新数据，ui界面还是旧数据
     updated：数据更新完成后，界面和data里面的数据都是最新的

  4. 销毁阶段

     beforeDestroy：实例准备销毁，data和methods还能正常使用
     destroyed：实例销毁完成，原先创建的属性都不可用了

`. vue3.x`

  vue3中可以继续使用vue2.x中的生命周期钩子，但是有两个被改名：

  beforeDestroy改名为beforeUnmount

  destroyed改名为unmounted

  vue3也提供了Composition API形式的生命周期钩子，与vue2.x中钩子对应关系如下

  beforeCreate =====setup（）

  created =========setup（）

  beforeMount=====onBeforeMount

  mounted========onMounted

  beforeUpdate====onBeforeUpdate

  updated========onUpdated

  beforeUnmount==onBeforeUnmount

  unmounted=====onUnmounted

2. 实现一个深拷贝

使用递归循环:

. 正确处理对象内的循环引用 
. 保持之前的原型链

. 正确处理 bigint 类型

. 正确处理 正则、Date 类型

. 正确处理 function、undefined 类型

. 正确处理 key 为 symbol 类型的字段
```js
function cloneDeep(target, map = new Map()) {
  if (target === null) return null;
  if (typeof target !== 'object') return target;
  if (target.constructor === Date) return new Date(target);
  if (target.constructor === RegExp) return new RegExp(target);
  if (map.has(target)) return map.get(target);
  const newTarget = new target.constructor();
  map.set(target, newTarget);
  Reflect.ownKeys(target).forEach(key => {
    newTarget[key] = cloneDeep(target[key], map);
  })
  return newTarget;
};
```
3. 防抖与节流

. 防抖- 将多次操作变为一次操作，比如：联想模糊查询
. 节流- 一定时间内，只执行一次请求

4. 原型和原型链

. 原型：每一个函数类型的数据，都有一个叫做prototype的属性，这个属性指向的是一个对象，就是所谓的原型对象，对于原型对象来说，它有个constructor属性，指向它的构造函数

  最主要的作用就是用来存放实例对象的公有属性和公有方法。
  
. 原型链：因为对象的原型对象也是对象，所以原型对象也有指向，__proto__的指向是Object，而Object再往上指向，就是null了，所以构成了一个原型链

  如果某个对象查找属性，自己和原型对象上都没有，那就会继续往原型对象的原型对象上去找，这个例子里就是Object.prototype，这里就是查找的终点站了，在这里找不到，就没有更上一层了（null里面啥也没有），直接返回undefined。

5. 览器缓存策略
   
  览器缓存策略分为两种：强缓存和协商缓存，并且缓存策略都是通过设置 HTTP Header 来实现的

. 强缓存
  不会向服务器发送请求，直接从缓存中读取资源，强缓存可以通过设置两种 HTTP Header 实现：Expires 和 Cache-Control

  Expires：

  缓存过期时间，用来指定资源到期的时间，是服务器端具体的时间点
  Expires 是 HTTP/1 的产物，受限于本地时间，如果修改了本地时间，可能会造成缓存失效

  Cache-Control:

  HTTP/1.1 的产物，比如当设置Cache-Control:max-age=300，单位是s，代表5分钟内再次请求就会走强缓存

  `对比：Cache-Control优先级高于Expires`

. 协商缓存

  协商缓存就是`强制缓存`失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程

  协商缓存可以通过设置两种 HTTP Header 实现：Last-Modified 和 ETag

  Last-Modified:
  http1.0

  原理：浏览器第一次访问资源时，服务器会在response头里添加Last-Modified时间点，这个时间点是服务器最后修改文件的时间点，然后浏览器第二次访问资源时，检测到缓存文件里有Last-Modified，就会在请求头里加If-Modified-Since，值为Last-Modified的值，服务器收到头里有If-Modified-Since，就会拿这个值和请求文件的最后修改时间作对比，如果没有变化，就返回304，如果小于了最后修改时间，说明文件有更新，就会返回新的资源，状态码为200
  ETag:
  http1.1

  原理：与Last-Modified类似，只是Last-Modified返回的是最后修改的时间点，而ETag是每次访问服务器都会返回一个新的token，第二次请求时，该值埋在请求头里的If-None-Match发送给服务器，服务器在比较新旧的token是否一致，一致则返回304通知浏览器使用本地缓存，不一致则返回新的资源，新的ETag，状态码为200

  `对比：ETag更精确，性能上Last-Modified好点`