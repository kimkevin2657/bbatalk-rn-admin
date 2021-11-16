<template>
  <default-dialog
      ref="defaultDialog"
      title="사진 편집"
      :width=400
      :height=400
      :useButtons="['close', 'regist']"
      @regist="onRegImage"
      @close="$emit('reset')"
  >
    <cropper
      :src="imageSrc"
      :stencil-props="{
        aspectRatio: 1
      }"
      ref="cropper"
      @change="change"
    />
  </default-dialog>
</template>

<script>
import DefaultDialog from '../dialog/DefaultDialog'
import { Cropper // , CircleStencil
} from 'vue-advanced-cropper'

export default {
  name: 'PhotoCropperPopup',
  components: {
    DefaultDialog,
    Cropper // ,
    // CircleStencil
  },
  data () {
    return {
      imageFile: '',
      imageSrc: '',
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      },
      image: null
    }
  },
  methods: {
    show (file) {
      this.setImageFile(file)
      this.$refs.defaultDialog.show()
    },
    setImageFile (file) {
      this.imageFile = file
      // console.log(this.imageFile)
      const reader = new FileReader()
      const self = this
      reader.onload = function (e) {
        self.imageSrc = e.target.result
      }
      reader.readAsDataURL(file)
    },
    change ({ coordinates, canvas }) {
      this.coordinates = coordinates
      // console.log(coordinates, canvas)
    },
    crop () {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      // You able to do different manipulations at a canvas
      // but there we just get a cropped image
      this.image = canvas.toDataURL()
      // console.log(this.image)
    },
    onRegImage () {
      this.crop()
      this.$refs.defaultDialog.hide()
      return this.$emit('cropImage', this.image)
    }
  }
}
</script>
