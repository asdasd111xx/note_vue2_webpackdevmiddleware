<template>
    <mobile-container
        :class="$style['container-bg']"
        :header-setting="headerSetting"
    >
        <div slot="content" :class="$style['body-wrap']">
            <!-- banner -->
            <div :class="$style['banner']" />
            <!-- vip 等級選擇 -->
            <ul :class="[$style['vip-rank'], 'clearfix']">
                <li
                    v-for="(item, index) in 10"
                    :key="index"
                    :class="{ [$style.active]: item == selected }"
                    @click="selected = item"
                >
                    <i :class="[$style[`rank-${item}`]]" />
                    <span>VIP{{ item }}</span>
                </li>
            </ul>
            <!-- vip 等級資訊 -->
            <vip-info :info="vipLevelInfo[selected-1]" />
            <!-- 活動規則 -->
            <div :class="$style['activity-rules']">
                <div :class="$style['title']">{{ $text('S_ACTIVITY_RULES', '活动规则') }}</div>
                <ul>
                    <li v-for="(rule, index) in activityRules" :key="index">
                        <i>{{ rule.serialNumber }}</i>
                        <b>{{ rule.title }}</b>
                        <p>{{ rule.text }}</p>
                    </li>
                </ul>
            </div>
            <!-- go to top -->
            <button :class="$style['go-to-top']" @click="scrollToTop" />
        </div>
    </mobile-container>
</template>

<script>
import mobileContainer from '../../common/mobileContainer';
import vipInfo from './vipInfo';

export default {
    components: {
        mobileContainer,
        vipInfo
    },
    data() {
        return {
            selected: 1
        };
    },
    computed: {
        headerSetting() {
            return {
                left: { show: true },
                center: {
                    show: true,
                    typeText: true,
                    text: this.$text('S_VIP_DETAILS_BTN', 'VIP详情')
                },
                right: { show: true }
            };
        },
        vipLevelInfo() {
            return [
                {
                    level: 1,
                    title: 'VIP1-好奇小螺',
                    accumulation: '500',
                    request: '3,000',
                    upgrade: '8'
                },
                {
                    level: 2,
                    title: 'VIP2-初级玩家',
                    accumulation: '2,000',
                    request: '12,000',
                    upgrade: '18'
                },
                {
                    level: 3,
                    title: 'VIP3-倔强青铜',
                    accumulation: '10,000',
                    request: '60,000',
                    upgrade: '38'
                },
                {
                    level: 4,
                    title: 'VIP4-秩序白银',
                    accumulation: '50,000',
                    request: '300,000',
                    upgrade: '88'
                },
                {
                    level: 5,
                    title: 'VIP5-荣耀黄金',
                    accumulation: '200,000',
                    request: '1,200,000',
                    upgrade: '388'
                },
                {
                    level: 6,
                    title: 'VIP6-尊贵铂金',
                    accumulation: '500,000',
                    request: '3,000,000',
                    upgrade: '688'
                },
                {
                    level: 7,
                    title: 'VIP7-永恒钻石',
                    accumulation: '1,200,000',
                    request: '7,200,000',
                    upgrade: '1088'
                },
                {
                    level: 8,
                    title: 'VIP8-至尊星耀',
                    accumulation: '3,000,000',
                    request: '18,000,000',
                    upgrade: '3888'
                },
                {
                    level: 9,
                    title: 'VIP9-最强王者',
                    accumulation: '10,000,000',
                    request: '60,000,000',
                    upgrade: '5888'
                },
                {
                    level: 10,
                    title: 'VIP10-至尊BOSS',
                    accumulation: '30,000,000',
                    request: '180,000,000',
                    upgrade: '18888'
                }
            ];
        },
        activityRules() {
            return [
                {
                    serialNumber: 1,
                    title: '晋升标准',
                    text: '会员的累计存款以及累计投注额达到相应级别的要求，即可在次日24点前晋级相应VIP等级。'
                },
                {
                    serialNumber: 2,
                    title: '晋升顺序',
                    text: 'VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升。'
                },
                {
                    serialNumber: 3,
                    title: '升级礼金',
                    text: '升级礼金在会员达到该会员级别后系统自动派发，每个级别的升级礼金每位会员仅能获得1次。'
                },
                {
                    serialNumber: 4,
                    title: '',
                    text: 'VIP等级活动彩金皆为1倍流水方可进行取款，彩金添加至账号后不予取消。'
                },
                {
                    serialNumber: 5,
                    title: '',
                    text: '出现对打、套利等违返常态游戏规则的行为，将不计有效投注；如投注体育赛事中出现、对冲或对打投注不计、未接受注单/赛果为平时的注单不计；在真人娱乐/电子游艺/对战/彩票游戏投注，无风险投注不计。'
                },
                {
                    serialNumber: 6,
                    title: '',
                    text: '如会员使用一切不正常投注、套利行为，本公司将保留冻结账号盈利及余额等权利。'
                },
                {
                    serialNumber: 7,
                    title: '',
                    text: '每位有效玩家、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑者只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利。'
                },
                {
                    serialNumber: 8,
                    title: '',
                    text: '参与此活动代表完全遵守威尼斯人贵宾厅全部游戏规则【一般条款与规则】。'
                }
            ];
        }
    },
    mounted() {
        window.scrollTo({ top: 0, left: 0 });
    },
    methods: {
        scrollToTop() {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }
};
</script>

<style lang="scss" module>
.body-wrap{
    color: #F8F1EB;
    margin: 43px 0 45px;
    padding-bottom: 20px;

    ul, li {
        padding: 0;
        margin: 0;
        list-style: none;
    }
}

.banner {
    width: 100%;
    height: 140px;
    background: url('/static/image/mobile/tpl/theme3/vip/banner.jpg') center top;
    background-size: cover;
}

.vip-rank {
    li {
        float: left;
        width: 20%;
        text-align: center;
        border-left: 1px solid #272727;
        border-bottom: 1px solid #2f2f2f;
        padding: 10px 0 7px;
        color: #666;
        font-size: 13px;
        position: relative;

        &:first-child, &:nth-child(6) {
            border-left: 0;
        }

        i {
            width: 35px;
            height: 50px;
            margin: 0 auto 8px;
            display: block;
            background-image: url('/static/image/mobile/tpl/theme3/vip/black_1.png');
            background-size: cover;
            position: relative;
            z-index: 10;

            &.rank-2 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_2.png'); }
            &.rank-3 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_3.png'); }
            &.rank-4 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_4.png'); }
            &.rank-5 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_5.png'); }
            &.rank-6 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_6.png'); }
            &.rank-7 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_7.png'); }
            &.rank-8 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_8.png'); }
            &.rank-9 {
                width: 48px;
                background-image: url('/static/image/mobile/tpl/theme3/vip/black_9.png');
            }
            &.rank-10 {
                width: 48px;
                background-image: url('/static/image/mobile/tpl/theme3/vip/black_10.png');
            }
        }

        span {
            position: relative;
            z-index: 10;
        }

        &.active {
            &:after{
                content: '';
                background: url('/static/image/mobile/tpl/theme3/vip/rank_bg.png') center center;
                background-size: 140px;
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 0;
            }

            i {background-image: url('/static/image/mobile/tpl/theme3/vip/gold_1.png'); }
            .rank-2 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_2.png'); }
            .rank-3 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_3.png'); }
            .rank-4 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_4.png'); }
            .rank-5 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_5.png'); }
            .rank-6 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_6.png'); }
            .rank-7 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_7.png'); }
            .rank-8 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_8.png'); }
            .rank-9 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_9.png'); }
            .rank-10 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_10.png'); }

            span {
                color: #fff;
            }
        }
    }
}

.activity-rules {
    color: #f3e4d5;
    font-size: 13px;
    max-width: 85%;
    margin: 0 auto;
    border: 1px solid #edbf6a;
    border-radius: 10px;
    padding: 15px 20px;
    box-sizing: border-box;

    .title {
        font-weight: bold;
        font-size: 15px;
        color: #edbf6a;
        border-bottom: 1px solid #edbf6a;
        padding: 0px 20px 10px;
        margin: 0 -20px 13px;
    }

    i {
        border-radius: 50%;
        width: 18px;
        height: 18px;
        line-height: 18px;
        display: inline-block;
        font-style: normal;
        text-align: center;
        color: #9C6E54;
        background-image: linear-gradient(90deg, #efdfae, #edbf6a);
        margin: 0px 4px 0px 0;
    }

    b {
        color: #9C6E54;
        display: inline-block;
    }

    p {
        margin: 5px 0 0 0;
    }

    li + li {
        margin-top: 15px;
    }
}

.go-to-top {
    width: 70px;
    height: 60px;
    display: block;
    border: 0;
    padding: 0;
    margin: 10px auto 0;
    background: transparent;
    background-image: url('/static/image/mobile/tpl/theme3/vip/back_arrow.png');
    background-size: 100%;

    &:focus {
        outline: 0;
    }
}
</style>
