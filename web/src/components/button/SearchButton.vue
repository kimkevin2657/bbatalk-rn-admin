<template>
  <q-btn-dropdown
    ref="dropdown"
    :label="`${from} ~ ${to}`"
    flat
    :fit="false"
    :menu-anchor="anchor"
    :menu-self="self"
    @before-show="init"
  >
    <q-card
      class="row bg-grey-1"
      style="max-width: 550px;"
    >
      <q-date
        v-model="calData"
        :locale="locale"
        minimal
        range
        flat
        mask="YYYY-MM-DD"
        class="col-sm-6 col-xs-12"
        @input="onCalInput"
      />
      <q-card
        class="q-pa-sm bg-grey-1 col-sm-6 col-xs-12"
        flat
      >
        <div class="row">
          <span style="align-self: center; margin-right: 5px;">기간: </span>
          <q-select
            v-model="periodType"
            :options="priodOpts"
            emit-value
            map-options
            dense
            class="q-ml-md"
            @input="onPeriodInput"
          />
        </div>
        <div class="row q-mt-sm">
          <q-input
            name="from"
            v-model="timeData.from"
            outlined
            square
            dense
            data-vv-scope="search"
            v-validate="'required|date'"
            @input="onFromInput"
            style="width: 120px;"
            :error="errors.has('search.from')"
            :error-message="getValidateMessage('from')"
          />
          <span style="align-self: center; margin: 0 5px; height: 60px; padding-top: 10px">~</span>
          <q-input
            name="to"
            v-model="timeData.to"
            outlined
            square
            dense
            data-vv-scope="search"
            v-validate="'required|date'"
            @input="onToInput"
            style="width: 120px;"
            :error="errors.has('search.to')"
            :error-message="getValidateMessage('to')"
          />
        </div>
        <q-space />
        <div class="row q-mt-none">
          <q-space />
          <q-btn
            label="취소"
            color="blue-grey-4"
            class="q-mr-sm"
            @click="$refs.dropdown.hide()"
          />
          <q-btn
            label="검색"
            color="blue-grey-8"
            @click="onConfirm"
          />
        </div>
      </q-card>
    </q-card>
  </q-btn-dropdown>
</template>

<script>
// mixin
import CalendarMixin from 'src/mixins/calendarMixin'
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'SearchButton',
  mixins: [CalendarMixin, ValidateMixin],
  inject: ['$validator'],
  props: {
    from: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      default: ''
    },
    position: { // left, right
      type: String,
      default: 'right'
    }
  },
  computed: {
    anchor () {
      if (this.position === 'right') return 'bottom end'
      return 'bottom start'
    },
    self () {
      if (this.position === 'right') return 'top end'
      return 'top start'
    }
  },
  data () {
    return {
      calData: this.$moment().format('YYYY-MM-DD'),
      timeData: {
        from: this.$moment().format('YYYY-MM-DD'),
        to: this.$moment().format('YYYY-MM-DD')
      },
      periodType: 'today',
      priodOpts: [
        { label: '직접변경', value: 'custom' },
        { label: '오늘', value: 'today' },
        { label: '어제', value: 'yesterday' },
        { label: '지난주', value: 'lastWeek' },
        { label: '지난달', value: 'lastMonth' },
        { label: '이번주', value: 'thisWeek' },
        { label: '이번달', value: 'thisMonth' }
      ]
    }
  },
  methods: {
    init () {
      const current = this.$moment().format('YYYY-MM-DD')
      if (this.from === current && this.to === current) {
        this.calData = this.$moment().format('YYYY-MM-DD')
        this.timeData.from = this.$moment().format('YYYY-MM-DD')
        this.timeData.to = this.$moment().format('YYYY-MM-DD')
        this.periodType = 'today'
      } else if (this.from === this.to) {
        this.calData = this.from
        this.timeData.from = this.from
        this.timeData.to = this.to
        this.periodType = 'custom'
      } else {
        this.calData = {
          from: this.from,
          to: this.to
        }
        this.timeData.from = this.$moment(this.from).format('YYYY-MM-DD')
        this.timeData.to = this.$moment(this.to).format('YYYY-MM-DD')
        this.periodType = 'custom'
      }
    },
    // 달력 입력시
    onCalInput (val, reason, details) {
      this.periodType = 'custom'
      if (_.isObject(val)) {
        this.timeData.from = val.from
        this.timeData.to = val.to
      } else {
        this.timeData.from = val
        this.timeData.to = val
      }
    },
    async onFromInput (val) {
      this.periodType = 'custom'
      const reqValidate = await this.$validator.validateAll('search')
      if (!reqValidate) return
      if (this.timeData.to === val) this.calData = val
      else this.calData = _.clone(this.timeData)
    },
    async onToInput (val) {
      this.periodType = 'custom'
      const reqValidate = await this.$validator.validateAll('search')
      if (!reqValidate) return
      if (this.timeData.from === val) this.calData = val
      else this.calData = _.clone(this.timeData)
    },
    // 기간 형식 변경시
    onPeriodInput (val) {
      let st, et
      switch (val) {
        case 'custom': // 직접입력
          break
        case 'today': // 오늘
          this.calData = this.$moment().format('YYYY-MM-DD')
          this.timeData.from = this.$moment().format('YYYY-MM-DD')
          this.timeData.to = this.$moment().format('YYYY-MM-DD')
          break
        case 'yesterday': // 어제
          this.calData = this.$moment().add('Day', -1).format('YYYY-MM-DD')
          this.timeData.from = this.$moment().add('Day', -1).format('YYYY-MM-DD')
          this.timeData.to = this.$moment().add('Day', -1).format('YYYY-MM-DD')
          break
        case 'lastWeek': // 지난주
          st = this.$moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD')
          et = this.$moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD')
          this.timeData.from = st
          this.timeData.to = et
          this.calData = _.clone(this.timeData)
          break
        case 'lastMonth': // 지난달
          st = this.$moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
          et = this.$moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
          this.timeData.from = st
          this.timeData.to = et
          this.calData = _.clone(this.timeData)
          break
        case 'thisWeek': // 이번주
          st = this.$moment().startOf('isoWeek').format('YYYY-MM-DD')
          et = this.$moment().endOf('isoWeek').format('YYYY-MM-DD')
          this.timeData.from = st
          this.timeData.to = et
          this.calData = _.clone(this.timeData)
          break
        case 'thisMonth': // 이번달
          st = this.$moment().startOf('month').format('YYYY-MM-DD')
          et = this.$moment().endOf('month').format('YYYY-MM-DD')
          this.timeData.from = st
          this.timeData.to = et
          this.calData = _.clone(this.timeData)
          break
      }
    },
    async onConfirm () {
      const reqValidate = await this.$validator.validateAll('search')
      if (!reqValidate) return
      this.$emit('search', this.timeData) // {from, to}
      this.$refs.dropdown.hide()
    }
  }
}
</script>
