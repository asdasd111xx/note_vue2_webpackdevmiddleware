<template>
    <div :class="$style.terms">
        <div :class="$style['main-title']">{{ $text('S_USER_AGREEMENT', '用户协议') }}</div>
        <div :class="$style.content">
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_USER_AGREEMENT', '用户协议') }}</div>
                <p>{{ $text('S_USER_AGREEMENT_CONTENT') }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.terms {
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
    > p {
        color: #969696;
        font-size: 14px;
        font-weight: 400;
        margin: 23px 0px;
    }
}
.title {
    line-height: 20px;
    color: #000;
    font-size: 24px;
    font-weight: 400;
}
</style>
