import { ApplicationType } from '@event-chat/single-spa'
import { createElement, updateElement } from '../utils'

const app3: ApplicationType = {
  bootstrap: (props) => {
    console.log(`${props._name} bootstrap1`, props)
    createElement(props._name)
  },
  mount(props) {
    console.log(`${props._name} mount`)
    updateElement(props._name, `<h1>APP3-props: ${props.a}</h1>`)
  },
  unmount({ _name }) {
    console.log(`${_name} unmount`)
    updateElement(_name, '')
  },
}

export default app3
