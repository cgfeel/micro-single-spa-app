import { ApplicationType } from '@event-chat/single-spa'
import { createElement, updateElement } from '../utils'

function createScript() {
  const script = document.createElement('script')
  script.innerHTML = `window.addEventListener("popstate", () => {
        console.log(window.location.href, 'inner app update+++');
    });`
  document.body.appendChild(script)
}

const app2: ApplicationType = {
  bootstrap: (props) => {
    console.log(`${props._name} bootstrap1`, props)
    createElement(props._name)
    createScript()
  },
  mount(props) {
    updateElement(props._name, `<h1>${props._name.toUpperCase()}-props: ${props.a}</h1>`)
    return new Promise((resovle) => {
      setTimeout(() => {
        console.log(`${props._name} mount`)
        resovle()
      }, 1000)
    })
  },
  unmount({ _name }) {
    console.log(`${_name} unmount`)
    updateElement(_name, '')
  },
}

export default app2
