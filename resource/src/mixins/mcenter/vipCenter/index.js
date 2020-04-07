import { mapGetters } from 'vuex';
import isNil from 'lodash/isNil';

export default {
    computed: {
        ...mapGetters({
            vipInfo: 'getVip'
        }),
        vip() {
            return {
                ...this.vipInfo,
                upgrade_valid_bet: this.formatToPrice(this.vipInfo.upgrade_valid_bet),
                upgrade_deposit_amount: this.formatToPrice(this.vipInfo.upgrade_deposit_amount)
            };
        },
        vipReplaceInfo() {
            return {
                next: `<span class="${this.$style.important}">${this.vip.next_level_name}</span>`,
                deposit: `<span class="${this.$style.important}">${this.vip.upgrade_deposit_amount}</span>`,
                bet: `<span class="${this.$style.important}">${this.vip.upgrade_valid_bet}</span>`,
                times: `<span class="${this.$style.important}">${this.vip.upgrade_deposit_times}</span>`
            };
        }
    },
    methods: {
        formatToPrice(value) {
            return `${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        },
        textReplace(text, ref = {}) {
            return text.replace(
                /{{(.+?)}}/g,
                // eslint-disable-next-line
                (match, $0) => isNil(ref[$0]) ? '' : ref[$0]
            );
        }
    }
};
