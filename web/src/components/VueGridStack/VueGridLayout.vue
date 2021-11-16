<template>
    <div
        ref="layout"
        class="grid-stack"
    >
        <widget
            v-for="widget in widgets"
            :x="widget.x"
            :y="widget.y"
            :i="widget.i"
            :w="widget.w"
            :h="widget.h"
            :key="widget.i"
            :name="widget.name"
            :locked="widget.lock"
            :moveable="widget.move"
            :contents="widget.contents"
            :resizable="widget.resize"
            :auto-position="widget.position"
            @locked="onLockedWidget"
            @refresh="onRefreshWidget"
            @removed="onRemoveWidget"
        />
    </div>
</template>

<script>
// 그리드 스택 유틸
import {
    makeWidget,
    saveWidgets,
    initWidgets,
    removeWidget,
    lockedWidget,
    createLayout,
    setFreeLayout,
    getGridStackNodes
} from '../libs/gridstack/gridstack.util'

// 위젯 정보
import VueGridWidget from './VueGridWidget'

export default {
    name: 'VueGridLayout',
    components: {
        widget: VueGridWidget
    },
    data() {
        return {}
    },
    props: {
        col: {
            type: Number,
            default: 12
        },
        row: {
            type: Number
        },
        widgets: {
            type: Array,
            default: () => []
        },
        animation: {
            type: Boolean,
            default: false
        },
        freePosition: {
            type: Boolean,
            default: false
        },
        onChangeCallback: {
            type: Function,
            default: () => {}
        },
        addedWidgetHandler: {
            type: Function,
            default: () => {}
        }
    },
    computed: {},
    watch: {
        freePosition (isFree) {
            setFreeLayout(this.$el, isFree)
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            createLayout(this.$el, {
                options: {
                    width: this.col,
                    float: this.freePosition
                },
                changeCallback: this.onChangeCallback
            })
        })
    },
    beforeDestroy() {},
    methods: {
        /**
         * 이름: initWidgets
         * 설명: 등록된 모든 위젯을 제거한다.
         */
        initAllWidgets () {
            initWidgets(this.$el)
        },
        /**
         * 이름: createVueGridLayoutWidgets
         * 설명: VueGridLayout 컴포넌트의 상태값을 초기화한다. 위젯을 완전히 새로 불러오고자 하는 경우, 위젯을 먼저 모델에 추가 후 호출해야한다.
         */
        createVueGridLayoutWidgets () {
            // 전달된 Widget들을 다시 GridStack 위젯으로 생성
            this.$nextTick(() => {
                // 위젯으로 생성
                for (const widget of this.widgets) {
                    const isWidgetMount = document.getElementById(widget.i)

                    if (isWidgetMount) {
                        makeWidget(this.$el, widget.i)
                    }
                }
            })
        },
        /**
         * 이름: serializeWidgets
         * 설명: 레이아웃에 추가된 위젯을 객체화한다.
         */
        serializeWidgets () {
            return saveWidgets(this.$el)
        },
        /**
         * 이름: addNewWidget
         * 설명: 새로운 위젯을 추가한다. 이 메서드를 사용하기 위해서 DOM에 위젯이 먼저 마운트 되어야 한다.
         */
        addNewWidget (widgetId) {
            this.$nextTick(() => {
                makeWidget(this.$el, widgetId)
            })
        },
        /**
         * 이름: onRemoveWidget
         * 설명: 대상 위젯을 삭제한다.
         */
        onRemoveWidget(widgetId) {
            // DOM에서 ID로 위젯 DOM 찾기
            const targetWidget = document.getElementById(widgetId)

            // GridStack 객체 제거
            removeWidget(this.$el, targetWidget)

            // 모델에서 제거 요청
            this.$emit('removed-widget', widgetId)
        },
        /**
         * 이름: onRefreshWidget
         * 설명: 위젯에서 출력하는 데이터를 새로고침한다.
         */
        onRefreshWidget (widgetId) {
            const dom = document.getElementById(widgetId) || null

            if (dom) {
                dom.vue.$refs.widgetContents.getChartData()
            }
        },
        /**
         * 이름: onLockedWidget
         * 설명: 대상 위젯을 잠근다. 잠김 상태에서 다른 위젯이 해당 위젯의 위치로 이동 할 수 없다.
         */
        onLockedWidget(widgetId, lockFlag = false) {
            // DOM에서 ID로 위젯 DOM 찾기
            const targetWidget = document.getElementById(widgetId)

            // 위젯 잠금
            lockedWidget(this.$el, targetWidget, lockFlag)
        }
    }
}
</script>

<style scope>
</style>
