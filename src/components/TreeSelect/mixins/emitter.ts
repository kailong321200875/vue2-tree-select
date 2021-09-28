import { Vue, Component } from 'vue-property-decorator'

function broadcast(componentName: string, eventName: any, params?: any[]) {
  // @ts-ignore
  this.$children.forEach((child: Vue) => {
    const name = (child.$options as any).componentName

    if (name === componentName) {
      child.$emit.apply(child, ([eventName] as any).concat(params))
    } else {
      broadcast.apply(child, ([componentName, eventName] as any).concat([params]))
    }
  })
}

@Component
export default class Emitter extends Vue {
  public dispatch(componentName: string, eventName: any, params: any[]) {
    let parent = this.$parent || this.$root
    let name = (parent.$options as any).componentName

    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent

      if (parent) {
        name = (parent.$options as any).componentName
      }
    }
    if (parent) {
      parent.$emit.apply(parent, ([eventName] as any).concat(params))
    }
  }

  public broadcast(componentName: string, eventName: any, params?: any[]) {
    broadcast.call(this, componentName, eventName, params)
  }
}
