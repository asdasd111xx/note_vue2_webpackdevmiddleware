<template>
    <div>
        <div :class="$style['item-wrap']">
            <span>{{ $text('S_WELCOME', '欢迎您') }}，</span>
            <span :class="$style.username" @click="getMcenterPage('accountData')">{{ memInfo.user.username }}</span>
            <img
                v-if="vip.enable"
                :class="$style.img"
                :src="$getCdnPath('/static/image/tpl/customizeHome/48/vip.png')"
                @click="getMcenterPage('vipExclusive')"
            />
            <span>｜</span>
        </div>
        <div :class="$style['item-wrap']">
            <!-- eslint-disable vue/no-v-html -->
            <span
                :class="$style.money"
                @click="getMcenterPage('deposit')"
                v-html="moneyTitle"
            />
            <!-- eslint-enable vue/no-v-html -->
            <span
                v-for="link in linkList"
                :key="link.link"
                :class="$style.link"
                @click="getMcenterPage(link.link)"
            >
                {{ link.text }}
            </span>
            <span>｜</span>
        </div>
        <span :class="$style.msg" @click="getMcenterPage('infoMessage')">{{ $text('S_NEWS', '消息') }}：{{ memInfo.msgCount }}</span>
        <span :class="$style.logout" @click="logout">{{ $text('S_LOGOUT2', '退出登录') }}</span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import member from '@/api/member';

export default {
    data() {
        return {
            linkList: [
                { text: this.$text('S_ACCOUNT_DEPOSITE', '存款'), link: 'deposit' },
                { text: this.$text('S_ACCOUNT_WITHDRAW', '取款'), link: 'withdraw' },
                { text: this.$text('S_TRANSDER', '转帐'), link: 'bankBalanceTran' }
            ]
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            vip: 'getVip'
        }),
        moneyTitle() {
            const moneyTitle = this.$text('S_WALLET', '钱包：%S元');
            const result = moneyTitle.replace('%S', `<span> ${this.memInfo.cash.balance}</span>`);
            return result;
        }
    },
    methods: {
        getMcenterPage(page, firstEnter = false) {
            this.navClicked = true;
            if (page === 'bankRebate') {
                this.actionEnterMCenterThirdPartyLink({ type: 'member', page }).then((pageName) => {
                    if (pageName) {
                        mcenterPageAuthControl(pageName).then((response) => {
                            if (response && response.status) {
                                this.$router.push({ path: `/page/mcenter/${pageName}` });
                                return;
                            }

                            if (firstEnter) {
                                this.$router.push({ path: '/page/mcenter/accountData' });
                            }
                        });
                    }
                });
                return;
            }

            if (page === 'deposit') {
                this.$depositLink(false);
                return;
            }

            mcenterPageAuthControl(page).then((response) => {
                if (response && response.status) {
                    this.$router.push({ path: `/page/mcenter/${page}` });
                    return;
                }

                if (firstEnter) {
                    this.$router.push({ path: '/page/mcenter/accountData' });
                }
            });
        },
        logout() {
            member.logout({
                success: () => {
                    window.location.reload();
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.item-wrap {
    display: inline-block;
}

.username {
    cursor: pointer;

    &:hover {
        color: #FFF;
    }
}

.money {
    margin-right: 14px;
    cursor: pointer;

    span {
        color: #FCAD34;
    }

    &:hover {
        color: #FFF;

        span {
            color: #FCAD34;
        }
    }
}

.link {
    margin-right: 18px;
    cursor: pointer;

    &:hover {
        color: #FFF;
    }
}

.msg {
    margin-right: 28px;
    cursor: pointer;
}

.logout {
    cursor: pointer;

    &:hover {
        color: #FFF;
    }
}

.img {
    width: 15px;
    margin-left: 6px;
    vertical-align: middle;
    cursor: pointer;
}
</style>
