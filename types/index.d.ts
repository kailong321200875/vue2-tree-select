import Vue from 'vue'

declare class TreeSelect extends Vue {
  static install(vue: typeof Vue): void

  data: any[]

  id: string

  name: string

  value: string | number | any[]

  multiple: boolean

  disabled: boolean

  clearable: boolean

  defaultExpandAll: boolean

  size: string

  props: any

  placeholder: string

  nodeKey: string | number | any[]

  lazy: boolean

  load: Fn

  showCheckbox: boolean

  checkStrictly: boolean

  expandOnClickNode: boolean

  filterable: boolean

  filterMethod: Fn

  collapseTags: boolean

  collapseTagsMaxNum: number

  tooltipEffect: string

  optionMaxWidth: string

  renderContent: Fn
}

export default TreeSelect
