<template>
    <div :class="$style['share-container']">
        <div :class="$style['pic-wrap']">
            <div :class="$style['img']">
                <img
                    :src="
                        $getCdnPath(
                            `/static/image/_new/mcenter/share/shareapp_save.png`
                        )
                    "
                    alt="shareApp"
                />

                <div
                    v-if="agentLink || landingLink"
                    :class="$style['qrcode-wrap']"
                >
                    <qrcode
                        :value="loginStatus ? agentLink : landingLink"
                        :options="{ width: 75, margin: 1 }"
                        tag="img"
                    />
                </div>
            </div>

            <div :class="$style['text']" @click="downloadImage">
                <img
                    :src="
                        $getCdnPath(
                            `/static/image/_new/mcenter/share/btn_tick.png`
                        )
                    "
                />
                {{ btnTickText }}
            </div>
        </div>

        <div :class="$style['func-wrap']">
            <div :class="$style['cancle']" @click="closeShare">取消</div>

            <message v-if="msg" @close="msg = ''">
                <div slot="msg">{{ msg }}</div>
            </message>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import message from "../../../../common/new/message";

export default {
    components: {
        message
    },
    props: {
        isShowShare: {
            type: Boolean,
            require: true
        }
    },
    data() {
        return {
            msg: "",
            landingLink: "",
            domain: "",
            agentCode: ""
        };
    },
    computed: {
        ...mapGetters({
            isPwa: "getIsPwa",
            loginStatus: "getLoginStatus",
            siteConfig: "getSiteConfig",
            agentLink: "getAgentLink"
        }),
        isException() {
            return (
                window.location.hostname === "yaboxxxapp02.com" || this.isPwa
            );
        },
        btnTickText() {
            return this.$text(
                ...(this.isException
                    ? ["S_SCREENSHOT_SAVE", "点击截屏保存"]
                    : ["S_AUTO_SAVE", "自动保存"])
            );
        }
    },
    created() {
        if (this.loginStatus) {
            // 已登入：註冊頁
            this.actionSetAgentLink();
        } else {
            // 未登入：落地頁
            axios({
                method: "get",
                url: `${this.siteConfig.YABO_API_DOMAIN}/system/downloadlink`
            }).then(res => {
                if (res && res.data && res.data.data) {
                    this.landingLink =
                        res.data.data[0].value || res.data.data[1].value;
                }
            });
        }
    },
    methods: {
        ...mapActions(["actionSetAgentLink"]),
        closeShare() {
            this.$emit("update:isShowShare", false);
        },
        downloadImage() {
            if (this.isException) {
                window.open("/mobile/shareDownload", "_blank");
                return;
            }
        }
    }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

@mixin fixed-container-style($opacity) {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 10;

    &::before {
        content: "";
        position: absolute;
        background: #000;
        opacity: $opacity;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
}

.share-container {
    @include fixed-container-style(0.4);
}

.pic-wrap {
    position: absolute;
    width: 270px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    // overflow: hidden;
    .img {
        height: 347px;
        overflow: hidden;
        img {
            width: 100%;
        }
    }
    .text {
        background: #fff;
        color: #78a8f0;
        padding: 9px;
        text-align: center;
        font-size: 12px;
        z-index: 999;
        img {
            vertical-align: middle;
        }
    }

    .qrcode-wrap {
        position: absolute;
        bottom: 9%;
        left: 50%;
        transform: translateX(-50%);
    }
}

.func-wrap {
    position: absolute;
    width: 100%;
    bottom: 0;
    font-weight: 600;
    background: #f5f5f9;

    .func-cell {
        display: inline-block;
        width: 60px;
        text-align: center;
        margin: 15px 0px 10px 17px;

        > div {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            border-radius: 10px;
            background: #fff;
        }

        > p {
            font-size: 12px;
            color: #898989;
            margin-top: 5px;
        }

        img {
            width: 32px;
            height: 32px;
        }
    }

    // cancle
    .cancle {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        height: 45px;
        font-size: 16px;
        color: $main_title_color1;
    }
}
</style>
