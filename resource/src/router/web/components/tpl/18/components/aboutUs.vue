<template>
    <div :class="$style['about-us']">
        <div :class="$style['main-title']">{{ $text('S_ABOUT_US', '关于我们') }}</div>
        <div :class="$style.content">
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_COMPANY_PROFILE', '公司的简介') }}</div>
                <p>{{ $text('S_COMPANY_PROFILE_CONTENT') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_MILLER_QUALIFICATION', '必博资质') }}</div>
                <p>{{ $text('S_MILLER_QUALIFICATION_CONTENT') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_MILLER_PRODUCT', '必博产品') }}</div>
                <p>{{ $text('S_MILLER_PRODUCT_CONTENT') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_PAY_MODE', '支付方式') }}</div>
                <p>{{ $text('S_PAY_MODE_CONTENT') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_CUSTOMER_SERVICE', '客户服务') }}</div>
                <p>{{ $text('S_CUSTOMER_SERVICE_CONTENT_01') }}：</p>
                <p>{{ $text('S_CUSTOMER_SERVICE_CONTENT_02') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_OUR_SERVICE', '我们的服务') }}</div>
                <p>{{ $text('S_OUR_SERVICE_CONTENT') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_IDEALS_VISIONS', '理想和愿景') }}</div>
                <p>{{ $text('S_IDEALS_VISIONS_CONTENT') }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.about-us {
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
}
.title {
    line-height: 22px;
    color: #333;
    font-size: 16px;
    font-weight: 600;
}
</style>
