# micro-single-spa-app

一个 `single-spa` 原理演示，完整内容查看微前端主仓库：https://github.com/cgfeel/zf-micro-app

分为 2 个部分：

- `Single-spa` 原理简述
- `Single-spa` 复现

对于珠峰的课程内容做了一些优化：

- 为了更好复现 `Single-spa`，演示采用 `TypeScript` 更直观描述数据类型
- 为了支持 `TypeScript` 所以启用了 `webpack` 作为运行环境，并通过 `historyApiFallback` [[查看配置](https://github.com/cgfeel/micro-single-spa-app/blob/main/webpack.config.js)] 支持 `history` 模式，同时仍旧演示了 `hash` 路由切换
- 由于采用了 `history` 模式，所有链接通过 `history.pushState` 进行跳转，从而避免开了珠峰视频课中 `hashchange` + `popstate` 遇到异步重复触发的问题
- 重新调整了 `reroute.ts` 等文件结构，清晰思路

---

## 示例

### `Single-spa` 原理简述

建议启动后查看演示：

- 路径：https://github.com/cgfeel/micro-single-spa-app/blob/main/public/single-spa.html
- URL：`/single-spa.html`

和 `SystemJS` [[查看](https://github.com/cgfeel/micro-systemjs/blob/main/dist/systemjs.html)] 一样包含 3 部分：

- `single-spa.min.js`：运行为应用的 `single-spa` 库
- `registerApplication`：注册微应用
- `start`：启动并监听路由

`registerApplication` 包含 4 个参数：

- `appName`: 应用名称，需要唯一
- `loadApp`: 加载应用的一个返回 `Promise` 的方法
- `activeWhen`: 接受一个 `location` 决定何时挂载应用
- `customProps`：自定义透传给应用的 `props`，可以传递一个 `store`，例如：`zustand` 等

注册应用分 3 个部分：

- `bootstrap`：加载应用，只加载一次，加载之后不再触发
- `mount`：挂载应用
- `unmount`：卸载应用

共同点：

- 这 3 个部分都接受一个返回 `Promise` 的函数，也可以接受一组这样的函数作为数组
- 每个 `Promise` 函数都接受来自 `loadApp` 透传的 `customProps`，其中还包含了应用名称等
