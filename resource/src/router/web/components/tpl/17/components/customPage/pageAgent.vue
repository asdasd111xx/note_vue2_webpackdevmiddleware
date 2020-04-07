<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['page-container']">
            <div :class="$style['page-top']">
                <div :class="$style['item-left']">
                    <img :src="$getCdnPath('/static/image/tpl/17/customPage/agent/wz_agent.png')" />
                    <div :class="$style['item-title']">是成为传奇? 还是成为传奇的歌颂者?</div>
                    <div :class="$style['item-middle']">
                        <div :class="$style.item">
                            <img :src="$getCdnPath('/static/image/tpl/17/customPage/agent/icon_chaogao.png')" />
                            <span>
                                超高返佣比
                                <br />
                                Maximum Commission
                            </span>
                        </div>
                        <div :class="$style.item">
                            <img :src="$getCdnPath('/static/image/tpl/17/customPage/agent/icon_zuiyou.png')" />
                            <span>
                                最优质的产品
                                <br />
                                High quality products
                            </span>
                        </div>
                        <div :class="$style.item">
                            <img :src="$getCdnPath('/static/image/tpl/17/customPage/agent/icon_zuijing.png')" />
                            <span>
                                最精确的数据
                                <br />
                                Accurate statistics
                            </span>
                        </div>
                    </div>
                    <div :class="$style['info-wrap']">
                        <div
                            v-for="(data, index) in infoData"
                            :key="index"
                            :class="$style['info-item']"
                        >
                            <img :src="$getCdnPath(`/static/image/tpl/17/customPage/agent/${data.img}.png`)" />
                            <div :class="$style['info-title']">{{ data.title }}</div>
                            <div :class="$style['info-text']">{{ data.text }}</div>
                        </div>
                    </div>
                    <div :class="$style['btn-wrap']">
                        <div :class="$style.btn" @click="onAgentLogin(webInfo.alias === '500000' ? '32423' : webInfo.alias === '48' ? '10490' : '10523')">{{ $text('S_AGENT_LOGIN', '代理登入') }}</div>
                        <div :class="$style.btn" @click="onAgentLogin(webInfo.alias === '500000' ? '32424' : webInfo.alias === '48' ? '10491' : '10524')">{{ $text('S_AGENT_JOIN', '代理註冊') }}</div>
                    </div>
                </div>
                <div :class="$style['item-right']">
                    <img :src="$getCdnPath('/static/image/tpl/17/customPage/agent/img_people.png')" />
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
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';

export default {
    props: {
        changePage: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            infoData: [
                { img: 'logo_qq', title: '合营部QQ', text: '515387777' }
                // { img: 'logo_qq_2', title: '合营部Skype', text: 'wsdailibu@gmail.com' },
                // { img: 'logo_qq_3', title: '合营部Sugram', text: 'wsdailibu@gmail.com' }
            ]
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            webInfo: 'getWebInfo'
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
            this.changePage({ page: path });
        }
    }
};
</script>

<style lang="scss" module>
.page-wrap {
    background-color: #F0F3F6;
}

.page-container {
    width: 1350px;
    margin: 0 auto;
    padding-top: 53px;
}

.page-top {
    position: relative;
    height: 946px;
}

.item-left {
    position: absolute;
    left: 0;
    bottom: 144px;
    height: 654px;
    text-align: center;
}

.item-title {
    position: relative;
    height: 53px;
    margin: 0 auto;
    font-weight: 100;
    font-size: 34px;
    color: #666666;
}

.item-middle {
    margin: 24px 0;
}

.item {
    display: inline-block;
    margin-right: 35px;

    &:last-child {
        margin-right: 0;
    }

    span {
        display: inline-block;
        margin-left: 10px;
        text-align: start;
        vertical-align: middle;
    }

    img {
        vertical-align: middle;
    }
}

.info-item {
    display: inline-block;
    width: 220px;
    height: 140px;
    border-radius: 10px;
    box-shadow: 0 0 21px 5px rgba(207, 207, 207, 0.5);
    background-color: #F8F9FB;
    margin-right: 20px;

    img {
        width: 34px;
        height: 34px;
        margin: 20px 0 9px;
    }
}

.info-title {
    margin-bottom: 8px;
}

.info-text {
    color: #3085E5;
}

.btn-wrap {
    margin-top: 24px;
}

.btn {
    display: inline-block;
    width: 245px;
    height: 62px;
    margin-right: 10px;
    line-height: 62px;
    font-size: 16px;
    color: #FFF;
    cursor: pointer;
    background: linear-gradient(to right, #42D2E8, #48D2ED, #3A97E5);
    border-radius: 31px;
    box-shadow: 0 6px 10px 6px rgba(0, 180, 255, 0.3)
}

.item-right {
    position: absolute;
    right: 0;
    bottom: 0;
}

.page-middle {
    height: 900px;
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

    >thead {
        background-color: #3A97E5;
        color: #FFF;
    }
}
</style>
