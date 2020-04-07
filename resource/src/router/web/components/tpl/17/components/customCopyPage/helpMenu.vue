<template>
    <ul :class="$style['menu-wrap']">
        <li
            v-for="(item, index) in list"
            :key="`title-${index}`"
        >
            <div
                :class="[$style['menu-title-wrap'], { [$style.active] : item.title === currentTitle }]"
                @click="$router.push(`/page/${item.content[0].id}`)"
            >
                <span :class="[$style[`icon-${index + 1}`], $style.icon]" />
                <span :class="$style['menu-title']">{{ item.title }}</span>
                <span :class="$style['icon-arrow']" />
            </div>
            <ul v-if="item.title === currentTitle" :class="$style['page-list']">
                <li
                    v-for="items in item.content"
                    :key="`item-${items.id}`"
                    :class="[$style['page-list-item'], { [$style.active] : items.id === currentPage }]"
                    @click="$router.push(`/page/${items.id}`)"
                >
                    <span :class="$style['page-item-circle']" />
                    <span :class="$style['page-item-title']">{{ items.name }}</span>
                </li>
                <li
                    v-if="item.value === 'help'"
                    :class="$style['page-list-item']"
                    @click="actionChangePage({ page: 'ubb', type: 'static' })"
                >
                    <span :class="$style['page-item-circle']" />
                    <span :class="$style['page-item-title']">{{ $text('S_UB_BROWSER', '寰宇浏览器') }}</span>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            currentTitle: '',
            currentPage: ''
        };
    },
    computed: {
        ...mapGetters({
            nowpage: 'getNowpage',
            webInfo: 'getWebInfo'
        }),
        isTestDomain() {
            return this.webInfo.alias.includes('500000');
        },
        list() {
            return [
                // {
                //     title: this.$text('S_NEW_HANDS_HELP', '新手帮助'),
                //     value: 'help',
                //     content: [
                //         {
                //             id: this.isTestDomain ? 30780 : '',
                //             name: this.$text('S_ACCOUNT_OPEN', '开户')
                //         },
                //         {
                //             id: this.isTestDomain ? 30781 : '',
                //             name: this.$text('S_ACCOUNT_DEPOSITE', '存款')
                //         },
                //         {
                //             id: this.isTestDomain ? 30782 : '',
                //             name: this.$text('S_WITHDRAWAL', '提款')
                //         },
                //         {
                //             id: this.isTestDomain ? 30783 : '',
                //             name: this.$text('S_TRANSFER', '转账')
                //         },
                //         {
                //             id: this.isTestDomain ? 30784 : '',
                //             name: this.$text('S_PREFERENTIAL_RULES', '优惠规则')
                //         },
                //         {
                //             id: this.isTestDomain ? 30785 : '',
                //             name: this.$text('S_BROWSER_FORMAT', '浏览器格式')
                //         },
                //         {
                //             id: this.isTestDomain ? 30786 : '',
                //             name: this.$text('S_SPORTS_BETTING_TUTORIAL', '体育投注教程')
                //         },
                //         {
                //             id: this.isTestDomain ? 30787 : '',
                //             name: this.$text('S_ANTI_HIJACKING_TUTORIAL', '防劫持教程')
                //         }
                //     ]
                // },
                // {
                //     title: this.$text('S_GAME_PROBLEM', '游戏问题'),
                //     value: 'game',
                //     content: [
                //         {
                //             id: this.isTestDomain ? 30788 : '',
                //             name: this.$text('S_LOTTERY_ISSUE', '彩票问题')
                //         },
                //         {
                //             id: this.isTestDomain ? 30789 : '',
                //             name: this.$text('S_ESPORTS', '电子竞技')
                //         },
                //         {
                //             id: this.isTestDomain ? 30790 : '',
                //             name: this.$text('S_SPORTS_PROBLEM', '体育问题')
                //         },
                //         {
                //             id: this.isTestDomain ? 30791 : '',
                //             name: this.$text('S_LIVE_PROBLEM', '真人问题')
                //         },
                //         {
                //             id: this.isTestDomain ? 30792 : '',
                //             name: this.$text('S_OTHER_PROBLEM', '其他问题')
                //         }
                //     ]
                // },
                {
                    title: this.$text('S_BUSINESS_AFFAIRS', '企业事务'),
                    value: 'company',
                    content: [
                        {
                            // eslint-disable-next-line
                            id: this.webInfo.alias === '500000' ? 30793 : this.webInfo.alias === '48' ? 10475 : 10507,
                            name: this.$text('S_GAMING_RESPONSIBILITY', '博彩责任')
                        },
                        {
                            // eslint-disable-next-line
                            id: this.webInfo.alias === '500000' ? 30794 : this.webInfo.alias === '48' ? 10476 : 10508,
                            name: this.$text('S_ABOUT_US', '关于我们')
                        },
                        {
                            // eslint-disable-next-line
                            id: this.webInfo.alias === '500000' ? 30795 : this.webInfo.alias === '48' ? 10477 : 10509,
                            name: this.$text('S_RULES_TERMS', '规则与条款')
                        },
                        // {
                        //     // eslint-disable-next-line
                        //     id: this.webInfo.alias === '500000' ? 30796 : this.webInfo.alias === '48' ? 10478 : 10510,
                        //     name: this.$text('S_JOINT_VENTURE_PLAN', '合营计划')
                        // },
                        {
                            // eslint-disable-next-line
                            id: this.webInfo.alias === '500000' ? 30797 : this.webInfo.alias === '48' ? 10480 : 10511,
                            name: this.$text('S_PRIVACY_PROTECTION_RULES', '隐私保护规则')
                        }
                    ]
                },
                {
                    title: this.$text('S_MEMBER_HELP', '会员帮助'),
                    value: 'help',
                    content: [
                        {
                            // eslint-disable-next-line
                            id: this.webInfo.alias === '500000' ? 35207 : this.webInfo.alias === '48' ? 10940 : 10939,
                            name: this.$text('S_CG_PAY', 'CG Pay钱包')
                        }
                    ]
                },
                {
                    title: this.$text('S_CONTACT_US', '联系我们'),
                    value: 'contact',
                    content: [
                        {
                            // eslint-disable-next-line
                            id: this.webInfo.alias === '500000' ? 30798 : this.webInfo.alias === '48' ? 10479 : 10512,
                            name: this.$text('S_CUSTOMER_SERVICE_ONLINE', '在线客服')
                        }
                    ]
                }
            ];
        }
    },
    watch: {
        // eslint-disable-next-line quote-props
        '$route': {
            immediate: true,
            handler() {
                this.list.some((item) => {
                    if (item.content.some((page) => page.id === this.nowpage)) {
                        this.currentTitle = item.title;
                        this.currentPage = this.nowpage;
                        return true;
                    }
                    return false;
                });
            }
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ])
    }
};
</script>

<style lang="scss" module>
.menu-wrap {
    padding-left: 0;
    margin: 0;
    list-style: none;
}

.menu-title-wrap {
    height: 80px;
    line-height: 80px;
    margin-bottom: 5px;
    position: relative;
    color: #364A51;
    background-color: #EAEAEA;
    border-left: 3px solid transparent;
    box-shadow: 2px 2px 20px hsla(0, 0%, 65.9%, .3);
    cursor: pointer;

    &.active {
        color: #C39E51;
        background-color: #F8F8F8;
        border-color: #C39E51;

        .icon-arrow {
            transform: rotate(0deg);
        }

        .icon {
            &-1 {
                background-position: 0px -3px;
            }

            &-2 {
                background-position: -27px -6px;
            }

            &-3 {
                background-position: -56px 0;
            }

            &-4 {
                width: 22px;
                height: 22px;
                background-position: -81px -2px;
            }
        }
    }
}

.menu-title {
    margin-left: 100px;
}

.icon {
    display: block;
    margin-right: 48px;
    position: absolute;
    left: 32px;
    top: 32px;
    background: url('/static/image/tpl/17/copywriting/help_new.png');
    background-repeat: no-repeat;

    &-1 {
        width: 20px;
        height: 20px;
        background-position: 0px -31px;
    }

    &-2 {
        width: 22px;
        height: 15px;
        background-position: -27px -34px;
    }

    &-3 {
        width: 18px;
        height: 25px;
        background-position: -56px -28px;
    }

    &-4 {
        width: 22px;
        height: 22px;
        background-position: -81px -30px;
    }
}

.icon-arrow {
    width: 12px;
    height: 6px;
    line-height: 80px;
    position: absolute;
    right: 44px;
    top: 50%;
    transform: translateY(-50%);
    background: url('/static/image/tpl/17/copywriting/iconRight.png');
    background-repeat: no-repeat;
    transform: rotate(-90deg);
    transition: all 0.3s;
}

.page-list {
    padding-left: 0;
    margin: 0;
    list-style: none;
}

.page-list-item {
    height: 40px;
    line-height: 40px;
    position: relative;
    font-size: 12px;
    color: #647C85;
    background-color: #F7F7F7;
    border-bottom: 1px solid #EAEAEA;
    border-right: 3px solid transparent;
    cursor: pointer;

    &.active {
        background-color: #E2F6FF;
        border-right: 3px solid #C39E51;
    }
}

.page-item-circle {
    display: block;
    width: 4px;
    height: 4px;
    position: absolute;
    left: 36px;
    top: 50%;
    background-color: #647C85;
    transform: translateY(-50%);
    border-radius: 50%;
}

.page-item-title {
    margin-left: 88px;
}
</style>
