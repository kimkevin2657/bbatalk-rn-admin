<template>
  <div
    class="column justify-center bg-touch"
    style="height: 100vh; width: 100vw;"
  >
    <div class="col-9 self-center">
      <q-tab-panels v-model="panel" animated style="background-color: #fafafa">
        <q-tab-panel name="auth">
          <!-- 회원번호 입력 컴포넌트 -->
          <check-member @next="panel = 'view'"/>
        </q-tab-panel>

        <q-tab-panel name="view">
          <view-info @previous="panel = 'auth'"/>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import CheckMember from './Checkin/CheckMember'
import ViewInfo from './Checkin/ViewInfo'
export default {
  name: 'Checkin',
  components: {
    CheckMember,
    ViewInfo
  },
  data () {
    return {
      panel: 'auth'
    }
  }
}
</script>

<style scoped>
/* // https://www.123rf.com/photo_106915618_fitness-background-dumbbell-sneakers-bottle-jumping-rope-towel-and-other-equipment-on-wooden-board.html
// 해당 이미지를 사용한다면 위 Url에서 구매 되어야 함. */
.bg-touch {
  /* background-image: url(https://previews.123rf.com/images/digieye/digieye1808/digieye180800081/106915618-fitness-background-dumbbell-sneakers-bottle-jumping-rope-towel-and-other-equipment-on-wooden-board.jpg); */
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>
