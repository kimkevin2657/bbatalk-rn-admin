export default {
  methods: {
    getValidateMessage (fieldName) {
      if (this.errors.count() > 0) {
        for (const error of this.errors.items) {
          if (error.field === fieldName) {
            return error.msg
          }
        }
      }

      return ''
    }
  }
}
