<template>
    <mobile-container class="outerbox">
        <div slot="content" class="events-box">
            <div id="category" class="events-category">
                <swiper :options="{ slidesPerView: 'auto' }">
                    <swiper-slide
                        v-for="(item,index) in categoryListData"
                        :key="item"
                        :style="{ width: 85 }"
                        :class="{ active: item.isActive }"
                    >
                        <p @click="switchCategory(index,item.key)">{{ item.p }}</p>
                    </swiper-slide>
                </swiper>
            </div>
            <div class="events-content">
                <div
                    v-for="item in getlistData"
                    :key="item.key"
                    :class="{ typea: item.isTypea, typeb: !item.isTypea }"
                    @click="onClick(item)"
                >
                    <div class="upbox">
                        <div class="imgbox">
                            <span>{{ item.slogan }}</span>
                            <img :src="$getCdnPath(item.imgSrc)" class="list-img" />
                        </div>
                        <div class="textbox">
                            <div>
                                <h5>{{ item.title }}</h5>
                                <p>{{ item.p }}</p>
                            </div>
                            <img v-if="item.isTypeA" :src="$getCdnPath('/static/image/mobile/tpl/theme3/events/icon_go2_n.png')" />
                            <img v-else :src="$getCdnPath('/static/image/mobile/tpl/theme3/events/icon_go2_h.png')" />
                        </div>
                    </div>
                    <div class="downbox" />
                </div>
            </div>
            <detail-page
                v-if="show"
                :info-data="detailInfo"
                @close="onClose"
            />
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import ajax from '@/lib/ajax';
import isMobile from '@/lib/is_mobile';
import mobileContainer from '../common/mobileContainer';

export default {
    components: {
        swiper,
        swiperSlide,
        mobileContainer,
        detailPage: () => import('./components/detailPage')
    },
    data() {
        return {
            show: false,
            nowCategory: 'all',
            categoryListData: [
                {
                    isActive: true,
                    p: '全部优惠',
                    key: 'all'
                },
                {
                    isActive: false,
                    p: '真人优惠',
                    key: 'physical'
                },
                {
                    isActive: false,
                    p: '彩票优惠',
                    key: 'ticket'
                },
                {
                    isActive: false,
                    p: '电子优惠',
                    key: 'electronic'
                },
                {
                    isActive: false,
                    p: '其他优惠',
                    key: 'other'
                }
            ],
            detailInfo: null
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        }),
        promotionLinkInfo() {
            const promoLinkArr = {
                48: {
                    id: '7ec69c696b45d7ba72e14f6d99a421608cfaf88a', // API固定ID
                    newbie: 'https://77boxing398.666uxm.com/newbie', // 新手任務
                    weeklySign: 'https://77boxing398.666uxm.com/WeeklySign', // 周周簽
                    content1: 'https://77boxing398.666uxm.com/Content/1912090001', // 綜合類首充優惠15%
                    content2: 'https://77boxing398.666uxm.com/Content/1912090002', // 彩票類首充優惠30%
                    // content3: 'https://77boxing398.666uxm.com/Content/1912090003' // 電子類首充優惠100%
                    content4: 'https://77boxing398.666uxm.com/Content/2001160001', // 流水搶關
                    content5: 'https://77boxing398.666uxm.com/Content/2001160002', // 幸運注單
                    content6: 'https://77boxing398.666uxm.com/Content/2001160003', // 超級對子
                    wager: 'https://77boxing398.666uxm.com/signweekly/wager', // 打码签到
                    deposit: 'https://77boxing398.666uxm.com/signweekly/deposit' // 充值签到
                },
                50: {
                    id: '7ec69c696b45d7ba72e14f6d99a421608cfaf88a', // API固定ID
                    newbie: 'https://66chile.666uxm.com/newbie', // 新手任務
                    weeklySign: 'https://66chile.666uxm.com/WeeklySign', // 周周簽
                    content1: 'https://66chile.666uxm.com/Content/1912090002', // 綜合類首充優惠15%
                    content2: 'https://66chile.666uxm.com/Content/1912090003', // 彩票類首充優惠30%
                    // content3: 'https://66chile.666uxm.com/Content/1912090004' // 電子類首充優惠100%
                    content4: 'https://66chile.666uxm.com/Content/2001160001', // 流水搶關
                    content5: 'https://66chile.666uxm.com/Content/2001160002', // 幸運注單
                    content6: 'https://66chile.666uxm.com/Content/2001160003', // 超級對子
                    wager: 'https://66chile.666uxm.com/signweekly/wager', // 打码签到
                    deposit: 'https://66chile.666uxm.com/signweekly/deposit' // 充值签到
                },
                500000: {
                    id: 'cfd0891aaabe79773e75c753b754fc54f45bc8fe', // API固定ID
                    newbie: 'https://wsws.iplay.bet/newbie', // 新手任務
                    weeklySign: 'https://wsws.iplay.bet/WeeklySign', // 周周簽
                    content1: 'https://wsws.iplay.bet/Content/1912090001', // 綜合類首充優惠15%
                    content2: 'https://wsws.iplay.bet/Content/1912090002', // 彩票類首充優惠30%
                    // content3: 'https://wsws.iplay.bet/Content/1912090003' // 電子類首充優惠100%
                    wager: 'https://wsws.iplay.bet/signweekly/wager', // 打码签到
                    deposit: 'https://wsws.iplay.bet/signweekly/deposit' // 充值签到
                }
            };

            return promoLinkArr[this.webInfo.alias];
        },
        getlistData() {
            const listData = [
                {
                    key: 'content4',
                    category: ['all', 'physical'],
                    isTypea: true,
                    slogan: '最新',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-15.jpg',
                    title: '流水闯关',
                    p: '即日起',
                    lightbox: false
                },
                {
                    key: 'content5',
                    category: ['all', 'physical'],
                    isTypea: true,
                    slogan: '最新',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-16.jpg',
                    title: '幸运注单',
                    p: '即日起',
                    lightbox: false
                },
                {
                    key: 'content6',
                    category: ['all', 'physical'],
                    isTypea: true,
                    slogan: '最新',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-17.jpg',
                    title: '超级对子',
                    p: '即日起',
                    lightbox: false
                },
                {
                    key: 'wager',
                    category: ['all', 'other'],
                    isTypea: false,
                    slogan: '最新',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-14.jpg',
                    title: '打码签到',
                    p: '即日起',
                    lightbox: false
                },
                {
                    key: 'deposit',
                    category: ['all', 'other'],
                    isTypea: false,
                    slogan: '最新',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-13.jpg',
                    title: '充值签到',
                    p: '即日起',
                    lightbox: false
                },
                {
                    key: 'newbie',
                    category: ['all', 'other'],
                    isTypea: false,
                    slogan: '最新',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-1.jpg',
                    title: '新手任务',
                    p: '即日起',
                    lightbox: false
                },
                // {
                //     key: 'weeklySign',
                //     category: ['all', 'other'],
                //     isTypea: true,
                //     slogan: '最新',
                //     imgSrc: '/static/image/mobile/tpl/theme3/events/P-2.jpg',
                //     title: '周周签到活动',
                //     p: '即日起',
                //     lightbox: false
                // },
                {
                    key: 'content1',
                    category: ['all', 'physical', 'ticket', 'electronic'],
                    isTypea: false,
                    slogan: '新人',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-5.jpg',
                    title: '综合类首存优惠15%',
                    p: '即日起',
                    lightbox: false
                },
                {
                    key: 'content2',
                    category: ['all', 'ticket'],
                    isTypea: true,
                    slogan: '新人',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-7.jpg',
                    title: '彩票首充优惠30%',
                    p: '即日起',
                    lightbox: false
                },
                // {
                //     key: 'content3',
                //     category: ['all', 'electronic'],
                //     isTypea: false,
                //     slogan: '新人',
                //     imgSrc: '/static/image/mobile/tpl/theme3/events/P-8.jpg',
                //     title: '电子首充优惠100%',
                //     p: '即日起',
                //     lightbox: false
                // },
                // {
                //     key: 'vip',
                //     category: ['all', 'electronic'],
                //     isTypea: true,
                //     slogan: 'VIP',
                //     imgSrc: '/static/image/mobile/tpl/theme3/events/P-9.jpg',
                //     title: 'VIP等级划分',
                //     p: '长期活动',
                //     lightbox: false
                // },
                {
                    key: 'rebate',
                    category: ['all', 'other'],
                    isTypea: false,
                    slogan: '日常',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-10.jpg',
                    title: '实时返水1.5%',
                    p: '即日起',
                    lightbox: true,
                    detailData: {
                        src: '/static/image/mobile/tpl/theme3/events/P-10.jpg',
                        title: '实时返水1.5%',
                        content: [
                            {
                                label: '活动时间',
                                p: ['即日起']
                            },
                            {
                                label: '活动对象',
                                p: ['全网会员']
                            },
                            {
                                label: '活动内容',
                                isTable: true,
                                tableData: {
                                    th: [
                                        {
                                            width: '22%',
                                            p: '有效投注'
                                        },
                                        {
                                            width: '13%',
                                            p: '视讯直播'
                                        },
                                        {
                                            width: '13%',
                                            p: '体育赛事'
                                        },
                                        {
                                            width: '13%',
                                            p: '彩票游戏'
                                        },
                                        {
                                            width: '13%',
                                            p: '棋牌游戏'
                                        },
                                        {
                                            width: '13%',
                                            p: '捕鱼机'
                                        },
                                        {
                                            width: '13%',
                                            p: '电子游艺'
                                        }
                                    ],
                                    tr: [
                                        {
                                            td: ['100万以上', '0.7%', '0.6%', '0.6%', '0.8%', '0.8%', '1.5%']
                                        },
                                        {
                                            td: ['50万以上', '0.6%', '0.5%', '0.5%', '0.7%', '0.7%', '1.2%']
                                        },
                                        {
                                            td: ['1元以上', '0.5%', '0.3%', '0.3%', '0.6%', '0.6%', '1.0%']
                                        }
                                    ]
                                }
                            },
                            {
                                label: '特别声明',
                                p: [
                                    '1.【时时返水】和【天天返水】任君选择，所有返水金额，需要一倍流水，即可申请出款；',
                                    '2.电子游艺类桌上游戏均不享受返点；部分游戏因突发临时维护时，会员中心实时返水会进行提醒等待系统统一返水；',
                                    '3.返点回馈计算方式：当日各游戏有效投注x各项目相应返点百分比=会员所得返点金额；',
                                    '4.会员每次申请实时返水，系统将会自动结算您所有未结算的有效投注，无法进行部分结算；',
                                    '5.当日返水总额扣除已返金额如有剩余部份，则将于次日15:00与【系统自动返水】部份一并由系统自动派发',
                                    '6.每次结算后，已结算的有效投注作为有效投注门槛的条件；【即：假设会员当日视讯总有效投注为100万以上，若是第一次打流水是30万以上50万以下时进行领取返水将按照“1元+”门槛进行结算为30万x0.5%=1500元，（有继续进游戏到总计100万以上）剩余部分流水按照“100万+”门槛结算为100万x0.7%=7000元，7000-1500=5500元为第二次领取的返水金额】;',
                                    '7.由于地区时差问题，系统数据统计会有所延迟，如遇到数据不同步的情况，以系统数据为准； 投注额最多可能会有30分钟延迟 ，建议投注30分钟后进行申请实时返水；《试算服务：每5分钟可使用一次》；'
                                ]
                            },
                            {
                                label: '申请方式',
                                p: [
                                    '♠自助实时反水（创新）：会员任意一笔有效投注，只需要通过会员中心【我的返水】点击（试算）（领取）即可实时到账；',
                                    '♠天天系统返水（默认）：美东时间当天00:00-23:59的有效投注，将于次日北京时间每天下午15:00左右完成派送，届时剩余返水将统一存入会员账号中；'
                                ]
                            },
                            {
                                label: '活动规则',
                                p: [
                                    '1.所有优惠以人民币(CNY)为结算金额，以美东时间(EDT)为计时区间；',
                                    '2.出现对打、套利等违返常态游戏规则的行为，将不计有效投注；如投注体育赛事中出现、对冲或对打投注不计、未接受注单/赛果为平时的注单不计；在真人娱乐/电子游艺/对战/彩票游戏投注，无风险投注不计；',
                                    '3.任何取消注单、赛事或局数不计；无风险投注包括同时押庄闲、大小、单双、红黑、轮盘下注15个以上号码等；如同时下“大“+”双“，换成号码数共计27个，则此局不计入有效投注，若超过下注单数的三分之一，则全天不计有效投注；',
                                    '4.威尼斯人贵宾厅在会员有重复申请账号行为时，保留取消，收回会员优惠红利的权利，每一位玩家、每一住址、每一电子邮箱、每一电话号码、相同支付卡/信用卡号码，以及共用电脑环境,例如：网吧、其他公共电脑等，只能够同于区间参与此活动；这项优惠只使用于每位客户在威尼斯人贵宾厅唯一申领本优惠的账户；',
                                    '6.若会员对活动有争议时，为确保双方利益，杜绝身份盗用行为，威尼斯人贵宾厅有权要求会员向我们提供充足有效的文件，用以确认是否享有该优惠的资质；',
                                    '7.无论是个人或团体，如滥用任何威胁、滥用威尼斯人贵宾厅优惠的行为，威尼斯人贵宾厅保留权利取消，收回优惠以及产生的红利；',
                                    '8.威尼斯人贵宾厅保留对活动的最终解释权，以及在无通知的情况下修改、终止活动的权利，适用于所有优惠；'
                                ]
                            }
                        ]
                    }
                },
                {
                    key: 'bank',
                    category: ['all', 'other'],
                    isTypea: true,
                    slogan: '日常',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-11.jpg',
                    title: '银行卡充值1%优惠',
                    p: '即日起',
                    lightbox: true,
                    detailData: {
                        src: '/static/image/mobile/tpl/theme3/events/P-11.jpg',
                        title: '银行卡充值1%优惠',
                        content: [
                            {
                                label: '活动时间',
                                p: ['即日起']
                            },
                            {
                                label: '活动对象',
                                p: ['全网会员']
                            },
                            {
                                label: '活动内容',
                                p: [
                                    '1.每次入款前请先登入会员账号--点击“存款"--“银行卡转账”---进行转账汇款（网银转账、ATM.、手机银行转账、柜台现金存入）',
                                    '2.为了更加快捷，方便客服查询到您的存款，请您存款务必输入正确的存款姓名等等；',
                                    '3.存款优惠单次上限为388元，会员单日最高可获的优惠无上限；',
                                    '4.存款优惠仅需达到一倍流水方可申请提款；',
                                    '5.无需申请，充值成功后2%优惠自动到账；'
                                ]
                            },
                            {
                                label: '活动规则',
                                p: [
                                    '1.此优惠活动与威尼斯人贵宾厅其他优惠同时进行；',
                                    '2.该优惠活动成功申请后不能取消，如解除账户限制，需完成活动指定流水要求，将自动解除首充未完成的流水倍数；',
                                    '3.如会员使用一切不正常投注、套利行为，本公司将保留冻结账号盈利及余额等权利；',
                                    '4.参与此活动代表完全遵守威尼斯人贵宾厅全部游戏规则【一般条款与规则】；',
                                    '5.本活动最终解释权归威尼斯人贵宾厅所有；'
                                ]
                            }
                        ]
                    }
                },
                {
                    key: 'cg',
                    category: ['all', 'other'],
                    isTypea: false,
                    slogan: '最新',
                    imgSrc: '/static/image/mobile/tpl/theme3/events/P-12.jpg',
                    title: 'CG钱包充值0.5%优惠',
                    p: '即日起',
                    lightbox: true,
                    detailData: {
                        src: '/static/image/mobile/tpl/theme3/events/P-12.jpg',
                        title: 'CG钱包充值0.5%优惠',
                        content: [
                            {
                                label: '活动时间',
                                p: ['即日起']
                            },
                            {
                                label: '活动对象',
                                p: ['全网会员']
                            },
                            {
                                label: '活动内容',
                                isTable: true,
                                tableData: {
                                    th: [
                                        {
                                            width: '22%',
                                            p: '充值方式'
                                        },
                                        {
                                            width: '13%',
                                            p: '充值金额'
                                        },
                                        {
                                            width: '13%',
                                            p: '可获优惠'
                                        },
                                        {
                                            width: '13%',
                                            p: '彩金上限(单笔)'
                                        },
                                        {
                                            width: '13%',
                                            p: '流水要求'
                                        }
                                    ],
                                    tr: [
                                        {
                                            td: ['CG Pay钱包', '100', '0.5%', '388', '1倍']
                                        }
                                    ]
                                }
                            },
                            {
                                label: '',
                                p: [
                                    '1.每次入款前请先登入会员账号，使用CG Pay钱包充值即可获得0.5%的入款优惠，无需申请，充值成功后0.5%优惠自动到账；',
                                    '2.会员单日最高可获的优惠无上限；',
                                    '3.存款优惠仅需达到一倍流水方可申请提款'
                                ]
                            },
                            {
                                label: '活动规则',
                                p: [
                                    '1.此优惠活动与威尼斯人贵宾厅其他优惠同时进行；',
                                    '2.该优惠活动成功申请后不能取消，如解除账户限制，需完成活动指定流水要求，将自动解除未完成的流水倍数；',
                                    '3.如会员使用一切不正常投注、套利行为，本公司将保留冻结账号盈利及余额等权利；',
                                    '4.参与此活动代表完全遵守威尼斯人贵宾厅全部游戏规则【一般条款与规则】；',
                                    '5.本活动最终解释权归威尼斯人贵宾厅所有；'
                                ]
                            }
                        ]
                    }
                }
            ];

            return listData.filter((info) => info.category.includes(this.nowCategory));
        }
    },
    methods: {
        switchCategory(index, key) {
            const which = this.categoryListData.map((item) => item.isActive).indexOf(true);
            this.categoryListData[which].isActive = false;
            this.categoryListData[index].isActive = true;
            this.nowCategory = key;
        },
        onClick(info) {
            let newWindow = '';
            // 辨別裝置是否為ios寰宇瀏覽器
            const isUBMobile = navigator.userAgent.match(/UBiOS/) !== null && navigator.userAgent.match(/iPhone/) !== null;

            if (['vip'].includes(info.key)) {
                this.$router.push('/mobile/vip');
                return;
            }

            if (['rebate', 'bank', 'cg'].includes(info.key)) {
                this.detailInfo = info.detailData;
                this.show = true;
                return;
            }

            if (isMobile() && !isUBMobile) {
                newWindow = window.open('');
            }

            ajax({
                method: 'get',
                url: `/api/v1/c/link/customize?id=${this.promotionLinkInfo.id}&client_uri=${this.promotionLinkInfo[info.key]}`,
                errorAlert: false,
                success: (response) => {
                    if (response && response.result === 'ok') {
                        if (isMobile() && !isUBMobile) {
                            newWindow.location.href = response.ret.uri;
                            return;
                        }

                        window.open(response.ret.uri);
                        return;
                    }

                    if (isMobile() && !isUBMobile) {
                        newWindow.alert(`${response.msg} ${response.code ? `(${response.code})` : ''}`);
                        newWindow.close();
                    }
                }
            });
        },
        onClose() {
            this.show = false;
            this.detailInfo = null;
        }
    }
};
</script>

<style lang="scss" scoped>
.events-box,.outerbox {
    background: #000;
    height: 100%;
}
.events-category {
    background: #272727;
    border-bottom-left-radius: 10px;
    margin-bottom: 15px;
    width: 100%;
    padding: 20px 0;
    .swiper-wrapper {
        .swiper-slide {
            font-size: 13px;
            line-height: 21px;
            font-weight: bold;
            width: 85px;
            min-width: 85px;
            border-radius: 25px;
            padding: 10px;
            list-style: none;
            text-align: center;
            background: -webkit-linear-gradient(left,#EFDFAF,#DDC084,#EDBF6B);
            background: -o-linear-gradient(right,#EFDFAF,#DDC084,#EDBF6B);
            background: -moz-linear-gradient(right,#EFDFAF,#DDC084,#EDBF6B);
            background: linear-gradient(to right,#EFDFAF,#DDC084,#EDBF6B);
            transition: .5s;
            color: #9C6E54;
            &:first-child {
                margin-left: 10px
            }
            &:last-child {
                margin-right: 10px
            }
            &:not(:last-child) {
                margin-right: 5px;
            }
            &.active {
                background: -webkit-linear-gradient(left,#3C599F,#2D477E);
                background: -o-linear-gradient(right,#3C599F,#2D477E);
                background: -moz-linear-gradient(right,#3C599F,#2D477E);
                background: linear-gradient(to right,#3C599F,#2D477E);
                color: #fff;
            }
        }
    }
}
.events-content {
    padding: 0 15px 45px;
    &>div {
        margin-bottom: 10px;
        position: relative;
    }
    .typea,.typeb {
        .upbox {
            width: 95%;
            margin: 0 auto;
            position: relative;
            z-index: 1;
            .imgbox {
                width: 100%;
                position: relative;
                margin-bottom: 5px;
                span {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    display: inline-block;
                    padding: 2px 15px;
                    border-bottom-right-radius: 25px;
                    border-top-right-radius: 25px;
                    border-top-left-radius: 25px;
                    background: -webkit-linear-gradient(left,#F4886C,#EA4A62);
                    background: -o-linear-gradient(right,#F4886C,#EA4A62);
                    background: -moz-linear-gradient(right,#F4886C,#EA4A62);
                    background: linear-gradient(to right,#F4886C,#EA4A62);
                    color: #fff;
                    font-size: 12px;
                    line-height: 20px;
                }
                img {
                    width: 100%;
                    border-radius: 10px;
                }
            }
            .textbox {
                display: flex;
                align-items: center;
                border-radius: 10px;
                padding: 0 15px 10px;
                div {
                    width: calc(100% - 28px);
                    h5 {
                        font-size: 16px;
                        line-height: 22px;
                        font-weight: bold;
                        margin-bottom: 0;
                    }
                    p {
                        font-size: 12px;
                        line-height: 20px;
                    }
                }
                img {
                    width: 28px;
                    height: 28px;
                }
            }
        }
        .downbox {
            position: absolute;
            bottom: 0;
            left: 0;
            height: calc(100% - 60px);
            width: 100%;
            border-radius: 10px;
        }
    }
    .typea {
        .upbox {
            color: #fff;
                p {
                color: #9A8D87;
            }
        }
        .downbox {
            background: #5E5450;
        }
    }
    .typeb {
        .upbox {
            color: #5C4030;
            p {
                color: #9C6E54;
            }
        }
        .downbox {
            background: -webkit-linear-gradient(left,#EFDFAF,#DDC084,#EDBF6B);
            background: -o-linear-gradient(right,#EFDFAF,#DDC084,#EDBF6B);
            background: -moz-linear-gradient(right,#EFDFAF,#DDC084,#EDBF6B);
            background: linear-gradient(to right,#EFDFAF,#DDC084,#EDBF6B);
        }
    }
}
</style>
