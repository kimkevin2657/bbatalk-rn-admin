<template>
  <q-card :class="$q.screen.gt.sm ? 'q-ma-md' : 'q-mt-md'">
    <q-card-section>
      <q-item-label class="text-h6">기본 설정</q-item-label>
      <q-item-label caption>기본적인 정보를 확인 및 수정 할 수 있습니다.</q-item-label>
    </q-card-section>
    <q-separator inset />
    <q-card-section class="row q-col-gutter-md">
      <q-input
        name="name"
        v-model="gymData.name"
        label="센터명"
        class="col-md-6 col-sm-12"
        data-vv-scope="gym"
        v-validate="'required'"
        :error="errors.has('gym.name')"
        :error-message="getValidateMessage('name')"
      />
      <q-input
        name="mid"
        v-model="gymData.mid"
        label="소유 계정명"
        class="col-md-6 col-sm-12"
        data-vv-scope="gym"
        v-validate="'required'"
        :error="errors.has('gym.mid')"
        :error-message="getValidateMessage('mid')"
        disable
      />
      <!-- 영업 시간 -->
      <q-select
        name="starttime"
        v-model="gymData.stime"
        label="영업 시작 시간"
        :options="hoursOpts"
        style="width: 150px"
      />
      <div style="align-self: center; justify-self: center;">~</div>
      <q-select
        name="starttime"
        v-model="gymData.etime"
        label="영업 종료 시간"
        :options="hoursOpts"
        style="width: 150px"
      />

      <!-- 센터 설명 -->
      <q-input
        v-model="gymData.desc"
        label="설명"
        type="textarea"
        class="col-12"
        outlined
        autogrow
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
// mixin
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'CenterBasicCard',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  data () {
    return {
      hoursOpts: [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
      ]
    }
  },
  computed: {
    ...mapState('gym', [
      'gymData'
    ])
  },
  methods: {

  }
}
</script>
