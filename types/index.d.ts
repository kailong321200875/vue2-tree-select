import { Vue } from 'vue-property-decorator'

export declare class TreeSelect extends Vue {
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
