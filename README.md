# micro-single-spa-app

一个 `single-spa` 原理演示，完整内容查看微前端主仓库：https://github.com/cgfeel/zf-micro-app

分为 2 个部分：

- `Single-spa` 原理简述
- `Single-spa` 复现

对于珠峰的课程内容做了一些优化：

- 为了更好复现 `Single-spa`，演示采用 `TypeScript` 更直观描述数据类型
- 为了支持 `TypeScript` 所以启用了 `webpack` 作为运行环境，并通过 `historyApiFallback` [[查看配置](https://github.com/cgfeel/micro-single-spa-app/blob/main/webpack.config.js)]支持 `history` 模式，同时仍旧演示了 `hash` 路由切换
- 由于采用了 `history` 模式，所有链接通过 `history.pushState` 进行跳转，从而避免开了珠峰视频课中 `hashchange` + `popstate` 遇到异步重复触发的问题
- 重新调整了 `reroute.ts` 等文件结构，清晰思路

---

## 示例

### `Single-spa` 复现
