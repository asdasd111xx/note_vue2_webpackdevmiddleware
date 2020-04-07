<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['page-container']">
            <div :class="$style['main-wrap']">
                <div :class="$style['type-wrap']">
                    <span
                        v-for="type in typeList"
                        :key="type.type"
                        :class="[$style['type-btn'], { [$style.current]: curType === type.type}]"
                        @click="curType = type.type"
                    >
                        <img :class="$style.imgIn" :src="$getCdnPath(`/static/image/tpl/17/customPage/promotions/${type.type}_icon.png`)" />
                        <img :class="$style.imgOut" :src="$getCdnPath(`/static/image/tpl/17/customPage/promotions/${type.type}_icon_hover.png`)" />
                        {{ type.text }}
                    </span>
                </div>
                <div :class="[$style['card-wrap'], 'clearfix']">
                    <div
                        v-for="data in resultPromoData"
                        :key="data.tag"
                        :class="$style['item-wrap']"
                        @click="clickHandler(data)"
                    >
                        <div :class="$style['tag-wrap']">
                            <img :src="$getCdnPath(`/static/image/tpl/17/customPage/promotions/${data.tag}_tag.png`)" />
                        </div>
                        <div :class="$style['img-wrap']">
                            <img :src="$getCdnPath(`/static/image/tpl/17/customPage/promotions/P-${data.promotionType}.jpg`)" />
                        </div>
                        <div :class="$style['text-wrap']">
                            <div :class="$style['card-title']">{{ data.title }}</div>
                            <div :class="$style['card-time']">{{ data.time }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template v-if="popData">
            <div :class="$style.mask" @click="popData = ''" />
            <div :class="$style['pop-wrap']">
                <div :class="$style['pop-container']">
                    <div :class="$style['pop-title']">
                        {{ popTitle }}
                        <img
                            :class="$style['close-btn']"
                            :src="$getCdnPath('/static/image/tpl/17/customPage/promotions/btn_close.png')"
                            @click="popData = ''"
                        />
                    </div>
                    <div :class="$style['pop-content']">
                        <component :is="popData" />
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';

export default {
    components: {
        promotionRebate: () => import(/* webpackChunkName: 'promotionRebate' */'./promotionRebate'),
        promotionBank: () => import(/* webpackChunkName: 'promotionBank' */'./promotionBank'),
        promotionCG: () => import(/* webpackChunkName: 'promotionCG' */'./promotionCG')
    },
    props: {
        changePage: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            typeList: [
                { type: 'all', text: this.$text('S_ALL', '全部') },
                { type: 'live', text: this.$text('S_ALL_LIVE', '真人优惠') },
                { type: 'lottery', text: this.$text('S_ALL_LOTTERY', '彩票优惠') },
                { type: 'casino', text: this.$text('S_ALL_CASINO', '电子优惠') },
                { type: 'other', text: this.$text('S_ALL_OTHER', '其他优惠') }
            ],
            curType: 'all',
            popData: '',
            popTitle: '',
            vipPageId: {
                500000: '32425',
                50: '10525',
                48: '10492'
            }
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        }),
        resultPromoData() {
            return this.promotionsData.filter((data) => data.type.includes(this.curType));
        },
        promotionsData() {
            return [
                {
                    type: ['all', 'live'], tag: 'new', title: '流水闯关', time: '即日起', promotionType: '15', isLink: true, link: 'content4'
                },
                {
                    type: ['all', 'live'], tag: 'new', title: '幸运注单', time: '即日起', promotionType: '16', isLink: true, link: 'content5'
                },
                {
                    type: ['all', 'live'], tag: 'new', title: '超级对子', time: '即日起', promotionType: '17', isLink: true, link: 'content6'
                },
                {
                    type: ['all', 'other'], tag: 'new', title: '打码签到', time: '即日起', promotionType: '14', isLink: true, link: 'wager'
                },
                {
                    type: ['all', 'other'], tag: 'new', title: '充值签到', time: '即日起', promotionType: '13', isLink: true, link: 'deposit'
                },
                {
                    type: ['all', 'other'], tag: 'new', title: '新手任务', time: '即日起', promotionType: '1', isLink: true, link: 'newbie'
                },
                {
                    type: ['all', 'live', 'lottery', 'casino'], tag: 'newMem', title: '综合类首充优惠15%', time: '即日起', promotionType: '5', isLink: true, link: 'content1'
                },
                {
                    type: ['all', 'lottery'], tag: 'newMem', title: '彩票首充优惠30%', time: '即日起', promotionType: '7', isLink: true, link: 'content2'
                },
                // { type: ['all', 'casino'], tag: 'newMem', title: '电子首充优惠100%', time: '即日起', promotionType: '8', isLink: true, link: 'content3' },
                // { type: ['all', 'other'], tag: 'vip', title: 'VIP等級劃分', time: '即日起', promotionType: '9', isLink: false, link: '32425' },
                {
                    type: ['all', 'other'], tag: 'daily', title: '实时返水1.5%', time: '即日起', promotionType: '10', isLink: false, link: '', promoData: 'promotionRebate'
                },
                {
                    type: ['all', 'other'], tag: 'daily', title: '银行卡充值1%優惠', time: '即日起', promotionType: '11', isLink: false, link: '', promoData: 'promotionBank'
                },
                {
                    type: ['all', 'other'], tag: 'new', title: 'CG钱包充值0.5%优惠', time: '即日起', promotionType: '12', isLink: false, link: '', promoData: 'promotionCG'
                }
            ];
        }
    },
    methods: {
        clickHandler(data) {
            if (data.tag === 'vip') {
                this.changePage({ page: this.vipPageId[this.webInfo.alias], type: 'external' });
                return;
            }

            if (data.isLink) {
                this.linkHandler(data.link);
                return;
            }

            this.popTitle = data.title;
            this.popData = data.promoData;
        },
        linkHandler(link) {
            const promoLinkArr = {
                48: {
                    id: '7ec69c696b45d7ba72e14f6d99a421608cfaf88a',
                    newbie: 'https://77boxing398.666uxm.com/newbie',
                    weeklySign: 'https://77boxing398.666uxm.com/WeeklySign',
                    content1: 'https://77boxing398.666uxm.com/Content/1912090001',
                    content2: 'https://77boxing398.666uxm.com/Content/1912090002',
                    // content3: 'https://77boxing398.666uxm.com/Content/1912090003',
                    content4: 'https://77boxing398.666uxm.com/Content/2001160001',
                    content5: 'https://77boxing398.666uxm.com/Content/2001160002',
                    content6: 'https://77boxing398.666uxm.com/Content/2001160003',
                    wager: 'https://77boxing398.666uxm.com/signweekly/wager',
                    deposit: 'https://77boxing398.666uxm.com/signweekly/deposit'
                },
                50: {
                    id: '7ec69c696b45d7ba72e14f6d99a421608cfaf88a',
                    newbie: 'https://66chile.666uxm.com/newbie',
                    weeklySign: 'https://66chile.666uxm.com/WeeklySign',
                    content1: 'https://66chile.666uxm.com/Content/1912090002',
                    content2: 'https://66chile.666uxm.com/Content/1912090003',
                    // content3: 'https://66chile.666uxm.com/Content/1912090004',
                    content4: 'https://66chile.666uxm.com/Content/2001160001',
                    content5: 'https://66chile.666uxm.com/Content/2001160002',
                    content6: 'https://66chile.666uxm.com/Content/2001160003',
                    wager: 'https://66chile.666uxm.com/signweekly/wager',
                    deposit: 'https://66chile.666uxm.com/signweekly/deposit'
                },
                500000: {
                    id: 'cfd0891aaabe79773e75c753b754fc54f45bc8fe',
                    newbie: 'https://wsws.iplay.bet/newbie',
                    weeklySign: 'https://wsws.iplay.bet/WeeklySign',
                    content1: 'https://wsws.iplay.bet/Content/1912090001',
                    content2: 'https://wsws.iplay.bet/Content/1912090002',
                    // content3: 'https://wsws.iplay.bet/Content/1912090003',
                    wager: 'https://wsws.iplay.bet/signweekly/wager',
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
.page-wrap {
    padding-top: 120px;
    background: #F5F7FB url('/static/image/tpl/17/customPage/promotions/bg.png') 0 0 no-repeat;
}

.page-container {
    height: 100%;
    padding: 375px 0 20px;
    background: #F5F7FB url('/static/image/tpl/17/customPage/promotions/banner.png') 50% -36px no-repeat;
}

.main-wrap {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    padding: 40px 45px;
    background-color: #FFF;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);

    &::before,
    &::after {
        position: absolute;
        left: 0;
        width: 100%;
        height: 18px;
        background: url('/static/image/tpl/17/customPage/promotions/bg_wen.png') 0 0 no-repeat;
        content: "";
    }

    &::before {
        top: -7px;
    }

    &::after {
        bottom: -7px;
        transform: rotate(180deg);
    }
}

.type-btn {
    display: inline-block;
    width: 144px;
    height: 48px;
    margin-right: 17px;
    line-height: 48px;
    font-size: 14px;
    text-align: center;
    color: #666;
    background: #FFF;
    box-shadow: 0 5px 12px 0 rgba(197, 197, 197, 0.5);
    border-radius: 25px;
    cursor: pointer;
}

.current,
.type-btn:hover {
    color: #FFF;
    background: linear-gradient(90deg, #F3D382, #955D2C);
    box-shadow: 0 5px 12px 0 rgba(145, 87, 40, 0.5);

    .imgIn {
        display: none;
    }

    .imgOut {
        display: inline-block;
    }
}

.imgIn {
    vertical-align: middle;
    width: 26px;
    height: 24px;
    margin-right: 12px;
}

.imgOut {
    composes: imgIn;
    display: none;
}

.item-wrap {
    position: relative;
    float: left;
    width: 350px;
    height: 284px;
    margin: 32px 30px 0 0;
    box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.1);
    background-color: #FFF;
    border-radius: 10px;
    transition: all .5s ease-in-out;
    cursor: pointer;

    &:nth-child(3n) {
        margin-right: 0;
    }

    &:hover {
        box-shadow: 0 2px 25px 1px rgba(0, 0, 0, 0.4);
        transform: translateY(-10px);

        .img-wrap {
            img {
                transform: scale(1.2);
            }
        }
    }

}

.tag-wrap {
    position: absolute;
    left: 20px;
    top: -4px;
    z-index: 1;
}

.img-wrap {
    height: 213px;
    overflow: hidden;

    >img {
        width: 100%;
        border-radius: 10px 10px 0 0;
        transition: all .5s ease-in-out;
    }
}

.text-wrap {
    height: 70px;
    padding: 17px 19px 0;
    font-size: 14px;
}

.card-title {
    font-weight: 300;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333;
}

.card-time {
    composes: card-title;
    margin-top: 9px;
    color: #999;
}

.promotion-popup {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.3);
}

.mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.5;
    top: 0;
    left: 0;
    z-index: 1000;
}

.pop-wrap {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1001;
}

.pop-container {
    max-width: 960px;
    max-height: 650px;
    margin: 218px auto 0;
    border-radius: 20px;
    background-color: #FFF;
    overflow: hidden;
}

.pop-title {
    position: relative;
    height: 70px;
    line-height: 70px;
    background: linear-gradient(270deg, #955D2C, #F3D382);
    color: #FFF;
    text-align: center;
    font-size: 22px;
    font-weight: 400;
}

.close-btn {
    position: absolute;
    top: 26px;
    right: 16px;
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.pop-content {
    overflow: auto;
    height: calc(100% - 70px);
    max-height: calc(650px - 70px);
    padding: 33px 15px 28px 30px;
}

.mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(21, 20, 22, 0.29);
    z-index: 1;
}
</style>
