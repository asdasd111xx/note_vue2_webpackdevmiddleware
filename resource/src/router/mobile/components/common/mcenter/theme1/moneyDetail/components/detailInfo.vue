<template>
    <div :class="$style['detail-info-wrap']">
        <div :class="$style.amount">
            <span :class="$style.symbol">¥</span>
            <span :class="$style.number">{{ detailInfo.amount }}</span>
        </div>
        <div :class="$style.wrap">
            <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.title">交易类型</div>
                <div :class="$style.text">{{ currentCategory.text }}</div>
            </div>
            <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.title">交易方式</div>
                <div :class="$style.text">{{ opcodeList[detailInfo.opcode] }}</div>
            </div>
            <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.title">交易时间</div>
                <div :class="$style.text">{{ detailInfo.created_at | dateFormat }}</div>
            </div>
            <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.title">订单号码</div>
                <div :class="$style.text">{{ detailInfo.ref_id }}</div>
            </div>
            <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.title">備註</div>
                <div :class="$style.text">{{ detailInfo.memo ? detailInfo.memo : '--' }}</div>
            </div>
        </div>
        <div :class="$style.tips">如需帮助，请 <span @click="$router.push('/mobile/service')">联系客服</span></div>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    filters: {
        dateFormat(date) {
            return Vue.moment(date).utcOffset(-4).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    props: {
        currentCategory: {
            type: Object,
            required: true
        },
        opcodeList: {
            type: Object,
            required: true
        },
        detailInfo: {
            type: Object,
            default: null
        }
    },
    beforeDestroy() {
        this.$emit('update:detailInfo', null);
    }
};
</script>

<style lang="scss" module>
.detail-info-wrap {
    height: calc(100vh - 49px);
    margin-top: 6px;
    padding-top: 32px;
    background-color: #FEFFFE;
}

.amount {
    height: 25px;
    line-height: 25px;
    color: #414655;
    text-align: center;

    > span {
        display: inline-block;
        vertical-align: top;
    }
}

.symbol {
    font-size: 12px;
    transform: translateY(2px);
}

.number {
    font-weight: 700;
    font-size: 22px;
}

.wrap {
    margin: 39px 25px 46px;
}

.detail {
    line-height: 16px;
    margin-bottom: 22px;
}

.title {
    float: left;
    color: #A6A9B2;
    font-size: 14px;
}

.text {
    float: right;
    color: #414655;
    font-size: 14px;
}

.tips {
    color: #A6A9B2;
    font-size: 14px;
    text-align: center;

    > span {
        color: #6AAAF5;
    }
}
</style>
