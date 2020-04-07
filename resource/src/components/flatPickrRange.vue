<template>
    <input ref="target" type="text" />
</template>

<script>
import { mapGetters } from 'vuex';
import Flatpickr from 'flatpickr';
import l10n from 'flatpickr/dist/l10n';

/**
 * 共用元件 - 日期選擇器
 * @param {Array} date - 選擇的當前的日期
 * @param {Date} minDate - 可選擇的最小日期
 * @param {Date} maxDate - 可選擇的最大日期
 * @param {String} dateFormat - 日期格式
 * @param {Boolean} enableTime - 是否設定時間
 */
export default {
    props: {
        date: {
            type: Array,
            required: true
        },
        minDate: {
            type: Date,
            default: null
        },
        maxDate: {
            type: Date,
            default: null
        },
        dateFormat: {
            type: String,
            default: 'Y-m-d'
        },
        enableTime: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            fp: null
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        })
    },
    watch: {
        date() {
            this.fp.setDate(this.date);
        }
    },
    mounted() {
        const trans = {
            en: 'en', ja: 'ja', 'zh-cn': 'zh', 'zh-tw': 'zh_tw'
        };
        const lang = trans[this.curLang] || 'zh';
        const shorthand = ['zh', 'zh_tw'].includes(lang) ? ['日', '一', '二', '三', '四', '五', '六'] : l10n[lang].weekdays.shorthand;
        const weekdays = { ...l10n[lang].weekdays, shorthand };

        this.fp = new Flatpickr(this.$refs.target, {
            mode: 'range',
            defaultDate: this.date,
            minDate: this.minDate,
            maxDate: this.maxDate,
            dateFormat: this.dateFormat,
            enableTime: this.enableTime,
            locale: {
                ...l10n[lang],
                weekdays,
                rangeSeparator: ' ~ ',
                firstDayOfWeek: 1
            },
            onClose: (selectedDate) => {
                if (selectedDate.length !== 2) {
                    this.fp.setDate(this.date);
                    return;
                }

                if (selectedDate.length === 2) {
                    this.$emit('update:date', [selectedDate[0], selectedDate[1]]);
                }
            }
        });
    },
    beforeDestroy() {
        if (this.fp) {
            this.fp.destroy();
            this.fp = null;
        }
    }
};
</script>
