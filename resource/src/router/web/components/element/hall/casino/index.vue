<template>
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
    >
        <!-- 電子遊戲板塊 -->
        <theme-default
            :element="element"
            :config="config"
            :vendor-list="vendorList"
            :self-store="$observables"
            :store-methods="casino.getMethods($observables, $root)"
        />
    </main-wrap>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import config from './config';
import casino from './js/casino';
import themeDefault from './template/themeDefault';

export default {
    components: {
        mainWrap: () => import(/* webpackChunkName: 'mainWrap' */'../../common/new/mainWrap'),
        themeDefault
    },
    subscriptions() {
        return cloneDeep(casino.props);
    },
    props: {
        element: {
            type: Object,
            default: () => ({
                // 非模塊，如手機版電子大廳
                i: 'static',
                theme: 'basic'
            })
        }
    },
    data() {
        return {
            config,
            casino
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            gameData: 'getGameData',
            casinoVendor: 'getCasinoVendor',
            curLang: 'getCurLang'
        }),
        /**
         * 遊戲提供廠商代號及名稱對照表
         * @method vendorList
         * @returns {object} 代號及名稱對照表
         */
        vendorList() {
            const result = {
                '': this.$t('S_ALL')
            };

            Object.keys(this.gameData).forEach((type) => {
                if (this.gameData[type].kind === 3 && this.gameData[type].switch === 'Y') {
                    // 因應MG2電子上線, 先將MG電子隱藏
                    if (this.gameData[type].vendor === 'mg') {
                        return;
                    }

                    // 配合 rd5 api 參數，調整 type 名稱
                    const transList = {
                        bbcasino: 'bbin'
                    };
                    const resultType = transList[type] ? transList[type] : type;

                    [result[resultType]] = this.gameData[type].vendor.split('_');

                    if (result[resultType] === 'mg') {
                        result[resultType] = this.$text('S_OLD_MG', '旧MG');
                        return;
                    }

                    if (result[resultType] === 'mg2') {
                        result[resultType] = 'MG';
                        return;
                    }

                    if (result[resultType] === 'rt') {
                        if (this.curLang === 'zh-tw' || this.curLang === 'zh-cn') {
                            result[resultType] = '申博';
                            return;
                        }
                        result[resultType] = 'SBG';
                        return;
                    }

                    if (result[resultType] === 'lg') {
                        result[resultType] = 'XBB';
                    }
                }
            });
            return result;
        }
    },
    created() {
        if (this.isBackEnd) {
            return;
        }
        if (this.$route.path.split('/').filter((path) => path)[0] === 'mobile') {
            const vendor = this.$route.params.vendor || '';

            if (vendor && this.vendorList[vendor]) {
                casino.getMethods(this.$observables, this).setCasino('curVendor$', vendor);
                return;
            }

            if (this.$route.params.type === 'activity') {
                casino.getMethods(this.$observables, this).setCasino('curType$', this.$route.params.type);
                return;
            }

            this.$router.push('/mobile/casino');
            return;
        }

        const nowVendor = this.$route.params.subId && this.vendorList[this.$route.params.subId] ? this.$route.params.subId : '';
        casino.getMethods(this.$observables, this).setCasino('curVendor$', nowVendor);
    }
};
</script>
