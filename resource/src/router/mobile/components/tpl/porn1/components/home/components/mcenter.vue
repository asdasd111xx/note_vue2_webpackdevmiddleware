<template>
    <div :class="$style.wrap">
        <div :class="$style.container">
            <div
                v-for="item in list"
                :key="item.name"
                :class="$style.link"
                @click="goMcenter(item.name)"
            >
                <img v-if="item.name === 'grade'" :src="$getCdnPath(`/static/image/mobile/tpl/porn1/home/vip_${vipLevel}.png`)" />
                <img v-else :src="$getCdnPath(`/static/image/mobile/tpl/porn1/home/${item.name}.png`)" />
                <span v-if="item.name === 'grade' && currentLevel > 10" :class="$style.level">{{ currentLevel }}</span>
                <span :class="$style.name">{{ item.text }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileLinkOpen from '@/lib/mobile_link_open';
import mcenter from '@/api/mcenter';

export default {
    data() {
        return {
            list: [
                {
                    name: 'deposit',
                    text: this.$text('S_DEPOSIT', '充值')
                },
                {
                    name: 'balanceTrans',
                    text: this.$text('S_TRANSDER', '转帐')
                },
                {
                    name: 'withdraw',
                    text: this.$text('S_WITHDRAWAL_TEXT', '提现')
                },
                {
                    name: 'server',
                    text: this.$text('S_SERVIEC', '客服')
                },
                {
                    name: 'accountVip',
                    text: this.$text('S_VIP', 'VIP')
                },
                {
                    name: 'grade',
                    text: this.$text('S_LEVEL', '等级')
                }
            ],
            currentLevel: 0
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            onlineService: 'getOnlineService'
        }),
        vipLevel() {
            return this.currentLevel <= 10 ? this.currentLevel : 'max';
        }
    },
    created() {
        if (!this.loginStatus) {
            return;
        }

        mcenter.vipUserDetail({
            success: ({ ret }) => {
                this.currentLevel = ret.find((item) => item.complex).now_level_seq;
            }
        });
    },
    methods: {
        goMcenter(path) {
            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            if (path === 'grade') {
                return;
            }

            if (path === 'server') {
                if (!this.onlineService.url) {
                    return;
                }

                mobileLinkOpen({ linkType: 'static', linkTo: 'service' });
                return;
            }

            this.$router.push(`/mobile/mcenter/${path}`);
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.wrap {
    width: 95%;
    height: 48px;
    margin: 25px auto 0;
    border: 1px solid #646464;
    border-radius: 6px;;
    background: #1C1C1C;
}

.container {
    text-align: center;
}

.link {
    display: inline-block;
    margin-left: 5%;
    position: relative;
    text-align: center;
    transform: translateY(-15px);

    &:first-child {
        margin-left: 0;
    }

    img {
        display: block;
        width: 37px;
        height: 37px;
    }

    .name {
        font-size: 12px;
        color: #818181;
    }

    .level {
        position: absolute;
        left: 50%;
        top: 9px;
        font-size: 12px;
        color: #C07F1B;
        transform: translateX(-50%);
    }
}


@media screen and (min-width: $phone) {
    .wrap {
        height: 60px;
        margin: 35px auto 0;
        border-radius: 7px;
    }

    .link {
        margin-left: 6%;
        transform: translateY(-18px);

        img {
            width: 45px;
            height: 45px;
            margin-bottom: 5px;
        }

        .name {
            font-size: 14px;
        }

        .level {
            top: 13px;
        }
    }
}

@media screen and (min-width: $pad) {
    .wrap {
        height: 100px;
        margin: 45px auto 0;
        border-radius: 10px;
        border-width: 2px;
    }

    .link {
        transform: translateY(-30px);

        img {
            width: 74px;
            height: 74px;
            margin-bottom: 15px;
        }

        .name {
            font-size: 20px;
        }

        .level {
            top: 27px;
            font-size: 14px;
        }
    }
}

@media screen and (max-width: 340px)  {
    .link {
        margin-left: 4%;
    }
}
</style>
