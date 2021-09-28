import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { PopupManager } from '../popup'
import Popper from 'popper.js'

const PopperJS: any = Vue.prototype.$isServer ? function () {} : Popper

const stop = (e: any) => e.stopPropagation()

/**
 * @param {HTMLElement} [reference=$refs.reference] - The reference element used to position the popper.
 * @param {HTMLElement} [popper=$refs.popper] - The HTML element used as popper, or a configuration used to generate the popper.
 * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end), right(-start, -end), bottom(-start, -end), left(-start, -end)
 * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
 * @param {Boolean} [visible=false] Visibility of the popup element.
 * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
 */
@Component
export default class VuePopper extends Vue {
  public showPopper = false
  public currentPlacement = ''
  public popperElm: any = null
  public referenceElm: any = null
  public popperJS: any = null
  public appended = false

  @Prop({
    type: [Boolean, String],
    default: true
  })
  public transformOrigin!: string | boolean

  @Prop({
    type: String,
    default: 'bottom-start'
  })
  public placement!: string

  @Prop({
    type: Number,
    default: 5
  })
  public boundariesPadding!: number

  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  })
  public reference!: any

  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  })
  public popper!: any

  @Prop({
    type: Number,
    default: 0
  })
  public offset!: number

  // @Prop({
  //   type: Boolean,
  //   default: false
  // })
  // public value!: boolean

  @Prop({
    type: Boolean,
    default: true
  })
  public visibleArrow!: boolean

  @Prop({
    type: Number,
    default: 35
  })
  public arrowOffset!: number

  @Prop({
    type: Boolean,
    default: true
  })
  public appendToBody!: boolean

  @Prop({
    type: Object,
    default: () => {
      return {
        gpuAcceleration: false
      }
    }
  })
  public popperOptions!: any

  @Prop({
    type: Boolean,
    default: false
  })
  public disabled!: boolean

  // @Watch('value', {
  //   immediate: true
  // })
  // public valueChange(val: boolean) {
  //   this.showPopper = val
  //   this.$emit('input', val)
  // }

  @Watch('showPopper')
  public showPopperChange(val: boolean) {
    if (this.disabled) return
    val ? this.updatePopper() : this.destroyPopper()
    // this.$emit('input', val)
  }

  public createPopper() {
    if (this.$isServer) return
    this.currentPlacement = this.currentPlacement || this.placement
    if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
      return
    }

    const options = this.popperOptions
    const popper = (this.popperElm = this.popperElm || this.popper || this.$refs.popper)
    let reference = (this.referenceElm =
      this.referenceElm || this.reference || this.$refs.reference)

    if (!reference && this.$slots.reference && this.$slots.reference[0]) {
      reference = this.referenceElm = this.$slots.reference[0].elm
    }

    if (!popper || !reference) return
    if (this.visibleArrow) this.appendArrow(popper)
    if (this.appendToBody) document.body.appendChild(this.popperElm)
    if (this.popperJS && this.popperJS.destroy) {
      this.popperJS.destroy()
    }

    options.placement = this.currentPlacement
    options.offset = this.offset
    options.arrowOffset = this.arrowOffset
    this.popperJS = new PopperJS(reference, popper, options)
    this.popperJS.onCreate(() => {
      this.$emit('created', this)
      this.resetTransformOrigin()
      this.$nextTick(this.updatePopper)
    })
    if (typeof options.onUpdate === 'function') {
      this.popperJS.onUpdate(options.onUpdate)
    }
    this.popperJS._popper.style.zIndex = PopupManager.nextZIndex()
    this.popperElm.addEventListener('click', stop)
  }

  public updatePopper() {
    const popperJS = this.popperJS
    if (popperJS) {
      popperJS.update()
      if (popperJS._popper) {
        popperJS._popper.style.zIndex = PopupManager.nextZIndex()
      }
    } else {
      this.createPopper()
    }
  }

  public doDestroy(forceDestroy: any) {
    /* istanbul ignore if */
    if (!this.popperJS || (this.showPopper && !forceDestroy)) return
    this.popperJS.destroy()
    this.popperJS = null
  }

  public destroyPopper() {
    if (this.popperJS) {
      this.resetTransformOrigin()
    }
  }

  public resetTransformOrigin() {
    if (!this.transformOrigin) return
    const placementMap = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }
    const placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0]
    const origin = placementMap[placement]
    this.popperJS._popper.style.transformOrigin =
      typeof this.transformOrigin === 'string'
        ? this.transformOrigin
        : ['top', 'bottom'].indexOf(placement) > -1
        ? `center ${origin}`
        : `${origin} center`
  }

  public appendArrow(element: HTMLElement) {
    let hash
    if (this.appended) {
      return
    }

    this.appended = true

    for (const item in element.attributes) {
      if (/^_v-/.test(element.attributes[item].name)) {
        hash = element.attributes[item].name
        break
      }
    }

    const arrow = document.createElement('div')

    if (hash) {
      arrow.setAttribute(hash, '')
    }
    arrow.setAttribute('x-arrow', '')
    arrow.className = 'popper__arrow'
    element.appendChild(arrow)
  }

  beforeDestroy() {
    this.doDestroy(true)
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop)
      document.body.removeChild(this.popperElm)
    }
  }

  // call destroy in keep-alive mode
  deactivated() {
    ;(this.$options as any).beforeDestroy[0].call(this)
  }
}
