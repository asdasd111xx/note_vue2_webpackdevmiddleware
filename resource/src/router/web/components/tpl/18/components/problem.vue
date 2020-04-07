<template>
    <div :class="$style.problem">
        <div :class="$style['main-title']">{{ $text('S_COMMON_PROBLEM', '常见问题') }}</div>
        <div :class="$style.content">
            <div :class="$style['sub-title']">{{ $text('S_COMMON_PROBLEM', '常见问题') }}</div>
            <div :class="$style.wrap">
                <div :class="$style.title">1.{{ $text('S_COMMON_PROBLEM_01') }}</div>
                <p>{{ $text('S_COMMON_PROBLEM_CONTENT_01') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">2.{{ $text('S_COMMON_PROBLEM_02') }}</div>
                <p>{{ $text('S_COMMON_PROBLEM_CONTENT_02') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">3.{{ $text('S_COMMON_PROBLEM_03') }}</div>
                <p>{{ $text('S_COMMON_PROBLEM_CONTENT_03') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">4.{{ $text('S_COMMON_PROBLEM_04') }}</div>
                <p>{{ $text('S_COMMON_PROBLEM_CONTENT_04') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">5.{{ $text('S_COMMON_PROBLEM_05') }}</div>
                <p>{{ $text('S_COMMON_PROBLEM_CONTENT_05') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">6.{{ $text('S_COMMON_PROBLEM_06') }}</div>
                <p>{{ $text('S_COMMON_PROBLEM_CONTENT_06') }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.problem {
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
