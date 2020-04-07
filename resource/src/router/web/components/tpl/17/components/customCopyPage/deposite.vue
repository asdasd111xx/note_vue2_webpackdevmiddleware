<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>如何存款</h3>
            <p>1. 存款前，请确保您已经成功注册成为威尼斯人贵宾厅会员，如未注册，请点击此处进行注册。</p>
            <p>2. 如未开通网上银行，请到当地银行柜台开通网上银行业务。</p>
            <p>3. 存款前请先登录威尼斯人贵宾厅账号——财务中心——存款——选择存款方式。</p>
        </div>
        <div :class="$style['paragraph-item2']">
            <h3>银行卡转账</h3>
            <img :src="$getCdnPath('/static/image/tpl/17/copywriting/deposit01.png')" />
            <p>登录威尼斯人贵宾厅账号——财务中心——存款——银行卡转账；</p>
            <p>登录个人网上银行——转账汇款——复制收款人信息， 填到对应的表单——填写存款金额——附言处填写正确附言代码——存款完成</p>
        </div>
        <div :class="$style['paragraph-item2']">
            <h3>银联支付</h3>
            <img :src="$getCdnPath('/static/image/tpl/17/copywriting/deposit02.png')" />
            <p>填写存款金额——选择相应银行——点击立即存款——按照页面提示登录个人网上银行——存款完成</p>
        </div>
        <div :class="$style['paragraph-item2']">
            <h3>微信极速支付</h3>
            <div :class="[$style['pay-step'], 'clearfix']">
                <div :class="[$style['pay-item'], $style['pay-left']]">
                    <div :class="$style['pay-method']">
                        方式一
                    </div>
                    <h4>扫收款码进行付款</h4>
                    <div :class="$style['swiper-wrap']">
                        <swiper :options="swiperOption">
                            <swiper-slide
                                v-for="(item, index) in paylist.method1"
                                :key="`method1-${index}`"
                            >
                                <img :src="$getCdnPath(item.img)" />
                                <p>
                                    <!-- eslint-disable vue/no-v-html -->
                                    <span v-html="item.content" />
                                    <!-- eslint-enable vue/no-v-html -->
                                </p>
                            </swiper-slide>
                            <div slot="pagination" class="swiper-pagination" />
                            <div slot="button-prev" class="swiper-button-prev" />
                            <div slot="button-next" class="swiper-button-next" />
                        </swiper>
                    </div>
                </div>
                <div :class="$style['pay-item']">
                    <div :class="$style['pay-method']">
                        方式二
                    </div>
                    <h4>扫二维码添加好友进行付款</h4>
                    <div :class="$style['swiper-wrap']">
                        <swiper :options="swiperOption">
                            <swiper-slide
                                v-for="(item, index) in paylist.method2"
                                :key="`method2-${index}`"
                            >
                                <img :src="$getCdnPath(item.img)" />
                                <p>
                                    <!-- eslint-disable vue/no-v-html -->
                                    <span v-html="item.content" />
                                    <!-- eslint-enable vue/no-v-html -->
                                </p>
                            </swiper-slide>
                            <div slot="pagination" class="swiper-pagination" />
                            <div slot="button-prev" class="swiper-button-prev" />
                            <div slot="button-next" class="swiper-button-next" />
                        </swiper>
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style['paragraph-item2']">
            <h3>支付宝极速支付</h3>
            <div :class="[$style['pay-step'], 'clearfix']">
                <div :class="[$style['pay-item'], $style['pay-left']]">
                    <div :class="$style['pay-method']">
                        方式一
                    </div>
                    <h4>扫收款码进行付款</h4>
                    <div :class="$style['swiper-wrap']">
                        <swiper :options="swiperOption">
                            <swiper-slide
                                v-for="(item, index) in paylist.method3"
                                :key="`method3-${index}`"
                            >
                                <img :src="$getCdnPath(item.img)" />
                                <p>
                                    <!-- eslint-disable vue/no-v-html -->
                                    <span v-html="item.content" />
                                    <!-- eslint-enable vue/no-v-html -->
                                </p>
                            </swiper-slide>
                            <div slot="pagination" class="swiper-pagination" />
                            <div slot="button-prev" class="swiper-button-prev" />
                            <div slot="button-next" class="swiper-button-next" />
                        </swiper>
                    </div>
                </div>
                <div :class="$style['pay-item']">
                    <div :class="$style['pay-method']">
                        方式二
                    </div>
                    <h4>扫二维码添加好友进行付款</h4>
                    <div :class="$style['swiper-wrap']">
                        <swiper :options="swiperOption">
                            <swiper-slide
                                v-for="(item, index) in paylist.method4"
                                :key="`method4-${index}`"
                            >
                                <img :src="$getCdnPath(item.img)" />
                                <p>
                                    <!-- eslint-disable vue/no-v-html -->
                                    <span v-html="item.content" />
                                    <!-- eslint-enable vue/no-v-html -->
                                </p>
                            </swiper-slide>
                            <div slot="pagination" class="swiper-pagination" />
                            <div slot="button-prev" class="swiper-button-prev" />
                            <div slot="button-next" class="swiper-button-next" />
                        </swiper>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[$style['paragraph-item2'], $style['paragraph-indent']]">
            <h3>存款常见问题</h3>
            <p>
                没有网银如何充值？<br />
                选择微信支付或支付宝存款，扫一扫即可直接到账。
            </p>
            <p>
                附言是什么？为什么一定要填？<br />
                在您通过转账时，请一定要在备注/附言/悄悄话/用途等处填写附言编码，否则无法自动到账。
            </p>
            <p>
                存款至旧的银行卡账户怎么办？<br />
                每次存款前请登录官网获取最新的银行卡账户，存至旧的银行卡账户将导致存款无法到账。
            </p>
            <p>
                存款一般多久到账？<br />
                填写正确的附言编码，即可实时到账，跨行用户请选择加急或实时到账才能极速到账。
            </p>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
    components: {
        swiper,
        swiperSlide
    },
    data() {
        return {
            paylist: {
                method1: [
                    {
                        img: '/static/image/tpl/17/copywriting/pay1-1.png',
                        content: '步骤1、点击扫一扫，进行扫码'
                    },
                    {
                        img: '/static/image/tpl/17/copywriting/pay1-2.png',
                        content: '步骤2、输入订单金额并点击添加备注（转账金额必须与订单金额一致，否则无法到账）'
                    },
                    {
                        img: '/static/image/tpl/17/copywriting/pay1-3.png',
                        content: '步骤3、添加备注必须填写附言内容，否则无法到账'
                    },
                    {
                        img: '/static/image/tpl/17/copywriting/pay1-4.png',
                        content: '步骤4、点击付款，完成付款操作，立即为您充值（充值到账时间为0-15分钟），如有疑问请联系在线客服'
                    }
                ],
                method2: [
                    {
                        img: '/static/image/tpl/17/copywriting/pay2-1.png',
                        content: '步骤1、添加好友后，点击进行转账'
                    },
                    {
                        img: '/static/image/tpl/17/copywriting/pay2-2.png',
                        content: '步骤2、输入转账金额，务必与订单金额一致（否则无法到账）'
                    },
                    {
                        img: '/static/image/tpl/17/copywriting/pay2-3.png',
                        content: `
                            步骤3、成功转账后，发送会员账号及订单附言，即刻为您充值，充值时间为0-15分钟，
                            <span style="color:#C39E51">注：此微信只提供转账业务，不提供咨询服务，如有疑问请联系在线客服</span>
                        `
                    }
                ],
                method3: [
                    {
                        img: '/static/image/tpl/17/copywriting/pay3-1.png',
                        content: '步骤1、打开支付宝，点击转账'
                    },
                    {
                        img: '/static/image/tpl/17/copywriting/pay3-2.png',
                        content: '步骤2、输入提交订单内支付宝账户，每次转账务必重新提交订单，转账至该订单支付宝账户。切勿直接转账至之前的账号，否则无法到账'
                    },
                    {
                        img: '/static/image/tpl/17/copywriting/pay3-3.png',
                        content: `
                            步骤3、输入订单金额，同时必须在
                            <span style="color:#C39E51">“添加备注”处填入附言及会员账号（否则无法转账）</span>
                        `
                    }
                ],
                method4: [
                    {
                        img: '/static/image/tpl/17/copywriting/pay4-1.png',
                        content: '步骤1、打开支付宝，点击扫一扫，进行扫码'
                    },
                    {
                        img: '/static/image/tpl/17/copywriting/pay4-2.png',
                        content: `
                            步骤2、输入订单金额，同时必须在，
                            <span style="color:#C39E51">“添加备注”处填入附言及会员账号（否则无法转账）</span>
                        `
                    },
                    {
                        img: '/static/image/tpl/17/copywriting/pay4-3.png',
                        content: '步骤3、点击确认转账，完成转账操作'
                    }
                ]
            },
            swiperOption: {
                effect: 'fade',
                loop: true,
                autoplay: {
                    delay: 2800,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination'
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            }
        };
    }
};
</script>

<style lang="scss" module>
.paragraph-item,
.paragraph-item2 {
    margin: 33px 0 60px;

    h3 {
        line-height: 1;
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        color: #C39E51;
    }

    p {
        margin: 8px 0 0;
        line-height: 22px;
        text-align: justify;
        font-size: 12px;
        color: #647C85;
    }
}

.paragraph-item2 {
    margin-top: 60px;
}

.pay-step {
    width: 839px;
    height: 700px;
    margin: 50px auto;
}

.pay-item {
    float: right;
    width: 400px;
    height: 100%;
    position: relative;
    background: #F8F8F8;
    box-shadow: 0 2px 12px 0 #D9D9D9;

    h4 {
        line-height: 1;
        margin: 53px 0 0;
        font-size: 14px;
        font-weight: normal;
        color: #C39E51;
        text-align: center;
    }
}

.pay-left {
    float: left;
}

.pay-method {
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 50%;
    color: #C39E51;
    background: #F8F8F8;
    box-shadow: 0 2px 12px 0 #D9D9D9;
    border-radius: 50%;
    transform: translate(-50%, -50%);
}

.swiper-wrap {
    width: 400px;
    height: calc(100% - 67px);
    margin: 3px auto;
    background-image: url('/static/image/tpl/17/copywriting/phone.png');
    background-repeat: no-repeat;
    background-position: top;
    background-size: 285px 538px;
}

:global {
    .swiper-container {
        height: 100%;
        overflow: initial;

        &:hover {
            .swiper-button-prev,
            .swiper-button-next {
                opacity: 1;
            }
        }

        .swiper-pagination-bullets {
            bottom: 80px;
        }

        .swiper-button-prev,
        .swiper-button-next {
            width: 36px;
            height: 36px;
            top: 45%;
            background-image: url('/static/image/tpl/17/copywriting/right.png');
            background-size: cover;
            opacity: 0;
            transition: all 0.3s;
        }

        .swiper-button-prev {
            transform: rotate(180deg);
        }
    }

    .swiper-slide {
        padding-top: 69px;
        box-sizing: border-box;
        opacity: 0 !important;

        &.swiper-slide-active {
            opacity: 1 !important;
        }
        img {
            display: block;
            margin: 0 auto;
        }

        p {
            width: auto;
            padding: 0 20px;
            line-height: 22px;
            margin: 100px 0 0;
            text-align: center;
            font-size: 12px;

            > span {
                display: inline-block;
                color: #647C85;
                text-align: left;
            }
        }
    }

    .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
    }
}

.paragraph-indent {
    p {
        padding-left: 15px;
    }
}
</style>
