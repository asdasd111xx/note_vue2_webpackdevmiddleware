<template>
    <div :class="$style['footer-wrap']">
        <div :class="$style.footer">
            <div :class="$style['vendor-list']">
                <div
                    v-for="vendor in vendorList"
                    :key="vendor"
                    :class="$style['vendor-icon']"
                >
                    <img :class="$style.imgin" :src="$getCdnPath(`/static/image/tpl/customizeHome/48/footer/img_logo_${vendor}.png`)" />
                    <img :class="$style.imgout" :src="$getCdnPath(`/static/image/tpl/customizeHome/48/footer/img_logo_${vendor}_hover.png`)" />
                </div>
            </div>
            <div :class="$style['footer-info-wrap']">
                威尼斯人贵宾厅拥有欧洲马耳他博彩管理局（MGA）、英国GC监督委员会（Gambling Commission）和菲律宾政府博彩委员会（PAGCOR）颁发的合法执照。
                <br /> 注册于英属维尔京群岛，是受国际博彩协会认可的合法博彩公司。进行注册并娱乐前，请确保您年满18周岁！
            </div>
            <div :class="$style['commission-info-wrap']">
                <div
                    v-for="commission in commissionList"
                    :key="commission.type"
                    :class="$style['commission-wrap']"
                >
                    <img :class="$style.imgin" :src="$getCdnPath(`/static/image/tpl/customizeHome/48/footer/logo_${commission.type}_n.png`)" />
                    <img :class="$style.imgout" :src="$getCdnPath(`/static/image/tpl/customizeHome/48/footer/logo_${commission.type}_hover.png`)" />
                    <div :class="$style['commission-text']">{{ commission.text }}</div>
                </div>
            </div>
            <div :class="$style['footer-info-wrap']">
                <div
                    v-for="(link, index) in linkList"
                    :key="index"
                    :class="$style['link-wrap']"
                    @click="$router.push(`/page/${link.link}`)"
                >
                    {{ link.text }}
                    <span v-if="index < 4">|</span>
                </div>
            </div>
            <div :class="$style['footer-info-wrap']">
                <div class="footer-copyright">版权所有  ©2018-2019{{ memInfo.config.domain_name[$i18n.locale] }}  保留所有权</div>
                <!-- eslint-disable vue/no-v-html -->
                <div class="footer-info" v-html="webInfo.footer[$i18n.locale]" />
                <!-- eslint-enable vue/no-v-html -->
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            vendorList: ['bbin', 'ag', 'pt', 'ab', 'mg', 'jdb', 'lg', 'gd', 'bf', 'bg', 'yg', 'ky'],
            commissionList: [
                { text: '英国GC监督委员会', type: 'cg' },
                { text: '马耳他博彩牌照（MGA）认证', type: 'mga' },
                { text: '英属维尔京群岛（BVI）认证', type: 'bvi' },
                { text: '菲律宾（PAGCOR）监督博彩牌照', type: 'pagcor' }
            ],
            linkList: [
                // { text: '新手帮助', link: 10461 },
                { text: '博彩责任', link: 10475 },
                { text: '隐私保护', link: 10480 },
                { text: '规则条款', link: 10477 },
                { text: '联系我们', link: 10479 },
                { text: '会员帮助', link: 10940 }
                // { text: '合营计划', link: 10478 }
            ]
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        thirdLinkOpen(link, name) {
            window.open(link, name);
        }
    }
};
</script>

<style lang="scss" module>
.footer-wrap {
    width: 100%;
    height: 399px;
    background: #222;
    padding: 29px 0 13px;
    overflow: hidden;
    position: relative;
}

.footer {
    margin: 0 auto;
}

.vendor-list {
    margin-bottom: 18px;
    padding-bottom: 22px;
    background: url('/static/image/tpl/customizeHome/48/footer/img_xian.png') 0 100% no-repeat;
    text-align: center;
}

.vendor-icon {
    display: inline-block;
    margin-right: 19px;
    vertical-align: middle;
    cursor: pointer;

    &:hover {
        .imgout {
            display: block;
        }

        .imgin {
            display: none;
        }
    }

    &:last-child{
        margin-right: 0;
    }
}

.imgin {
    display: block;
    margin: 0 auto;
}

.imgout {
    display: none;
}

.footer-info-wrap {
    margin-bottom: 20px;
    text-align: center;
    font-size: 14px;
    color: #666;
}

.commission-info-wrap {
    composes: footer-info-wrap;
    width: 900px;
    margin: 0 auto 20px;
}

.commission-wrap {
    display: inline-block;
    width: 25%;
    cursor: pointer;

    &:hover {
        .imgout {
            display: block;
            margin: 0 auto;
        }

        .imgin {
            display: none;
        }

        .commission-text {
            color: #CCC;
        }
    }
}

.commission-text {
    margin-top: 10px;
}

.link-wrap {
    display: inline-block;
    cursor: pointer;

    span {
        margin: 0 20px;
        cursor: initial;
    }

    &:hover {
        color: #CCC;
        span {
            color: #7C8797;
            cursor: initial;
        }
    }
}

.sponsors-link-wrap {
    display: inline-block;
    margin-right: 30px;
    cursor: pointer;

    &:hover {
        .imgout {
            display: block;
            margin: 0 auto;
        }

        .imgin {
            display: none;
        }
    }
}
</style>
