<template>
    <div :class="[$style['mcenter-header-wrap'], $style[`theme-${siteConfig.MOBILE_WEB_TPL}`], colorClass]">
        <div :class="$style['mcenter-header-title']">{{ memInfo.config.domain_name[curLang] }}</div>
        <div :class="$style['header-wrap']">
            <!-- 左上角按鈕 -->
            <div v-if="settings.leftBtns" :class="$style['btn-wrap']">
                <div :class="[$style[`header-btn`], `icon-${settings.leftBtns.icon}`]" @click="() => { onLeftBtnClick(settings.leftBtns); }">
                    <icon :name="headerBtnName"/>
                </div>
            </div>
            <!-- 標題與 Logo -->
            <span v-if="settings.title" :class="$style.title">{{ settings.title }}</span>
            <!-- 餘額按鈕 -->
            <div
                v-if="loginStatus && settings.balance"
                :class="$style['btn-balance']"
                @click="setMenuState('balance')"
            >
                <div>
                    <icon name="dollar-sign"/>
                </div>
            </div>
            <!-- 右上按鈕 -->
            <template v-if="settings.rightBtns && settings.rightBtns.icon">
                <!-- 登出 -->
                <div
                    v-if="settings.rightBtns.icon === 'logout'"
                    :class="$style['logout-btn']"
                    @click="onLogout"
                >
                    {{ $text('S_LOGOUT', '登出') }}
                </div>
                <!-- 自定義按鈕 -->
                <div
                    v-else
                    :class="[$style['btn-wrap-right'], { [$style['loading']] : isLoading }]"
                    @click="isLoading ? null : onRightBtnClick(settings.rightBtns)"
                >
                    <icon :class="$style[`header-btn-right`]" :name="settings.rightBtns.icon" />
                </div>
            </template>
            <!-- 側邊選單-餘額 -->
            <balance v-else-if="currentMenu === 'balance'" :open-state.sync="currentMenu" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import balance from './components/balance';

export default {
    components: {
        balance
    },
    props: {
        headerSetting: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            currentMenu: ''
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            cdnDomain: 'getCdnDomain',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            curLang: 'getCurLang',
            siteConfig: 'getSiteConfig',
            isLoading: 'getIsLoading'
        }),
        settings() {
            return {
                title: '',
                leftBtns: {},
                rightBtns: {},
                balance: false,
                gameList: false,
                ...this.headerSetting
            };
        },
        headerBtnName() {
            if (this.settings.leftBtns.icon === 'arrow') {
                return 'chevron-left';
            }
            if (this.settings.leftBtns.icon === 'close') {
                return 'times';
            }
            return '';
        },
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    methods: {
        onLeftBtnClick(info) {
            if (info.onClick) {
                info.onClick();
                return;
            }

            switch (info.icon) {
                case 'home':
                    this.$router.push('/mobile');
                    break;
                case 'arrow':
                    this.$router.go(-1);
                    break;
                case 'hamburger':
                    this.setMenuState('sideMenu');
                    break;
                default:
                    break;
            }
        },
        onRightBtnClick(info) {
            if (info.onClick) {
                info.onClick();
            }
        },
        // 設定選單狀態
        setMenuState(value) {
            this.currentMenu = (this.currentMenu === value) ? '' : value;
        },
        onLogout() {
            member.logout().then(() => { window.location.reload(); });
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module></style>
