<template>
    <div :class="$style.privacy">
        <div :class="$style['main-title']">{{ $text('S_PRIVACY_POLICY', '隐私政策') }}</div>
        <div :class="$style.content">
            <div :class="$style['sub-title']">{{ $text('S_PRIVACY_POLICY', '隐私政策') }}</div>
            <div :class="$style.wrap">
                <p>{{ $text('S_PRIVACY_CONTENT_01') }}；</p>
                <p>{{ $text('S_PRIVACY_CONTENT_02') }}。</p>
                <p>{{ $text('S_PRIVACY_CONTENT_03') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_DATA_COLLECTION', '资料收集') }}</div>
                <p>{{ $text('S_DATA_COLLECTION_CONTENT_01') }}。</p>
                <p>{{ $text('S_DATA_COLLECTION_CONTENT_02') }}。</p>
                <p>{{ $text('S_DATA_COLLECTION_CONTENT_03') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_SECURITY_SECRET', '保密性及安全') }}</div>
                <p>{{ $text('S_SECURITY_SECRET_CONTENT') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_WHAT_IS_COOKIE', '什么是Cookie') }}</div>
                <p>{{ $text('S_WHAT_IS_COOKIE_CONTENT') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_CONFIDENTIALITY', '保密') }}</div>
                <p>{{ $text('S_CONFIDENTIALITY_CONTENT') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_USER_CONSENT', '用户同意') }}</div>
                <p>{{ $text('S_USER_CONSENT_CONTENT') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_CHANGE_PRIVACY', '隐私申明的更改') }}</div>
                <p>{{ $text('S_CHANGE_PRIVACY_CONTENT') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_REMARK', '备注') }}</div>
                <p>{{ $text('S_REMARK_CONTENT_01') }}。</p>
                <p>{{ $text('S_REMARK_CONTENT_02') }}。</p>
                <p>{{ $text('S_REMARK_CONTENT_03') }}。</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.privacy {
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
.sub-title {
    line-height: 30px;
    color: #000;
    font-size: 24px;
    font-weight: 400;
}
.title {
    line-height: 22px;
    color: #333;
    font-size: 16px;
    font-weight: 600;
}
</style>
