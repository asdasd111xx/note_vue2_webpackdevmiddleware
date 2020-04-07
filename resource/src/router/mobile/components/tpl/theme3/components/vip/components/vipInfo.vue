<template>
    <div>
        <div :class="$style['card']">
            <i :class="[$style['level'], $style['rank-'+info.level]]" />
            <div :class="$style['main']">
                <div :class="$style['level-title']"><span>{{ $text('S_VIP_LEVEL', 'VIP等级') }}</span>{{ info.title }}</div>
                <div :class="$style['accumulation']"><span>{{ $text('S_ACCUMULATED_DEPOSIT', '累计存款') }}:</span>{{ info.accumulation }}</div>
                <div :class="$style['request']"><span>{{ $text('S_SERIAL_NUMBER', '流水要求') }}:</span>{{ info.request }}</div>
                <div :class="$style['upgrade']"><span>{{ $text('S_UPGRADE_BONUS', '升级奖金') }}:</span>{{ info.upgrade }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    }
};
</script>

<style lang="scss" module>
.card {
    max-width: 275px;
    height: 160px;
    background: url('/static/image/mobile/tpl/theme3/vip/card/bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    margin: 20px auto;
    position: relative;

    .level {
        width: 66px;
        height: 27px;
        background-image: url('/static/image/mobile/tpl/theme3/vip/card/vip1.png');
        background-size: 100%;
        display: block;
        position: absolute;
        right: 4px;
        top: -2px;
        display: block;

        &.rank-2 { background-image: url('/static/image/mobile/tpl/theme3/vip/card/vip2.png'); }
        &.rank-3 { background-image: url('/static/image/mobile/tpl/theme3/vip/card/vip3.png'); }
        &.rank-4 { background-image: url('/static/image/mobile/tpl/theme3/vip/card/vip4.png'); }
        &.rank-5 { background-image: url('/static/image/mobile/tpl/theme3/vip/card/vip5.png'); }
        &.rank-6 { background-image: url('/static/image/mobile/tpl/theme3/vip/card/vip6.png'); }
        &.rank-7 { background-image: url('/static/image/mobile/tpl/theme3/vip/card/vip7.png'); }
        &.rank-8 { background-image: url('/static/image/mobile/tpl/theme3/vip/card/vip8.png'); }
        &.rank-9 { background-image: url('/static/image/mobile/tpl/theme3/vip/card/vip9.png'); }
        &.rank-10 { background-image: url('/static/image/mobile/tpl/theme3/vip/card/vip10.png'); }
    }

    .main {
        color: #583f2d;
        padding: 30px 20px 0;

        span {
            display: inline-block;
            vertical-align: middle;
            margin: 0 10px 0 0;
        }

        .level-title {
            color: #f3e4d5;
            margin: 0 0 10px 0;
        }

        div {
            font-size: 13px;

            & + div {
                margin-top: 7px;
            }
        }
    }
}
</style>
