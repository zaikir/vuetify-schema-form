import { VForm } from 'vuetify/lib/components'
import clone from 'clone'
import { fieldCompiler, renderComponents } from './utils'

export const createForm = ({ Form, fields } = {}) => {
  const componentsTree = fields && fieldCompiler(fields.length
    ? { type: 'row', fields }
    : fields)

  return {
    name: 'GenericForm',
    props: {
      value: {
        type: Object,
        default: () => ({})
      },
      gapped: {
        type: Boolean,
        default: false
      },
      reactive: {
        type: Boolean,
        default: true
      },
      fields: {
        type: Array,
        default: null
      }
    },
    data () {
      return {
        clone: {}
      }
    },
    watch: {
      value: {
        handler (val) {
          this.clone = clone(val)
        },
        immediate: true
      }
    },
    methods: {
      submit () {
        if (!this.$refs.editForm.validate()) {
          return
        }

        this.$emit('submit', this.clone)
      },
      reset () {
        if (this.$refs.editForm) {
          this.$refs.editForm.reset()
          this.$refs.editForm.resetValidation()
        }
      }
    },
    render (createElement) {
      if (!this.fields && !fields) {
        throw new Error('Fields are required to build form!')
      }

      const actualComponentTree = this.fields
        ? fieldCompiler(this.fields.length ? { type: 'row', fields: this.fields } : this.fields)
        : componentsTree

      return createElement(Form || VForm, {
        props: {
          lazyValidation: true
        },
        class: 'py-2',
        ref: 'editForm',
        on: {
          submit: (event) => {
            this.submit()
            event.preventDefault()
          }
        }
      }, [
        renderComponents(createElement, actualComponentTree, this.clone, {
          globalProps: {
            dense: this.$attrs.dense === undefined ? true : this.$attrs.dense
          },
          globalClasses: {
            ...this.gapped && { 'mb-1': true }
          },
          ...this.reactive && {
            onInput: () => this.$emit('input', this.clone),
            onChange: () => this.$emit('change', this.clone)
          }
        })
      ])
    }
  }
}

export default createForm()
