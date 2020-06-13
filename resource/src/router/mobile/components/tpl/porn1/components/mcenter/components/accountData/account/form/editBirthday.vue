<template>
    <div :class="[$style['field-editer'], 'clearfix']">
        <div :class="$style['field-title']">{{ $text("S_BIRTHDAY_DATE") }}</div>
        <div :class="$style['input-wrap']">
            <div :class="[$style['field-value'], $style['date-field']]">
                <input v-model="value" type="date" />
                <span>{{ value | dateFormat }}</span>
            </div>
            <div :class="$style['btn-wrap']">
                <span :class="$style['btn-cancel']" @click="$emit('cancel')">
                    {{ $text("S_CANCEL", "取消") }}
                </span>
                <span :class="$style['btn-confirm']" @click="handleSubmit()">
                    {{ $text("S_CONFIRM", "確認") }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { format } from 'date-fns';
import datepickerLang from '@/lib/datepicker_lang';
import mcenter from '@/api/mcenter';

export default {
    data() {
        return {
            value: '',
            dateLang: datepickerLang(this.$i18n.locale)
        };
    },
    computed: {
        ...mapGetters({
            systemTime: 'getSystemTime'
        })
    },
    filters: {
        dateFormat(value) {
            if(value) {
                return Vue.moment(value).format('YYYY年MM月DD日')
            } else {
                return '年 / 月 / 日'
            }
        }
    },
    methods: {
        ...mapActions(['actionSetUserdata']),
        handleSubmit() {
            // 空值驗證
            if (this.value === '') {
                alert(this.$text('S_CR_NUT_NULL'));
                return Promise.resolve('error');
            }

            const valueDate = new Date(this.value);
            const limit = new Date(Vue.moment(this.systemTime).add(-18, 'year'));
            if (valueDate > limit) {
                this.$emit('msg', '年龄未满十八岁,无法游戏');
                return Promise.resolve('error');
            }

            return mcenter.accountDataSet({
                params: {
                    birthday: Vue.moment(this.value).format()
                },
                success: () => {
                    this.$emit('msg', this.$text('S_CR_SUCCESS'));
                    this.$emit('cancel');
                    this.actionSetUserdata(true);
                },
                fail: (res) => {
                    this.$emit('msg', res.msg);
                    this.$emit('cancel');
                }
            });
        }
    }

};

</script>

<style src="../../css/index.module.scss" lang="scss" module>
