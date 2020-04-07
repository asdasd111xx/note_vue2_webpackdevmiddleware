<template>
    <slide-up-down :active="active">
        <div :class="$style['promotion-pop-up']" :style="wrapBg">
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
    </slide-up-down>
</template>

<script>
import { mapGetters } from 'vuex';
import SlideUpDown from 'vue-slide-up-down';
import ajax from '@/lib/ajax';
import countdownTimer from './countdownTimer';

export default {
    components: {
        SlideUpDown,
        countdownTimer
    },
    props: {
        active: {
            type: Boolean,
            required: true
        },
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
    margin-top: 1px;
    padding-top: 20px;
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
