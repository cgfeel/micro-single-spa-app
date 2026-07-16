import { registerApplication, start } from '@event-chat/single-spa'
import app0 from './pages/app0'
import app1 from './pages/app1'
import app2 from './pages/app2'
import app3 from './pages/app3'
import app4 from './pages/app4'
import { rootPath } from './utils'

// 挂载应用 ----
// 当路径是 #/app1 的时候加载应用 app1
// 所有注册的应用，就是看一下路径是否匹配，如果匹配则加载对应的应用
registerApplication(
  'app0',
  () => app0,
  (location) => location.pathname.startsWith(rootPath),
  { a: 1 }
)
registerApplication(
  'app1',
  () => app1,
  (location) => location.pathname === rootPath,
  { a: 1 }
)
registerApplication(
  'app2',
  () => app2,
  (location) => location.pathname.startsWith(`${rootPath}app2`),
  { a: 2 }
)
registerApplication(
  'app3',
  () => app3,
  (location) => location.hash.startsWith('#/app3'),
  { a: 3 }
)
registerApplication(
  'app4',
  () => app4,
  (location) => location.hash.startsWith('#/app4'),
  { a: 4 }
)

// 开启路径的监控，路径切换的时候可以调用对应的：mount、unmount
start()

// 将在路由切换之后再执行
window.addEventListener('popstate', () => {
  console.log(window.location.href, 'out app update---')
})
