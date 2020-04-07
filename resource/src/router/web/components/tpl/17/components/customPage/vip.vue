<template>
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
                <div :class="$style['rank-dialog']">
                    <i :class="[$style[`rank-${item}`]]" />
                    <span>VIP{{ item }}</span>
                </div>
            </li>
        </ul>
        <!-- vip 等級資訊 -->
        <div :class="$style['card']">
            <div :class="[$style['card-people-bg'], $style['people-' + vipLevelInfo[selected-1].level]]">
                <div :class="$style['card-content']">
                    <i :class="[$style['level'], $style['rank-' + vipLevelInfo[selected-1].level]]" />
                    <div :class="$style['main']">
                        <div :class="$style['level-title']">
                            <span>{{ $text('S_VIP_LEVEL', 'VIP等级') }}</span>
                            {{ vipLevelInfo[selected-1].title }}
                        </div>
                        <div :class="$style['accumulation']">
                            <span>{{ $text('S_ACCUMULATED_DEPOSIT', '累计存款') }}:</span>
                            {{ vipLevelInfo[selected-1].accumulation }}
                        </div>
                        <div :class="$style['request']">
                            <span>
                                {{ $text('S_SERIAL_NUMBER', '流水要求') }}:</span>
                            {{ vipLevelInfo[selected-1].request }}
                        </div>
                        <div :class="$style['upgrade']">
                            <span>{{ $text('S_UPGRADE_BONUS', '升级奖金') }}:</span>
                            {{ vipLevelInfo[selected-1].upgrade }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
</template>

<script>

export default {
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
                    title: '晋升标准：',
                    text: '会员的累计存款以及累计投注额达到相应级别的要求，即可在次日24点前晋级相应VIP等级。'
                },
                {
                    serialNumber: 2,
                    title: '晋升顺序：',
                    text: 'VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升。'
                },
                {
                    serialNumber: 3,
                    title: '升级礼金：',
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
ul, li {
    padding: 0;
    margin: 0 auto;
    list-style: none;
}

.body-wrap {
    background: url('/static/image/mobile/tpl/theme3/vip/vip_bg.jpg') center top no-repeat;
}

.banner {
    width: 100%;
    height: 542px;
    background: url('/static/image/mobile/tpl/theme3/vip/banner.jpg') center top;
    background-size: cover;
}

.vip-rank {
    margin: 40px auto;
    list-style: none;
    max-width: 1200px;

    li {
        float: left;
        width: 10%;
        text-align: center;
        padding: 0 5px;
        color: #666;
        font-size: 16px;
        position: relative;

        .rank-dialog {
            border-radius: 5px;
            position: relative;
            z-index: 10;
            background: linear-gradient(180deg,#ffffff,#f2f2f2);
            padding: 0 0 10px 0;

            i {
                width: 70px;
                height: 100px;
                margin: 0 auto;
                display: block;
                background-image: url('/static/image/mobile/tpl/theme3/vip/black_1.png');
                background-size: cover;
                position: relative;
                top: -6px;

                &.rank-2 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_2.png'); }
                &.rank-3 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_3.png'); }
                &.rank-4 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_4.png'); }
                &.rank-5 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_5.png'); }
                &.rank-6 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_6.png'); }
                &.rank-7 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_7.png'); }
                &.rank-8 { background-image: url('/static/image/mobile/tpl/theme3/vip/black_8.png'); }
                &.rank-9, &.rank-10 {
                    width: 96px;
                    height: 108px;
                    top: -10px;
                    margin-bottom: -8px;
                    background-image: url('/static/image/mobile/tpl/theme3/vip/black_9.png');
                }
                &.rank-10 {
                    background-image: url('/static/image/mobile/tpl/theme3/vip/black_10.png');
                }
            }
        }

        &.active {
            padding: 0;

            .rank-dialog {
                background: url('/static/image/mobile/tpl/theme3/vip/rank_bg.png') center top;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: cover;
                transform: translateY(-20px) scale(1.12);
                height: 172px;
            }

            i {
                top: 15px;
                background-image: url('/static/image/mobile/tpl/theme3/vip/gold_1.png');
                background-size: cover;
                margin: 0 auto 15px;

                &.rank-2 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_2.png'); }
                &.rank-3 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_3.png'); }
                &.rank-4 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_4.png'); }
                &.rank-5 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_5.png'); }
                &.rank-6 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_6.png'); }
                &.rank-7 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_7.png'); }
                &.rank-8 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_8.png'); }
                &.rank-9, &.rank-10 {
                    width: 100px;
                    height: 101px;
                    top: 15px;
                    margin: 0 auto 15px;
                    background-image: url('/static/image/mobile/tpl/theme3/vip/gold_9.png');
                }
                &.rank-10 { background-image: url('/static/image/mobile/tpl/theme3/vip/gold_10.png'); }
            }

            span {
                color: #fff;
            }
        }
    }
}

.card {
    position: relative;
    max-width: 1200px;
    height: 370px;
    display: block;
    background: url('/static/image/mobile/tpl/theme3/vip/card/bg-2.png') 50% 50% no-repeat;
    margin: 0 auto;
}

.card-people-bg {
    position: relative;
    max-width: 440px;
    height: 256px;
    margin: 180px auto 0;

    &:before {
        content: '';
        width: 300px;
        height: 400px;
        position: absolute;
        z-index: 5;
        right: 100%;
        margin: -70px -120px 0 0;
    }

    &:after {
        content: '';
        width: 300px;
        height: 400px;
        position: absolute;
        z-index: 5;
        top: 0;
        left: 100%;
        margin: -70px 0 0 -120px;
    }

    &.people-1:before{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/1.png'); }
    &.people-1:after{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/1-1.png'); }
    &.people-2:before{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/2.png'); }
    &.people-2:after{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/2-1.png'); }
    &.people-3:before{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/3.png'); }
    &.people-3:after{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/3-1.png'); }
    &.people-4:before{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/4.png'); }
    &.people-4:after{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/4-1.png'); }
    &.people-5:before{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/5.png'); }
    &.people-5:after{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/5-1.png'); }
    &.people-6:before{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/6.png'); }
    &.people-6:after{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/6-1.png'); }
    &.people-7:before{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/7.png'); }
    &.people-7:after{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/7-1.png'); }
    &.people-8:before{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/8.png'); }
    &.people-8:after{ background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/8-1.png'); }
    &.people-9:before {
        width: 395px;
        height: 400px;
        margin: -160px 0 0 40px;
        right: auto;
        top: 0;
        background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/9.png');
        background-size: 100%;
    }
    &.people-9:after{ background-image: none; }
    &.people-10:before {
        width: 395px;
        height: 400px;
        margin: -220px 0 0 40px;
        right: auto;
        top: 0;
        background-image: url('/static/image/mobile/tpl/theme3/vip/card/people/10.png');
        background-size: 100%;
    }
    &.people-10:after{ background-image: none; }
}

.card-content {
    max-width: 440px;
    height: 256px;
    background: url('/static/image/mobile/tpl/theme3/vip/card/bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    margin: 20px auto;
    position: relative;
    z-index: 10;

    .level {
        width: 118px;
        height: 47px;
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
        padding: 60px 40px 0;
        font-size: 16px;

        span {
            display: inline-block;
            vertical-align: middle;
            margin: 0 40px 0 0;
        }

        .level-title {
            color: #f3e4d5;
            margin: 0 0 40px 0;

            span {
                margin: 0 10px 0 0;
            }
        }

        div {
            & + div {
                margin-bottom: 10px;
            }
        }
    }
}

.activity-rules {
    max-width: 1200px;
    margin: 0 auto;
    font-size: 14px;
    box-sizing: border-box;

    .title {
        font-size: 32px;
        line-height: 111px;
        background: linear-gradient(270deg,#3b9ee5,#42d2e8);
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        display: inline-block;
        font-weight: bold;
    }

    li {
        padding: 0 0 0 30px;
        position: relative;
    }

    i {
        display: inline-block;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        margin-right: 10px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        color: #fff;
        position: absolute;
        top: 0;
        left: 0;
        background: -webkit-gradient(linear,left top,left bottom,from(#ddd1b5),to(#9f8d6b));
        background: -webkit-linear-gradient(top,#ddd1b5,#9f8d6b);
        background: linear-gradient(180deg,#ddd1b5,#9f8d6b);
    }

    b {
        font-weight: normal;
    }

    p {
        display: inline-block;
    }

    li + li {
        margin-top: 20px;
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
