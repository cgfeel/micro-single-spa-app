# micro-single-spa-app

一个 `single-spa` 原理演示，完整内容查看微前端主仓库：https://github.com/cgfeel/zf-micro-app

分为 3 个部分：

- `Single-spa` 原理简述
- `Single-spa` 生命周期
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

---- 分割线 ----

### `Single-spa` 微应用的生命周期

![无标题-2024-06-04-1410](https://github.com/cgfeel/micro-single-spa-app/assets/578141/02f2a86a-d6df-48fe-82b6-2acb1f37f949)

通过 `Single-spa` 复现来总结：

- `app.helpers.ts` 中 `preformAppChange` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/src/single-spa/application/app.helpers.ts)] 根据生命周期提取应用并归类
- 根据执行过程，图中将相同分类的生命周期用颜色做了区分

**根据分类提取以下方法：**

目录：`lifecycles` [[查看](https://github.com/cgfeel/micro-single-spa-app/tree/main/src/single-spa/lifecycles)]

- `load.ts` 加载应用，状态：`NOT_LOADED` - `LOADING_SOURCE_CODE` - `NOT_BOOTSTRAPED`
- `bootstrap.ts` 启动应用，状态：`NOT_BOOTSTRAPED` - `BOOTSTRAPING` - `NOT_MOUNTED`
- `mount.ts` 挂载应用，状态：`NOT_MOUNTED` - `MOUNTED`
- `unmount.ts` 卸载应用，状态：`MOUNTED` - `UNMOUNTING` - `NOT_MOUNTED`

#### `load.ts`

加载应用，只执行一次，之后均直接返回应用不再执行，加载应用会做 2 件事：

- 提供应用加载和挂载的能力：`bootstrap`、`mount`、`unmount`
- 将加载、挂载的方法通过 `flattenArrayToPromise` 拍平

关于拍平，在 `main.ts` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/src/main.ts)] 注册应用的时候分别演示：

- 挂载一个 `promise` 函数
- 挂载一组 `promise` 函数

#### `bootstrap.ts`

启动应用，只执行一次，之后均直接返回应用不再执行，需要注意：

- 启动应用只修改应用状态，在此之前需要通过 `router.ts` 通过 `shouldBeActive` 去判断是否启动应用
- 不能理解可以先看 `Single-spa` 复现，再回头看启动应用

#### `mount.ts` 和 `unmount.ts`

由 `router.ts` 决定启动状态，挂载和卸载应用只修改了应用状态

---- 分割线 ----

### `Single-spa` 复现

在复现 `Single-spa` 之前可以先了解下：① 上述特征 [[查看](#single-spa-原理简述)]；② 微应用的生命周期 [[查看](#single-spa-微应用的生命周期)]

- 目录：`src` [[查看](https://github.com/cgfeel/micro-single-spa-app/tree/main/src)]
- URL：`/`

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

关于生命周期 `toLoadPromise` 见上方总结 [[查看](#single-spa-微应用的生命周期)]

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

备注：

- 其中 `unmountAllPromise` 会重复执行，所以在 `toUnmoutPromise` 要去判断应用状态再执行，关于生命周期见上方总结 [[查看](#single-spa-微应用的生命周期)]
- 珠峰将加载和挂载方法全部写在了 `reroute` 中，我将其合理划分了 3 个方方法，只需要传递应用集合 `apps` 作为参数，提取状态会在执行方法中分别执行

#### 3.1 监听路由变化

目录：`navigation.event.ts` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/src/single-spa/navigation/navigation.event.ts)]

通过 `hashchange`、`popstate` 监听路由变化，这里只要知道 2 点：

- 无论是应用加载、挂载、监听路由，都是执行一遍 `reroute`
- 优化：将监听方法包裹在 `navigationEvent`，由 `start` 启动时调用，而不是默认全局监听

对于路由的监听会遇到几个问题：

- 除了监听路由切换，如果应用本身也有相同的应用怎么办？
- 如何支持 `history`
- 将监听方法包裹在 `navigationEvent` 中，如果重复 `start` 怎么避免重复监听

下面分别针对问题进行解决：

#### 3.2 事件触发顺序

确保先加载路由，再响应监听的同类事件方法

- `originalAddEventListener` 托管 `window.addEventListener`
- `originalRemoveEventListener` 托管 `window.removeEventListener`
- `window.addEventListener` 代理传递过来的事件记录在 `captureEventListeners`
- `window.removeEventListener` 代理将删除的事件从 `captureEventListeners` 移除
- 通过 `originalAddEventListener` 监听路由变化将当前的 `event` 传递给 `rerouter`
- `rerouter` 如果是加载应用，将在所有 `toLoadPromise` 触发响应
- `rerouter` 如果是挂载应用，将在 `loadMountPromises` 和 `loadMountPromises` 触发响应
- `callCaptureEventListener` 接受触发的响应找到并执行对应的方法

做的优化：

- 将 `addEventListener` 中的 `opeions` 和 `callback` 一同记录

测试方法，在 `main.ts` [[查看](https://github.com/cgfeel/micro-single-spa-app/blob/main/src/main.ts)] 中分别添加了 2 个事件监听：

- 主应用监听：`out app update`
- 应用内部监听：`inner app update`

在浏览窗口可以看到路由先发生切换，最后再响应事件

#### 3.3 响应支持 history

详细见 `navigation.event.ts` 中的 `patchFn`

- 分别代理：`window.history.pushState`、`window.history.replaceState`
- 将执行前后的 URL 拿来比较，发生变化则触发 `popstate`

优化：

- 由于全部采用 `history` 的方式变更路由，不会触发 `hashchange`，也不会遇到挂载异步方法重复执行的情况

#### 3.3 避免重复调用

- 由于监听 `hashchange`、 `popstate` 在 `navigation` 中
- 不存在固定地址；重复 `start` 情况下不能通过 `removeEventListener` 取消监听

解决办法：

- 将方法 `handleEvent` 初始化时托管在 `listener` 对象中
- 将对象作为事件的 `listener` 即可
