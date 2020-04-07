<template>
    <div :class="$style['edit-date']">
        <div>
            <span>{{ $text('S_PERIOD', '期间') }}</span>
            <span :class="$style.tips">※{{ $text('S_PERIOD_TIPS', '仅能设定到小时') }}</span>
        </div>
        <flat-pickr-range
            :date.sync="date"
            :date-format="'Y-m-d H'"
            :enable-time="true"
            :class="$style['date-picker']"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import split from 'lodash/split';
import join from 'lodash/join';
import flatPickrRange from '@/components/flatPickrRange';

export default {
    components: {
        flatPickrRange
    },
    props: {
        value: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        }),
        date: {
            get() {
                if (!this.value.date[this.curLang]) {
                    return [];
                }

                return split(this.value.date[this.curLang], ' ~ ');
            },
            set(date) {
                this.$emit('input', {
                    ...this.value,
                    date: {
                        ...this.value.date,
                        [this.curLang]: join(date.map((value) => this.onDateFormat(value)), ' ~ ')
                    }
                });
            }
        }
    },
    methods: {
        /**
         * 日期格式化
         * @method onDateFormat
         * @param {Date} date - 日期
         * @returns {String} 格式化後的日期
         */
        onDateFormat(date) {
            return Vue.moment(date).format('YYYY-MM-DD HH');
        }
    }
};
</script>

<style lang="scss" module>
.edit-date {
    margin: 15px 10px;
}

.tips {
    margin-left: 5px;
    color: #ED797A;
    font-size: 14px;
}

.date-picker {
    width: 100%;
    margin-top: 10px;
    padding: 5px 10px;
}
</style>
