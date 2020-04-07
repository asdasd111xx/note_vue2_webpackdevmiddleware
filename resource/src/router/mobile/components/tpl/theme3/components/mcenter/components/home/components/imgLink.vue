<template>
    <div id="imgLink" :class="[$style['link-wrap'], 'clearfix']">
        <div :class="$style.link" @click="linkHandler('newbie')">
            <div :class="$style.title">{{ $text('S_VIP_TASK', '新手任务') }}</div>
            <div :class="$style.intro">{{ $text('S_VIP_TASK_INTRO', '新手有好礼') }}</div>
            <div :class="$style.image">
                <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/link_img01.png')" />
            </div>
        </div>
        <div :class="$style.link" @click="$router.push('/mobile/promotion')">
            <div :class="$style.title">{{ $text('S_VIP_RAKEBACK', '实时返水1.5%') }}</div>
            <div :class="$style.intro">{{ $text('S_VIP_RAKEBACK_INTRO', '现金奖金等你拿') }}</div>
            <div :class="$style.image">
                <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/link_img02.png')" />
            </div>
        </div>
        <div :class="$style.link" @click="linkHandler('deposit')">
            <div :class="$style.title">{{ $text('S_CHECK_IN', '充值签到') }}</div>
            <div :class="$style.intro">{{ $text('S_CHECK_IN_INTRO', '领取丰富大奖') }}</div>
            <div :class="$style.image">
                <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/link_img03.png')" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';

export default {
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            webInfo: 'getWebInfo'
        })
    },
    methods: {
        linkHandler(link) {
            const promoLinkArr = {
                48: {
                    id: '7ec69c696b45d7ba72e14f6d99a421608cfaf88a',
                    newbie: 'https://77boxing398.666uxm.com/newbie',
                    deposit: 'https://77boxing398.666uxm.com/signweekly/deposit'
                },
                50: {
                    id: '7ec69c696b45d7ba72e14f6d99a421608cfaf88a',
                    newbie: 'https://66chile.666uxm.com/newbie',
                    deposit: 'https://66chile.666uxm.com/signweekly/deposit'
                },
                500000: {
                    id: 'cfd0891aaabe79773e75c753b754fc54f45bc8fe',
                    newbie: 'https://wsws.iplay.bet/newbie',
                    deposit: 'https://wsws.iplay.bet/signweekly/deposit'
                }
            };

            const url = `/api/v1/c/link/customize?id=${promoLinkArr[this.webInfo.alias].id}&client_uri=${promoLinkArr[this.webInfo.alias][link]}`;
            ajax({
                method: 'get',
                url,
                errorAlert: false,
                success: (response) => {
                    window.open(response.ret.uri);
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
    .link-wrap {
        margin: 5px auto 0;
        width: 94%;
        .link {
            float: left;
            border-radius: 5px;
            background: #5E5450;
            width: 32%;
            &:first-child,
            &:nth-child(2) {
                margin-right: 2%;
            }
            .title,
            .intro,
            .image {
                margin: 0 auto;
                width: 88%;
            }
            .title {
                margin-top: 4px;
                color: #F8F1EB;
                font-size: 13px;
            }
            .intro {
                color: #9A8D87;
                font-size: 12px;
            }
            .image {
                width: 70%;
                text-align: center;
                img {
                    width: 100%;
                }
            }
        }
    }
</style>
