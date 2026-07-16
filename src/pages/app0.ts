import { ApplicationType } from '@event-chat/single-spa'
import { createElement, rootPath, updateElement } from '../utils'

const redirectTem = `const urlParams = new URLSearchParams(window.location.search)
const redirectPath = urlParams.get('redirect')
if (redirectPath) {
  // 移除redirect参数，跳转到原路由（保留其他查询参数）
  urlParams.delete('redirect')
  const params = urlParams.toString()
  const newSearch = params ? '?' + params : ''
  
  window.history.replaceState({}, null, ${rootPath} + redirectPath.slice(1) + newSearch)
}
`

function bootstrap(id: string) {
  const script = document.createElement('script')
  script.innerHTML = redirectTem

  createElement(id)
  document.body.appendChild(script)
}

const app0: ApplicationType = {
  bootstrap: async ({ _name }) => bootstrap(_name),
  mount: async ({ _name }) =>
    updateElement(
      _name,
      `<div>
        <a onclick="window.history.pushState({}, null, '${rootPath}')">app1</a> |
        <a onclick="window.history.pushState({}, null, '${rootPath}app2')">app2</a> |
        <a href="#/app3">+app3</a> |
        <a href="#/app4">+app4</a>
    </div>`
    ),
  unmount: async ({ _name }) => updateElement(_name, ''),
}

export default app0
