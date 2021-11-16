const routes = [{
  path: '/',
  // redirect: '/manager/schedule'
  redirect: '/auth/login'
},
{
  path: '/checkin',
  component: () => import('pages/TouchScreen/Checkin.vue')
},
{
  path: '/auth/login',
  component: () => import('pages/Auth/Login.vue')
},
{
  path: '/auth/join',
  component: () => import('pages/Auth/Join.vue')
},
{
  path: '/auth/regmember/:type',
  component: () => import('pages/Auth/RegMember')
},
{
  path: '/manager',
  component: () => import('layouts/ManagerLayout.vue'),
  children: [{
    // 대쉬보드
    name: '대쉬보드',
    path: 'dashboard/main',
    component: () => import('pages/Dashboard/Main')
  },
  {
    // 문의관리 - 문의 현황
    key: 'inquiryState',
    name: '문의 현황',
    path: 'inquiry/InquiryState',
    component: () => import('pages/Inquiry/InquiryState')
  },
  {
    // 문의관리 - 문의 설문지
    key: 'inquirySurveyPopup',
    name: '문의 설문지',
    path: 'inquiry/InquirySurveyPopup',
    component: () => import('pages/Inquiry/popup/InquirySurveyPopup')
  },
  {
    // 문의관리 - 체험 스케줄
    key: 'freeSchedulePopup',
    name: '체험 스케줄',
    path: 'inquiry/FreeSchedulePopup',
    component: () => import('pages/Inquiry/popup/FreeSchedulePopup')
  },
  {
    // 회원 관리 - 회원 현황
    key: 'memberState',
    name: '회원 현황',
    path: 'member/MemberState',
    component: () => import('pages/Member/MemberState')
  },
  {
    // 회원 관리 - 회원권 현황
    key: 'membershipTicket',
    name: '회원권 현황',
    path: 'member/MembershipTicket',
    component: () => import('pages/Member/MembershipTicket')
  },
  {
    // 회원 관리 - 수강권 현황
    key: 'lessonTicket',
    name: '수강권 현황',
    path: 'member/LessonTicket',
    component: () => import('pages/Member/LessonTicket')
  },
  {
    // 회원 관리 - 기간연장 현황
    key: 'delayTicket',
    name: '기간변경 현황',
    path: 'member/DelayTicket',
    component: () => import('pages/Member/DelayTicket')
  },
  {
    key: 'memberAccess',
    name: '출입 현황',
    path: 'member/MemberAccess',
    component: () => import('pages/Member/MemberAccess')
  },
  {
    // 회원 관리 - 회원 상세 정보
    key: 'memberDetail',
    name: '회원 상세 정보',
    path: 'member/MemberDetail',
    component: () => import('pages/Member/MemberDetail')
  },
  {
    // 회원 관리 - 만기 회원 현황
    key: 'memberExpired',
    name: '만기 회원 현황',
    path: 'member/MemberExpired',
    component: () => import('pages/Member/MemberExpired')
  },
  {
    // 회원 관리 - 랭커 회원 현황
    key: 'memberExpired',
    name: '랭커 회원 현황',
    path: 'member/MemberExpired',
    component: () => import('pages/Member/MemberExpired')
  },
  {
    // 스케줄 관리 - 강사 스케줄
    key: 'staffSchedule',
    name: '강사 스케줄',
    path: 'schedule/StaffSchedule',
    component: () => import('pages/Schedule/StaffSchedule')
  },
  {
    // 스케줄 관리 - 룸 스케줄
    key: 'roomSchedule',
    name: '룸 스케줄',
    path: 'schedule/RoomSchedule',
    component: () => import('pages/Schedule/RoomSchedule')
  },
  {
    key: 'reserveSchedule',
    name: '예약 현황',
    path: 'schedule/ReserveSchedule',
    component: () => import('pages/Schedule/ReserveSchedule')
  },
  {
    // 강사 관리 - 강사 현황
    key: 'staffState',
    name: '강사 현황',
    path: 'staff/StaffState',
    component: () => import('pages/Staff/StaffState')
  },
  {
    // 강사 관리 - 정산 현황
    key: 'staffSettle',
    name: '정산 현황',
    path: 'staff/StaffSettle',
    component: () => import('pages/Staff/StaffSettle')
  },
  {
    // 강사 관리 - 강사 상세 정보
    key: 'staffDetail',
    name: '강사 상세 정보',
    path: 'staff/StaffDetail',
    component: () => import('pages/Staff/StaffDetail')
  },
  {
    // 회원 관리 - 락커 현황
    key: 'lockerSettings',
    name: '락커 현황',
    path: 'option/LockerSettings',
    component: () => import('pages/Option/LockerSettings')
  },
  {
    // 매출&지출 관리 - 매출 현황,
    key: 'salesState',
    name: '매출 현황',
    path: 'sales/SalesState',
    component: () => import('pages/Sales/SalesState')
  },
  {
    // 매출&지출 관리 - 회원권 매출,
    key: 'salesMember',
    name: '회원권 매출',
    path: 'sales/SalesMember',
    component: () => import('pages/Sales/SalesMember')
  },
  {
    // 매출&지출 관리 - 수강권 매출,
    key: 'salesLesson',
    name: '수강권 매출',
    path: 'sales/SalesLesson',
    component: () => import('pages/Sales/SalesLesson')
  },
  {
    // 매출&지출 관리 - 옵션 매출,
    key: 'salesOption',
    name: '옵션 매출',
    path: 'sales/SalesOption',
    component: () => import('pages/Sales/SalesOption')
  },
  {
    // 매출&지출 관리 - 지출&시제 현황
    key: 'expenseState',
    name: '지출&시제 현황',
    path: 'sales/ExpenseState',
    component: () => import('pages/Sales/ExpenseState')
  },
  {
    // 매출&지출 관리 - 정산 현황
    key: 'settleState',
    name: '매출 정산 현황',
    path: 'sales/SettleState',
    component: () => import('pages/Sales/SettleState')
  },
  {
    // 운영 관리 - 운영 일정
    key: 'operationSchedule',
    name: '운영 일정',
    path: 'operation/OperationSchedule',
    component: () => import('pages/Operation/OperationSchedule')
  },
  {
    // 운영 관리 - 기획 현황
    key: 'operationPlanning',
    name: '기획 현황',
    path: 'operation/OperationPlanning',
    component: () => import('pages/Operation/OperationPlanning')
  },
  {
    // 운영 관리 - 공지 현황
    key: 'operationNotice',
    name: '공지 현황',
    path: 'operation/OperationNotice',
    component: () => import('pages/Operation/OperationNotice')
  },
  {
    // 운영 관리 - 공지 등록
    key: 'operationNoticeEditor',
    name: '공지 현황 등록',
    path: 'operation/OperationNotice/Editor',
    props: (route) => ({ mode: route.query.mode, num: route.query.num }),
    component: () => import('pages/Operation/OperationNotice/OperationNoticeEditor')
  },
  {
    // 운영 관리 - 공지 현황 상세
    key: 'operationNoticeDetail',
    name: '공지 현황 - 게시물',
    path: 'operation/OperationNotice/Detail',
    props: (route) => ({ num: route.query.num }),
    component: () => import('pages/Operation/OperationNotice/OperationNoticeDetail')
  },
  {
    // 운영 관리 - 회원 공지
    key: 'operationCS',
    name: 'C.S 현황',
    path: 'operation/OperationCS',
    component: () => import('pages/Operation/OperationCS')
  },
  {
    // 분석 - 회원 분석
    key: 'memberAnalysis',
    name: '회원 분석',
    path: 'analysis/MemberAnalysis',
    component: () => import('pages/Analysis/MemberAnalysis')
  },
  {
    // 분석 - 매출 분석
    key: 'salesAnalysis',
    name: '매출 분석',
    path: 'analysis/SalesAnalysis',
    component: () => import('pages/Analysis/SalesAnalysis')
  },
  {
    // 커뮤니티 - 뽜튜브
    key: 'tube',
    name: '뽜튜브',
    path: 'community/Tube',
    component: () => import('pages/Community/Tube')
  },
  {
    // 커뮤니티 - 뽜톡
    key: 'talk',
    name: '뽜톡',
    path: 'community/Talk',
    component: () => import('pages/Community/Talk')
  },
  {
    // 환경설정 - 센터 설정
    key: 'centerSetting',
    name: '센터 설정',
    path: 'setting/CenterSetting',
    component: () => import('pages/Setting/Center/CenterSetting')
  },
  {
    // 환경설정 - 수강 설정
    key: 'manageDataSetting',
    name: '관리 데이터 설정',
    path: 'setting/ManageDataSetting',
    component: () => import('pages/Setting/ManageData/ManageDataSetting')
  }
  ]
}
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('pages/Error404.vue')
})

export default routes
