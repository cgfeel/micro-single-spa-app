import { ApplicationType } from '@event-chat/single-spa'
import { createElement, updateElement } from '../utils'

const app4: ApplicationType = {
  bootstrap: async (props) => {
    console.log(`${props._name} bootstrap1`, props)
    createElement(props._name)
  },
  async mount(props) {
    console.log(`${props._name} mount`)
    updateElement(props._name, `<h1>APP4-props: ${props.a}</h1>`)
  },
  async unmount({ _name }) {
    console.log(`${_name} unmount`)
    updateElement(_name, '')
  },
}

export default app4
