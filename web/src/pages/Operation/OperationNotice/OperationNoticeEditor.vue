<template>
  <div>
    <top />
    <q-card class="row q-pa-xl q-ma-sm">
      <q-input
        name="name"
        label="닉네임"
        dense
        v-model="operationNoticeData.name"
        data-vv-scope="regnotice"
        v-validate="'required'"
        autocomplete="new-password"
        :disable="this.mode==='update'"
        :error="errors.has('regnotice.name')"
        :error-message="getValidateMessage('name')"
        class="col-md-3 col-xs-12 q-mr-md"
      />
      <q-input
        name="pwd"
        type="password"
        label="비밀번호"
        dense
        v-model="operationNoticeData.pwd"
        data-vv-scope="regnotice"
        v-validate="'required|password'"
        autocomplete="new-password"
        :disable="this.mode==='update'"
        :error="errors.has('regnotice.pwd')"
        :error-message="getValidateMessage('pwd')"
        class="col-md-4 col-xs-12"
      />
      <q-input
        name="title"
        label="제목"
        dense
        v-model="operationNoticeData.title"
        data-vv-scope="regnotice"
        v-validate="'required'"
        :error="errors.has('regnotice.title')"
        :error-message="getValidateMessage('title')"
        class="col-md-8 col-xs-12"
      />
      <div class="q-gutter-sm col-12 q-mt-sm">
        <q-editor
          wysiwyg
          v-model="operationNoticeData.content"
          :toolbar="[
            ['left','center','right','justify'],
            ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
            ['token', 'hr', 'link', 'custom_btn'],
            [
              {
                label: $q.lang.editor.fontSize,
                icon: $q.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'size-1',
                  'size-2',
                  'size-3',
                  'size-4',
                  'size-5',
                  'size-6',
                  'size-7'
                ]
              },
              {
                label: $q.lang.editor.defaultFont,
                icon: $q.iconSet.editor.font,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'default_font',
                  'arial',
                  'arial_black',
                  'comic_sans',
                  'courier_new',
                  'impact',
                  'lucida_grande',
                  'times_new_roman',
                  'verdana'
                ]
              }
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
            ['viewsource']
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana'
          }"
          min-height="20rem"
        />
      </div>
      <div class="col-12 row q-pr-sm q-mt-md">
        <q-space />
        <q-btn
          label="취소"
          class="q-mr-sm"
          color="blue-grey-6"
          @click="$router.go(-1)"
        />
        <q-btn
          label="확인"
          color="blue-grey-8"
          @click="onRegisterNotice"
        />
      </div>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// component
import Top from 'src/layouts/component/Top'
// mixin
import ValidateMixin from 'src/mixins/validateMixin'

export default {
  name: 'OperationNoticeEditor',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  components: {
    Top
  },
  props: {
    mode: {
      type: String,
      default: 'add' // update
    },
    num: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('operationNotice', [
      'operationNoticeData'
    ])
  },
  async mounted () {
    if (this.mode === 'add') {
      this.initOperationNoticeData()
      await this.$nextTick()
      this.errors.clear()
    } else if (this.mode === 'update') {
      if (!this.operationNoticeData.pwd) {
        this.$router.push(`/manager/operation/OperationNotice/Detail?num=${this.num}`)
      }
    }
  },
  methods: {
    ...mapActions('operationNotice', [
      'reqAddOperationNoticeData',
      'reqUpdateOperationNoticeData'
    ]),
    ...mapMutations('operationNotice', [
      'initOperationNoticeData'
    ]),
    async onRegisterNotice () {
      const reqValidate = await this.$validator.validateAll('regnotice')
      if (!reqValidate) return
      let check = void 0
      let num = void 0
      if (this.mode === 'add') {
        // 게시글 추가 요청
        const { code, result } = await this.reqAddOperationNoticeData()
        check = code
        num = result.num
      } else {
        // 게시글 수정 요청
        const { code, result } = await this.reqUpdateOperationNoticeData()
        check = code
        num = result.num
      }

      if (check !== 'ok') return
      // 상세 게시글로 이동
      this.$router.push(`/manager/operation/OperationNotice/Detail?num=${num}`)
    }
  }
}
</script>
