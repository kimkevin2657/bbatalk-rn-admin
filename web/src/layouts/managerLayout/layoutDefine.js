module.exports = {
  managerMenu: [
    // {
    //   key: 'inquiry',
    //   label: '문의 관리',
    //   icon: 'mdi-comment-question',
    //   to: '',
    //   isOpen: false,
    //   children: [
    //     {
    //       label: '문의 현황',
    //       to: '/manager/inquiry/state'
    //     }
    //   ]
    // },
    {
      key: 'schedule',
      label: '스케줄 관리',
      icon: 'mdi-calendar-month',
      to: '',
      isOpen: false,
      children: [
        {
          label: '강사 스케줄',
          to: '/manager/schedule/StaffSchedule'
        },
        // {
        //   label: '룸 스케줄',
        //   to: '/manager/schedule/RoomSchedule'
        // },
        {
          label: '예약 현황',
          to: '/manager/schedule/ReserveSchedule'
        }
      ]
    },
    {
      key: 'member',
      label: '회원 관리',
      icon: 'account_box',
      to: '',
      isOpen: false,
      children: [
        {
          label: '회원 상세 정보',
          to: '/manager/member/MemberDetail',
          hidden: true
        },
        {
          label: '회원 현황',
          to: '/manager/member/MemberState'
        },
        // {
        //   label: '만기 회원 현황',
        //   to: '/manager/member/MemberExpired'
        // },
        {
          label: '회원권 현황',
          to: '/manager/member/MembershipTicket'
        },
        {
          label: '수강권 현황',
          to: '/manager/member/LessonTicket'
        },
        {
          label: '기간변경 현황',
          to: '/manager/member/DelayTicket'
        },
        {
          label: '출입 현황',
          to: '/manager/member/MemberAccess'
        }
      ]
    },
    {
      key: 'staff',
      label: '강사 관리',
      icon: 'mdi-teach',
      to: '',
      isOpen: false,
      children: [
        {
          label: '강사 상세 정보',
          to: '/manager/staff/StaffDetail',
          hidden: true
        },
        {
          label: '강사 현황',
          to: '/manager/staff/StaffState'
        }
        // {
        //   label: '정산 현황',
        //   to: '/manager/staff/StaffSettle'
        // }
      ]
    },
    {
      key: 'option',
      label: '옵션 관리',
      icon: 'mdi-locker',
      to: '',
      isOpen: false,
      children: [
        {
          label: '락커 현황',
          to: '/manager/option/LockerSettings'
        }
      ]
    },
    {
      key: 'sales',
      label: '매출&지출 관리',
      icon: 'mdi-notebook',
      to: '',
      isOpen: false,
      children: [
        {
          label: '매출현황',
          to: '/manager/sales/SalesState'
        },
        {
          label: '회원권 매출',
          to: '/manager/sales/SalesMember'
        },
        {
          label: '수강권 매출',
          to: '/manager/sales/SalesLesson'
        }
        // {
        //   label: '옵션 매출',
        //   to: '/manager/sales/SalesOption'
        // }
        // {
        //   label: '지출&시제 현황',
        //   to: '/manager/sales/ExpenseState'
        // },
        // {
        //   label: '매출 정산 현황',
        //   to: '/manager/sales/SettleState'
        // }
      ]
    },
    {
      key: 'operation',
      label: '운영 관리',
      icon: 'computer',
      to: '',
      isOpen: false,
      children: [
        // {
        //   label: '운영 일정',
        //   to: '/manager/operation/OperationSchedule'
        // },
        // {
        //   label: '기획 현황',
        //   to: '/manager/operation/OperationPlanning'
        // },
        {
          label: '공지 현황',
          to: '/manager/operation/OperationNotice'
        },
        {
          label: '공지 현황 등록',
          to: '/manager/operation/OperationNotice/Editor',
          hidden: true
        },
        {
          label: '공지 현황 - 게시물',
          to: '/manager/operation/OperationNotice/Detail',
          hidden: true
        }
        // {
        //   label: 'C.S 현황',
        //   to: '/manager/operation/OperationCS'
        // }
      ]
    },
    // {
    //   key: 'analysis',
    //   label: '분석',
    //   icon: 'mdi-google-analytics',
    //   to: '',
    //   isOpen: false,
    //   children: [
    //     {
    //       label: '회원 분석',
    //       to: '/manager/analysis/MemberAnalysis'
    //     },
    //     {
    //       label: '매출 분석',
    //       to: '/manager/analysis/SalesAnalysis'
    //     }
    //   ]
    // },
    // {
    //   key: 'community',
    //   label: '커뮤니티',
    //   icon: 'forum',
    //   to: '',
    //   isOpen: false,
    //   children: [
    //     {
    //       label: '뽜튜브',
    //       to: '/manager/community/Tube'
    //     }
    //     {
    //       label: '뽜톡',
    //       to: '/manager/community/Talk'
    //     }
    //   ]
    // },
    {
      key: 'setting',
      label: '환경설정',
      icon: 'work',
      to: '',
      isOpen: false,
      children: [
        {
          label: '센터 설정',
          to: '/manager/setting/CenterSetting'
        },
        {
          label: '관리 데이터 설정',
          to: '/manager/setting/ManageDataSetting'
        }
      ]
    }
  ],
  teacherMenu: [],
  userMenu: []
}
