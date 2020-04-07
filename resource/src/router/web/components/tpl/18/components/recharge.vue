<template>
    <div :class="$style.deposit">
        <div :class="$style['main-title']">充值教程</div>
        <div :class="[$style['button-wrap'], 'clearfix']">
            <div
                v-for="info in tabs"
                :key="info.key"
                :class="{ [$style.active]: current === info.key }"
                @click="current = info.key"
            >
                <span>{{ info.name }}</span>
            </div>
        </div>
        <div :class="$style.content">
            <div :class="$style['sub-title']">如何存款</div>
            <div :class="[$style.wrap , $style.list]">
                <p>1.存款前请先确认登录了乐动帐号，电脑版在右上角、 手机APP在【个人中心】点击【充值】按钮；如未注册，请点击右上角注册。</p>
                <p>2. 如未开通网上银行，请到当地银行柜台开通网上银行业务。</p>
                <p>3.登录乐动帐号----点击【充值】按钮-------选择存款方式。</p>
            </div>
            <div v-if="current === 'union-pay'" :class="$style.wrap">
                <div :class="$style['sub-title']">银联扫码</div>
                <p>第一步：选择银联扫码，输入金额.点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay1-01.png')" />
                <p>第二步：点击完下一步之后，会在跳转出新的页面中显示二维码。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay1-02.png')" />
                <p>第三步：打开银行PP，扫码确认付款。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay1-03.png')" />
                <p>第四步：输入支付密码，完成支付</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay1-04.png')" />
                <p>第五步：支付成功，充值到账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay1-05.png')" />
            </div>
            <div v-if="current === 'ali-pay'" :class="$style.wrap">
                <div :class="$style['sub-title']">支付宝支付</div>
                <p>第一步：选择支付宝充值，输入金额，点击下一步</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay2-01.png')" />
                <p>第二步：打开支付宝，点击扫一扫。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay2-02.png')" />
                <p>第三步：在跳转出的页面中，等待15秒左右，点击立即支付。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay2-03.png')" />
                <p>第四步：确认信息后点击下一步，点击确认转账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay2-04.png')" />
                <p>第五步：输入支付密码，完成付款。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay2-05.png')" />
                <p>第六步：支付成功，充值到账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay2-06.png')" />
            </div>
            <div v-if="current === 'weixin-pay'" :class="$style.wrap">
                <div :class="$style['sub-title']">微信支付</div>
                <p>第一步：选择微信支付，输入充值金额，点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay3-01.png')" />
                <p>第二步：打开微信，扫描二维码。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay3-02.png')" />
                <p>第三步：扫码后长按图中二维码。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay3-03.png')" />
                <p>第四步：识别图中二维码，确认信息.点击付款。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay3-04.png')" />
                <p>第五步：确认支付，充值到账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay3-05.png')" />
            </div>
            <div v-if="current === 'bank-card-trans'" :class="$style.wrap">
                <div :class="$style['sub-title']">银行卡转账</div>
                <p>第一步：选择银行卡转账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay4-01.png')" />
                <p>第二步：输入金额点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay4-02.png')" />
                <p>第三步：选择转账银行，输入真实姓名。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay4-03.png')" />
                <p>第四步：点击复制资料，登入转账平台转账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay4-04.png')" />
                <p>第五步：支付成功，充值到账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay4-05.png')" />
            </div>
            <div v-if="current === 'online-union-pay'" :class="$style.wrap">
                <div :class="$style['sub-title']">网银支付</div>
                <p>第一步：选择预设金额或手动填写金额，选择支付银行，点击“下一步”。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay5-01.png')" />
                <p>第二步：选择转账银行，点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay5-02.png')" />
                <p>第三步：在跳转出的页面中，输入存款人姓名，点击“提交”。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay5-03.png')" />
                <p>第四步：登录选择的支付银行。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay5-04.png')" />
                <p>第五步：在转账页面，输入存款信息，确认资料.点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay5-05.png')" />
                <p>第六步：选择认证的方式，输入密码确定付款。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay5-06.png')" />
                <p>第七步：支付成功，充值到账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay5-07.png')" />
            </div>
            <div v-if="current === 'biz-jd-pay'" :class="$style.wrap">
                <div :class="$style['sub-title']">京东支付</div>
                <p>第一步：选择京东支付，输入金额.点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay6-01.png')" />
                <p>第二步：确认金额，打开京东。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay6-02.png')" />
                <p>第三步：扫码二维码支付。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay6-03.png')" />
                <p>第四步：输入支付金额，点击确认支付。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay6-04.png')" />
                <p>第五步：支付成功，充值到账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay6-05.png')" />
            </div>
            <div v-if="current === 'ali-pay-trans'" :class="$style.wrap">
                <div :class="$style['sub-title']">支付宝转账</div>
                <p>第一步：选择支付宝转账，输入金额点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay7-01.png')" />
                <p>第二步：输入支付宝姓名，点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay7-02.png')" />
                <p>第三步：打开手机支付宝，扫描二维码。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay7-03.png')" />
                <p>第四步：利用手机扫描，并依照提示打开飞航模式。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay7-04.png')" />
                <p>第五步：确认付款信息，点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay7-05.png')" />
                <p>第六步：确认付款资料，点击确认转账，充值到账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay7-06.png')" />
            </div>
            <div v-if="current === 'pay-service'" :class="$style.wrap">
                <div :class="$style['sub-title']">快捷支付</div>
                <p>第一步：选择快捷支付，输入金额.点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay8-01.png')" />
                <p>第二步：在跳转的页面中，输入银行卡号，点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay8-02.png')" />
                <p>第三步：输入银行卡支付密码，点击“免费获取”，并输入短信验证码，</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay8-03.png')" />
                <p>第四步：成功转账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay8-04.png')" />
                <p>第五步：支付成功，充值到账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay8-05.png')" />
            </div>
            <div v-if="current === 'union-pay-intl'" :class="$style.wrap">
                <div :class="$style['sub-title']">云闪付</div>
                <p>第一步：择云闪付，输入金额.点击下一步。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay9-01.png')" />
                <p>第二步：打开云闪付扫码。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay9-02.png')" />
                <p>第三步：扫描识别后，确认付款信息.点击付款。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay9-03.png')" />
                <p>第四步：输入支付密码，完成支付。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay9-04.png')" />
                <p>第五步：支付成功，充值到账。</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/pay9-05.png')" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            current: 'union-pay'
        };
    },
    computed: {
        tabs() {
            return [
                {
                    key: 'union-pay',
                    name: '银联扫码'
                },
                {
                    key: 'ali-pay',
                    name: '支付宝支付'
                },
                {
                    key: 'weixin-pay',
                    name: '微信支付'
                },
                {
                    key: 'bank-card-trans',
                    name: '银行卡转账'
                },
                {
                    key: 'online-union-pay',
                    name: '网银支付'
                },
                {
                    key: 'biz-jd-pay',
                    name: '京东支付'
                },
                {
                    key: 'ali-pay-trans',
                    name: '支付宝转账'
                },
                {
                    key: 'pay-service',
                    name: '快捷支付'
                },
                {
                    key: 'union-pay-intl',
                    name: '云闪付'
                }
            ];
        }
    }
};
</script>

<style lang="scss" module>
.deposit {
    width: 100%;
    background-color: #FFF;
}

.main-title {
    line-height: 36px;
    padding: 13px 40px;
    background: url('/static/image/tpl/18/about/bg01.png') 0 0 no-repeat;
    background-size: 100%;
    color: #000;
    font-size: 25px;
    font-weight: 400;
}

.button-wrap {
    margin-top: 20px;
    padding: 0 40px;

    > div {
        float: left;
        width: 80px;
        height: 40px;
        line-height: 38px;
        margin-right: 15px;
        border-width: 1px;
        border-style: solid;
        border-color: #000;
        border-radius: 2px;
        color: #000;
        font-size: 14px;
        font-weight: 700;
        text-align: center;
        outline: none;
        transition: all 0.38s;
        cursor: pointer;

        &:last-child {
            margin-right: 0;
        }

        &.active {
            background-color: rgb(247, 181, 0);
            border-color: rgb(247, 181, 0);
            color: #FFF;
        }
    }
}

.content {
    padding: 12px 40px 80px;
}

.wrap {
    line-height: 20px;
    margin-top: 23px;
    > p {
        color: #969696;
        font-size: 14px;
        font-weight: 400;
        margin: 20px 0px;
    }
    > img {
        display: block;
        width: 100%;
    }
}
.sub-title {
    line-height: 30px;
    margin-bottom: 24px;
    color: #000;
    font-size: 24px;
}
.list {
    padding-bottom: 80px;
}
</style>
