export default {
  mounted () {
    this.routeKey = _.last(this.$route.path.split('/'))
    this.initVisibleColumns()
  },
  data () {
    return {
      routeKey: void 0,
      rowsSelected: [],
      pagination: {
        sortBy: '',
        rowsPerPage: 20,
        page: 1
      },
      filter: ''
    }
  },
  computed: {
  },
  methods: {
    /**
     * 사용 컬럼 초기화
     * localStorage에 컬럼 정보가 있다면 초기화 수행
     * Component에서 필수적으로 visibleColumns를 가지고 있어야 수행 됨.
     * 만약, visibleColumns가 비어 있고 columns 속성으로 컬럼을 사용할 경우
     * columns의 키 값으로 visibleColumns를 채운다.
     */
    initVisibleColumns () {
      // 컴포넌트에서 visibleColumns를 가지고 있어야 함.
      const key = `${this.routeKey}_${this.$options.name}_columns`
      const columnsStr = window.localStorage.getItem(key)
      if (this.visibleColumns === void 0) return
      let parseList = void 0
      try {
        parseList = JSON.parse(columnsStr)
        if (!_.isArray(parseList)) parseList = []
      } catch (e) {
        parseList = []
      }
      if (parseList.length === 0 && this.columns !== void 0) {
        parseList = _.map(this.columns, o => {
          return o.name
        })
      }
      this.visibleColumns = parseList
    },
    setColumns () {
      const key = `${this.routeKey}_${this.$options.name}_columns`
      if (!this.visibleColumns) return
      window.localStorage.setItem(key, JSON.stringify(this.visibleColumns))
    },
    onSingleRowClick (evt, row) {
      this.rowsSelected = [row]
    },
    onMultiRowClick (evt, row, key = '_id') {
      const index = _.findIndex(this.rowsSelected, o => o[key] === row[key])
      if (index === -1) return this.rowsSelected.push(row)
      this.rowsSelected.splice(index, 1)
    }
  }
}
