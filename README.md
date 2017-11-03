# 简易 markdown 编辑器
整个项目基于 [React](reactjs.org) 和 [Bulma](https://bulma.io) 创建。 

Markdown 的渲染使用 [markdownit](https://github.com/markdown-it/markdown-it)，一个非常卓绝的库。

代码高亮部分使用的是—[highlight.js](https://highlightjs.org)

代码中使用的**函数式编程库**来自 [ramda.js](https://ramdajs.com)

另外用到了 [moment.js](https://momentjs.com/) 获得可读的时间。

感谢开源程序员的付出。
**因为 Safari 不支持在 Web Worker 中使用 `await`，还是不要使用 Safari 测试**。
## 实现的功能

1. 实时渲染. 通过 `web worker` 来生成 markdown 渲染后的 HTML 代码，稍微提供性能。不过渲染 HTML 成 DOM 仅仅用的是 `innerHTML`，感觉效率还是偏低，但是不知道如果提高
2. 编辑器部分
    1. 高亮当前行
    2. Sublime 快捷键
    3. 自动生成括号
    4. 高亮代码块部分的内容
    5. 支持 Drop-Drag(只支持 md 文件)
    6. 支持搜索和替换
3. Markdown 部分
    1. 支持表格
    2. 支持 checkbox
    3. 支持 footnote
    4. 所有 commondMark 语法
4. 分屏同时滚动。不过只是简单的支持了，没有做到绝对精确的同步
5. 使用 `indexedDB` 来保存写过的文章，可以访问所有写过的内容. indexedDB 也是使用 web worker 操作。之前是使用的是 `localStorage` 但是这个是同步的，而且不能在 web worker 中使用，就换成了 indexedDB
6. 自动 30s 保存或者编辑器失去焦点的时候保存。个人测试，在不是很刻意的情况下，都能正常保存

## 使用方式
安装 `yarn`，使用 `yarn install && yarn start` 来开启调试。(确实我不确定能不能成功，安装了 eslint 的配置文件后，多了一个 `package.lock.json`，不知道有没有影响。)
 当然，可以看在线 [Demo](https://queenyoung.github.io/Markdown-React/)

 项目有两个按钮，左边的用来生成新的 markdown 文件，右边的就是浏览当前的文件(但是如果没有保存任何文件的话，会很尴尬). **通过将 markdown 的第一行设置为 `# ` 格式来获得文章标题**，有点类似于 Bear, 默认情况下是 *untilted*.


## Bugs
1. 如果连续多次点击 + 那个按钮话，会出现点小问题，但是不影响使用，就先不修咯。
2. 在移动端 WebKit (iOS 上所有浏览器都是) 不支持存储功能，因为 `indexedDB` 不支持 Web Worker
3. 移动端，侧边栏并不会真正的隐藏(CSS 不好就是看不懂 :()
---

## 总结
其实我项目的经验一直不多，但是通过整个任务也让我认识到**开源让世界更美好**。同时发现函数式编程真的是一个可以减少 bug 的好手段。但是由于对 ramda 不是很熟悉，在想把某个范式转化成函数式的时候，会花很长时间看文档并尝试。也算是一个不小的挑战把。
