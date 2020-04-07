<template>
    <div :class="[$style['widget-list'], 'clearfix']">
        <template v-for="(widget, type) in widgets">
            <div
                :key="type"
                :class="$style['widget-item']"
                @click="addWidget(widget[0].type)"
            >
                <div
                    :class="[$style[`widget-icon-${type}`] || $style['widget-icon'], { [$style['is-disabled']]: widgetDisabled[widget[0].type] }]"
                    @mouseenter="popupItem = type"
                    @mouseleave="popupItem = ''"
                >
                    <template v-if="widget.length > 1">
                        <div :class="$style['more-icon']" />
                        <div v-show="type === popupItem" :class="$style['more-wrap']">
                            <div
                                v-for="widgetInfo in widget"
                                :key="widgetInfo.type"
                                :class="[$style.item, { [$style['is-disabled']]: widgetDisabled[widgetInfo.type] }]"
                                @click.stop="addWidget(widgetInfo.type)"
                            >
                                {{ widgetInfo.name }} +
                            </div>
                        </div>
                    </template>
                </div>
                <span :class="[$style['widget-name'], { [$style['is-disabled']]: widgetDisabled[widget[0].type] }]">{{ widget[0].name }} +</span>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { widgetsData, getWidgetList } from '../../widgetView/widget/setting';

export default {
    props: {
        caseData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            popupItem: ''
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            lang: 'getLang'
        }),
        widgets() {
            return getWidgetList().reduce((init, info) => {
                const { limit } = widgetsData[info.type].config;
                let disabled = false;

                if (limit && limit >= this.counter[info.type]) {
                    disabled = true;
                }

                return {
                    ...init,
                    [info.category]: [
                        ...(init[info.category] || []),
                        { ...info, disabled }
                    ]
                };
            }, {});
        },
        widgetDisabled() {
            return Object.keys(this.widgets).reduce((init, category) => ({
                ...init,
                ...this.widgets[category].reduce((i, info) => ({
                    ...i,
                    [info.type]: info.disabled
                }), {})
            }), {});
        },
        counter() {
            return this.caseData.reduce((init, info) => {
                if (!init[info.type]) {
                    return {
                        ...init,
                        [info.type]: 1
                    };
                }
                return {
                    ...init,
                    [info.type]: init[info.type] + 1
                };
            }, {});
        }
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        addWidget(widgetType) {
            if (!this.isBackEnd || this.widgetDisabled[widgetType]) {
                return;
            }

            const widgetInfo = widgetsData[widgetType];
            const field = { ...widgetInfo.widget };

            field.key = `_${Math.random().toString(36).substr(2, 9)}`;

            Object.keys(widgetInfo.data).forEach((key) => {
                field[key] = {};

                Object.keys(this.lang).forEach((lang) => {
                    field[key][lang] = widgetInfo.data[key];
                });
            });

            // 新加的部件之旗標，後續會移除，不儲存到資料庫
            field.newWidget = true;

            this.$emit('update:caseData', [
                ...this.caseData,
                { ...field }
            ]);
        }
    }
};
</script>

<style lang="scss" module>
.widget-list {
    margin: 0 auto;
    margin-bottom: 12px;
    width: 960px;
}

.widget-item {
    float: left;
    margin-right: 18px;
}

.widget-icon {
    position: relative;
    background-color: #FFF;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    margin: 0 auto 8px;
    width: 50px;
    height: 50px;
    border-radius: 4px;
    border: 1px solid #D7DBE2;
    cursor: pointer;

    &.is-disabled {
        text-decoration: line-through;
        cursor: default;
    }
}

.widget-icon-image {
    composes: widget-icon;
    background-image: url('/static/image/element/widget/ui/list_icon/btn_img.png');
}

.widget-icon-text {
    composes: widget-icon;
    background-image: url('/static/image/element/widget/ui/list_icon/btn_text.png');
}

.widget-icon-lang {
    composes: widget-icon;
    background-image: url('/static/image/element/widget/ui/list_icon/btn_lang.png');
}

.widget-icon-slider {
    composes: widget-icon;
    background-image: url('/static/image/element/widget/ui/list_icon/btn_slider.png');
}

.widget-icon-news {
    composes: widget-icon;
    background-image: url('/static/image/element/widget/ui/list_icon/btn_news.png');
}

.widget-icon-jackpot {
    composes: widget-icon;
    background-image: url('/static/image/element/widget/ui/list_icon/btn_jackpot.png');
}

.widget-name {
    background-color: #FFF;
    display: inline-block;
    width: 82px;
    line-height: 22px;
    text-align: center;
    color: #89909C;
    border-radius: 9px;
    border: 1px solid #D7DBE2;
    font-size: 13px;
    cursor: pointer;

    &.is-disabled {
        text-decoration: line-through;
        cursor: default;
    }
}

.more-icon {
    position: absolute;
    right: 2px;
    bottom: 2px;
    background-image: url('/static/image/element/widget/ui/btn_arrow.png');
    width: 7px;
    height: 7px;
}

.more-wrap {
    position: absolute;
    top: 52px;
    left: 0;
    background-color: #FFF;
    padding: 2px 8px;
    border: 1px solid #D7DBE2;
    border-radius: 9px;
    color: #89909C;
    white-space: nowrap;
    z-index: 5;

    // 擴大點擊區域
    &::before {
        content: '';
        position: absolute;
        top: -4px;
        right: -4px;
        bottom: -4px;
        left: -4px;
    }
}

.item {
    position: relative;
    cursor: pointer;

    &.is-disabled {
        text-decoration: line-through;
        cursor: default;
    }
}
</style>
