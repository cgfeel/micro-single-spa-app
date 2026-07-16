import { ApplicationType } from '@event-chat/single-spa'
import { createElement, updateElement } from '../utils'

const app1: ApplicationType = {
  bootstrap: [
    async (props) => console.log(`${props._name} bootstrap1`, props),
    async ({ _name }) => {
      console.log(`${_name} bootstrap2`)
      createElement(_name)
    },
  ],
  // mount 也可以挂载数组，通常为一个异步函数
  // 在 single-spa 中是通过 `System.import<LifeCycles>("")` 返回一个 `promise`
  mount: [
    async (props) => {
      // new Vue().$mount()...
      console.log(`${props._name} mount1`, props)
    },
    async (props) =>
      updateElement(props._name, `<h1>${props._name.toUpperCase()}-props: ${props.a}</h1>`),
  ],
  async unmount({ _name }) {
    console.log(`${_name} unmount`)
    updateElement(_name, '')
  },
}

export default app1
