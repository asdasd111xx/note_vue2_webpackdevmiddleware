<template>
    <div class="depositHelp">
        <sidebar />
        <div class="content">
            <h1>{{ i18nList.depositHelp[language] }}</h1>
            <div class="intro">
                <div class="wechat">
                    <img :src="$getCdnPath('/static/image/tpl/8/wechat.jpg')" class="pay-icon" />
                    <h3>{{ i18nList.wechatTunnel[language] }}</h3>
                    <p class="feature">
                        <span class="yellow">{{ i18nList.feature1[language] }}</span>
                        <span class="green">{{ i18nList.wechatLine[language] }}</span>
                    </p>
                    <p class="hint">
                        {{ i18nList.wechatHint[language] }}
                    </p>
                </div>
                <div class="alipay">
                    <img :src="$getCdnPath('/static/image/tpl/8/alipay.jpg')" class="pay-icon" />
                    <h3>{{ i18nList.alipayTunnel[language] }}</h3>
                    <p class="feature">
                        <span class="yellow">{{ i18nList.feature1[language] }}</span>
                        <span class="green">{{ i18nList.aliPayLine[language] }}</span>
                    </p>
                    <p class="hint">
                        {{ i18nList.aliPayHint[language] }}
                    </p>
                </div>
                <div class="unionPay">
                    <img :src="$getCdnPath('/static/image/tpl/8/unionPay.jpg')" class="pay-icon" />
                    <h3>{{ i18nList.unionPayTunnel[language] }}</h3>
                    <p class="feature">
                        <span class="yellow">{{ i18nList.feature1[language] }}</span>
                        <span class="green">{{ i18nList.unionPayLine[language] }}</span>
                    </p>
                    <p class="hint">
                        {{ i18nList.unionPayHint[language] }}
                    </p>
                </div>
                <div class="unionScan">
                    <img :src="$getCdnPath('/static/image/tpl/8/unionScan.jpg')" class="pay-icon" />
                    <h3>{{ i18nList.unionScanTunnel[language] }}</h3>
                    <p class="feature">
                        <span class="yellow">{{ i18nList.feature1[language] }}</span>
                        <span class="green">{{ i18nList.unionScanLine[language] }}</span>
                    </p>
                    <p class="hint">
                        {{ i18nList.unionScanHint[language] }}
                    </p>
                </div>
                <div class="qqScan">
                    <img :src="$getCdnPath('/static/image/tpl/8/qqScan.jpg')" class="pay-icon" />
                    <h3>{{ i18nList.qqScanTunnel[language] }}</h3>
                    <p class="feature">
                        <span class="yellow">{{ i18nList.feature1[language] }}</span>
                        <span class="green">{{ i18nList.qqScanLine[language] }}</span>
                    </p>
                    <p class="hint">
                        {{ i18nList.qqScanHint[language] }}
                    </p>
                </div>
                <div class="zdmPay">
                    <img :src="$getCdnPath('/static/image/tpl/8/zdmPay.jpg')" class="pay-icon" />
                    <h3>{{ i18nList.zdmPayTunnel[language] }}</h3>
                    <p class="feature">
                        <span class="yellow">{{ i18nList.feature1[language] }}</span>
                        <span class="green">{{ i18nList.zdmPayLine[language] }}</span>
                    </p>
                    <p class="hint">
                        {{ i18nList.zdmPayHint[language] }}
                    </p>
                </div>
                <div class="EBankPay">
                    <img :src="$getCdnPath('/static/image/tpl/8/EBankPay.jpg')" class="pay-icon" />
                    <h3>{{ i18nList.EBankPay[language] }}</h3>
                    <p class="feature">
                        <span class="yellow">{{ i18nList.feature2[language] }}</span>
                        <span class="green">{{ i18nList.EBankPayLine[language] }}</span>
                    </p>
                    <p class="hint">
                        {{ i18nList.EBankPayHint[language] }}
                    </p>
                    <img :src="$getCdnPath('/static/image/tpl/8/EBankList.jpg')" class="bank-list" />
                </div>
                <div class="companyDeposit">
                    <img :src="$getCdnPath('/static/image/tpl/8/companyDeposit.jpg')" class="pay-icon" />
                    <h3>{{ i18nList.companyDeposit[language] }}</h3>
                    <p class="feature">
                        <span class="yellow">{{ i18nList.feature3[language] }}</span>
                        <span class="green">{{ i18nList.companyDepositLine[language] }}</span>
                    </p>
                    <p class="hint">{{ i18nList.companyDepositHint1[language] }}</p>
                    <p class="hint">{{ i18nList.companyDepositHint2[language] }}</p>
                    <p class="hint">{{ i18nList.companyDepositHint3[language] }}</p>
                </div>
            </div>
            <div class="QA">
                <h2>{{ i18nList.depositHasProblem[language] }}</h2>
                <!-- eslint-disable vue/no-v-html -->
                <p class="contact" v-html="colorYellow(i18nList.depositContact[language])" />
                <!-- eslint-enable vue/no-v-html -->
                <p class="description">{{ i18nList.depositDescription[language] }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import sidebar from './gameNav';
import i18nList from '../config/lang';

export default {
    components: {
        sidebar
    },
    data() {
        return {
            i18nList
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang',
            cdnDomain: 'getCdnDomain'
        }),
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        }
    },
    methods: {
        colorYellow(val) {
            return ['<span class="yellow">', '</span>']
                .reduce((init, newVal) => init.replace('%s', newVal),
                    val);
        }
    }
};
</script>


<style lang="scss" scoped>
.depositHelp {
    padding: 20px 20px 0;

    .content {
        display: inline-block;
        vertical-align: top;
        margin-left: 27px;
        width: 700px;

        h1 {
            color: #867B7C;
            font-size: 14px;
            line-height: 25px;
            margin: 0;
        }

        .intro {
            margin-top: 58px;

            .wechat,
            .alipay,
            .unionPay,
            .unionScan,
            .zdmPay,
            .qqScan,
            .EBankPay,
            .companyDeposit {
                height: 80px;
                padding: 7px 0 7px 100px;
                margin-bottom: 36px;
                position: relative;

                .pay-icon {
                    position: absolute;
                    width: 80px;
                    height: 80px;
                    left: 0;
                    top: 0;
                }

                h3 {
                    color: #ff8c00;
                    font-size: 15px;
                    line-height: 22px;
                    margin: 0;
                }

                .feature {
                    font-size: 14px;
                    line-height: 22px;
                    margin: 0;

                    .yellow {
                        color: #ffd700;
                    }

                    .green {
                        color: #48ff00;
                    }
                }

                .hint {
                    font-size: 12px;
                    line-height: 22px;
                    color: #FFF;
                    margin: 0;
                }
            }

            .EBankPay {
                height: 156px;
            }

            .companyDeposit {
                height: 110px;
                padding: 0 0 0 100px;
            }
        }

        .QA {
            padding-top: 22px;
            color: #FFF;
            font-size: 12px;

            h2 {
                width: 680px;
                background-color: #663333;
                color: #FFD700;
                line-height: 22px;
                font-size: 14px;
                margin: 0;
                font-weight: 700;
            }

            .contact {
                margin: 18px 0 0;

                /deep/ .yellow {
                    color: #FFD700;
                }
            }

            .description {
                margin: 0 0 18px;
            }
        }
    }
}
</style>
