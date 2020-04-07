<template>
    <div
        :class="[
            'mcenter-list-wrap',
            `${listSwitch ? 'show' : ''}`,
            `${$route.name === 'webview' ? 'app' : ''}`,
            'brilliant'
        ]"
    >
        <div class="mcenter-list">
            <div class="list-title-wrap">
                <div
                    v-for="title in mcenterTitleFilter"
                    :key="`${title.key}`"
                    :class="`list-title ${title.key == titleCurrent ? 'current' : ''} `"
                    :title="$i18n.locale === 'ja' ? `${$t(title.text)}` : '' "
                    @click="titleChange(title.key)"
                >
                    <div :class="[title.key, 'title-icon']" />
                    <span>{{ $t(title.text) }}</span>
                </div>
                <div
                    v-if="isWonderCasino"
                    :title="$i18n.locale === 'ja' ? `${$t('S_AGENT')}` : '' "
                    class="list-title jp-agent"
                    @click="onJpAgent"
                >
                    {{ $t('S_AGENT') }}
                </div>
            </div>
            <div class="list-item-wrap">
                <div
                    v-for="item in mcenterPageList"
                    :key="item.key"
                    :title="$t(item.text)"
                    :class="`list-item ${item.key} ${item.key == isCurrent ? 'current' : ''} `"
                    @click="navChangePage(item.key)"
                >
                    {{ $t(item.text) }}
                </div>
            </div>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .title-icon[{{ this.$options._scopeId }}] {
                background-image: url('/static/image/mcenter/member_menu_icon.png');
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';
import exceptionList from '@/config/exceptionList';
import { API_COMMISSION_LINK } from '@/config/api';

export default {
    props: {
        navChangePage: {
            type: Function,
            default: () => {}
        },
        listSelect: {
            type: Function,
            default: () => {}
        },
        isCurrent: {
            type: String,
            default: ''
        },
        listSwitch: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            titleCurrent: 'account',
            isThirdLink: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            mcenterList: 'getMcenterList',
            webInfo: 'getWebInfo'
        }),
        hasVip() {
            // VIP啟用判斷
            return this.memInfo.user.display_vip;
        },
        mcenterTitleFilter() {
            const mcenterData = cloneDeep(this.mcenterList);
            const result = [];

            mcenterData.forEach((data) => {
                if (data.key === 'account') {
                    const item = [];

                    data.item.forEach((info) => {
                        if (info.key === 'accountVip' && !this.hasVip) {
                            return;
                        }

                        item.push(info);
                    });

                    result.push({ ...data, item });
                    return;
                }

                if (data.key === 'bank') {
                    const item = [];

                    data.item.forEach((info) => {
                        // 日本站特例移除紅利帳戶
                        if (info.key === 'bonusAccount' && this.isException) {
                            return;
                        }

                        item.push(info);
                    });

                    // 輝煌會員中心title字樣與basic不同
                    result.push({
                        ...data,
                        text: 'S_MY_PURSE',
                        item
                    });
                    return;
                }

                // 無限層廳才顯示團隊中心
                if (data.key === 'tcenter') {
                    const item = [];

                    if (!this.memInfo.config.infinity) {
                        return;
                    }

                    data.item.forEach((info) => {
                        // 我的佣金為第三方佣金，但第三方佣金沒有提供連結
                        if (info.key === 'commission' && this.memInfo.config.wage && this.isThirdLink) {
                            return;
                        }
                        item.push(info);
                    });

                    // 輝煌會員中心title字樣與basic不同
                    result.push({
                        ...data,
                        text: 'S_PROMOTE_MONEY',
                        item
                    });
                    return;
                }

                result.push(data);
            });

            return result;
        },
        mcenterPageList() {
            return this.mcenterTitleFilter.filter((item) => item.key === this.titleCurrent)[0].item;
        },
        // 特例判斷
        isException() {
            const { wonderCasino, knightCasino } = exceptionList;
            return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
        },
        isWonderCasino() {
            const { wonderCasino } = exceptionList;
            return wonderCasino.includes(this.webInfo.alias);
        }
    },
    watch: {
        isCurrent() {
            this.findTitle();
        }
    },
    mounted() {
        this.findTitle();
    },
    created() {
        ajax({
            method: 'get',
            url: API_COMMISSION_LINK,
            success: (response) => {
                if (!response.ret.uri) {
                    this.isThirdLink = true;
                }
            }
        });
    },
    methods: {
        findTitle() {
            Object.keys(this.mcenterList).forEach((index) => {
                Object.keys(this.mcenterList[index].item).forEach((idx) => {
                    if (this.mcenterList[index].item[idx].key === this.isCurrent) {
                        this.titleCurrent = this.mcenterList[index].key;
                    }
                });
            });
        },
        onJpAgent() {
            let url;
            if (this.webInfo.alias === '110' || this.webInfo.alias === '123') {
                url = '/api/v1/c/link/customize?id=239eebc812b5772e585583d6025a7e2e6f322bb3&type=reward';
            } else {
                url = '/api/v1/c/link/customize?id=67873859460a046124c6563448ed09c7f92ab34e&type=reward';
            }

            ajax({
                method: 'get',
                url,
                errorAlert: false,
                success: (response) => {
                    window.open(response.ret.uri);
                }
            });
        },
        titleChange(val) {
            const curPage = this.mcenterTitleFilter.filter((item) => item.key === val)[0].item[0].key;
            this.titleCurrent = val;
            this.navChangePage(curPage);
        }
    }
};
</script>

<style lang="scss" src="../../../../css/common/navList/index.scss" scoped></style>
