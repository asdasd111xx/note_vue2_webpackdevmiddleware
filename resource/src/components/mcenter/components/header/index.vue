<template>
    <div
        :class="[
            $style['mcenter-header-wrap'],
            $style[`theme-${siteConfig.MOBILE_WEB_TPL}`],
            colorClass
        ]"
    >
        <div :class="$style['header-wrap']">
            <!-- 左上角按鈕 -->
            <div v-if="settings.leftBtns" :class="$style['btn-wrap']">
                <div
                    :class="[
                        $style[`header-btn`],
                        `icon-${settings.leftBtns.icon}`
                    ]"
                    @click="
                        () => {
                            onLeftBtnClick(settings.leftBtns);
                        }
                    "
                >
                    <icon :name="headerBtnName" />
                </div>
            </div>
            <!-- 標題與 Logo -->
            <span v-if="settings.title" :class="$style.title">{{
                settings.title
            }}</span>
            <!-- 餘額按鈕 -->
            <div
                v-if="loginStatus && settings.balance"
                :class="$style['btn-balance']"
                @click="setMenuState('balance')"
            >
                <div>
                    <icon name="dollar-sign" />
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
                    {{ $text("S_LOGOUT", "登出") }}
                </div>
                <!-- 自定義按鈕 -->
                <div
                    v-else
                    :class="[
                        $style['btn-wrap-right'],
                        { [$style['loading']]: isLoading }
                    ]"
                    @click="
                        isLoading ? null : onRightBtnClick(settings.rightBtns)
                    "
                >
                    <icon
                        :class="$style[`header-btn-right`]"
                        :name="settings.rightBtns.icon"
                    />
                </div>
            </template>
            <!-- 側邊選單-餘額 -->
            <balance
                v-else-if="currentMenu === 'balance'"
                :open-state.sync="currentMenu"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import member from "@/api/member";
import balance from "./components/balance";

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
            currentMenu: ""
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: "getLoginStatus",
            cdnDomain: "getCdnDomain",
            webInfo: "getWebInfo",
            memInfo: "getMemInfo",
            curLang: "getCurLang",
            siteConfig: "getSiteConfig",
            isLoading: "getIsLoading"
        }),
        settings() {
            return {
                title: "",
                leftBtns: {},
                rightBtns: {},
                balance: false,
                gameList: false,
                ...this.headerSetting
            };
        },
        headerBtnName() {
            if (this.settings.leftBtns.icon === "arrow") {
                return "chevron-left";
            }
            if (this.settings.leftBtns.icon === "close") {
                return "times";
            }
            return "";
        },
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this
                        .$style[`site-${this.memInfo.user.domain}`],
                    [this.$style["preset-color"]]: !this.$style[
                        `site-${this.memInfo.user.domain}`
                    ]
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
                case "home":
                    this.$router.push("/mobile");
                    break;
                case "arrow":
                    this.$router.go(-1);
                    break;
                case "hamburger":
                    this.setMenuState("sideMenu");
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
            this.currentMenu = this.currentMenu === value ? "" : value;
        },
        onLogout() {
            member.logout().then(() => {
                window.location.reload();
            });
        }
    }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

$headerColor: #f4d8af;

.mcenter-header-wrap {
    background: $main_white_color1;
    position: fixed;
    z-index: 200;
    width: 100%;
    min-height: 43px;
    top: 0;
    left: 0;
    text-align: center;
}

.mcenter-header-title {
    height: 23px;
    line-height: 23px;
    padding-left: 9px;
    text-align: left;
    font-size: 12px;
}

.header-wrap {
    position: relative;
    min-height: 43px;
    line-height: 43px;
}

.btn-wrap {
    position: absolute;
    top: 0;
    left: 0;
}

.btn-wrap-right {
    position: absolute;
    top: 0;
    right: 0;
}

.header-btn {
    float: left;
    margin: 3px 0 0 12px;
    width: 20px;
    height: 20px;
    cursor: pointer;

    svg {
        color: #626671;
    }
}

.header-btn-right {
    float: left;
    margin: 10px 12px 0 0;
    width: 20px;
    height: 20px;
    cursor: pointer;
    background-position: 50% 0;
    background-repeat: no-repeat;
    background-size: 100%;
}

.title {
    font-size: 16px;
    font-weight: 500;
}

.logo {
    display: block;
    position: relative;
    height: 32px;
    margin: 5px auto;
}

.logout-btn {
    position: absolute;
    top: 0;
    right: 15px;
    cursor: pointer;
}

.btn-balance {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 10px;
    right: 14px;
    background-position: 50% 0;
    background-repeat: no-repeat;
    background-size: 100%;
    div {
        width: 100%;
        height: 100%;
        position: relative;
        border: 1px solid $headerColor;
        color: $headerColor;
        border-radius: 50%;
    }
    svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.loading {
    color: #cbcbcb;
}
</style>
