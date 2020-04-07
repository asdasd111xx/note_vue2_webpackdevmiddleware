<template>
    <div class="account-pop-vip">
        <div class="member-level-text">
            {{ $t('S_CURRENT_LEVEL') }}：
            <span>
                {{ select.now_level_alias }}
            </span>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div class="prompt-text" v-html="vipText" />
        <!-- eslint-enable vue/no-v-html -->
    </div>
</template>

<script>

export default {
    props: {
        select: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        vipText() {
            let vipText;
            if (!this.select.is_lock) {
                if (this.select.is_max_level) {
                    vipText = this.$t('S_VIP_MAX_LEVEL');
                } else if (this.select.is_achieve) {
                    vipText = this.$text('S_VIP_ACHIEVE', {
                        replace: [{ target: '%s', value: `<span>${this.select.next_level_alias}</span>` }]
                    });
                } else {
                    vipText = this.$text('S_LEVEL_UPGRADE_PROMPT', {
                        replace: [
                            { target: '%S', value: `<span>${this.formatToPrice(this.select.upgrade_valid_bet)}</span>` },
                            { target: '%S', value: `<span>${this.select.upgrade_deposit_times}</span>` },
                            { target: '%S', value: `<span>${this.formatToPrice(this.select.upgrade_deposit_amount)}</span>` },
                            { target: '%s', value: `<span>${this.select.next_level_alias}</span>` }
                        ]
                    });
                }
            }

            return vipText;
        }
    },
    methods: {
        formatToPrice(value) {
            return `${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
    }
};
</script>
