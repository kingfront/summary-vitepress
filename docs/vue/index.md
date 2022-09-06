## vue

![RUNOOB 图标](https://v3.cn.vuejs.org/images/lifecycle.svg)

### vue3 设计与实现

Tree-shaking
消除那些永远不被执行的代码，可添加注释，表明代码不被执行

1. 编译器

- 把 vue 文件模板，编译为渲染函数
- 提取静态属性到前面,并设置 patchFlags 为-1

编译器前

```vue
<template>
  <div>你好</div>
</template>
<script>
export default {}
</script>
```

编译器后

```js
export default {
  render() {
    h('div', '你好')
  },
}
```

2. 渲染器

- 把虚拟 DOM 渲染为真实 DOM
- 通过 DIFF 算法，找出最小变更点
- h 函数是转换为虚拟 DOM 的一个辅助函数

3. 响应式

通过 ES6 新语法 proxy，监听对象的 get、set，从而执行副作用函数

### vue3.x 的变化

1. 事件缓存：将事件缓存，可以理解为变成静态的了
2. 添加静态标记：Vue2 是全量 Diff，Vue3 是静态标记 + 非全量 Diff
3. 静态提升：创建静态节点时保存，后续直接复用
4. 使用最长递增子序列优化了对比流程：Vue2 里在 updateChildren() 函数里对比变更，
   在 Vue3 里这一块的逻辑主要在 patchKeyedChildren() 函数里，具体看下面
   在 Vue3 里 patchKeyedChildren 为
     - 头和头比
     - 尾和尾比
     - 基于最长递增子序列进行移动/添加/删除

   看个例子，比如

   老的 children：[ a, b, c, d, e, f, g ]
   新的 children：[ a, b, f, c, d, e, h, g ]
   先进行头和头比，发现不同就结束循环，得到 [ a, b ]
   再进行尾和尾比，发现不同就结束循环，得到 [ g ]
   再保存没有比较过的节点 [ f, c, d, e, h ]，并通过 newIndexToOldIndexMap 拿到在数组里对应的下标，生成数组 [ 5, 2, 3, 4, -1 ]，-1 是老数组里没有的就说明是新增
   然后再拿取出数组里的最长递增子序列，也就是 [ 2, 3, 4 ] 对应的节点 [ c, d, e ]
   然后只需要把其他剩余的节点，基于 [ c, d, e ] 的位置进行移动/新增/删除就可以了
   使用最长递增子序列可以最大程度的减少 DOM 的移动，达到最少的 DOM 操作，有兴趣的话去 leet-code 第300题(最长递增子序列) 体验下

### vue3.x 源码分析

1. 返回 app 实例，支持链式调用
   const app = Vue.createApp({});

### diff 算法

1. vue2.x

![diff流程图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d84848aa035b4472b4d3f8e4b0d708c5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

在 Vue 中，主要是 `patch()、patchVnode()和 updateChildren()`这三个主要方法来实现 Diff 的。

当我们 Vue 中的响应式数据变化的时候，就会触发页面更新函数 updateComponent()（如何触发可以通过阅读 Vue 源码进行学习或者看一下我之前一篇《简单手写实现 Vue2.x》）；
此时 updateComponet()就会调用 patch()方法，在该方法中进行比较是否为相同节点，是的话执行 patchVnode()方法，开始比较节点差异；而如果不是相同节点的话，则进行替换操作，具体后面会讲到；
在 patchVnode()中，首先是更新节点属性，然后会判断有没有孩子节点，有的话则执行 updateChildren()方法，对孩子节点进行比较；如果没有孩子节点的话，则进行节点文本内容判断更新；（文本节点是不会有孩子节点的）
updateChildren()中，会对传入的两个孩子节点数组进行一一比较，当找到相同节点的情况下，调用 patchVnode()继续节点差异比较。

精细化比较：diff 算法 四种优化策略这里使用双指针的形式进行 diff 算法的比较，分别是旧前、旧后、新前、新后指针，（前指针往下移动，后指针往上移动）
四种优化策略：（命中：key 和 sel 都要相同）

①、新前与旧前
②、新后与旧后
③、新后与旧前
④、新前与旧后

注意： 当只有第一种不命中的时候才会采取第二种，依次类推，如果四种都不命中，则需要通过循环来查找。
命中指针才会移动，否则不移动。

![示例图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/19/163783eb58bfdb34~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

2. vue3.x

在 Vue2 里 updateChildren 会进行

- 头和头比
- 尾和尾比
- 头和尾比
- 尾和头比
- 都没有命中的对比

在 Vue3 里 patchKeyedChildren 为

- 头和头比
- 尾和尾比
- 基于最长递增子序列进行移动/添加/删除

例子：
老的 children：[ a, b, c, d, e, f, g ]
新的 children：[ a, b, f, c, d, e, h, g ]

先进行头和头比，发现不同就结束循环，得到 [ a, b ]
再进行尾和尾比，发现不同就结束循环，得到 [ g ]
再保存没有比较过的节点 [ f, c, d, e, h ]，并通过 newIndexToOldIndexMap 拿到在数组里对应的下标，生成数组 [ 5, 2, 3, 4, -1 ]，-1 是老数组里没有的就说明是新增
然后再拿取出数组里的最长递增子序列，也就是 [ 2, 3, 4 ] 对应的节点 [ c, d, e ]
然后只需要把其他剩余的节点，基于 [ c, d, e ] 的位置进行移动/新增/删除就可以了

使用最长递增子序列可以最大程度的减少 DOM 的移动，达到最少的 DOM 操作
