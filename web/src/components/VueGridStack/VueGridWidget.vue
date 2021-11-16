<template>
    <div
        class="grid-stack-item"
        :id="i"
        :data-gs-x="x"
        :data-gs-y="y"
        :data-gs-width="w"
        :data-gs-height="h"
        :data-gs-locked="locked"
        :data-gs-no-move="!moveable"
        :data-gs-no-resize="!resizable"
        :data-gs-auto-position="autoPosition"
    >
        <div class="grid-stack-item-content grid-stack-widget-layout">
            <div class="grid-stack-widget-header">
                <div class="grid-stack-widget-header-title">
                    <span>{{ name }}</span>
                </div>
                <q-btn
                    flat
                    round
                    dense
                    color="white"
                    :icon="isLocked"
                    @click="onClickLockWidget"
                />
                <q-btn
                    flat
                    round
                    dense
                    icon="refresh"
                    color="white"
                    @click="$emit('refresh', i)"
                />
                <q-btn
                    flat
                    round
                    dense
                    icon="close"
                    color="white"
                    @click="$emit('removed', i)"
                />
            </div>
            <div class="grid-stack-widget-contents">
                <widget-contents
                    ref="widgetContents"
                    :options="contents"
                />
            </div>
        </div>
    </div>
</template>

<script>
    // 위젯 컨텐츠 프레임
    import WidgetContents from '@/pages/dashboard/components/WidgetContents'

    export default {
        name: 'VueGridWidget',
        components: {
            WidgetContents
        },
        data() {
            return {
                lockFlag: false
            }
        },
        props: {
            i: {
                type: String,
                required: true
            },
            x: {
                type: [Number, String],
                default: 0,
                required: true
            },
            y: {
                type: [Number, String],
                default: 0,
                required: true
            },
            w: {
                type: [Number, String],
                default: 1
            },
            h: {
                type: [Number, String],
                default: 1
            },
            opts: {
                type: Object,
                default: () => {}
            },
            name: {
                type: String,
                default: 'Default Title'
            },
            locked: {
                type: Boolean,
                default: false
            },
            moveable: {
                type: Boolean,
                default: true
            },
            contents: {
                type: [Object, String],
                default: 'Widget Contents Area'
            },
            resizable: {
                type: Boolean,
                default: true
            },
            autoPosition: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            isLocked() {
                return this.lockFlag ? 'lock_open' : 'lock'
            }
        },
        mounted() {
            this.$el.vue = this
        },
        methods: {
            /**
             * 이름: onClickLockWidget
             * 설명: 대상 위젯을 잠근다. 잠근 상태에서는 이동할 수 없다.
             */
            onClickLockWidget() {
                this.lockFlag = !this.lockFlag
                this.$emit('locked', this.i, this.lockFlag)
            }
        }
    }
</script>

<style scope>
</style>
