<template>
    <div class="top-link clearfix">
        <div class="link-item" @click="onListClick(0)">
            <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_deposit_n.png')" />
            <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_deposit_h.png')" class="is-active" />
            {{ $t('S_ACCOUNT_DEPOSITE') }}
        </div>
        <div class="link-item" @click="onListClick(1)">
            <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_exchange_n.png')" />
            <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_exchange_h.png')" class="is-active" />
            {{ $t('S_TRAN_BALANCE') }}
        </div>
        <div class="link-item" @click="onListClick(2)">
            <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_withdrawals_n.png')" />
            <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_withdrawals_h.png')" class="is-active" />
            {{ $t('S_ACCOUNT_WITHDRAW') }}
        </div>
    </div>
</template>

<script>
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';

export default {
    data() {
        return {
            list: [
                { path: '', pageName: 'deposit' }, // 存款
                { path: '/mobile/mcenter/balanceTrans', pageName: 'bankBalanceTran' }, // 額度轉換
                { path: '/mobile/mcenter/withdraw', pageName: 'withdraw' } // 取款
            ]
        };
    },
    methods: {
        onListClick(listIndex) {
            const item = this.list[listIndex];

            if (item.pageName === 'deposit') {
                this.$depositLink(true);
                return;
            }

            mcenterPageAuthControl(item.pageName).then((response) => {
                if (response && response.status) {
                    this.$router.push(item.path);
                }
            });
        }
    }
};
</script>


<style lang="scss" src="../css/topLink.scss" scoped></style>
