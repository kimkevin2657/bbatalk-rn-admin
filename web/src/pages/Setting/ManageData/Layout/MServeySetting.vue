<template>
  <div class="contact-grid-container">
    <div class="contact-grid-header" />
    <div class="contact-grid-body">
      <div class="contact-grid-left" />
      <div class="contact-grid-center">
        <q-card>
          <q-card-section>
            <div class="column items-center">
              <div class="col">
                <p class="auto-title">
                  회원 쿠폰 발행 설문지
                </p>
              </div>
            </div>
          </q-card-section>
           <q-card-section>
             <p>
               &nbsp;&nbsp;회원님이 작성해주신 내용을 기준으로 회원님에게 필요한 <b>'쿠폰제공'</b>과 회원님의 <b>'목표 설정 값'</b>을 생성할 예정입니다.<br>
               &nbsp;&nbsp;<b>'쿠폰'</b>은 회원님이 체험을 통해 운동 장소를 선택할 수 있게 <b>시설 체험 쿠폰 1매</b> / 강습 진행을 도와줄 <b>강습 체험 쿠폰 각 1매</b>가 제공됩니다.<br>
               &nbsp;&nbsp;<b>'목표 설정 값'</b>은 회원님이 원하는 목표를 설정 값을 정하여 회원님의 목표에 도달하기 위한 지표 형성을 공유 드릴 예정입니다.
             </p>
             <div class="contact-section" />
           </q-card-section>
           <q-card-section>
            <div class="contact-grid-rows">센터 찾기 *</div>
            <!-- 센터 입력 -->
            <div class="contact-grid-inputrows" style="max-width: 390px">
              <q-input
                dense
                debounce="300"
                v-model="filter"
                placeholder="검색"
                :rules="[val => !!val || '필수 입력 항목입니다.']"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
           </q-card-section>
           <q-card-section>
            <div class="contact-grid-rows">시설 체험 쿠폰 요청 *</div>
            <div class="contact-grid-inputrows" style="max-width: 390px">
              <!-- 시설 체험 쿠폰 선택 -->
              <div class="q-gutter-sm">
                <q-radio v-model="facilityCoupon" val="request" label="요청" />
                <q-radio v-model="facilityCoupon" val="notrequest" label="요청 안함" />
              </div>
            </div>
           </q-card-section>
           <q-card-section>
            <div class="contact-grid-rows">강습 체험 쿠폰 요청 *</div>
            <div class="contact-grid-inputrows" style="max-width: 390px">
              <!-- 강습 체험 쿠폰 선택 -->
              <div class="q-gutter-sm">
                <q-radio v-model="classCoupon" val="request" label="요청" />
                <q-radio v-model="classCoupon" val="notrequest" label="요청 안함" />
              </div>
            </div>
            <div class="contact-section" />
           </q-card-section>
           <q-card-section>
            <div class="contact-grid-rows">관심 회원권</div>
            <!-- 관심 회원권 선택 -->
            <div class="q-gutter-sm">
              <q-list link>
                <q-item tag="label" v-ripple>
                  <q-item-section avatar>
                    <q-checkbox v-model="membership" val="vip" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>VIP</q-item-label>
                    <q-item-label caption>노블레스 회원권 + 웰상품권 100만 + 에스테틱 10회</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section avatar>
                    <q-checkbox v-model="membership" val="nobless" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>노블레스</q-item-label>
                    <q-item-label caption>헬스 + 수영 + 골프 + 사우나</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section avatar>
                    <q-checkbox v-model="membership" val="platinum" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>플래티넘</q-item-label>
                    <q-item-label caption>헬스 + 골프 + 사우나</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
           </q-card-section>
           <q-card-section>
            <div class="contact-grid-rows">관심 성인 강습</div>
            <div class="q-gutter-sm" style="margin: 8px 8px">
              <q-checkbox v-model="adultclass" val="pt" label="P.T" />
              <q-checkbox v-model="adultclass" val="pilates" label="필라테스" />
              <q-checkbox v-model="adultclass" val="golf" label="골프레슨" />
              <q-checkbox v-model="adultclass" val="swimming" label="수영레슨" />
              <q-checkbox v-model="adultclass" val="squash" label="스쿼시레슨" />
              <q-checkbox v-model="adultclass" val="gx" label="G.X강습" />
            </div>
           </q-card-section>
           <q-card-section>
            <div class="contact-grid-rows">관심 유소년 강습</div>
            <div class="q-gutter-sm" style="margin: 8px 8px">
              <q-checkbox v-model="yongclass" val="yongPt" label="키성장P.T" />
              <q-checkbox v-model="yongclass" val="yongPilates" label="유아 필라테스" />
              <q-checkbox v-model="yongclass" val="yongGolf" label="스내그 골프" />
              <q-checkbox v-model="yongclass" val="yongSwimming" label="유소년 수영" />
              <q-checkbox v-model="yongclass" val="yongSquash" label="유소년 스쿼시" />
              <q-checkbox v-model="yongclass" val="yongDance" label="유소년 댄스" />
            </div>
           </q-card-section>
           <q-card-section>
            <div class="contact-grid-rows">기타 문의 사항이 있다면 자유롭게 적어주세요.</div>
            <div class="contact-grid-textrows">
              <!-- 문의사항 입력 -->
              <q-input dense v-model="text" autogrow/>
            </div>
           </q-card-section>
        </q-card>
      </div>
      <div class="contact-grid-right" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      phone: '',
      facilityCoupon: '',
      classCoupon: '',
      membership: [''],
      adultclass: [''],
      yongclass: ['']
    }
  },

  methods: {
    reset () {
      this.$refs.input.resetValidation()
    }
  }
}
</script>
