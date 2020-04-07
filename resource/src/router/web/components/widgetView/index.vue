<template>
    <div ref="widget-wrap" class="widget-wrap">
        <ref-line
            :selected-index="selectedIndex"
            :widgets-info="viewData"
            :visible="enable && isLineVisible"
            :update-info="updateInfo"
        >
            <!-- 小部件登入前後顯示判斷 -->
            <template v-for="(widget, index) in viewData">
                <vue-draggable-resizable
                    v-show="[presentStatus, 'all'].includes(widget.present || 'all')"
                    ref="vdr"
                    :key="`${widget.key}-${selectedIndex}`"
                    :parent="true"
                    :prevent-deactivation="true"
                    :active="index === selectedIndex"
                    :w="+widget.w || getSetting(widget.type, 'minw')"
                    :h="+widget.h || getSetting(widget.type, 'minh')"
                    :x="+widget.x"
                    :y="+widget.y"
                    :min-width="getSetting(widget.type, 'minw')"
                    :min-height="getSetting(widget.type, 'minh')"
                    :resizable="widget.resizable === 'Y'"
                    :draggable="widget.draggable === 'Y'"
                    :handles="getSetting(widget.type, 'handles')"
                    :on-drag-start="onDragStart"
                    :z="index"
                    class-name="vdr-widget"
                    drag-cancel=".drag-cancel"
                    @activated="onActivated({ index, type: widget.type, action: 'dragging' })"
                    @dragging="onDragging"
                    @dragstop="onDragstop"
                    @resizing="onResizing"
                >
                    <component
                        :is="widget.type"
                        :is-active="index === selectedIndex"
                        :current-index="index"
                        :widgets-info="viewData"
                        :update-info="updateInfo"
                        :unit="units[widget.category] || null"
                        @update:unit="(value) => { units[widget.category] = value; }"
                    />
                </vue-draggable-resizable>
            </template>
        </ref-line>
        <slot name="append-element" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import VueDraggableResizable from 'vue-draggable-resizable';
import { widgetsData } from './widget/setting';
import refLine from './refLine';

export default {
    components: {
        VueDraggableResizable,
        refLine,
        oneImage: () => import(/* webpackChunkName: 'oneImage' */'./widget/oneImage'),
        oneText: () => import(/* webpackChunkName: 'oneText' */'./widget/oneText'),
        oneTextLink: () => import(/* webpackChunkName: 'oneTextLink' */'./widget/oneTextLink'),
        oneLang: () => import(/* webpackChunkName: 'oneLang' */'./widget/oneLang'),
        oneLangSelect: () => import(/* webpackChunkName: 'oneLangSelect' */'./widget/oneLangSelect'),
        adSlider: () => import(/* webpackChunkName: 'adSlider' */'./widget/adSlider'),
        marqueeNews: () => import(/* webpackChunkName: 'marqueeNews' */'./widget/marqueeNews'),
        oneFlash: () => import(/* webpackChunkName: 'oneFlash' */'./widget/oneFlash'),
        oneJackpot: () => import(/* webpackChunkName: 'oneJackpot' */'./widget/oneJackpot'),
        formLoginAccount: () => import(/* webpackChunkName: 'formLoginAccount' */'./widget/formLoginAccount'),
        formLoginPassword: () => import(/* webpackChunkName: 'formLoginPassword' */'./widget/formLoginPassword'),
        formLoginCaptcha: () => import(/* webpackChunkName: 'formLoginCaptcha' */'./widget/formLoginCaptcha'),
        formLoginSubmit: () => import(/* webpackChunkName: 'formLoginSubmit' */'./widget/formLoginSubmit'),
        formLoginCode: () => import(/* webpackChunkName: 'formLoginCode' */'./widget/formLoginCode')
    },
    props: {
        selectedIndex: {
            type: Number,
            default: -1
        },
        viewData: {
            type: Array,
            default: () => []
        },
        widgetStatus: {
            type: Object,
            default: () => ({})
        },
        enable: {
            type: Boolean,
            default: false
        },
        presentStatus: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isLineVisible: false,
            lockActive: false,
            defStatus: {
                index: -1,
                type: '',
                action: '',
                x: null,
                y: null,
                w: null,
                h: null,
                minw: null,
                minh: null
            },
            units: {
                memLogin: {}
            }
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        })
    },
    created() {
        this.$emit('update:widgetStatus', { ...this.defStatus });
    },
    mounted() {
        if (this.isBackEnd) {
            document.addEventListener('keydown', this.onKeydown);
            document.getElementById('app').addEventListener('mousedown', this.onDeactivated);
        }
    },
    beforeDestroy() {
        if (this.isBackEnd) {
            document.removeEventListener('keydown', this.onKeydown);
            document.getElementById('app').removeEventListener('mousedown', this.onDeactivated);
        }
    },
    methods: {
        /**
         * @method 拖曳開始，回傳 false 表示 disable 狀態
         */
        onDragStart() {
            this.lockActive = true;

            return this.enable;
        },
        onActivated({ index, type, action }) {
            this.$emit('update:selectedIndex', index);

            this.$emit('update:widgetStatus', {
                ...this.widgetStatus,
                index,
                type,
                action,
                x: this.viewData[index].x,
                y: this.viewData[index].y,
                w: this.viewData[index].w,
                h: this.viewData[index].h,
                minw: this.getSetting(type, 'minw'),
                minh: this.getSetting(type, 'minh')
            });
        },
        onDeactivated() {
            // 套件先觸發 onDragStart 再觸發 onActivated，之後會再觸發 onDeactivated
            // 為解決無法 active 的問題，目前先這樣處理
            if (this.lockActive) {
                this.$nextTick(() => {
                    this.lockActive = false;
                });
                return;
            }

            this.$emit('update:selectedIndex', -1);
            this.$emit('update:widgetStatus', { ...this.defStatus });
        },
        onDragging() {
            this.isLineVisible = true;

            // 因套件未使用 ＄nextTick，造成 callback 回傳的 left, top 不正確
            // 因此使用 ＄nextTick 重取定位處理
            this.$nextTick(() => {
                const curWidget = this.$refs.vdr[this.selectedIndex];
                const [x, y] = [curWidget.left, curWidget.top];

                this.$emit('update:widgetStatus', {
                    ...this.widgetStatus,
                    action: 'dragging',
                    x,
                    y
                });

                this.$emit('update:viewData', cloneDeep(this.viewData.map((info, index) => {
                    if (index === this.selectedIndex) {
                        return {
                            ...info,
                            x,
                            y
                        };
                    }
                    return info;
                })));
            });
        },
        onDragstop() {
            this.isLineVisible = false;
        },
        onResizing() {
            // 因套件未使用 ＄nextTick，造成 callback 回傳的 left, top 不正確
            // 因此使用 ＄nextTick 重取定位處理
            this.$nextTick(() => {
                const curWidget = this.$refs.vdr[this.selectedIndex];
                const [x, y, w, h] = [curWidget.left, curWidget.top, curWidget.width, curWidget.height];

                this.$emit('update:widgetStatus', {
                    ...this.widgetStatus,
                    action: 'resizing',
                    x,
                    y,
                    w,
                    h
                });

                this.$emit('update:viewData', cloneDeep(this.viewData.map((info, index) => {
                    if (index === this.selectedIndex) {
                        return {
                            ...info,
                            x,
                            y,
                            w,
                            h
                        };
                    }
                    return info;
                })));
            });
        },
        getSetting(widgetType, attr) {
            const defaultSetting = {
                minw: 30,
                minh: 30,
                handles: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
            };

            try {
                return widgetsData[widgetType].config[attr] || defaultSetting[attr];
            } catch (error) {
                return defaultSetting[attr];
            }
        },
        updateInfo(updateInfo) {
            if (Object.keys(updateInfo).every((key) => this.viewData[this.selectedIndex][key] === updateInfo[key])) {
                return;
            }

            this.$emit('update:viewData', cloneDeep(this.viewData.map((info, index) => {
                if (index === this.selectedIndex) {
                    return {
                        ...info,
                        ...updateInfo
                    };
                }
                return info;
            })));
        },
        onKeydown(e) {
            if (![37, 38, 39, 40].includes(e.keyCode)) {
                return;
            }
            if (this.selectedIndex >= 0) {
                // 防止捲軸移動
                e.preventDefault();

                let move = 1;
                let direction = 'top';

                switch (e.keyCode) {
                    case 37: // left
                        move = -1;
                        direction = 'left';
                        break;
                    case 38: // up
                        move = -1;
                        break;
                    case 39: // right
                        direction = 'left';
                        break;
                    case 40: // down
                    default:
                        break;
                }
                this.updateInfo({ [direction === 'top' ? 'y' : 'x']: +this.viewData[this.selectedIndex][direction === 'top' ? 'y' : 'x'] + move });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.widget-wrap {
    position: relative;
    height: inherit;

    .vdr-widget {
        /deep/ {
            .handle {
                z-index: 10;
            }
        }
    }
}
</style>
