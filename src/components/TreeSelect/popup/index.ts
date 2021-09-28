import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import merge from '../utils/merge'
import PopupManager from './popup-manager'
import getScrollBarWidth from '../utils/scrollbar-width'
import { getStyle, addClass, removeClass, hasClass } from '_u/dom-uitls'

let idSeed = 1

let scrollBarWidth

@Component
export default class Popup extends Vue {
  public _popupId = ''
  public _opening = false
  public opened = false
  public bodyPaddingRight: any = null
  public computedBodyPaddingRight = 0
  public withoutHiddenClass = true
  public rendered = false
  public _closeTimer: any = null
  public _openTimer: any = null
  public _closing = false
  public willOpen: any = null

  @Prop({
    type: Boolean,
    default: false
  })
  public visible!: boolean

  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  })
  public openDelay!: any

  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  })
  public closeDelay!: any

  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  })
  public zIndex!: any

  @Prop({
    type: Boolean,
    default: false
  })
  public modal!: boolean

  @Prop({
    type: Boolean,
    default: true
  })
  public modalFade!: boolean

  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  })
  public modalClass!: any

  @Prop({
    type: Boolean,
    default: false
  })
  public modalAppendToBody!: boolean

  @Prop({
    type: Boolean,
    default: true
  })
  public lockScroll!: boolean

  @Prop({
    type: Boolean,
    default: false
  })
  public closeOnPressEscape!: boolean

  @Prop({
    type: Boolean,
    default: false
  })
  public closeOnClickModal!: boolean

  beforeMount() {
    this._popupId = 'popup-' + idSeed++
    PopupManager.register(this._popupId, this)
  }

  beforeDestroy() {
    PopupManager.deregister(this._popupId)
    PopupManager.closeModal(this._popupId)

    this.restoreBodyStyle()
  }

  @Watch('visible')
  public visibleChange(val: boolean) {
    if (val) {
      if (this._opening) return
      if (!this.rendered) {
        this.rendered = true
        Vue.nextTick(() => {
          this.open()
        })
      } else {
        this.open()
      }
    } else {
      this.close()
    }
  }

  public open(options?: any) {
    if (!this.rendered) {
      this.rendered = true
    }
    // @ts-ignore
    const props = merge({}, this.$props || this, options)

    if (this._closeTimer) {
      clearTimeout(this._closeTimer)
      this._closeTimer = null
    }
    clearTimeout(this._openTimer)

    const openDelay = Number(props.openDelay)
    if (openDelay > 0) {
      this._openTimer = setTimeout(() => {
        this._openTimer = null
        this.doOpen(props)
      }, openDelay)
    } else {
      this.doOpen(props)
    }
  }

  public doOpen(props: any) {
    if (this.$isServer) return
    if (this.willOpen && !this.willOpen()) return
    if (this.opened) return

    this._opening = true

    const dom = this.$el as HTMLElement

    const modal = props.modal

    const zIndex = props.zIndex
    if (zIndex) {
      PopupManager.zIndex = zIndex
    }

    if (modal) {
      if (this._closing) {
        PopupManager.closeModal(this._popupId)
        this._closing = false
      }
      PopupManager.openModal(
        this._popupId,
        PopupManager.nextZIndex(),
        this.modalAppendToBody ? undefined : dom,
        props.modalClass,
        props.modalFade
      )
      if (props.lockScroll) {
        this.withoutHiddenClass = !hasClass(document.body, 'el-popup-parent--hidden')
        if (this.withoutHiddenClass) {
          this.bodyPaddingRight = document.body.style.paddingRight
          this.computedBodyPaddingRight = parseInt(getStyle(document.body, 'paddingRight'), 10)
        }
        scrollBarWidth = getScrollBarWidth()
        const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight
        const bodyOverflowY = getStyle(document.body, 'overflowY')
        if (
          scrollBarWidth > 0 &&
          (bodyHasOverflow || bodyOverflowY === 'scroll') &&
          this.withoutHiddenClass
        ) {
          document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px'
        }
        addClass(document.body, 'el-popup-parent--hidden')
      }
    }

    if (getComputedStyle(dom).position === 'static') {
      dom.style.position = 'absolute'
    }

    dom.style.zIndex = PopupManager.nextZIndex()
    this.opened = true
    // @ts-ignore
    this.onOpen && this.onOpen()

    this.doAfterOpen()
  }

  public doAfterOpen() {
    this._opening = false
  }

  public close() {
    // @ts-ignore
    if (this.willClose && !this.willClose()) return

    if (this._openTimer !== null) {
      clearTimeout(this._openTimer)
      this._openTimer = null
    }
    clearTimeout(this._closeTimer)

    const closeDelay = Number(this.closeDelay)

    if (closeDelay > 0) {
      this._closeTimer = setTimeout(() => {
        this._closeTimer = null
        this.doClose()
      }, closeDelay)
    } else {
      this.doClose()
    }
  }

  public doClose() {
    this._closing = true
    // @ts-ignore
    this.onClose && this.onClose()

    if (this.lockScroll) {
      setTimeout(this.restoreBodyStyle, 200)
    }

    this.opened = false

    this.doAfterClose()
  }

  public doAfterClose() {
    PopupManager.closeModal(this._popupId)
    this._closing = false
  }

  public restoreBodyStyle() {
    if (this.modal && this.withoutHiddenClass) {
      document.body.style.paddingRight = this.bodyPaddingRight
      removeClass(document.body, 'el-popup-parent--hidden')
    }
    this.withoutHiddenClass = true
  }
}

export { PopupManager }
