<template>
  <div class="grid-container">
    <div class="auth-form-box">
      <h3 class="form_title">
        회원가입약관
      </h3>
      <div class="form_terms form_content">
        <template v-for="(item, index) in accountTextArr">
          <p :key="index">
            {{ item }}
          </p>
        </template>
      </div>
      <q-checkbox
        v-model="isAccountAgree"
        style="padding: 5px 0px 15px 10px; float: right;"
        class="ma-0"
        color="indigo"
        label="회원가입약관에 동의합니다."
      />
      <h3 class="form_title">
        개인정보 처리방침
      </h3>
      <h3 class="form_subtitle">
        1. 개인정보의 수집 및 이용목적
      </h3>
      <table class="fix">
        <colgroup>
          <col width="177">
          <col>
        </colgroup>
        <tbody>
          <tr>
            <th>아이디, 비밀번호, 별명</th>
            <td>
              서비스 이용에 따른 본인식별, 중복가입 확인, 부정이용 방지
            </td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>
              전체메일발송, 비밀번호 분실시 필요한 정보제공 및 민원처리 등
            </td>
          </tr>
          <!-- <tr>
            <th>SNS 정보</th>
            <td>
              회원이 자신의 홈페이지주소를 공개하고자 할 경우
            </td>
          </tr> -->
          <tr>
            <th>이용자의 IP주소, 방문일시</th>
            <td>
              불량회원의 부정 이용방지와 비인가 사용방지, 통계학적 분석
            </td>
          </tr>
          <tr>
            <th>그 외 선택사항</th>
            <td>
              개인 맞춤 서비스 제공
            </td>
          </tr>
        </tbody>
      </table>
      <h3 class="form_subtitle" style="margin-top: 10px;">
        2. 수집하는 개인정보 항목
      </h3>
      <table class="fix">
        <colgroup>
          <col width="80">
          <col>
        </colgroup>
        <tbody>
          <tr>
            <th>회원가입</th>
            <td>
              아이디, 비밀번호, 별명, 이메일
            </td>
          </tr>
        </tbody>
      </table>
      <h3 class="form_subtitle" style="margin-top: 10px;">
        3. 개인 정보 수집 방법
      </h3>
      <div class="form_text">
        홈페이지 회원가입
      </div>
      <h3 class="form_subtitle" style="margin-top: 10px;">
        4. 개인 정보 보존기간
      </h3>
      <table class="fix">
        <colgroup>
          <col style="width: 25%">
          <col style="width: 50%">
          <col width="width: 25%">
        </colgroup>
        <thead>
          <tr>
            <th>보존항목</th>
            <th>보존근거</th>
            <th>보존기간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>성별, 성명, 생년월</th>
            <td>
              반복적인 회원 가입 방지
            </td>
            <td>
              30일
            </td>
          </tr>
          <tr>
            <th>아이디, 이메일</th>
            <td>
              원활한 서비스 이용 및 타사용자의 이용 방지
            </td>
            <td>
              서비스 제공 종료시까지
            </td>
          </tr>
        </tbody>
      </table>
      <q-checkbox
        v-model="isPravateAgree"
        style="padding: 5px 0px 15px 10px; float: right;"
        class="ma-0"
        color="indigo"
        label="개인정보처리방침을 읽었으며 내용에 동의합니다."
      />
    </div>
    <q-separator class="q-my-md" />
    <div>
      <div class="column items-center">
        <div class="col">
          <q-btn
            :to="'/auth/join'"
            style="margin-right:15px;"
          >
            동의하지 않습니다.
          </q-btn>
          <q-btn
            color="indigo"
            :dark="isAllChecked"
            :disabled="!isAllChecked"
            @click="onJoinAgree"
          >
            동의합니다.
          </q-btn>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import joinDefine from 'assets/json/join.json'
export default {
  name: 'JoinAgreeTemplate',
  data () {
    return {
      accountTextArr: [],
      isAccountAgree: false,
      isPravateAgree: false
    }
  },
  computed: {
    isAllChecked () {
      return this.isAccountAgree && this.isPravateAgree
    }
  },
  mounted () {
    this.accountTextArr = joinDefine.account
  },
  methods: {
    onJoinAgree () {
      this.$emit('complete')
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-rows: auto 40px 50px;
}
.grid-btns {
border-top-width: 1px;
}
.terms_style h3 {
  font-size: 13px;
  color: #333;
  font-weight: normal;
  margin: 20px 0 10px;
}
.form_title {
  color: #333;
  padding: 10px 0 10px 10px;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  font-weight: normal;
  text-align: left;
}
.form_subtitle {
  color: #333;
  padding: 10px 0 10px 10px;
  font-weight: normal;
  text-align: left;
  font-size:15px;
}
.form_text {
  color: #666;
  padding: 0px 0 0px 20px;
  font-size:13px;
  text-align: left;
}
.form_content {
  width: 100%;
  height: 220px;
  overflow-y: auto;
  padding: 10px 15px;
  background-color: #F1F1F1;
}
.form_content p {
  text-align:left;
}
table {
  border: 1px solid #ddd;
  border-collapse: separate;
  border-spacing: 2px;
  border-color: grey;
  background-color: transparent;
  border-collapse: collapse;
  /* width: 600px; */
  margin: 10px 0 10px 0px;
}
th, td {
  border: 1px solid #ddd;
  padding: 7px 15px;
  text-align: left;
}
th {
  background-color: #F1F1F1;
}

h3 {
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
</style>
