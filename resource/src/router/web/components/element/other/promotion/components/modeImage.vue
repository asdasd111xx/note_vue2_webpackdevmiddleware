<template>
    <div :class="$style['mode-image-wrap']">
        <div v-if="isBackEnd && !isClientShow" :class="$style.mask">
            <img :src="$getCdnPath('/static/image/common/closed_bg.png')" />
            <p>{{ $text('S_CLIENT_OPEN_YET', '会员端尚未开放') }}</p>
        </div>
        <div :class="[$style['mode-image'], 'clearfix']" :style="mainStyle">
            <div :class="[$style['image-wrap'], { [$style['is-pc']]: !isMobile }]" @click="onCheck">
                <img :src="$getCdnPath(`${cdnDomain}${info.image[curLang]}`)" />
            </div>
            <div v-if="!isMobile" :class="[$style['button-wrap'], { [$style['has-join']]: isShowJoin }]">
                <div
                    v-if="isShowJoin"
                    :class="$style.button"
                    :style="joinStyle"
                    @mouseenter="joinHover = true"
                    @mouseleave="joinHover = false"
                    @click="onJoin"
                >
                    <span>{{ $text('S_PROMOTION_JOIN_BUTTON', '加入优惠') }}</span>
                </div>
                <div
                    :class="$style.button"
                    :style="moreStyle"
                    @mouseenter="moreHover = true"
                    @mouseleave="moreHover = false"
                    @click="onCheck"
                >
                    <span>{{ $text('S_PROMOTION_MORE_BUTTON', '查看更多') }}</span>
                </div>
            </div>
        </div>
        <promotion-slide-down
            :active="isCheck"
            :setting="setting"
            :info="info"
            :content="content"
            :theme="setting['timer-style']"
            :is-show-join="isShowJoin"
            :promotion="promotion"
            @join="onJoin"
            @close="onCheck"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as moment from 'moment-timezone';
import split from 'lodash/split';
import { API_PROMOTION_POP, API_PROMOTION_MEM } from '@/config/api';
import ajax from '@/lib/ajax';
import EST from '@/lib/EST';
import isMobile from '@/lib/is_mobile';
import promotionSlideDown from './promotionSlideDown';

export default {
    components: {
        promotionSlideDown
    },
    props: {
        setting: {
            type: Object,
            required: true
        },
        info: {
            type: Object,
            required: true
        },
        content: {
            type: Object,
            required: true
        },
        hasJoined: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            promotion: { end_at: '' },
            isMobile: isMobile(),
            isCheck: false,
            joinHover: false,
            moreHover: false
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus',
            curLang: 'getCurLang'
        }),
        /**
         * 卡片樣式
         * @method mainStyle
         * @returns {object} css 樣式物件
         */
        mainStyle() {
            if (this.setting.card['background-style']) {
                return { 'background-color': this.setting.card.color };
            }

            return { 'background-color': '#FFF' };
        },
        /**
         * 加入優惠按鈕樣式
         * @method joinStyle
         * @returns {object} css 樣式物件
         */
        joinStyle() {
            if (this.setting.card['button-style']) {
                const { button, text } = this.setting.card;
                const bg = this.joinHover ? button.join.hover : button.join.color;
                const color = this.joinHover ? text.join.hover : text.join.color;

                return { 'background-color': bg, color };
            }

            const bg = this.joinHover ? '#A8A8B7' : '#74CCFB';
            const color = this.joinHover ? '#FFF' : '#FFF';

            return { 'background-color': bg, color };
        },
        /**
         * 查看更多按鈕樣式
         * @method moreStyle
         * @returns {object} css 樣式物件
         */
        moreStyle() {
            if (this.setting.card['button-style']) {
                const { button, text } = this.setting.card;
                const bg = this.moreHover ? button.more.hover : button.more.color;
                const color = this.moreHover ? text.more.hover : text.more.color;

                return { 'background-color': bg, color };
            }

            const bg = this.moreHover ? '#A8A8B7' : '#F99';
            const color = this.moreHover ? '#FFF' : '#FFF';

            return { 'background-color': bg, color };
        },
        /**
         * 是否顯示加入優惠按鈕
         * @method isShowJoin
         * @returns {boolean} true or false
         */
        isShowJoin() {
            if (this.isBackEnd) {
                return true;
            }

            if (this.loginStatus) {
                return +this.info.join[this.curLang] && !this.hasJoined;
            }

            return false;
        },
        /**
         * 客端是否顯示此優惠
         * @method isClientShow
         * @returns {boolean} 是否顯示
         */
        isClientShow() {
            const now = moment(EST(new Date(), 'YYYY-MM-DD HH')).tz('Asia/Shanghai');
            const time = split(this.info.date[this.curLang], ' ~ ');

            return now.isBetween(moment(time[0]).tz('Asia/Shanghai'), moment(time[1]).tz('Asia/Shanghai'));
        }
    },
    created() {
        if (this.isBackEnd || !+this.info.join[this.curLang] || !this.info.connect[this.curLang]) {
            return;
        }

        ajax({
            method: 'get',
            url: `${API_PROMOTION_POP}/${this.info.connect[this.curLang]}`
        }).then(({ result, ret }) => {
            if (result !== 'ok') {
                return;
            }

            this.promotion = ret;
        });
    },
    methods: {
        /**
         * 加入優惠
         * @method onJoin
         */
        onJoin() {
            if (this.isBackEnd || !this.loginStatus || this.hasJoined) {
                return;
            }

            ajax({
                method: 'put',
                url: `${API_PROMOTION_MEM}/${this.info.connect[this.curLang]}`
            }).then(({ result }) => {
                if (result !== 'ok') {
                    return;
                }

                this.$emit('update');
            });
        },
        /**
         * 查看更多
         * @method onCheck
         */
        onCheck() {
            if (this.info.link[this.curLang]) {
                window.open(this.info.link[this.curLang], '_blank');
                return;
            }

            if (+this.info.join[this.curLang] && this.info.connect[this.curLang] && this.promotion.status === 'finish') {
                alert(this.$text('S_PROMOTION_END', '活动已结束'));
                return;
            }

            this.isCheck = !this.isCheck;
        }
    }
};
</script>

<style lang="scss" module>
.mode-image-wrap {
    position: relative;
}

.mask {
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0.9);

    > img {
        display: block;
        width: 11%;
        margin: 2.5% auto 10px;
    }

    > p {
        color: #000;
        font-size: 20px;
        text-align: center;
        letter-spacing: 2px;
    }
}

.mode-image {
    position: relative;
    padding: 5px;
}

.image-wrap {
    > img {
        display: block;
        width: 100%;
    }
}

.is-pc {
    width: 85%;
}

.button-wrap {
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 5px;
    left: calc(85% + 5px);
    height: 53px;
    margin: auto;
}

.has-join {
    height: 96px;
}

.button {
    width: 95%;
    margin: 10px auto;
    padding: 7px 0;
    border-radius: 18px;
    text-align: center;
    transition: 0.3s ease;
    cursor: pointer;
}
</style>
