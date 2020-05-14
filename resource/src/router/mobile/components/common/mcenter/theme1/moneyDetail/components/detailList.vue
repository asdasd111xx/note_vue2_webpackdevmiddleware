<template>
    <div v-if="detailList" :class="$style['detail-list-wrap']">
        <div v-for="(info, date) in detailList" :key="date">
            <div :class="$style['detail-date']">{{ date }}</div>
            <div
                v-for="item in info"
                :key="item.id"
                :class="[$style['detail-wrap'], 'clearfix']"
                @click="onClick(item)"
            >
                <div :class="$style['detail-icon']">
                    <img :src="$getCdnPath(`/static/image/_new/mcenter/moneyDetail/icon_${currentCategory.key}.png`)" />
                </div>
                <div :class="[$style['detail-info'], 'clearfix']">
                    <div :class="$style.wrap">
                        <div class="title-wrap">
                            <span :class="$style.title">{{ currentCategory.text }}</span>
                            <span :class="$style.tips">{{ opcodeList[item.opcode] }}</span>
                        </div>
                        <div :class="$style.time">{{ item.created_at | timeFormat }}</div>
                    </div>
                    <div :class="$style.amount">{{ item.amount }}</div>
                </div>
            </div>
        </div>
    </div>
    <div v-else :class="$style['no-data-wrap']">
        <img :src="$getCdnPath('/static/image/_new/mcenter/moneyDetail/no_data.png')" />
        <div :class="$style.tips">暂时没有新的{{ currentCategory.text }}记录</div>
        <div v-if="currentCategory.key === 'deposit'"
             :class="$style['btn-deposit']"
             @click="$router.push('/mobile/mcenter/deposit')">
             立即充值
        </div>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    filters: {
        timeFormat(date) {
            return Vue.moment(date).utcOffset(-4).format('HH:mm:ss');
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
        detailList: {
            type: Object,
            default: null
        },
        detailInfo: {
            type: Object,
            default: null
        }
    },
    methods: {
        onClick(info) {
            this.$emit('update:detailInfo', info);
            this.$router.push('/mobile/mcenter/moneyDetail/detail');
        }
    }
};
</script>

<style lang="scss" module>
.detail-list-wrap {
    margin-top: 50px;
}

.detail-date {
    height: 35px;
    line-height: 35px;
    padding: 0 14px;
    color: #414655;
    font-weight: 700;
    font-size: 17px;
}

.detail-wrap {
    height: 66px;
    padding-left: 14px;
    background-color: #FEFFFE;
}

.detail-icon {
    float: left;
    width: 30px;
    height: 30px;
    margin: 18px 0;

    > img {
        display: block;
        width: 100%;
    }
}

.detail-info {
    float: right;
    width: calc(100% - 30px - 10px);
    height: 66px;
    padding-right: 8px;
    border-bottom: 1px solid #EEE;
}

.wrap {
    float: left;
    margin: 15px 0 8px;
}

.title {
    line-height: 21px;
    color: #414655;
    font-weight: 700;
    font-size: 16px;
}

.tips {
    line-height: 15px;
    margin-left: 4px;
    color: #A6A9B2;
    font-size: 12px;
}

.time {
    line-height: 14px;
    margin-top: 6px;
    color: #A6A9B2;
    font-size: 12px;
}

.amount {
    float: right;
    line-height: 15px;
    margin: 25px 0;
    padding-right: 22px;
    background: url('/static/image/_new/mcenter/moneyDetail/icon_arrow.png') 100% 50% no-repeat;
    background-size: 15px 15px;
    color: #414655;
    font-weight: 700;
    font-size: 14px;
}

.no-data-wrap {
    width: 180px;
    height: 292px;
    margin: 20% auto 0;

    > img {
        display: block;
        width: 100%;
    }

    .tips {
        line-height: 22px;
        margin: 16px 0 29px;
        color: #A6A9B2;
        font-size: 16px;
        text-align: center;
    }

    .btn-deposit {
        width: 140px;
        height: 45px;
        line-height: 45px;
        margin: 0 auto;
        border-radius: 3px;
        background: linear-gradient(to left, #BD9D7D, #F9DDBD);
        color: #FFF;
        font-weight: 700;
        font-size: 14px;
        text-align: center;
    }
}
</style>
