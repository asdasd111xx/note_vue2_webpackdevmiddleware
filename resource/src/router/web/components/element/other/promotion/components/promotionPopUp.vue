<template>
    <transition name="pop">
        <div :class="$style['promotion-pop-up']" @click.self="$emit('close')">
            <div :class="$style.wrap" :style="wrapBg">
                <div
                    :class="$style.close"
                    :style="closeColor"
                    @click.stop="$emit('close')"
                >
                    <span>×</span>
                </div>
                <div :class="$style.container">
                    <img :src="$getCdnPath(`${cdnDomain}${info.image[curLang]}`)" />
                    <div v-if="+info.join[curLang] && info.connect[curLang]" :class="[$style['countdown-timer-wrap'], 'clearfix']">
                        <countdown-timer
                            :theme="theme"
                            :end="promotion.end_at"
                            :is-show-join="isShowJoin"
                            :class="$style.timer"
                            @join="$emit('join')"
                        />
                    </div>
                    <!-- eslint-disable vue/no-v-html -->
                    <div :class="$style.content" v-html="vHtml" />
                    <!-- eslint-enable vue/no-v-html -->
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';
import countdownTimer from './countdownTimer';

export default {
    components: {
        countdownTimer
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
        theme: {
            type: Number,
            required: true
        },
        isShowJoin: {
            type: Boolean,
            required: true
        },
        promotion: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            text: ''
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        wrapBg() {
            if (this.setting.article['background-style'] === 0) {
                return { 'background-color': '#FFF' };
            }

            return { 'background-color': this.setting.article.color };
        },
        closeColor() {
            if (this.setting.article['button-style'] === 0) {
                return { color: '#CCC' };
            }

            return { color: this.setting.article.button.close.color };
        },
        vHtml() {
            if (this.isBackEnd) {
                return this.content[this.curLang];
            }

            return this.text;
        }
    },
    created() {
        if (this.isBackEnd) {
            return;
        }

        ajax({
            method: 'get',
            url: `/tpl/${this.memInfo.user.domain}${this.content[this.curLang]}`
        }).then((response) => {
            this.text = response;
        });
    }
};
</script>

<style lang="scss" module>
.promotion-pop-up {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.wrap {
    position: absolute;
    top: 10%;
    right: 0;
    bottom: 10%;
    left: 0;
    width: 100%;
    max-width: 940px;
    margin: auto;
    border-radius: 8px;
    background-color: #FFF;
}

.close {
    width: 80px;
    height: 80px;
    line-height: 80px;
    margin: 0 0 0 auto;
    font-size: 40px;
    text-align: center;
    cursor: pointer;
}

.container {
    overflow-y: auto;
    height: calc(100% - 80px);

    > img {
        display: block;
        width: 100%;
        margin-bottom: 20px;
    }
}

.countdown-timer-wrap {
    margin-bottom: 20px;
}

.timer {
    float: right;
    margin-right: 15px;
}

.content {
    padding: 0 34px 28px;
}
</style>
