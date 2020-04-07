<template>
    <mobile-container
        :class="$style['container-bg']"
        :header-setting="headerSetting"
    >
        <div slot="content" :class="$style['body-wrap']">
            <div :class="$style.title">
                <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/agent/img_agent.png')" />
            </div>
            <div :class="$style.subtitle">是成为传奇? 还是成为传奇的歌颂者?</div>
            <div :class="$style['info-wrap']">
                <div :class="$style['info-container']">
                    <div
                        v-for="(data, index) in infoData"
                        :key="index"
                        :class="$style['info-item']"
                    >
                        <img :src="$getCdnPath(`/static/image/tpl/17/customPage/agent/${data.img}.png`)" />
                        <div :class="$style['info-content']">
                            <div :class="$style['info-title']">{{ data.title }}</div>
                            <div :class="$style['info-text']">{{ data.text }}</div>
                        </div>
                        <div :class="$style['info-btn']" @click="$copyText(data.text)">复制</div>
                    </div>
                    <div :class="[$style['btn-wrap'], 'clearfix']">
                        <div :class="$style.btn" @click="onAgentLogin('/mobile/agLogin')">{{ $text('S_AGENT_LOGIN', '代理登入') }}</div>
                        <div :class="$style.btn" @click="onAgentLogin('/mobile/joinAgent')">{{ $text('S_AGENT_JOIN', '代理註冊') }}</div>
                    </div>
                </div>
            </div>
            <div :class="$style['page-middle']">
                <div :class="$style['agent-copy']">
                    <p>
                        &nbsp;&nbsp;&nbsp;&nbsp;欢迎加入威尼斯人贵宾厅这个大家庭，诚邀您的加盟，共同努力！我司与BBIN进行技术合作，拥有哥斯达黎加合法注册之博彩公司，拥有多元化的产品，使用最公平、公正、公开的系统，在市场上的
                        众多博彩网站中，我们自豪的提供会员最优惠的回馈，给予合作伙伴最优势的营利回报! 无论您拥有的是网络资源，或是人脉资源，都欢迎您来加入威尼斯人贵宾厅合作伙伴的行列，无须负担任何费
                        用，就可以开始无上限的收入，加入威尼斯人贵宾厅代理，开始您日赚百万的旅程吧！
                    </p>
                    <p>
                        请点击【合营计划】→【代理注册】申请，填写真实联系方式， 我司会评估审核联盟申请讯息，并以站内信形式通知申请结果，请务必留下真实有效消息，以提升代理通过率！
                    </p>
                </div>
                <table
                    :class="$style.table"
                    rules="all"
                    cellpadding="5"
                >
                    <thead>
                        <tr>
                            <th>級別</th>
                            <th>公司本月总盈利</th>
                            <th>有效玩家数量</th>
                            <th colspan="2">当月退佣比例</th>
                        </tr>
                        <tr>
                            <th />
                            <th />
                            <th />
                            <th>视讯、电子、体育，电竞</th>
                            <th>彩票（有效投注）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>101-30000</td>
                            <td>>3</td>
                            <td>25%</td>
                            <td>0.8%</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>101-50000</td>
                            <td>>3</td>
                            <td>30%</td>
                            <td>0.8%</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>50001-15000</td>
                            <td>≥10</td>
                            <td>35%</td>
                            <td>0.8%</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>150001-300000</td>
                            <td>≥15</td>
                            <td>40%</td>
                            <td>0.8%</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>300001-500000</td>
                            <td>≥25</td>
                            <td>45%</td>
                            <td>0.8%</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>500001-1000000</td>
                            <td>≥35</td>
                            <td>50%</td>
                            <td>0.8%</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>1000001≥</td>
                            <td>>55</td>
                            <td>55%</td>
                            <td>0.8%</td>
                        </tr>
                    </tbody>
                </table>
                <div :class="$style['agent-copy']">
                    <div :class="$style['copy-title']">
                        联盟方案：
                    </div>
                    <div :class="$style['copy-text']">
                        &nbsp;&nbsp;&nbsp;&nbsp;1.联盟佣金计算，结算区间为：本月第一个礼拜一至下月第一个礼拜一前的周日，将会员盈利，以联盟方案分红公式计算；
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;2.佣金于每个月的第一个礼拜三开始与代理专员确认金额后，在1个工作日内将佣金直接汇入代理联盟登记的银行帐号；每月代理联盟业绩于结算后归零重新开始
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;3.有效玩家：【当月最低有效会员】定义为：在月结区间内进行过最少500RMB有效下注的会员；
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;4.查看佣金:查看佣金请登陆合营端后台，点击佣金报表
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;5.重要信息：为回馈专业代理商的爱护与支持，如当月代理商佣金总额产生负值，将一律归零！
                    </div>
                    <div :class="$style['copy-title']">
                        计算方式：
                    </div>
                    <div :class="$style['copy-text']">
                        &nbsp;&nbsp;&nbsp;&nbsp;1.[彩票]退佣是以[退水]形式计算：以报表中[实际投注]字段x退佣比例0.8%
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;2.[真人视讯][体育][电子游艺][电竞]的退佣计算：以表格中[派彩]字段x对应上表的退佣比例；
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;3.退佣结算时将扣除[相应费用]；[相应费用]包括：会员各项优惠，存取款相应手续费（请留意：会员重复出款手续费、以及未达100%投注就申请出款的手续费由会员承担，不纳入计算）；
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;首先计算[彩票]的退佣:退水x0.1%=彩票费用；总的费用-彩票费用=剩下的费用，当相减后退佣计算公式为：（派彩金额-剩下的费用）x佣金百分比=可获退佣

                        例：A代理，退水金额10000，费用5000，有效派彩55000，退用比例25%

                        彩票：退水10000x0.8%=80（彩票）

                        总的费用5000-彩票80=剩下费用4920

                        可获佣金=（派彩55000-费用4920）x25%=12502.5元
                    </div>
                </div>
            </div>
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import mobileContainer from '../../common/mobileContainer';

export default {
    components: {
        mobileContainer
    },
    data() {
        return {
            headerSetting: {
                left: { show: true },
                center: {
                    show: true,
                    typeText: true,
                    text: this.$text('S_VENTURE_PLAN', '合营计划')
                },
                right: { show: true }
            },
            infoData: [
                { img: 'logo_qq', title: '合营部QQ', text: '99003995' },
                { img: 'logo_qq_2', title: '合营部Skype', text: 'wsdailibu@gmail.com' },
                { img: 'logo_qq_3', title: '合营部Sugram', text: 'wsdailibu@gmail.com' }
            ]
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        })
    },
    methods: {
        ...mapActions(['actionSetUserdata']),
        onAgentLogin(path) {
            if (this.loginStatus) {
                if (window.confirm(this.$text('S_LOGOUT_AGENT_CONFIRM', '操作代理端将登出您的会员身份, 请确认是否执行登出'))) {
                    member.logout({
                        success: () => {
                            this.actionSetUserdata(true);
                            this.$router.push(path);
                        }
                    });
                }

                return;
            }
            this.$router.push(path);
        }
    }

};

</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.container-bg {
    background-color: #F4F8FC !important;
}

.body-wrap{
    margin: 47px 0 45px;
    padding-top: 30px;
    color: #F8F1EB;
}

.title {
    width: 320px;
    margin: 0 auto;

    img {
        width: 100%;
    }
}

.subtitle {
    margin-top: 10px;
    color: #333;
    text-align: center;
}

.info-wrap {
    position: relative;
    height: 641px;
    background: url('/static/image/mobile/tpl/theme3/agent/content.png') 50% bottom/contain no-repeat;
}

.info-item {
    width: 320px;
    height: 76px;
    margin: 10px auto;
    padding: 20px 10px;
    border-radius: 12px;
    background-color: hsla(0,0%,99.2%,.9);
    color: #333;

    img {
        vertical-align: middle;
    }
}

.info-btn {
    float: right;
    width: 3rem;
    margin-top: 20px;
    color: #00A3E4;
    border-radius: .04rem;
    border: 1px solid #00A3E4;
    text-align: center;
}

.info-content {
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;
}

.info-container {
    position: absolute;
    width: 100%;
    bottom: 20px;
}

.btn-wrap {
    width: 320px;
    margin: 0 auto;
}

.btn {
    float: left;
    width: 40%;
    height: 40px;
    line-height: 40px;
    border-radius: 50px;
    background: linear-gradient(270deg, #60E6FF, #46A8FE);
    color: #FFF;
    text-align: center;

    &:last-child {
        float: right;
    }
}

.page-middle {
    width: 320px;
    margin: 0 auto;
    padding-top: 50px;
}

.agent-copy {
    padding: 20px;
    color: #666;
    border-radius: 10px;
    box-shadow: 0 0 21px 5px rgba(207, 207, 207, 0.5);
    background-color: #F8F9FB;
}

.table {
    width: 100%;
    margin: 50px 0;
    border: 1px solid #666;
    background-color: #FFF;
    box-shadow: 0 0 21px 5px rgba(207, 207, 207, 0.5);
    color: #333;

    >thead {
        background-color: #3A97E5;
        color: #FFF;
    }
}

@media screen and (min-width: $phone + $sidebar) {
    .title {
        width: 420px;
    }

    .subtitle {
        font-size: 20px;
    }

    .info-item {
        width: 420px;
    }

    .btn-wrap {
        width: 420px;
    }

    .page-middle {
        width: 420px;
    }
}

@media screen and (min-width: $pad + $sidebar) {
    .title {
        width: 620px;
    }

    .subtitle {
        font-size: 30px;
    }

    .info-item {
        width: 620px;
    }

    .btn-wrap {
        width: 620px;
    }

    .page-middle {
        width: 620px;
    }
}
</style>
