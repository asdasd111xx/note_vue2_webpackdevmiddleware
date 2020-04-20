<template>
    <div :class="[$style['date-picker-wrap'], 'clearfix']">
        <div :class="$style.wrap">
            <!-- 年份選擇器 -->
            <swiper
                ref="year-picker"
                :options="yearOptions"
                :style="{ overflow: 'visible' }"
            >
                <swiper-slide v-for="value in yearData" :key="value">{{ value }}</swiper-slide>
            </swiper>
        </div>
        <div :class="$style.wrap">
            <!-- 月份選擇器 -->
            <swiper
                ref="month-picker"
                :options="monthOptions"
                :style="{ overflow: 'visible' }"
            >
                <swiper-slide v-for="value in monthData" :key="value">{{ value }}</swiper-slide>
            </swiper>
        </div>
        <div :class="$style.wrap">
            <!-- 日期選擇器 -->
            <swiper
                ref="day-picker"
                :options="dayOptions"
                :style="{ overflow: 'visible' }"
            >
                <swiper-slide v-for="value in dayData" :key="value">{{ value }}</swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    props: {
        // 選擇日期
        date: {
            type: Date,
            required: true
        },
        // 最小限制日期
        minLimit: {
            type: Date,
            required: true
        },
        // 最大限制日期
        maxLimit: {
            type: Date,
            required: true
        }
    },
    data() {
        const date = Vue.moment(this.date);

        return {
            currentYear: date.year(), // 當前年份
            currentMonth: date.month() + 1, // 當前月份
            currentDay: date.date() // 當前日期
        };
    },
    computed: {
        // 最小限制年份
        minLimitYear() {
            return Vue.moment(this.minLimit).year();
        },
        // 最小限制月份
        minLimitMonth() {
            return Vue.moment(this.minLimit).month() + 1;
        },
        // 最小限制日期
        minLimitDay() {
            return Vue.moment(this.minLimit).date();
        },
        // 最大限制年份
        maxLimitYear() {
            return Vue.moment(this.maxLimit).year();
        },
        // 最大限制月份
        maxLimitMonth() {
            return Vue.moment(this.maxLimit).month() + 1;
        },
        // 最大限制日期
        maxLimitDay() {
            return Vue.moment(this.maxLimit).date();
        },
        // 年份資料
        yearData() {
            const years = [];

            for (let i = this.minLimitYear; i <= this.maxLimitYear; i += 1) {
                years.push(i);
            }

            return years;
        },
        // 月份資料
        monthData() {
            const months = [];

            if (this.currentYear === this.maxLimitYear) {
                for (let i = this.minLimitMonth; i <= this.maxLimitMonth; i += 1) {
                    months.push(i);
                }
            } else {
                for (let i = 12; this.minLimitMonth <= i; i -= 1) {
                    months.unshift(i);
                }
            }

            return months;
        },
        // 日期資料
        dayData() {
            const days = [];

            if (this.currentMonth === this.maxLimitMonth) {
                for (let i = 1; i <= this.maxLimitDay; i += 1) {
                    days.push(i);
                }
            } else {
                const lastDay = Vue.moment(new Date(this.currentYear, this.currentMonth, 0)).date();

                if (this.currentMonth === this.minLimitMonth) {
                    for (let i = lastDay; this.minLimitDay <= i; i -= 1) {
                        days.unshift(i);
                    }
                } else {
                    for (let i = 1; i <= lastDay; i += 1) {
                        days.push(i);
                    }
                }
            }

            return days;
        },
        options() {
            return {
                direction: 'vertical',
                height: 34,
                centeredSlides: true,
                slideClass: this.$style.date,
                slideActiveClass: this.$style.active
            };
        },
        yearOptions() {
            return {
                ...this.options,
                on: {
                    init: () => {
                        const index = this.yearData.indexOf(this.currentYear);

                        this.$nextTick(() => {
                            this.$refs['year-picker'].$swiper.slideTo(index);
                        });
                    },
                    slideChange: () => {
                        if (!this.$refs['year-picker'].$swiper) {
                            this.setYear(this.yearData.length - 1);
                            return;
                        }
                        this.setYear(this.$refs['year-picker'].$swiper.realIndex);
                    }
                }
            };
        },
        monthOptions() {
            return {
                ...this.options,
                on: {
                    init: () => {
                        const index = this.monthData.indexOf(this.currentMonth);

                        this.$nextTick(() => {
                            this.$refs['month-picker'].$swiper.slideTo(index);
                        });
                    },
                    slideChange: () => {
                        if (!this.$refs['month-picker'].$swiper) {
                            this.setMonth(this.monthData.length - 1);
                            return;
                        }
                        this.setMonth(this.$refs['month-picker'].$swiper.realIndex);
                    }
                }
            };
        },
        dayOptions() {
            return {
                ...this.options,
                on: {
                    init: () => {
                        const index = this.dayData.indexOf(this.currentDay);

                        this.$nextTick(() => {
                            this.$refs['day-picker'].$swiper.slideTo(index);
                        });
                    },
                    slideChange: () => {
                        if (!this.$refs['day-picker'].$swiper) {
                            this.setDay(this.dayData.length - 1);
                            return;
                        }
                        this.setDay(this.$refs['day-picker'].$swiper.realIndex);
                    }
                }
            };
        }
    },
    watch: {
        monthData() {
            const index = this.currentYear === this.maxLimitYear ? this.monthData.length - 1 : 0;

            this.$nextTick(() => {
                this.$refs['month-picker'].$swiper.slideTo(index);
            });
        },
        dayData() {
            const index = this.currentMonth === this.maxLimitMonth ? this.dayData.length - 1 : 0;

            this.$nextTick(() => {
                this.$refs['day-picker'].$swiper.slideTo(index);
            });
        }
    },
    methods: {
        setYear(index) {
            this.currentYear = this.yearData[index];
            this.$emit('update:date', new Date(this.yearData[index], this.currentMonth - 1, this.currentDay));
        },
        setMonth(index) {
            this.currentMonth = this.monthData[index];
            this.$emit('update:date', new Date(this.currentYear, this.monthData[index] - 1, this.currentDay));
        },
        setDay(index) {
            this.currentDay = this.dayData[index];
            this.$emit('update:date', new Date(this.currentYear, this.currentMonth - 1, this.dayData[index]));
        }
    }
};
</script>

<style lang="scss" module>
.date-picker-wrap {
    overflow: hidden;
    position: relative;
    height: 170px;
    padding: 67px 0;
    border-bottom: 1px solid #EEE;
    background-color: #FFF;
}

.wrap {
    float: left;
    width: 33%;
    height: 36px;
    border-top: 1px solid #DDD;
    border-bottom: 1px solid #DDD;

    &:first-child {
        width: 34%;
    }
}

.date {
    overflow: hidden;
    height: 34px;
    line-height: 34px;
    color: #A8A8A8;
    font-size: 20px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.active {
    color: #000;
    font-size: 23px;
}
</style>
