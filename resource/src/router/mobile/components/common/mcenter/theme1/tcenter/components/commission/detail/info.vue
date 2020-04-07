<template>
    <div :class="$style['info-wrap']">
        <div :class="[$style['title'], 'clearfix']">
            <span :class="$style['title-period']">{{ $text('S_PERIOD', '期数') }}&nbsp;{{ period }}</span>
            <span :class="$style['title-state']">{{ $text(state) }}</span>
        </div>
        <div :class="[$style['level-info-wrap'], 'clearfix']">
            <div
                v-for="item in levelList"
                :key="`level-${item.depth}`"
                :class="[$style['level-info-box'], $style[`level-num-${levelList.length}`]]"
            >
                <div :class="[$style['info-title'], $style[`friend-${item.depth}`]]">{{ $text(levelTrans[item.depth]) }}</div>
                <div :class="$style['info-subtitle']">{{ $text('S_COMMISSION_01' ,'佣金') }}</div>
                <div>{{ item.amount | commaFormat }}</div>
                <div :class="$style['info-subtitle']">{{ $text('S_VALID_BET' ,'有效投注') }}</div>
                <div>{{ item.valid_bet | commaFormat }}</div>
            </div>
        </div>
        <div :class="$style['level-total-box']">
            <div :class="[$style['level-total-tr'], 'clearfix']">
                <div :class="$style['info-title']">{{ $text('S_COMMISSION_TOTAL', '佣金总计') }}</div>
                <div :class="$style['info-value']">{{ levelTotle.amount | commaFormat }}</div>
            </div>
            <div :class="[$style['level-total-tr'], 'clearfix']">
                <div :class="$style['info-title']">{{ $text('S_VALID_BET_TOTAL_01', '有效投注总计') }}</div>
                <div :class="$style['info-value']">{{ levelTotle.valid_bet | commaFormat }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        state: {
            type: String,
            required: true
        },
        period: {
            type: String,
            required: true
        },
        levelTrans: {
            type: Object,
            required: true
        },
        levelList: {
            type: Array,
            required: true
        },
        levelTotle: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss" module>
.info-wrap {
    .title {
        height: 32px;
        line-height: 32px;
        background: url("/static/image/mobile/mcenter/bg_header2_iphone8.png") 50% -56px/100% no-repeat #222;

        .title-period {
            float: left;
            padding: 0 10px;
            width: 50%;
            color: #E2C8A0;
        }
        .title-state {
            float: left;
            padding: 0 10px;
            width: 50%;
            color: #9EA5C5;
            text-align: right;
        }
    }
}

.level-num-1 {
    width: 100%;
}
.level-num-2 {
    width: 50%;
}
.level-num-3 {
    width: 33.333%;
}
.level-num-4 {
    width: 25%;
}
.level-num-5 {
    width: 20%;
}

.level-info-box {
    float: left;
    color: #F4D8AF;
    font-size: 12px;
    text-align: center;
    border-right: 1px solid #002963;
    border-bottom: 1px solid #002963;
    background-color: #00347D;

    &:last-child {
        border-right: 0;
    }

    .info-title {
        height: 25px;
        line-height: 25px;
        color: #FFF;
    }
    .info-subtitle {
        color: #ABCDFE;
    }
}

.level-total-tr {
    color: #FFF;
    font-size: 12px;
    border-bottom: 1px solid #002963;
    background-color: #002E6E;

    .info-title {
        float: left;
        padding: 0 10px;
        width: 50%;
    }
    .info-value {
        float: left;
        padding: 0 10px;
        width: 50%;
        text-align: right;
    }
}
</style>
