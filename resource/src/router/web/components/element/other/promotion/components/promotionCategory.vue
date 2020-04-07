<template>
    <div
        v-if="isMobile"
        :class="[$style['is-mobile'], { [$style['has-icon']]: category.bottom.length > 0 }, 'clearfix']"
        :style="{ 'background-color': normalStyle['background-color'] }"
    >
        <div
            v-if="category.bottom.length > 0"
            :class="[$style.close, { [$style.active]: isShow }]"
            :style="{ 'border-color': activeStyle.color }"
            @click="onClick"
        >
            <span :class="$style.show" :style="{ 'border-color': activeStyle.closeBtn }" />
            <span :class="$style.hide" :style="{ 'border-color': activeStyle.closeBtn }" />
        </div>
        <div
            v-for="(list, key) in category"
            :key="key"
            :class="[$style[key], { [$style.active]: key === 'bottom' && isShow }, 'clearfix']"
        >
            <div
                v-for="info in list"
                :key="info.key"
                :style="info.key === active ? activeStyle : normalStyle"
                @click="$emit('active', info.key)"
            >
                <span>{{ info.text }}</span>
            </div>
        </div>
    </div>
    <div v-else :class="[$style['is-pc'], 'clearfix']">
        <div
            v-for="info in category"
            :key="info.key"
            :class="$style.category"
            :style="info.key === active ? activeStyle : normalStyle"
            @click="$emit('active', info.key)"
        >
            <span>{{ info.text }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import isMobile from '@/lib/is_mobile';

export default {
    props: {
        setting: {
            type: Object,
            required: true
        },
        active: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isMobile: isMobile(),
            isShow: false
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        }),
        /**
         * 優惠分類
         * @method category
         */
        category() {
            if (this.isMobile) {
                return this.setting['promotion-category'].reduce((init, info, index) => {
                    const result = info[this.curLang] || info['zh-cn'];

                    if (index < 4) {
                        return { ...init, top: [...init.top, result] };
                    }

                    return { ...init, bottom: [...init.bottom, result] };
                }, { top: [], bottom: [] });
            }

            return this.setting['promotion-category'].map((info) => info[this.curLang] || info['zh-cn']);
        },
        /**
         * 分類未選中樣式
         * @method normalStyle
         */
        normalStyle() {
            if (this.setting.category['button-style']) {
                return {
                    'background-color': this.setting.category.button.color,
                    color: this.setting.category.text.color
                };
            }

            return {
                'background-color': '#FFF',
                color: '#000'
            };
        },
        /**
         * 分類被選中樣式
         * @method activeStyle
         */
        activeStyle() {
            if (this.setting.category['button-style']) {
                if (this.isMobile) {
                    return {
                        'border-color': this.setting.category.text.active,
                        'background-color': this.setting.category.button.active,
                        color: this.setting.category.text.active,
                        closeBtn: this.setting.category.text.color
                    };
                }

                return {
                    'background-color': this.setting.category.button.active,
                    color: this.setting.category.text.active
                };
            }

            if (this.isMobile) {
                return {
                    'border-color': '#FFF',
                    'background-color': '#74CCFB',
                    color: '#FFF'
                };
            }

            return {
                'background-color': '#74CCFB',
                color: '#FFF'
            };
        }
    },
    methods: {
        onClick() {
            if (!this.isMobile) {
                return;
            }

            this.isShow = !this.isShow;
        }
    }
};
</script>

<style lang="scss" module>
.is-mobile {
    position: relative;

    &.has-icon {
        padding-right: 40px;
    }

    .close {
        position: absolute;
        top: 7px;
        right: 7px;
        width: 26px;
        height: 26px;
        border-width: 1px;
        border-style: solid;
        border-radius: 5px;

        &.active {
            .show {
                display: none;
            }

            .hide {
                display: block;
            }
        }

        span {
            position: absolute;
            left: 8px;
            width: 8px;
            height: 8px;
            border-style: solid;
            transform: rotate(45deg);
        }
    }

    .show {
        display: block;
        top: 6px;
        border-width: 0 1px 1px 0;
    }

    .hide {
        display: none;
        top: 10px;
        border-width: 1px 0 0 1px;
    }

    .top,
    .bottom {
        width: 100%;

        > div {
            float: left;
            width: 25%;
            height: 40px;
            line-height: 40px;
            padding: 0 3px;
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: transparent;
            text-align: center;
        }
    }

    .bottom {
        display: none;

        &.active {
            display: block;
        }
    }
}

.is-pc {
    padding: 30px 0;

    .category {
        overflow: hidden;
        float: left;
        width: 11.5%;
        height: 40px;
        line-height: 40px;
        margin: 0 0.5%;
        padding: 0 5px;
        border-radius: 20px;
        box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        outline: none;
        cursor: pointer;
    }
}
</style>
