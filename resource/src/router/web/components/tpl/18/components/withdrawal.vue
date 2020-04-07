<template>
    <div :class="$style.withdrawal">
        <div :class="$style['main-title']">提款教程</div>
        <div :class="$style.content">
            <div :class="$style['sub-title']">如何提现</div>
            <div :class="$style.wrap">
                <p>点击导航栏【充值】-->【提现】按钮。</p>
                <p>提现流程：选择一张银行卡--->输入金额-→等待审核到账</p>
                <p :class="$style.note">*注：第一次提现需先绑定银行卡</p>
                <img :src="$getCdnPath('/static/image/tpl/18/about/withdrawal01.png')" />
            </div>
        </div>
        <div :class="$style.content">
            <div :class="$style['sub-title']">APP提现</div>
            <div :class="$style.wrap">
                <p>第一次提现需先绑定银行卡，绑定完成后在个人中心点击【提现】按钮。</p>
                <p>提现流程：选择一张银行卡--->输入金额-→等待审核到账</p>
                <div :class="$style['wrap-item']">
                    <div :class="$style['wrap-item-content']">
                        <p>1.选择一张银行卡</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/withdrawal02-1.png')" />
                    </div>
                    <div :class="$style['wrap-item-content']">
                        <p>2.输入提款金额</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/withdrawal02-2.png')" />
                    </div>
                    <div :class="$style['wrap-item-content']">
                        <p>3.等待审核</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/withdrawal02-3.png')" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.withdrawal {
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
.sub-title {
    line-height: 30px;
    color: #000;
    font-size: 24px;
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
    .note {
        color: rgb(207, 42, 42);
    }
    .wrap-item {
        display: flex;
    }
    .wrap-item-content {
        display: flex;
        flex-direction: column;
        margin-right: 24px;
    }
}
</style>
