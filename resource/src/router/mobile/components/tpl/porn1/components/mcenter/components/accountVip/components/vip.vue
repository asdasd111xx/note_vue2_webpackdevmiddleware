<template>
    <vip :class="[$style['vip-main-wrap']]">
        <template
            scope="{ vipLevelList, vipConfig, userVipInfo, previewLevel, isNextLevel, nowTypeLevel, nowMobileIndex, badgeList, isDisplay, changeMobileIndex }"
        >
            <url-list
                v-if="isShowUrl"
                :url-list="allUrlList"
                @close="switchUrlList"
            />
        </template>
    </vip>
</template>

<script>
import { mapGetters } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import vip from "@/components/common/mcenter/vip";
import ajax from "@/lib/ajax";

export default {
    components: {
        mcenterHeader: () =>
            import(
                /* webpackChunkName: 'mcenterHeader' */ "@/router/mobile/components/common/mcenter/theme1/header"
            ),
        urlList: () =>
            import(
                /* webpackChunkName: 'urlList' */ "@/router/mobile/components/common/mcenter/theme1/vip/urlList"
            ),
        vip,
        Swiper,
        SwiperSlide
    },
    data() {
        return {
            headerSetting: {
                title: "VIP",
                leftBtns: {
                    icon: "arrow",
                    onClick: () => this.$router.push("/mobile/mcenter")
                },
                balance: true
            },
            isShowUrl: false,
            isGoUrl: false,
            allUrlList: []
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: "getSiteConfig"
        })
    },
    created() {
        ajax({
            method: "get",
            url: "/api/v1/c/vip/hostnames",
            errorAlert: false,
            success: ({ result, ret }) => {
                if (result === "ok" && ret.length > 0) {
                    this.isGoUrl = true;
                    this.allUrlList = ret;
                }
            }
        });
    },
    methods: {
        switchUrlList(isDisplay) {
            this.isShowUrl = isDisplay;
        },
        showHtml(info, levelUpTip) {
            if (info.is_max_level) {
                return this.$text(
                    "S_YOU_ALREADY_HIGHEST_LEVEL",
                    "您的等级已是当前最高等级"
                );
            }

            if (info.is_achieve) {
                return this.$text("S_YOU_MET_PROMOTION_REQUIREMENTS", {
                    text: "您已满足%s晋级条件",
                    replace: [
                        {
                            target: "%s",
                            value: info.next_level_alias
                        }
                    ]
                });
            }

            return levelUpTip;
        },
        notShowInfoList(dir, thisInfo) {
            if (!thisInfo) {
                return true;
            }
            if (dir === "line_up") {
                if (!thisInfo.downgrade) {
                    return true;
                }
                if (
                    parseFloat(
                        +thisInfo.now_birth_amount + +thisInfo.now_gift_amount
                    ) <= 0 ||
                    parseFloat(thisInfo.downgrade_valid_bet) <= 0
                ) {
                    return true;
                }
            }
            if (dir === "line_down") {
                if (
                    parseFloat(thisInfo.gift_amount) <= 0 ||
                    parseFloat(thisInfo.birth_amount) <= 0
                ) {
                    return true;
                }
            }
            if (
                dir === "downgrade_valid_bet" &&
                !thisInfo.downgrade &&
                thisInfo.downgrade_achieve
            ) {
                return true;
            }
            if (dir !== "claim_amount" && parseFloat(thisInfo[`${dir}`]) <= 0) {
                return true;
            }
            if (
                parseFloat(
                    +thisInfo.now_birth_amount + +thisInfo.now_gift_amount
                ) <= 0
            ) {
                return true;
            }
            return false;
        },
        commaFormat(value) {
            // 加上千分位符號
            return value
                .toString()
                .replace(
                    /^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/,
                    (all, pre, groupOf3Digital) =>
                        pre + groupOf3Digital.replace(/\d{3}/g, ",$&")
                );
        }
    }
};
</script>

<style lang="scss" module>
.vip-main-wrap {
}
</style>
