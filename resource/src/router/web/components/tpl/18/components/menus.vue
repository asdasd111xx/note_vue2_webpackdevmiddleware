<template>
    <ul class="about-menu">
        <li
            v-for="(info, index) in menuList"
            :key="`menu-${index}`"
            class="about-menu-item"
        >
            <div class="about-menu-title">
                <img
                    :src="$getCdnPath(`/static/image/tpl/18/about/${info.icon}.png`)"
                    width="24"
                    height="24"
                />
                <div>{{ info.title }}</div>
            </div>
            <ul :class="['about-list', { pt10 : info['sub-page'].length < 2}]">
                <li
                    v-for="page in info['sub-page']"
                    :key="page.id[memInfo.user.domain]"
                    :class="['about-list-item', { active : page.id[memInfo.user.domain] === nowpage }]"
                    @click="toPage(page)"
                >
                    <div>{{ page.name }}</div>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            nowpage: 'getNowpage',
            memInfo: 'getMemInfo'
        }),
        menuList() {
            return [
                {
                    title: this.$text('S_ABOUT_US', '关于我们'),
                    icon: 'user-friends',
                    'sub-page': [
                        {
                            id: {
                                500011: 36319,
                                53: 12171,
                                52: 12158
                            },
                            name: this.$text('S_ABOUT_US', '关于我们')
                        }
                    ]
                },
                {
                    title: this.$text('S_BUSINESS_AFFAIRS', '企业事务'),
                    icon: 'file-alt',
                    'sub-page': [
                        {
                            id: {
                                500011: 36323,
                                53: 12175,
                                52: 12162
                            },
                            name: this.$text('S_GAMING_RESPONSIBILITY', '博彩责任')
                        },
                        {
                            id: {
                                500011: 36324,
                                53: 12176,
                                52: 12163
                            },
                            name: this.$text('S_USER_AGREEMENT', '用户协议')
                        },
                        {
                            id: {
                                500011: 36325,
                                53: 12177,
                                52: 12164
                            },
                            name: this.$text('S_TERMS_TREATY', '条款条约')
                        },
                        {
                            id: {
                                500011: 36326,
                                53: 12178,
                                52: 12165
                            },
                            name: this.$text('S_PRIVACY_POLICY', '隐私政策')
                        }
                    ]
                },
                {
                    title: this.$text('S_HELP_CENTER', '帮助中心'),
                    icon: 'question',
                    'sub-page': [
                        {
                            id: {
                                500011: 36327,
                                53: 12179,
                                52: 12166
                            },
                            name: this.$text('S_CG_PAY', 'CG Pay钱包')
                        },
                        {
                            id: 'ubb',
                            type: 'static',
                            name: this.$text('S_UB_BROWSER', '寰宇浏览器')
                        },
                        {
                            id: {
                                500011: 36328,
                                53: 12180,
                                52: 12167
                            },
                            name: this.$text('S_COMMON_QUESTION', '常见问题')
                        }
                    ]
                },
                {
                    title: this.$text('S_CONTACT_US', '联系我们'),
                    icon: 'headphones-alt',
                    'sub-page': [
                        {
                            id: {
                                500011: 36322,
                                53: 12174,
                                52: 12161
                            },
                            name: this.$text('S_CONTACT_US', '联系我们')
                        }
                    ]
                }
            ];
        }
    },
    mounted() {
        const btns = document.querySelectorAll('.about-list-item');
        const startRipple = (e) => {
            const holder = e.currentTarget || e.target;
            const rect = holder.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('div');
            let max;

            if (rect.width === rect.height) {
                max = rect.width * 1.42;
            } else {
                max = Math.sqrt((rect.width * rect.width) + (rect.height * rect.height));
            }

            const size = `${max * 2}px`;

            ripple.style.width = size;
            ripple.style.height = size;
            ripple.style.marginLeft = `${-max + x}px`;
            ripple.style.marginTop = `${-max + y}px`;
            ripple.className = 'ripples';
            holder.appendChild(ripple);

            setTimeout(() => {
                ripple.classList.add('is-held');
            }, 0);

            const handleRelease = function endRipple() {
                document.removeEventListener('mouseup', handleRelease);

                setTimeout(() => {
                    ripple.classList.add('is-done');
                }, 300);

                setTimeout(() => {
                    holder.removeChild(ripple);
                }, 1100);
            };

            document.addEventListener('mouseup', handleRelease);
        };

        btns.forEach((btn) => btn.addEventListener('mousedown', startRipple));
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        toPage(page) {
            let pageType = 'custom';
            if (page.type) {
                pageType = page.type;
            }
            this.actionChangePage({ type: pageType, page: page.id[this.memInfo.user.domain] || page.id });
        }
    }
};
</script>

<style lang="scss" scoped>
.about-menu {
    width: 300px;
    padding-left: 0;
    margin: 0 20px 0 0;
    list-style: none;
}

.about-menu-item {
    border-bottom: 20px solid rgb(226, 226, 226);
    background: rgb(255, 255, 255);
}

.about-menu-title {
    line-height: 51px;
    margin: 0 20px;
    font-size: 16px;
    font-weight: 700;
    color: #333;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(226, 226, 226);
    img {
        margin-left: 10px;
        margin-right: 16px;
    }
}
.about-list {
    padding: 0 0 20px;
    margin: 0;
    list-style: none;
}
.pt10 {
    padding-bottom: 10px;
}
.about-list-item {
    line-height: 26px;
    padding: 8px 0 8px 75px;
    height: 36px;
    font-weight: 400;
    position: relative;
    color: #9298A2;
    cursor: pointer;
    overflow: hidden;

    &:before {
        display: block;
        width: 2px;
        height: 26px;
        position: absolute;
        left: 0;
        top: 50%;
        background: transparent;
        transform: translateY(-50%);
        content: "";
    }

    &:after {
        display: block;
        width: 100%;
        height: 52px;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.15);
        transform: scaleX(0);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0s;
        content: "";
    }

    &:hover {
        font-weight: 700;
    }

    &.active {
        color: rgb(247, 181, 0);

        &:before {
            background: rgb(247, 181, 0);
        }
    }

    /deep/ .ripples {
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: 0;
        background-clip: padding-box;
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        transition: transform 1.1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;

        &.is-held {
            transform: scale(1);
        }

        &.is-done {
            opacity: 0!important;
        }
    }
}
</style>
