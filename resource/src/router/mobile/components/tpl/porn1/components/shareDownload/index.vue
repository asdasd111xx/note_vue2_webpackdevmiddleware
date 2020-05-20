<template>
    <div>
        <div
            :class="$style['back']"
            @click="$router.push('/mobile/mcenter/home')"
        >
            <img
                :src="$getCdnPath(`/static/image/_new/common/btn_back.png`)"
                alt="back"
            />
        </div>
        <div :class="$style['pic-wrap']">
            <img
                :src="
                    $getCdnPath(
                        `/static/image/_new/mcenter/share/share_app_f.png`
                    )
                "
                alt="shareApp"
            />

            <div v-if="agentLink || landingLink" :class="$style['qrcode-wrap']">
                <qrcode
                    :value="loginStatus ? agentLink : landingLink"
                    :options="{ width: 75, margin: 1 }"
                    tag="img"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
    data() {
        return {
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
        })
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
        ...mapActions(["actionSetAgentLink"])
    }
};
</script>

<style lang="scss" module>
.back {
    position: absolute;
    width: 20px;
    height: 20px;
    z-index: 1;
    top: 5px;
    left: 5px;

    img {
        width: 100%;
        height: 100%;
    }
}
.pic-wrap {
    position: relative;
    width: 100%;
    height: 100%;

    img {
        width: 100%;
        height: 100%;
    }

    .qrcode-wrap {
        position: absolute;
        bottom: 29.5%;
        left: 50%;
        transform: translateX(-50%);
        width: 25%;
    }
}
</style>
