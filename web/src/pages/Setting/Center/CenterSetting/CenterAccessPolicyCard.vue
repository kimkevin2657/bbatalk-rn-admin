<template>
  <q-card :class="$q.screen.gt.sm ? 'q-ma-md' : 'q-mt-md q-mb-xl'">
    <q-card-section>
      <q-item-label class="text-h6">출입 정책 설정</q-item-label>
      <q-item-label caption>출입에 관련된 정책을 설정 할 수 있습니다.</q-item-label>
    </q-card-section>
    <q-separator inset />
    <q-card-section class="row q-col-gutter-md">
      <q-input
        name="accessRange"
        v-model.number="gymData.accessRange"
        label="출입 오차 범위 시간"
        class="col-6"
        suffix="분"
        data-vv-scope="gym"
        v-validate="'required'"
        style="width: 250px"
        hint="수강권으로 출입할 때에 허용시간 오차범위"
        :error="errors.has('gym.accessRange')"
        :error-message="getValidateMessage('accessRange')"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import ValidateMixin from 'src/mixins/validateMixin'
export default {
  name: 'CenterAccessPolicyCard',
  mixins: [ValidateMixin],
  inject: ['$validator'],
  computed: {
    ...mapState('gym', [
      'gymData'
    ])
  }
}
</script>
