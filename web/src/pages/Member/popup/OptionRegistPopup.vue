<template>
  <default-dialog
      ref="defaultDialog"
      title="락커 등록"
      :width=450
      :height=600
      :useButtons="['close', 'regist']"
    >

    <div class="row" style="margin: 0px;">
      <q-input
          readonly
          label="선택 락커"
          class="col-12 condition-box"
          v-model="selectLocker"
          hide-bottom-space
          :rules="[val => !!val] "
          dense
        >
        <!-- <template v-slot:append>
          <q-icon name="search" @click="text = ''" class="cursor-pointer"/>
        </template> -->
      </q-input>
      <q-input
          label="회원 선택"
          class="col-12 condition-box"
          v-model="memberName"
          hide-bottom-space
          :rules="[val => !!val] "
          dense
        >
        <template v-slot:append>
          <q-icon name="search" @click="text = ''" class="cursor-pointer"/>
        </template>
      </q-input>
      <q-input
          readonly
          label="요금설정"
          name="paySetting"
          class="col-12 condition-box"
          v-model="paySetting"
          hide-bottom-space
          :rules="[val => !!val] "
          dense
        />
        <div class="col-8 condition-box form-date">
          <q-input
            v-model="startDate"
            dense
            mask="date"
            :rules="['date']"
            label="시작 일자"
            :hint="`${startDate} ~ ${'endDate'}`"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="startDate" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-select
          label="개월"
          class="col-4 condition-box"
          v-model="durationMonth"
          input-debounce="0"
          dense
          :options="durationOptions"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          label="요금"
          name="pay"
          class ="col-12 condition-box"
          style="margin-top: 10px;"
          input-class="text-right"
          v-model="price"
          reverse-fill-mask
          dense
        />

        <q-select
          label="결제방법"
          class="col-4 condition-box"
          v-model="payType"
          input-debounce="0"
          dense
          :options="payTypeOptions"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          readonly
          label="부가세"
          class ="col-8 condition-box"
          input-class="text-right"
          v-model="vat"
          reverse-fill-mask
          dense
        />

        <q-input
          label="비고"
          v-model="memo"
          height="20px"
          class="col-12 condition-box"
          type="textarea"
          outlined
        />
    </div>
  </default-dialog>
</template>

<script>
import DefaultDialog from '../../../components/dialog/DefaultDialog'
export default {
  name: 'OptionRegistPopup',
  components: {
    DefaultDialog
  },
  data () {
    return {
      selectLocker: '개인락카(남) 6번 락커',
      memberName: '',
      paySetting: '월단위 고정금액',
      durationMonth: '',
      startDate: '2019/10/01',
      endDate: '',
      price: '',
      payType: '카드',
      vat: '',
      memo: '',
      durationOptions: [
        '1개월', '2개월', '3개월', '4개월', '5개월', '6개월', '7개월', '8개월', '9개월', '10개월', '11개월', '12개월', '24개월'
      ],
      payTypeOptions: [ '카드', '계좌이체', '현금', '복합결제', '포인트' ]
    }
  },
  methods: {
    show () {
      this.$refs.defaultDialog.show()
    },
    onFindMember () {
      this.$loader.show({
        state: '회원 검색 중...(남욱아 이거 팝업 띄워야하냐)'
      })
      this.$sleep(1000)
      this.$loader.hide()
    }
  }
}
</script>

<style scoped>
.form-date {
  max-height: 60px;
  padding-top: 0px;
  margin-top: 0px;
}

.form-row {
  border-width: 1px 1px 1px 3px;
  border-style: solid;
  border-color: rgba(0,0,0,0.12);
  background: #F1F1F1;
  border-left-color: #3f51b5;
  border-radius: 4px;
}

.condition-box
{
  padding: 0px 10px 0px 10px;
  text-align: center;
}

</style>

<style lang="sass" scoped>
.row
  margin-top: 10px
  margin-bottom: 10px
.row + .row
  margin-top: 0px
</style>
