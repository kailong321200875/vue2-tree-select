<template>
  <div
    v-clickoutside="handleClose"
    class="el-tree-select"
    :class="[selectSize ? 'el-tree-select--' + selectSize : '']"
    @click.stop="toggleTree"
  >
    <div
      v-if="multiple"
      ref="tags"
      class="el-tree-select__tags"
      :style="{ 'max-width': inputWidth - 32 + 'px' }"
    >
      <span v-if="collapseTags && selected instanceof Array" class="el-select-tree__tags-wrapper">
        <transition-group @after-leave="resetInputHeight">
          <el-tag
            v-for="item in selected.slice(0, collapseTagsMaxNum)"
            :key="item.value"
            :closable="!selectDisabled"
            :size="collapseTagSize"
            type="info"
            disable-transitions
            :style="{ 'max-width': inputWidth - 32 + 'px' }"
            @close.stop="deleteTag(item)"
          >
            <span
              class="el-tree-select__tags-text"
              :style="{ 'max-width': inputWidth - 74 + 'px' }"
            >
              {{ item.label }}
            </span>
          </el-tag>
        </transition-group>
        <el-tag
          v-if="selected.length > collapseTagsMaxNum"
          :closable="false"
          :size="collapseTagSize"
          class="tag-num"
          type="info"
          disable-transitions
        >
          <el-tooltip
            popper-class="tree-select-tooltip"
            :max-width="inputWidth - 20"
            :effect="tooltipEffect"
            :content="selectedTitle"
            placement="top"
          >
            <span>+ {{ selected.length - collapseTagsMaxNum }}</span>
          </el-tooltip>
        </el-tag>
      </span>
      <span v-else class="el-select-tree__tags-wrapper">
        <transition-group class="el-select-tree__tags-wrapper" @after-leave="resetInputHeight">
          <el-tag
            v-for="item in selected"
            :key="item.value"
            :closable="!selectDisabled"
            :size="collapseTagSize"
            type="info"
            disable-transitions
            :style="{ 'max-width': inputWidth - 32 + 'px' }"
            @close.stop="deleteTag(item)"
          >
            <span
              class="el-tree-select__tags-text"
              :style="{ 'max-width': inputWidth - 74 + 'px' }"
            >
              {{ item.label }}
            </span>
          </el-tag>
        </transition-group>
      </span>

      <input
        v-if="filterable && visible"
        ref="input"
        v-model="query"
        type="text"
        class="el-tree-select__input"
        :disabled="selectDisabled"
        :autocomplete="false"
        :style="{ width: inputLength + 'px' }"
        @click.stop
        @focus="handleFocus"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        @input="(e) => handleQueryChange(e.target.value)"
      />
    </div>
    <el-input
      :id="id"
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :name="name"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :size="selectSize"
      :class="{ 'is-focus': visible }"
      :placeholder="currentPlaceholder"
      @focus="handleFocus"
      @keyup.native="onInputChange"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
    >
      <template v-if="$slots.prefix" slot="prefix">
        <slot name="prefix"></slot>
      </template>
      <i slot="suffix" :class="suffixIconClass" @click="handleIconClick"></i>
    </el-input>
    <transition name="el-zoom-in-top">
      <div
        v-show="visible"
        ref="popper"
        :style="{ minWidth: inputWidth + 'px', maxWidth: optionMaxWidth }"
        class="el-tree-select-dropdown el-popper"
      >
        <el-scrollbar
          ref="scrollbar"
          wrap-class="el-tree-select-dropdown__wrap"
          view-class="el-tree-select-dropdown__list"
        >
          <el-tree
            ref="tree"
            :data="data"
            :lazy="lazy"
            :load="load"
            :check-on-click-node="checkOnClickNode"
            :default-expanded-keys="defaultExpandedKeys"
            :props="props"
            :default-expand-all="defaultExpandAll"
            :node-key="nodeKey"
            :render-content="renderContent"
            :class="multiple ? 'tree-select--multiple' : 'tree-select'"
            v-bind="$attrs"
            :show-checkbox="showCheckbox"
            :expand-on-click-node="expandOnClickNode"
            :check-strictly="checkStrictly"
            :filter-node-method="filterNodeMethod"
            :default-checked-keys="checkedKeys"
            @check="handleCheck"
            @node-click="handleNodeClick"
          >
            <div slot-scope="{ data }">
              <slot :data="data">{{
                props && props.label ? data[props.label] : data['label']
              }}</slot>
            </div>
          </el-tree>
        </el-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Provide, Mixins } from 'vue-property-decorator'
import { valueEquals } from '_u'
import vuePopper from './mixins/vue-popper'
import emitter from './mixins/emitter'
import { addResizeListener, removeResizeListener } from '_u/resize-event'
import { ElInput } from 'element-ui/types/input'
import clickoutside from '@/directive/modules/clickoutside'
// @ts-ignore
// import { Scrollbar, Tree, Input, Tag, Tooltip, Icon } from 'element-ui'
// Vue.use(Scrollbar)
// Vue.use(Tree)
// Vue.use(Input)
// Vue.use(Tag)
// Vue.use(Tooltip)
// Vue.use(Icon)

const sizeMap = {
  medium: 32,
  small: 30,
  mini: 28
}
@Component({
  directives: {
    clickoutside
  }
})
export default class TreeSelect extends Mixins(vuePopper, emitter) {
  @Provide() elTreeSelect = this

  @Prop({
    type: Array,
    required: true
  })
  private data!: any[]

  @Prop({
    type: String
  })
  private id!: string

  @Prop({
    type: String
  })
  private name!: string

  @Prop({
    type: [String, Number, Array],
    required: true
  })
  public value!: string | number | any[]

  @Prop({
    type: Boolean
  })
  private multiple!: boolean

  @Prop({
    type: Boolean
  })
  private clearable!: boolean

  @Prop({
    type: Boolean,
    default: false
  })
  private defaultExpandAll!: boolean

  @Prop({
    type: String
  })
  private size!: string

  @Prop({
    type: Object
  })
  private props!: any

  @Prop({
    type: String,
    default: '请选择'
  })
  private placeholder!: string

  @Prop({
    type: [String, Number, Array],
    default: 'value'
  })
  private nodeKey!: string | number | any[]

  @Prop({
    type: Boolean
  })
  private lazy!: boolean

  @Prop({
    type: Function
  })
  private load!: Fn

  @Prop({
    type: Boolean
  })
  private showCheckbox!: boolean

  @Prop({
    type: Boolean,
    default: true
  })
  private checkStrictly!: boolean

  @Prop({
    type: Boolean,
    default: false
  })
  private expandOnClickNode!: boolean

  @Prop({
    type: Boolean
  })
  private filterable!: boolean

  @Prop({
    type: Function
  })
  private filterMethod!: Fn

  // @Prop({
  //   type: String,
  //   default: 'child',
  //   validator(val) {
  //     return ['parent', 'child'].indexOf(val) > -1
  //   }
  // })
  // private showCheckedStrategy!: string

  @Prop({
    type: Boolean
  })
  private collapseTags!: boolean

  @Prop({
    type: Number,
    default: 1
  })
  private collapseTagsMaxNum!: number

  @Prop({
    type: String,
    default: 'dark'
  })
  private tooltipEffect!: string

  @Prop({
    type: String
  })
  private optionMaxWidth!: string

  @Prop({
    type: Function
  })
  private renderContent!: Fn

  private query = ''
  private selectedLabel = ''
  private inputLength = 20
  private visible = false
  private inputWidth = 0
  private inputHovering = false
  private treeVisibleOnFocus = false
  private selected: any = this.multiple ? [] : {}
  private checkOnClickNode = true
  private selectedTitle = ''
  private defaultExpandedKeys: any[] = []
  private isSetDefault = false

  get suffixIconClass() {
    let classes = ['el-tree-select__caret', 'el-input__icon']
    const criteria =
      this.clearable &&
      !this.selectDisabled &&
      this.inputHovering &&
      this.value !== undefined &&
      this.value !== null &&
      this.value !== '' &&
      (this.value as any).length !== 0
    if (criteria) {
      classes = [...classes, 'el-icon-circle-close', 'is-show-close']
    } else {
      classes.push('el-icon-arrow-down')
      if (this.visible) {
        classes.push('is-reverse')
      }
    }
    return classes
  }

  get selectDisabled() {
    return this.disabled || ((this as any).elForm || {}).disabled
  }

  get selectSize() {
    return (
      this.size ||
      ((this as any).elFormItem || {}).elFormItemSize ||
      ((this as any).$ELEMENT || {}).size
    )
  }

  get collapseTagSize() {
    return ['small', 'mini'].indexOf(this.selectSize) > -1 ? 'mini' : 'small'
  }

  get readonly() {
    const isIE = !this.$isServer && !isNaN(Number((document as any).documentMode))
    return !this.filterable || this.multiple || (!isIE && !this.visible)
  }

  get checkedKeys() {
    if (this.multiple && this.showCheckbox) {
      return this.value || []
    } else {
      return []
    }
  }

  get currentPlaceholder() {
    if (
      !this.value ||
      (Array.isArray(this.value) && this.value.length === 0) ||
      this.value === ''
    ) {
      return this.placeholder
    } else {
      return ''
    }
  }

  @Watch('visible')
  private visibleChange(val: boolean) {
    if (val) {
      this.updatePopper()
      this.$nextTick(() => {
        if (this.multiple && this.filterable) {
          ;(this.$refs.input as ElInput).focus()
        }
        this.$emit('focus', this)
        if (!this.multiple && this.filterable) {
          this.broadcast('ElInput', 'inputSelect')
        }
      })
    } else {
      this.destroyPopper()
      if (this.$refs.input) {
        ;(this.$refs.input as ElInput).blur()
      }
      this.$emit('blur', this)
      this.query = ''
      this.selectedLabel = ''
      if (!this.multiple) {
        this.selectedLabel = this.selected.label || ''
        if (this.filterable) this.query = this.selectedLabel
      }
      if (this.filterable) {
        setTimeout(() => {
          this.handleQueryChange('')
        }, 100)
      }
    }
    if (this.multiple) {
      this.resetInputHeight()
    }
  }

  @Watch('value')
  private valChange(val: any, oldVal: any) {
    if (!val) {
      this.$emit('input', '')
      this.emitChange('')
      this.$emit('clear')
      this.$nextTick(() => {
        ;(this.$refs.tree as any).setCurrentKey(oldVal)
      })
      // (this.$refs.tree as any).getNode(oldVal).isSelect = false
      this.selected = this.multiple ? [] : {}
      this.selectedLabel = ''
      return
    }
    if (this.multiple) {
      this.resetInputHeight()
    } else {
      if (oldVal) {
        this.$nextTick(() => {
          ;(this.$refs.tree as any).setCurrentKey(oldVal)
        })

        // (this.$refs.tree as any).getNode(oldVal).isSelect = false
      }
      if (val) {
        this.$nextTick(() => {
          ;(this.$refs.tree as any).setCurrentKey(val)
        })
        // (this.$refs.tree as any).getNode(val).isSelect = true
      }
    }
    this.setSelected()
    if (!valueEquals(val, oldVal)) {
      this.dispatch('ElFormItem', 'el.form.change', val)
    }
    if (!this.isSetDefault) {
      this.defaultExpandedKeys = this.multiple ? val : [val]
      this.isSetDefault = true
    }
  }

  @Watch('data', {
    deep: true
  })
  private dataChange() {
    this.$nextTick(() => {
      this.setSelected()
      this.treeSelect()
    })
  }

  private handleFocus() {
    this.treeVisibleOnFocus = true
    this.visible = true
    // this.$emit('focus', event);
  }

  private handleClose() {
    this.visible = false
  }

  private toggleTree() {
    if (!this.selectDisabled) {
      if (this.treeVisibleOnFocus) {
        this.treeVisibleOnFocus = false
      } else {
        this.visible = !this.visible
      }
    }
  }

  private handleIconClick(event: any) {
    if (this.suffixIconClass.indexOf('el-icon-circle-close') > -1) {
      this.$nextTick(() => {
        ;(this.$refs.tree as any).setCurrentKey(null)
        ;(this.$refs.tree as any).setCheckedKeys([])
      })
      // setCheckedKeys
      event.stopPropagation()
      this.visible = false
      this.$emit('input', '')
      this.emitChange('')
      this.$emit('clear')

      // (this.$refs.tree as any).getNode(this.selected.value).isSelect = false
      this.selected = this.multiple ? [] : {}
      this.selectedLabel = ''
    }
  }

  private emitChange(val: any) {
    if (!valueEquals(this.value as any, val)) {
      this.$emit('change', val)
    }
  }

  private handleQueryChange(val: string) {
    ;(this.$refs.tree as any).filter(val)
  }

  private handleNodeClick(data: any, node: any) {
    this.isSetDefault = true
    if (this.showCheckbox) return
    let value = node.data.value
    const child = node.childNodes
    if (child.length === 0 || !this.expandOnClickNode) {
      if (this.multiple) {
        const valueCopy = (this.value as any).slice()
        const index = this.getValueIndex(valueCopy, value)
        if (index > -1) {
          this.$nextTick(() => {
            ;(this.$refs.tree as any).setCurrentKey(valueCopy[index])
          })
          // (this.$refs.tree as any).getNode(valueCopy[index]).isSelect = false
          valueCopy.splice(index, 1)
        } else {
          this.$nextTick(() => {
            valueCopy
              .push(value)(this.$refs.tree as any)
              .setCurrentKey(value)
          })
          // (this.$refs.tree as any).getNode(value).isSelect = true
        }
        if (this.$refs.input) {
          ;(this.$refs.tree as ElInput).focus()
        }
        this.$emit('input', valueCopy)
        this.emitChange(valueCopy)
      } else {
        if (value === this.value) {
          value = ''
        }
        this.$nextTick(() => {
          ;(this.$refs.tree as any).setCurrentKey(value || null)
        })
        // (this.$refs.tree as any).getNode(value).isSelect = true
        this.$emit('input', value)
        this.emitChange(value)
        this.visible = false
      }
    } else {
      return
    }
  }

  private handleCheck(data: any, info: any) {
    this.isSetDefault = true
    const { checkedNodes } = info
    const values = checkedNodes.map(({ value }: any) => value)
    if (this.filterable) (this.$refs.input as ElInput).focus()
    this.$emit('input', values)
    this.emitChange(values)
  }

  private getNodeData(value: any) {
    let node = null
    if (Array.isArray(this.data)) {
      const traverse = (arr: any) => {
        for (let i = 0; i < arr.length; i++) {
          const child = arr[i]
          if (child.value === value) {
            node = {
              label: child.label,
              value: child.value
            }
            break
          } else if (child.children && child.children.length > 0) {
            traverse(child.children)
          }
        }
      }
      traverse(this.data)
    }
    return node
  }

  private onInputChange() {
    if (this.filterable && this.query !== this.selectedLabel) {
      this.query = this.selectedLabel
      this.handleQueryChange(this.query)
    }
  }

  private filterNodeMethod(value: any, data: any) {
    if (!value) return true
    this.$nextTick(this.updatePopper)
    if (typeof this.filterMethod === 'function') {
      return this.filterMethod(value, data)
    } else {
      return data.label.indexOf(value) !== -1
    }
  }

  private resetInputHeight() {
    this.$nextTick(() => {
      if (!this.$refs.reference) return
      const inputEl = (this.$refs.reference as Vue).$refs.input as HTMLElement
      const tags = this.$refs.tags as any
      let height = sizeMap[this.selectSize] || 34
      if (this.selected.length !== 0) {
        height = Math.max(tags.clientHeight + (tags.clientHeight > height ? 6 : 0), height)
      }
      inputEl.style.height = `${height}px`
      if (this.visible) {
        this.updatePopper()
      }
    })
  }

  private getValueIndex(arr = [], value: any) {
    let index = -1
    arr.some((item, i) => {
      if (item === value) {
        index = i
        return true
      } else {
        return false
      }
    })
    return index
  }

  private deletePrevTag(e: any) {
    if (e.target.value.length <= 0) {
      this.selected.splice(-1, 1)
      const values = this.selected.map(({ value }: any) => value)
      this.$emit('input', values)
      ;(this.$refs.tree as any).setCheckedKeys(values)
      this.emitChange(values)
    }
  }

  private deleteTag(item: any) {
    this.selected = this.selected.filter((selectItem: any) => selectItem !== item)
    const values = this.selected.map(({ value }: any) => value)
    this.$emit('input', values)
    // (this.$refs.tree as any).setCurrentKey(value)
    // (this.$refs.tree as any).getNode(item.value).isSelect = false;
    ;(this.$refs.tree as any).setCheckedKeys(values)
    this.emitChange(values)
  }

  private resetInputWidth() {
    this.inputWidth = (this.$refs.reference as Vue).$el.getBoundingClientRect().width
  }

  private handleResize() {
    this.resetInputWidth()
  }

  private setSelected() {
    if (this.multiple) {
      const result: any[] = []
      const title: any[] = []
      if (Array.isArray(this.value)) {
        this.value.forEach((value) => {
          const node: any = this.getNodeData(value)
          if (node) {
            result.push(node)
            title.push(node.label)
          }
        })
      }
      this.selected = result
      this.selectedTitle = title.join('，')
      this.$nextTick(this.resetInputHeight)
    } else {
      const node: any = this.getNodeData(this.value)
      if (node) {
        this.selected = node
        this.selectedLabel = node.label
        if (this.filterable) this.query = this.selectedLabel
      }
    }
  }

  // 初始化高亮选中
  private treeSelect() {
    const select = this.selected
    // if (this.multiple && select.length > 0) {
    //   for (let i = 0; i < select.length; i++) {
    //     this.$nextTick(() => {
    //       (this.$refs.tree as any).setCurrentKey(select[i].value)
    //     })
    //     // (this.$refs.tree as any).getNode(select[i].value).isSelect = true
    //   }
    // }
    if (!this.multiple && select.value) {
      this.$nextTick(() => {
        ;(this.$refs.tree as any).setCurrentKey(select.value)
      })
      // (this.$refs.tree as any).getNode(select.value).isSelect = true
    }
  }

  // 获取两个数组不同
  private getArrDifference(arr1: any[], arr2: any[]) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v)
    })
  }

  mounted() {
    // if (this.multiple && this.showCheckbox) {
    //   this.checkOnClickNode = true;
    // };
    // if (this.checkStrictly) {
    //   this.showCheckedStrategy = 'all'
    // }
    this.referenceElm = (this.$refs.reference as Vue).$el
    this.popperElm = this.$refs.popper
    this.inputWidth = (this.$refs.reference as Vue).$el.getBoundingClientRect().width
    addResizeListener(this.$el, this.handleResize)

    if ((this.value as any).length) {
      this.defaultExpandedKeys = (this.multiple ? this.value : [this.value]) as any[]
      this.isSetDefault = true
    }
    this.setSelected()
    this.treeSelect()
  }

  beforeDestroy() {
    removeResizeListener(this.$el, this.handleResize)
  }
}
</script>

<style lang="less" scoped>
.el-tree-select {
  position: relative;
  display: inline-block;
  // width: 100%;
  // 消除文本距离
  font-size: 0;
  line-height: 34px;
  vertical-align: bottom;

  .el-input,
  .el-input__inner {
    cursor: pointer;

    &.is-disabled {
      .el-input__inner {
        color: #999;
        cursor: not-allowed;
        background-color: #efefef;
        border-color: #d2d2d2;
      }

      &:hover {
        .el-input__inner {
          border-color: #d2d2d2;
        }

        .el-input__icon {
          color: #999;
        }
      }
    }
  }

  .el-icon-arrow-down {
    font-size: 14px;
    transition: transform 0.3s;
  }

  .is-reverse {
    transform: rotateZ(180deg);
  }

  .el-icon-circle-close {
    z-index: 2;
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  &--medium {
    font-size: 14px;
    line-height: 32px;
  }

  &--small {
    font-size: 13px;
    line-height: 30px;
  }

  &--mini {
    font-size: 12px;
    line-height: 28px;
  }

  .el-tree-select__input {
    height: 28px;
    padding: 0;
    margin-left: 15px;
    font-size: 12px;
    color: #555;
    background-color: transparent;
    border: none;
    outline: none;
    appearance: none;
  }

  .el-select-tree__tags-wrapper {
    width: 100%;

    .el-tree-select__tags-text {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .el-tree-select__tags {
    position: absolute;
    top: 50%;
    z-index: 1;
    display: flex;
    line-height: normal;
    white-space: normal;
    transform: translateY(-50%);
    align-items: center;
    flex-wrap: wrap;

    & > span {
      display: inline-block;
    }
  }

  .el-tree-select-text {
    display: inline-block;
    width: 100%;
    margin-left: 15px;
    overflow: hidden;
    font-size: 14px;
    color: #666;
    text-overflow: ellipsis;
    white-space: nowrap;

    span::after {
      margin: 0 3px;
      content: ',';
    }

    span:last-child::after {
      content: '';
    }
  }

  .tag-num {
    vertical-align: top;
  }

  .el-tag {
    margin: 2px 0 2px 6px;
    background-color: #f0f2f5;
    border-color: transparent;
    box-sizing: border-box;

    &--small {
      height: 24px;
      line-height: 24px;
    }

    &--mini {
      height: 20px;
      line-height: 20px;
    }

    /deep/.el-tag__close,
    /deep/.el-icon-close {
      top: -9px;
      right: -7px;

      &:hover {
        color: #fff;
        background-color: #555;
      }

      &::before {
        display: block;
        transform: translate(0, 0.5px);
      }
    }
  }
}
</style>

<style lang="less">
.el-tree-select-dropdown {
  background-color: #fff;
  border: solid 1px #d2d2d2;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  &__wrap {
    height: 204px !important;
    padding: 10px 0;
  }

  .tree-select {
    .is-current {
      // color: #1890ff;
      & > .el-tree-node__content {
        color: #1890ff;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .el-tree-node__expand-icon {
      margin-left: 6px;
    }
  }

  .tree-select--multiple {
    .el-tree-node__expand-icon {
      margin-left: 6px;
    }
  }
}
</style>
