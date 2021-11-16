<template>
  <q-card :class="$q.screen.gt.sm ? 'q-ma-md' : 'q-mt-md'">
    <q-card-section>
      <q-item-label class="text-h6">회원권 & 수강권 정책 설정</q-item-label>
      <q-item-label caption>회원권과 수강권에 관련된 정책을 설정 할 수 있습니다.</q-item-label>
    </q-card-section>
    <q-separator inset />
    <q-card-section class="row q-col-gutter-md">
      <q-select
        name="trasferPolicy"
        label="양도 가능 여부"
        v-model="gymData.transferPolicy"
        :options="transferOpts"
        emit-value
        map-options
        data-vv-scope="gym"
        v-validate="'required'"
        :error="errors.has('gym.transferPolicy')"
        :error-message="getValidateMessage('transferPolicy')"
        class="col-md-6 col-sm-12"
      />
      <q-input
        name="transferPee"
        label="양도 수수료"
        type="number"
        v-model.number="gymData.transferPee"
        class="col-md-6 col-sm-12"
        suffix="원"
        data-vv-scope="gym"
        v-validate="'required'"
        :error="errors.has('gym.transferPee')"
        :error-message="getValidateMessage('transferPee')"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'CenterTicketPolicyCard',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  data () {
    return {
      transferOpts: [
        { label: '양도 불가', value: 0 },
        { label: '모두에게 양도 가능', value: 1 },
        { label: '가족에게만 양도 가능', value: 2 }
      ]
    }
  },
  computed: {
    ...mapState('gym', [
      'gymData'
    ])
  }
}
</script>
