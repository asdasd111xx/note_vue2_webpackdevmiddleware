<template>
    <div :class="['mcenter-list-wrap', `${listSwitch ? 'show' : ''}`, `${$route.name === 'webview' ? 'app' : ''}`]">
        <div class="mcenter-select" @click="listSelect()">
            <template>{{ listTitle }}</template>
            <span class="select-arrow">
                <icon
                    v-if="!listSwitch"
                    name="chevron-down"
                    width="20"
                    height="20"
                />
                <icon
                    v-else
                    name="chevron-up"
                    width="20"
                    height="20"
                />
            </span>
        </div>
        <div :class="`mcenter-list ${listSwitch ? 'show' : ''}`">
            <template v-for="title in mcenterListFilter">
                <div :key="`${title.key}-line`" class="list-title-line" />
                <div
                    :key="`${title.key}`"
                    :class="`list-title ${title.key == titleCurrent ? 'current' : ''} `"
                    :title="$i18n.locale === 'ja' ? `${$t(title.text)}` : '' "
                >
                    <div :class="[title.key, 'title-icon']" />
                    {{ $t(title.text) }}
                </div>
                <div
                    v-for="item in title.item"
                    :key="item.key"
                    :title="$t(item.text)"
                    :class="`list-item ${item.key} ${item.key == isCurrent ? 'current' : ''} `"
                    @click="navChangePage(item.key)"
                >
                    {{ $t(item.text) }}
                </div>
            </template>
            <template v-if="isException">
                <div class="list-title-line" />
                <div
                    :title="$i18n.locale === 'ja' ? `${$t('S_AGENT')}` : '' "
                    class="list-title jp-agent"
                    @click="onJpAgent"
                >
                    {{ $t('S_AGENT') }}
                </div>
            </template>
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
            haveThirdLink: false
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
        listTitle() {
            let first;
            let last;

            this.mcenterList.some((info) => {
                if (info.key !== this.titleCurrent) {
                    return false;
                }

                first = this.$t(info.text);
                return info.item.some((value) => {
                    if (value.key !== this.isCurrent) {
                        return false;
                    }

                    last = this.$t(value.text);
                    return true;
                });
            });

            return `${first} - ${last}`;
        },
        mcenterListFilter() {
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

                    result.push({ ...data, item });
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
                        if (info.key === 'commission' && this.memInfo.config.wage && !this.haveThirdLink) {
                            return;
                        }

                        item.push(info);
                    });

                    result.push({ ...data, item });

                    return;
                }

                result.push(data);
            });

            return result;
        },
        // 特例判斷
        isException() {
            const { wonderCasino, knightCasino } = exceptionList;
            return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
        }
    },
    watch: {
        isCurrent() {
            this.findTitle();
        }
    },
    created() {
        ajax({
            method: 'get',
            url: API_COMMISSION_LINK,
            success: (response) => {
                if (response.ret.uri) {
                    this.haveThirdLink = true;
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
        }
    }
};
</script>

<style lang="scss" src="../../../../css/common/navList/index.scss" scoped></style>
