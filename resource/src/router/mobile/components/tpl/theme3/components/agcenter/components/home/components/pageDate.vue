<template>
    <div :class="$style.date">{{ $text('S_TIME_OF_EAST_US', '美东时间') }}&nbsp;{{ nowDate }}</div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import EST from '@/lib/EST';

export default {
    data() {
        return {
            date: null,
            milli: null,
            timer: null
        };
    },
    computed: {
        ...mapGetters({
            systemTime: 'getSystemTime'
        }),
        nowDate() {
            if (!this.date) {
                return '---';
            }

            return this.date;
        }
    },
    created() {
        this.date = EST(this.systemTime);
        this.milli = +new Date(this.date);
        this.timer = setInterval(() => {
            this.milli += 1000;
            this.date = Vue.moment(this.milli).format('YYYY-MM-DD HH:mm:ss');
        }, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
};
</script>

<style lang="scss" module>
.date {
    line-height: 28px;
    padding: 9px 20px;
    background-color: #272727;
    color: #5C4030;
    font-size: 12px;
    text-align: right;
}
</style>
