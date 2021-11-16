<template>
  <div class="row">
    <q-select
      label="* 회원권 선택"
      class="col-12"
      dense
      hide-bottom-space
    />
    <!-- <div class="col-6">
      <q-input
        dense
        v-model="membershipStartDate"
        mask="date"
        label="유효일(시작)"
        hide-bottom-space
        >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="membershipStartDate" @input="() => $refs.qDateProxy.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-6">
      <q-input
        dense
        v-model="membershipEndDate"
        mask="date"
        label="유효일(종료)"
        hide-bottom-space
        >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="membershipEndDate" @input="() => $refs.qDateProxy.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'MembershipTemplate',
  data () {
    return {}
  },
  computed: {
  },
  methods: {
    onMembershipClick (membership) {
      this.membershipMonth = ''
      this.membershipMonthOpts = this.getMonthOpts('회원권', membership)
      this.membershipPrice = ''
      this.memberDiscountInfo = ''
    }
  }
}
</script>
