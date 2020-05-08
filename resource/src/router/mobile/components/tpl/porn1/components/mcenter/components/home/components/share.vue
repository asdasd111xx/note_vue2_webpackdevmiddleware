<template>
    <div :class="$style['share-container']">
        <div :class="$style['pic-wrap']">
            <!-- 未登入:落地頁 -->
            <div v-if="!loginStatus" :class="$style['img']">
                <img
                    ref="shareAppImage"
                    :src="
                        $getCdnPath(
                            `/static/image/_new/mcenter/share/share_app.png`
                        )
                    "
                    alt="shareApp"
                />
            </div>

            <!-- 已登入:註冊頁 -->
            <div v-else :class="$style['img']">
                <img
                    ref="shareAppImage"
                    :src="
                        $getCdnPath(
                            `/static/image/_new/mcenter/share/share_app_n.jpg`
                        )
                    "
                    alt="shareApp"
                />
                <template v-if="agentLink">
                    <div :class="$style['qrcode-wrap']">
                        <qrcode
                            :value="agentLink"
                            :options="{ width: 80 }"
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
            loginStatus: "getLoginStatus"
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
            this.getDomain();
            this.getAgentCode();
        }
    },
    mounted() {
        this.shareImageSrc = this.$refs.shareAppImage.src;
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
                window.open(this.shareImageSrc);
                return;
            }

            axios({
                url: this.shareImageSrc,
                methods: "GET",
                responseType: "blob"
            }).then(res => {
                const fileURL = window.URL.createObjectURL(
                    new Blob([res.data])
                );

                const fileLink = document.createElement("a");
                fileLink.href = fileURL;
                fileLink.setAttribute("download", "yabo.png");
                document.body.appendChild(fileLink);

                this.msg = this.$text(
                    "S_PICTURE_SAVED_TO_LOCAL",
                    "图片已保存到本地相册"
                );

                fileLink.click();
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
        /**
         * 取得推廣代碼
         * @method getAgentCode
         */
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
        bottom: 8%;
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
