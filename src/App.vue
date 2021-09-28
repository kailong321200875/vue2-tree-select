<template>
  <div>
    <tree-select
      v-model="value1"
      option-max-width="300px"
      :clearable="true"
      :default-expand-all="false"
      :data="options"
      placeholder="请选择"
      @change="treeSelectChange"
    />

    <tree-select
      v-model="value2"
      option-max-width="300px"
      :clearable="true"
      :default-expand-all="false"
      :data="options"
      placeholder="请选择"
      @change="treeSelectChange"
    />

    <tree-select
      v-model="value3"
      option-max-width="300px"
      show-checkbox
      multiple
      :clearable="true"
      :default-expand-all="false"
      :data="options"
      placeholder="请选择"
      @change="treeSelectChange"
    />

    <tree-select
      v-model="value4"
      option-max-width="300px"
      show-checkbox
      multiple
      collapse-tags
      :clearable="true"
      :default-expand-all="false"
      :data="options"
      placeholder="请选择"
      @change="treeSelectChange"
    />

    <tree-select
      v-model="value5"
      option-max-width="300px"
      show-checkbox
      multiple
      :collapse-tags-max-num="3"
      collapse-tags
      :clearable="true"
      :default-expand-all="false"
      :data="options"
      placeholder="请选择"
      @change="treeSelectChange"
    />

    <tree-select
      v-model="value6"
      option-max-width="300px"
      show-checkbox
      disabled
      multiple
      :collapse-tags-max-num="3"
      collapse-tags
      :clearable="true"
      :default-expand-all="false"
      :data="options"
      placeholder="请选择"
      @change="treeSelectChange"
    />

    <tree-select
      v-model="value7"
      option-max-width="300px"
      show-checkbox
      multiple
      collapse-tags
      :clearable="true"
      :default-expand-all="false"
      :data="options"
      placeholder="请选择"
      @change="treeSelectChange"
    />

    <tree-select
      v-model="value8"
      filterable
      option-max-width="300px"
      :clearable="true"
      :default-expand-all="false"
      :data="options"
      placeholder="请选择"
      @change="treeSelectChange"
    />

    <tree-select
      v-model="value9"
      filterable
      show-checkbox
      multiple
      collapse-tags
      option-max-width="300px"
      :clearable="true"
      :default-expand-all="false"
      :data="options"
      placeholder="请选择"
      @change="treeSelectChange"
    />

    <tree-select
      v-model="value10"
      filterable
      show-checkbox
      multiple
      collapse-tags
      option-max-width="300px"
      :clearable="true"
      :default-expand-all="false"
      :data="options"
      placeholder="请选择"
      :render-content="renderContent"
      @change="treeSelectChange"
    />
  </div>
</template>

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'
import TreeSelect from '../dist/vue2-tree-select'
import '../dist/css/index.css'
import { Button } from 'element-ui'
Vue.use(Button)

@Component({
  components: {
    TreeSelect
  }
})
export default class App extends Vue {
  private options: any[] = []
  private value1 = ''
  private value2 = 'breadcrumb'
  private value3 = []
  private value4 = []
  private value5 = []
  private value6 = []
  private value7 = ['breadcrumb', 'xiaolv']
  private value8 = ''
  private value9 = []
  private value10 = []

  created() {
    setTimeout(() => {
      this.options = [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        },
        {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局'
                },
                {
                  value: 'color',
                  label: 'Color 色彩'
                },
                {
                  value: 'typography',
                  label: 'Typography 字体'
                },
                {
                  value: 'icon',
                  label: 'Icon 图标'
                },
                {
                  value: 'button',
                  label: 'Button 按钮'
                }
              ]
            },
            {
              value: 'formWrap',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框'
                },
                {
                  value: 'checkbox',
                  label: 'Checkbox 多选框'
                },
                {
                  value: 'input',
                  label: 'Input 输入框'
                },
                {
                  value: 'input-number',
                  label: 'InputNumber 计数器'
                },
                {
                  value: 'select',
                  label: 'Select 选择器'
                },
                {
                  value: 'cascader',
                  label: 'Cascader 级联选择器'
                },
                {
                  value: 'switch',
                  label: 'Switch 开关'
                },
                {
                  value: 'slider',
                  label: 'Slider 滑块'
                },
                {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器'
                },
                {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器'
                },
                {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器'
                },
                {
                  value: 'upload',
                  label: 'Upload 上传'
                },
                {
                  value: 'rate',
                  label: 'Rate 评分'
                },
                {
                  value: 'form',
                  label: 'Form 表单'
                }
              ]
            },
            {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格'
                },
                {
                  value: 'tag',
                  label: 'Tag 标签'
                },
                {
                  value: 'progress',
                  label: 'Progress 进度条'
                },
                {
                  value: 'tree',
                  label: 'Tree 树形控件'
                },
                {
                  value: 'pagination',
                  label: 'Pagination 分页'
                },
                {
                  value: 'badge',
                  label: 'Badge 标记'
                }
              ]
            },
            {
              value: 'notice',
              label: 'Notice',
              children: [
                {
                  value: 'alert',
                  label: 'Alert 警告'
                },
                {
                  value: 'loading',
                  label: 'Loading 加载'
                },
                {
                  value: 'message',
                  label: 'Message 消息提示'
                },
                {
                  value: 'message-box',
                  label: 'MessageBox 弹框'
                },
                {
                  value: 'notification',
                  label: 'Notification 通知'
                }
              ]
            },
            {
              value: 'navigation',
              label: 'Navigation',
              children: [
                {
                  value: 'menu',
                  label: 'NavMenu 导航菜单'
                },
                {
                  value: 'tabs',
                  label: 'Tabs 标签页'
                },
                {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑'
                },
                {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单'
                },
                {
                  value: 'steps',
                  label: 'Steps 步骤条'
                }
              ]
            },
            {
              value: 'others',
              label: 'Others',
              children: [
                {
                  value: 'dialog',
                  label: 'Dialog 对话框'
                },
                {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示'
                },
                {
                  value: 'popover',
                  label: 'Popover 弹出框'
                },
                {
                  value: 'card',
                  label: 'Card 卡片'
                },
                {
                  value: 'carousel',
                  label: 'Carousel 走马灯'
                },
                {
                  value: 'collapse',
                  label: 'Collapse 折叠面板'
                }
              ]
            }
          ]
        },
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ]
    }, 2000)
  }

  private treeSelectChange(val: any) {
    console.log(val)
  }

  private renderContent(h: any, { node }: any) {
    return (
      <span class="custom-tree-node">
        <span>{node.label}</span>
        <span>
          <el-button size="mini" type="text">
            Append
          </el-button>
          <el-button size="mini" type="text">
            Delete
          </el-button>
        </span>
      </span>
    )
  }
}
</script>

<style lang="less" scoped>
.custom-tree-node {
  display: flex;
  padding-right: 8px;
  font-size: 14px;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}
</style>
