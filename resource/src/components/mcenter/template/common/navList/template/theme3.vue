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
        <div class="mcenter-top-info">
            <div
                class="user-picture"
                @mouseenter="showEdit = true"
                @mouseleave="showEdit = false"
            >
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/mcenter/avatar_${nowEditIndex}.png`)" />
                <div
                    v-if="showEdit"
                    class="user-picture-hover"
                    @click="showEditAvatar = true"
                >
                    <span>{{ $text('S_USER_AVATAR', '更改头像') }}</span>
                </div>
            </div>
            <div class="user-info">
                <span>{{ memInfo.user.username }}</span>
                <span class="user-vip">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/mcenter/icon_vip_0.png')" />
                </span>
            </div>
            <p class="join-count">{{ $text('S_COUNT_JOIN_DAYS').replace('%s', createdTime) }}</p>
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
                    <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/mcenter/icon_${item.key}.png`)" />
                    <span>{{ $t(item.text) }}</span>
                </div>
            </template>
            <template v-if="isWonderCasino">
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
        <div v-if="showEditAvatar" class="avatar-wrap">
            <div class="avatar-main-wrap">
                <span class="close-btn" @click="showEditAvatar = false">x</span>
                <div class="avatar-header">
                    <span class="avatar-title">{{ $text('S_MY_AVATAR', '我的头像') }}</span>
                </div>
                <div class="avatar-content">
                    <div class="avatar-current">
                        <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/mcenter/avatar_${nowEditIndex}.png`)" />
                        <p>{{ $text('S_AVATAR_PREVIEW', '头像预览') }}</p>
                    </div>
                    <div class="avatar-choose">
                        <div
                            v-for="num in 5"
                            :key="num"
                            :class="['avatar-item', `${listSwitch ? 'show' : ''}`]"
                        >
                            <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/mcenter/avatar_${num}.png`)" @click="nowEditIndex = num" />
                        </div>
                    </div>
                </div>
                <div class="avatar-footer">
                    <button class="confirm" @click="setAvatar(nowEditIndex)">{{ $text('S_CONFIRM', '确认') }}</button>
                    <button @click="showEditAvatar = false">{{ $text('S_DIALOG_CLOSE_BTN', '关闭') }}</button>
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
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import ajax from '@/lib/ajax';
import mcenter from '@/api/mcenter';
import member from '@/api/member';
import exceptionList from '@/config/exceptionList';

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
            nowEditIndex: '',
            showDropdown: false,
            showEdit: false,
            showEditAvatar: false,
            createdTime: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            mcenterList: 'getMcenterList',
            webInfo: 'getWebInfo',
            vip: 'getVip'
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
                if (data.key === 'tcenter' && !this.memInfo.config.infinity) {
                    return;
                }

                if (data.key === 'account' && this.vip.enable) {
                    data.item.push({ key: 'vipExclusive', text: 'S_VIP_EXCLUSIVE' });
                }

                result.push(data);
            });

            return result;
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
    created() {
        if (this.memInfo.user.image === 0) {
            this.nowEditIndex = 1;
        } else {
            this.nowEditIndex = this.memInfo.user.image;
        }

        member.data({
            success: (res) => {
                this.countDays(res.ret.user.created_at);
            }
        });
    },
    methods: {
        ...mapActions([
            'actionSetUserdata'
        ]),
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
        setAvatar(index) {
            if (this.memInfo.user.image === index) return;

            mcenter.accountDataSet({
                params: { image: index },
                success: () => {
                    this.actionSetUserdata();
                    this.showEditAvatar = false;
                }
            });
        },
        countDays(ceatedTime) {
            const startTime = moment(ceatedTime);
            const now = moment(new Date());

            this.createdTime = now.diff(startTime, 'days');
        }
    }
};
</script>

<style lang="scss" src="../../../../css/common/navList/index.scss" scoped></style>
