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

- 源码：`single-spa.html` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/public/single-spa.html)]
- URL：`/single-spa.html#/app1`

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

### `Single-spa` 复现

在复现 `Single-spa` 之前可以先了解下：① 上述特征；② 微应用的生命周期

- 目录：`src` [[查看](https://github.com/cgfeel/micro-single-spa-app/tree/main/src)]
- URL：`/` 启动服务后，首页即是

所有流程划分 3 个部分，详细见 `main.ts` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/src/main.ts)]：

1. `registerApplication` 注册应用：注册应用 - 提取状态 - 加载应用
2. `start` 挂载应用：获取注册应用 - 提取状态 - 挂载应用
3. 监听 `hashchange`、`popstate`：和 `start` 一样再次执行一遍重新挂载和卸载应用

`Single-spa` 从应用注册到挂载、全部都是通过微任务的方式，按照顺序分别整理如下：

#### 1.1 注册应用

目录：`app.ts` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/src/single-spa/application/app.ts)]

原理：

- 将 `registerApplication` 提交的应用信息，集合在一个 `apps` 数组中
- 接受的参数，集合的类型见源码中 `ts` 标注

#### 1.2 提取状态

目录：`app.helpers.ts` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/src/single-spa/application/app.helpers.ts)]

`getAppChanges` 根据当前 URL 激活状态、和应用的 `status`，将所有应用的集合划分成 3 类：

- `appsToLoad`：需要加载
- `appsToMount`：需要挂载
- `appsToUnmount`：需要卸载

#### 1.3 加载应用

目录：`reroute.ts` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/src/single-spa/navigation/reroute.ts)]

只看 `reroute` 函数，只需要知道 2 点：

- 无论是应用加载、挂载、监听路由，都是执行一遍 `reroute`
- 接受 2 个参数：应用集合，切换应用的事件

由于还没有 `start`，所以 `reroute` 只做了一件事，提取 `appsToLoad` 去加载，要注意是：

- 加载应用是一个微任务，当同时 `registerApplication`、`start` 时
- 注册加载应用的微任务还未执行，挂载应用已发起一个新的微任务将现有未加载的应用再次加载
- 好在挂载方法 `toLoadPromise` 在执行时会去判断一遍任务当前状态，避免重复挂载

关于生命周期 `toLoadPromise` 见下方总结

#### 2.1 挂载应用

目录：`start.ts` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/src/single-spa/start.ts)]

原理：

- 更新 `mount.start` 为 `true`，并执行 `reroute`
- 分离 `start` 和 `registerApplication` 的好处是，可以异步启动、监听微服务

#### 2.2 提取状态

和 1.2 提取任务状态一样

#### 2.3 挂载应用

目录：`reroute.js` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/src/single-spa/navigation/reroute.ts)]：

`reroute` 函数，只需要知道 2 点：

- 无论是应用加载、挂载、监听路由，都是执行一遍 `reroute`
- 由于 `start` 了，所以只看 `preformAppChange`

`preformAppChange` 函数执行过程

- `unmountAllPromise`：创建一个卸载应用的微任务，提取所有在线应用并卸载
- `loadMountPromises`：创建一个加载应用的微任务并执行，直到挂载应用
- `mountPromises`：创建一个挂载已加载状态应用的微任务并执行，直到挂载应用

`unmountAllPromise` 创建的微任务，会交由 `loadMountPromises` 和 `mountPromises` 在执行微任务中使用：

- `loadMountPromises`：`appsToLoad` - `toLoadPromise` - `tryBootstrapAndMount`
- `mountPromises`：`appsToMount` - `tryBootstrapAndMount`

`tryBootstrapAndMount` 为了确保：① 当前应用允许激活；② 在挂载应用前先卸载当前挂载的应用：

- `toBootstrapPromise`：启动应用
- `unmountAllPromise`：卸载当前已挂载的应用
- `toMountPromise`：挂载应用

其中 `unmountAllPromise` 会重复执行，所以在 `toUnmoutPromise` 要去判断应用状态再执行，关于生命周期见下方总结

### `Single-spa` 微应用的生命周期

![无标题-2024-06-04-1410](https://github.com/cgfeel/micro-single-spa-app/assets/578141/02f2a86a-d6df-48fe-82b6-2acb1f37f949)


