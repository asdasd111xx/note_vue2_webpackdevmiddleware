<template>
    <div :class="$style.trust">
        <div :class="$style['main-title']">{{ $text('S_GAMING_RESPONSIBILITY', '博彩责任') }}</div>
        <div :class="$style.content">
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_RESPONSIBILITY_BETTING', '责任博彩') }}</div>
                <p>{{ $text('S_RESPONSIBILITY_BETTING_CONTENT') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_ABOUT_BETTING', '关于博彩') }}</div>
                <p>{{ $text('S_ABOUT_BETTING_CONTENT') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_QUEST_BETTING', '博彩问题问卷表') }}:</div>
                <p>{{ $text('S_QUEST_BETTING_CONTENT_01') }}</p>
                <p>{{ $text('S_QUEST_BETTING_CONTENT_02') }}</p>
                <p>{{ $text('S_QUEST_BETTING_CONTENT_03') }}</p>
                <p>{{ $text('S_QUEST_BETTING_CONTENT_04') }}</p>
                <p>{{ $text('S_QUEST_BETTING_CONTENT_05') }}</p>
                <p>{{ $text('S_QUEST_BETTING_CONTENT_06') }}</p>
                <p>{{ $text('S_QUEST_BETTING_CONTENT_07') }}</p>
                <p>{{ $text('S_QUEST_BETTING_CONTENT_08') }}</p>
                <p>{{ $text('S_QUEST_BETTING_CONTENT_09') }}</p>
                <p>{{ $text('S_QUEST_BETTING_CONTENT_10') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_SUGGEST_PROBLEM') }}：</div>
                <p :class="$style.list">
                    {{ $text('S_GAMBLING_WEBSITE', '心里干预及戒赌组织网址') }}:
                    <br />
                    Gamcare：
                    <a href="www.gamcare.org.uk">www.gamcare.org.uk</a> 0808 8020 133
                    <br />
                    {{ $text('S_GAMBLING_ORGANIZATION', '匿名戒赌组织') }}：
                    <a href="www.gamblersanonymous.org.uk">www.gamblersanonymous.org.uk</a> 08700 50 88 80
                </p>
                <p :class="$style.list">
                    {{ $text('S_SELF_ISOLATION', '自我隔离') }}：
                    <br />
                    {{ $text('S_SELF_ISOLATION_CONTENT_01') }}
                    <br />
                    {{ $text('S_SELF_ISOLATION_CONTENT_02') }}
                    <br />
                    {{ $text('S_SELF_ISOLATION_CONTENT_03') }}
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.trust {
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
.list {
    line-height: 22px;
    font-size: 16px;
    font-weight: 400;
    > a {
        color: rgb(247, 181, 0);
        font-size: 14px;
        text-decoration: none;
        outline: none;
        &:hover {
            color: rgb(249, 196, 51);
        }
    }
    &::before {
        content: ' ';
        display: inline-block;
        width: 11px;
        height: 11px;
        margin-right: 7px;
        line-height: 14px;
        border-radius: 100%;
        background-color: #969696;
    }
}
</style>
