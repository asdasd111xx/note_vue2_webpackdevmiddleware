<template>
    <div :class="$style['share-container']">
        <div :class="$style['pic-wrap']">
            <div :class="$style['img']" ref="shareImageBlockRef">
                <img
                    ref="shareImageRef"
                    :src="
                        $getCdnPath(
                            `/static/image/_new/mcenter/share/share_app_f.png`
                        )
                    "
                    alt="shareApp"
                />
                <template v-if="agentLink || landingLink">
                    <div :class="$style['qrcode-wrap']" ref="qrcodeRef">
                        <qrcode
                            :value="loginStatus ? agentLink : landingLink"
                            :options="{ width: 75 }"
                            tag="img"
                        />
                    </div>
                </template>
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
            <!-- <div
                v-for="(item, index) in funcList"
                :key="index"
                :class="$style['func-cell']"
            >
                <div @click="item.callback">
                    <img :src="$getCdnPath(item.imgSrc)" :alt="item.text" />
                </div>
                <p>{{ item.text }}</p>
            </div> -->

            <div :class="$style['cancle']" @click="closeShare">取消</div>

            <message v-if="msg" @close="msg = ''">
                <div slot="msg">{{ msg }}</div>
            </message>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import html2canvas from "html2canvas";
import { API_PROMOTION_INFO } from "@/config/api";
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
            shareImageSrc: "",
            landingLink: "",
            domain: "",
            agentCode: "",
            funcList: [
                {
                    callback: () => {
                        this.copyShareImage();
                    },
                    imgSrc: "/static/image/_new/mcenter/share/btn_copy.png",
                    text: "复制链接"
                },
                {
                    callback: () => {
                        this.downloadImage();
                    },
                    imgSrc: "/static/image/_new/mcenter/share/btn_save.png",
                    text: "保存图片"
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            isPwa: "getIsPwa",
            loginStatus: "getLoginStatus",
            siteConfig: "getSiteConfig"
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
        },

        /**
         * 推廣連結
         * @method agentLink
         * @returns {String} 推廣連結
         */
        agentLink() {
            if (!this.domain || !this.agentCode || !this.loginStatus) {
                return "";
            }

            return `https://${this.domain}/a/${this.agentCode}`;
        }
    },
    created() {
        if (this.loginStatus) {
            // 已登入：註冊頁
            this.getDomain();
            this.getAgentCode();
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
    mounted() {
        this.shareImageSrc = this.$refs.shareImageRef.src;
    },
    methods: {
        closeShare() {
            this.$emit("update:isShowShare", false);
        },

        copyShareImage() {
            this.$copyText(this.shareImageSrc).then(e => {
                this.msg = this.$text("S_COPY_SUCCESSFUL", "复制成功");
            });
        },

        downloadImage() {
            if (this.isPwa) {
                // window.open(this.shareImageSrc);
                html2canvas(this.$refs["qrcodeRef"]).then(canvas => {
                    window.open("").document.write(
                        `
                        <html>
                            <head>
                                <meta name="viewport"
                                        content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                            </head>
                            <body style="margin: 0">
                                <div style="position: relative ; width: 100% ; height: 100%">
                                    <img style="width: 100% ; height: 100%" src=${
                                        this.shareImageSrc
                                    } />
                                    <img style="position: absolute ; height: 14% ; left: 50% ; bottom: 36.5% ;  transform: translate(-50% , 50%)" src=${canvas.toDataURL()} />
                                </div>
                            </body>
                        </html>
                    `
                    );
                });
                return;
            }

            html2canvas(this.$refs["shareImageBlockRef"], {
                useCORS: true
            }).then(canvas => {
                let link = document.createElement("a");
                link.href = canvas.toDataURL();
                link.setAttribute("download", "Yabo.png");
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
            });
        },
        getDomain() {
            axios({
                method: "get",
                url: "/api/v1/c/hostnames"
            }).then(res => {
                if (res.data.result !== "ok") {
                    return;
                }
                this.domain = res.data.ret[0];
            });
        },
        getAgentCode() {
            axios({
                method: "get",
                url: API_PROMOTION_INFO
            }).then(res => {
                if (res.data.result !== "ok") {
                    return;
                }
                this.agentCode = res.data.ret.code;
            });
        }
    }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

$radius: 10px;

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
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 8px;
    overflow: hidden;
    .img {
        height: 368px;
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
        img {
            vertical-align: middle;
        }
    }

    .qrcode-wrap {
        position: absolute;
        bottom: 14%;
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

.option-container {
    @include fixed-container-style(0.6);
}

.option-wrap {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 17px;

    .option-cell {
        width: 100%;
        background: #3a3a3a;
        color: #5f799e;
        text-align: center;
        padding: 15px 0px;
        margin: 0;
    }

    p:first-of-type {
        border-top-left-radius: $radius;
        border-top-right-radius: $radius;
    }

    p:last-of-type {
        border-bottom-left-radius: $radius;
        border-bottom-right-radius: $radius;
    }

    .cancle {
        margin: 5px 0;
        background: #2c2c2e;
        border-radius: $radius;
    }
}
</style>
