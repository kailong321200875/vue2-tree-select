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

  load: (...arg: any[]) => void

  showCheckbox: boolean

  checkStrictly: boolean

  expandOnClickNode: boolean

  filterable: boolean

  filterMethod: (...arg: any[]) => void

  collapseTags: boolean

  collapseTagsMaxNum: number

  tooltipEffect: string

  optionMaxWidth: string

  renderContent: (...arg: any[]) => void
}

export default TreeSelect
