<template>
    <div :class="$style['vip-container']">
        <div :class="$style['vip-bg-block']">
            <img
                :src="$getCdnPath(`/static/image/_new/mcenter/vip/vip_bg.png`)"
                alt="vip_bg"
            />
        </div>
        <!-- Header -->
        <div :class="$style['header-block']">
            <div
                :class="$style['btn-back']"
                @click="$router.push('/mobile/mcenter')"
            >
                <img
                    :src="$getCdnPath(`/static/image/_new/common/btn_back.png`)"
                    alt="btn_back"
                />
            </div>

            <div :class="$style['header-title']">
                <span
                    :class="{
                        [$style['active']]: item.config_id === currentConfigID
                    }"
                    v-for="(item, index) in userVipInfo"
                    :key="item.config_id"
                    @click="handleConfigId(item.config_id)"
                    >{{ item.config_name }}</span
                >

                <span @click="msg = '正在上线 敬请期待'">直播VIP</span>
            </div>

            <message v-if="msg" @close="msg = ''">
                <div slot="msg">{{ msg }}</div>
            </message>
        </div>

        <!-- user info -->
        <template v-if="userVipInfo">
            <vip-user
                :userVipInfo="
                    userVipInfo.find(
                        item => item.config_id === this.currentConfigID
                    )
                "
            />
        </template>

        <!-- level card -->
        <template v-if="vipLevelList && userVipInfo">
            <vip-level-card
                :currentLevelData.sync="setCurrentLevel"
                :vipLevelList="vipLevelList"
                :userVipInfo="
                    userVipInfo.find(
                        item => item.config_id === this.currentConfigID
                    )
                "
            />
        </template>

        <!-- desc -->
        <template v-if="setCurrentLevel">
            <vip-info :currentLevelData="setCurrentLevel" />
        </template>
        <!-- <live-info /> -->
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { API_PORN1_DOMAIN } from "@/config/api";
import { getCookie } from "@/lib/cookie";
import axios from "axios";
import vipUser from "./vipUser";
import vipLevelCard from "./vipLevelCard";
import vipInfo from "./vipInfo";
import liveInfo from "./liveInfo";
import mcenter from "@/api/mcenter";
import message from "../../../../common/new/message";

export default {
    components: {
        Swiper,
        SwiperSlide,
        vipUser,
        vipLevelCard,
        vipInfo,
        liveInfo,
        message
    },
    data() {
        return {
            msg: "",
            currentConfigID: 0,
            userVipInfo: null,
            vipLevelList: null,
            currentLevelData: {}
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: "getSiteConfig",
            memInfo: "getMemInfo"
        }),
        setCurrentLevel: {
            get() {
                return this.currentLevelData;
            },
            set(value) {
                this.currentLevelData = value;
            }
        }
    },
    created() {
        this.getUserDetail();
    },
    methods: {
        getUserDetail() {
            // 取得vip使⽤者詳細資料
            mcenter.vipUserDetail({
                success: res => {
                    if (res && res.ret) {
                        this.userVipInfo = res.ret;

                        // 起始預設 config_id 為分類中的第一筆
                        this.currentConfigID = this.userVipInfo[0].config_id;
                    }
                }
            });
        },
        getVipLevel() {
            // 依vip分類回傳所有等級清單(不分⾴)
            axios({
                method: "get",
                url: `${
                    this.siteConfig.YABO_API_DOMAIN
                }/player/viplevel/${getCookie("cid")}?configId=${
                    this.currentConfigID
                }`,
                headers: { "x-domain": this.memInfo.user.domain }
            }).then(res => {
                if (res && res.data && res.data.data) {
                    this.vipLevelList = res.data.data;
                }
            });
        },
        handleConfigId(value) {
            this.currentConfigID = value;
        }
    },
    watch: {
        currentConfigID() {
            this.getVipLevel();
        }
    }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.vip-container {
    width: 100%;
    height: calc(100% - 60px);
}

.vip-bg-block {
    position: absolute;
    width: 100%;
    height: 320px;
    background: white;

    img {
        width: 100%;
        height: 100%;
    }
}

.header-block {
    position: relative;
    height: 30px;
    text-align: center;
    margin: 0 17px;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    .btn-back {
        position: absolute;
        width: 20px;
        height: 20px;
        left: 0;
        bottom: 0px;
    }
}

.header-title {
    width: 80%;
    font-size: 16px;
    color: $main_text_color1;
    font-weight: 700;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    // 針對 Chrome 與 Safari 隱藏滾動條
    &::-webkit-scrollbar {
        display: none !important;
    }

    span {
        padding: 0 7.5px;

        &.active {
            color: #000000;
        }
    }
}
</style>
