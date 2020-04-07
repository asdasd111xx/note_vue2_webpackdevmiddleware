<template>
    <div :class="[$style[`theme-${theme}`], 'clearfix']">
        <template v-if="isBackEnd || end">
            <div :class="[$style.time, $style.first]">
                <p>{{ time.day }}</p>
                <p>{{ $text('S_DAY', '日') }}</p>
            </div>
            <div :class="$style.time">
                <p>{{ time.hour }}</p>
                <p>{{ $text('S_HOUR', '时') }}</p>
            </div>
            <div :class="$style.time">
                <p>{{ time.minute }}</p>
                <p>{{ $text('S_MINUTE', '分') }}</p>
            </div>
            <div :class="[$style.time, { [$style.last]: loginStatus && !isShowJoin }]">
                <p>{{ time.second }}</p>
                <p>{{ $text('S_SECOND', '秒') }}</p>
            </div>
        </template>
        <template v-if="!loginStatus">
            <div :class="[$style.join, { [$style.first]: !isBackEnd && !end }]" @click="onJoinMember">{{ $text('S_JOIN_MEMBER', '加入会员') }}</div>
        </template>
        <template v-else-if="isShowJoin">
            <div :class="[$style.join, { [$style.first]: !isBackEnd && !end }]" @click="$emit('join')">{{ $text('S_PROMOTION_JOIN_BUTTON', '加入优惠') }}</div>
        </template>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import isMobile from '@/lib/is_mobile';

export default {
    props: {
        theme: {
            type: Number,
            default: 0
        },
        end: {
            type: String,
            default: ''
        },
        isShowJoin: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            now: Math.trunc(new Date().getTime() / 1000),
            interval: null
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus'
        }),
        time: {
            get() {
                if (this.isBackEnd) {
                    return {
                        day: 8, hour: 8, minute: 8, second: 8
                    };
                }

                const end = Date.parse(Vue.moment(this.end).format()) / 1000;
                const result = end - this.now;
                const day = Math.trunc(result / 60 / 60 / 24);
                const hour = Math.trunc(result / 60 / 60) % 24;
                const minute = Math.trunc(result / 60) % 60;
                const second = result % 60;

                return {
                    day, hour, minute, second
                };
            },
            set(value) {
                if (value > Date.parse(Vue.moment(this.end).format()) / 1000 && this.interval) {
                    clearInterval(this.interval);
                    this.now = Date.parse(Vue.moment(this.end).format()) / 1000;
                    return;
                }

                this.now = value;
            }
        }
    },
    created() {
        if (this.isBackEnd) {
            return;
        }

        this.interval = setInterval(() => {
            this.time = Math.trunc(new Date().getTime() / 1000);
        }, 1000);
    },
    beforeDestroy() {
        if (this.isBackEnd || !this.interval) {
            return;
        }

        clearInterval(this.interval);
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        /**
         * 前往加入會員頁
         * @method onJoinMember
         */
        onJoinMember() {
            if (isMobile()) {
                this.$router.push('/mobile/joinmember');
                return;
            }

            this.actionChangePage({ page: 'join', type: '' });
        }
    }
};
</script>

<style lang="scss" module>
.countdown-timer {
    box-sizing: content-box;
    border-radius: 6px;
    text-align: center;
}

.theme-0 {
    composes: countdown-timer;

    .time {
        border-right-color: #FFF;
        background-color: #A8A8B7;
        color: #FFF;
    }

    .join {
        background-color: #74CCFB;
        color: #FFF;

        &:hover {
            background-color: #23AEFA;
        }
    }
}

.theme-1 {
    composes: countdown-timer;

    .time {
        border-right-color: #FFF;
        background-color: #2A2A2A;
        color: #FFF;
    }

    .join {
        background-color: #555;
        color: #FFF;

        &:hover {
            background-color: #000;
        }
    }
}

.theme-2 {
    composes: countdown-timer;

    .time {
        border-right-color: #000;
        background-color: #FFF;
        color: #000;
    }

    .join {
        background-color: #F99;
        color: #FFF;

        &:hover {
            background-color: #FF5959;
        }
    }
}

.time {
    float: left;
    min-width: 28px;
    height: 36px;
    border-right-width: 1px;
    border-right-style: solid;
    padding: 7px 3px;

    p {
        line-height: 18px;
        margin: 0;
        padding: 0;
        font-size: 14px;
    }
}

.join {
    overflow: hidden;
    float: left;
    width: 74px;
    height: 50px;
    line-height: 50px;
    padding: 0 3px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background-color .3s ease;
    cursor: pointer;
}

.first {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.last {
    border-right-width: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
</style>
