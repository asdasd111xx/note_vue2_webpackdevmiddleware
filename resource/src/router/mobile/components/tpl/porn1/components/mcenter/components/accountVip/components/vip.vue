<template>
    <div :class="[$style['vip-container']]">
        <div :class="[$style['vip-bg-block']]">
            <img
                :src="$getCdnPath(`/static/image/_new/mcenter/vip/vip_bg.png`)"
                alt="vip_bg"
            />
        </div>
        <!-- Header -->
        <div :class="[$style['header-block']]">
            <div
                :class="[$style['btn-back']]"
                @click="$router.push('/mobile/mcenter')"
            >
                <img
                    :src="$getCdnPath(`/static/image/_new/common/btn_back.png`)"
                    alt="btn_back"
                />
            </div>

            <div :class="[$style['header-title']]">
                <span :class="[$style['active']]">VIP特权</span>
                <span>直播VIP</span>
            </div>
        </div>

        <!-- user info -->
        <template v-if="userVipInfo">
            <vip-user :userVipInfo="userVipInfo" />
        </template>

        <!-- level card -->
        <template v-if="vipLevelList">
            <vip-level-card :vipLevelList="vipLevelList" />
        </template>

        <!-- desc -->
        <template v-if="userVipInfo && vipLevelList">
            <vip-info />
        </template>
        <!-- <live-info /> -->
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import vipUser from "./vipUser";
import vipLevelCard from "./vipLevelCard";
import vipInfo from "./vipInfo";
import liveInfo from "./liveInfo";
import ajax from "@/lib/ajax";
import mcenter from "@/api/mcenter";
import common from "@/api/common";

export default {
    components: {
        Swiper,
        SwiperSlide,
        vipUser,
        vipLevelCard,
        vipInfo,
        liveInfo
    },
    data() {
        return {
            index: 0,
            vipLevelList: null,
            vipConfig: [],
            userVipInfo: null,
            nowTypeLevel: {},
            badgeList: {},
            isNextLevel: {},
            isDisplay: false
        };
    },
    computed: {
        selectedIndex: {
            get() {
                return this.index;
            },
            set(value) {
                this.index = value;
            }
        }
    },
    created() {
        this.getUserDetail();
        this.getVipConfig();
    },
    mounted() {},
    methods: {
        getUserDetail() {
            // 取得vip使⽤者詳細資料
            mcenter.vipUserDetail({
                success: response => {
                    response.ret.forEach((info, index) => {
                        this.getVipLevel(info).then(() => {
                            common.image(
                                {
                                    success: res => {
                                        const list = {
                                            ...info,
                                            img_badge_src: res.ret,
                                            levelUpTip: this.$text(
                                                "S_VIP_FOREWORD",
                                                "您只需要"
                                            )
                                        };
                                        const vipContent = [];
                                        if (info.config_image_tag) {
                                            list.img_card_src = `/static/image/mcenter/vip/${info.config_image_tag}.jpg`;
                                        }
                                        if (+info.upgrade_valid_bet > 0) {
                                            vipContent.push(
                                                `${this.$text("S_VIP_BET_TIP", {
                                                    replace: [
                                                        {
                                                            target: "%s",
                                                            value: `<span class="vip-value">${this.commaFormat(
                                                                info.upgrade_valid_bet
                                                            )}</span>`
                                                        }
                                                    ]
                                                })}`
                                            );
                                        }
                                        if (+info.upgrade_deposit_times > 0) {
                                            vipContent.push(
                                                `${this.$text(
                                                    "S_VIP_DEPOSIT_TIMES",
                                                    {
                                                        replace: [
                                                            {
                                                                target: "%s",
                                                                value: `<span class="vip-value">${info.upgrade_deposit_times}</span>`
                                                            }
                                                        ]
                                                    }
                                                )}`
                                            );
                                        }
                                        if (+info.upgrade_deposit_amount > 0) {
                                            vipContent.push(
                                                `${this.$text(
                                                    "S_VIP_DEPOSIT_AMOUNT",
                                                    {
                                                        replace: [
                                                            {
                                                                target: "%s",
                                                                value: `<span class="vip-value">${this.commaFormat(
                                                                    info.upgrade_deposit_amount
                                                                )}</span>`
                                                            }
                                                        ]
                                                    }
                                                )}`
                                            );
                                        }
                                        if (+info.upgrade_deposit_total > 0) {
                                            vipContent.push(
                                                `${this.$text(
                                                    "S_VIP_DEPOSIT_TOTAL",
                                                    {
                                                        replace: [
                                                            {
                                                                target: "%s",
                                                                value: `<span class="vip-value">${this.commaFormat(
                                                                    info.upgrade_deposit_total
                                                                )}</span>`
                                                            }
                                                        ]
                                                    }
                                                )}`
                                            );
                                        }

                                        list.levelUpTip += vipContent.join(
                                            "，"
                                        );
                                        list.levelUpTip += `${this.$text(
                                            "S_VIP_LEVEL_ALIAS",
                                            {
                                                replace: [
                                                    {
                                                        target: "%s",
                                                        value: `<span class="vip-value">${info.next_level_alias}</span>`
                                                    }
                                                ]
                                            }
                                        )}`;

                                        if (!list.is_lock) {
                                            // this.$set(
                                            //     this.userVipInfo,
                                            //     info.config_id,
                                            //     list
                                            // );
                                            this.userVipInfo = list;
                                        }

                                        if (index + 1 === response.ret.length) {
                                            this.isDisplay = true;
                                        }
                                    }
                                },
                                info.icon_image_id
                            );
                        });
                    });
                }
            });
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
        },
        getVipConfig() {
            // 取得vip參數檔清單
            mcenter.vipConfigList({
                success: response => {
                    this.vipConfig = response.ret;
                }
            });
        },
        getVipLevel(info) {
            // 依vip分類回傳所有等級清單(不分⾴)
            return mcenter.vipLevelList({
                params: {
                    config_id: info.config_id
                },
                success: result => {
                    this.$set(this.badgeList, info.config_id, []);
                    const showIndex = result.ret
                        .map(item => item.id)
                        .indexOf(info.now_level_id);

                    if (showIndex !== 0) {
                        const resultVipList = result.ret.slice(
                            showIndex,
                            result.ret.length
                        );
                        // this.$set(
                        //     this.vipLevelList,
                        //     info.config_id,
                        //     resultVipList
                        // );
                        this.vipLevelList = resultVipList;
                    } else {
                        // this.$set(
                        //     this.vipLevelList,
                        //     info.config_id,
                        //     result.ret
                        // );
                        this.vipLevelList = result.ret;
                    }

                    this.vipLevelList[info.config_id].forEach((val, index) => {
                        common.image(
                            {
                                success: res => {
                                    const list = {
                                        id: val.id,
                                        seq: val.seq,
                                        config_id: val.config_id,
                                        name: val.name,
                                        img_badge_src: res.ret
                                    };

                                    this.badgeList = {
                                        ...this.badgeList,
                                        [info.config_id]: [
                                            ...this.badgeList[info.config_id],
                                            list
                                        ]
                                    };

                                    if (info.now_level_id === val.id) {
                                        this.$set(
                                            this.nowTypeLevel,
                                            info.config_id,
                                            index
                                        );
                                    }
                                }
                            },
                            val.image.image_id
                        );
                    });
                }
            });
        },
        previewLevel(level, status) {
            this.$set(this.isNextLevel, level.config_id, false);

            if (level.is_max_level) {
                return;
            }

            if (status === "next") {
                this.$set(
                    this.nowTypeLevel,
                    level.config_id,
                    this.nowTypeLevel[level.config_id] + 1
                );
            } else if (status === "pre") {
                this.$set(
                    this.nowTypeLevel,
                    level.config_id,
                    this.nowTypeLevel[level.config_id] - 1
                );

                if (!this.nowTypeLevel[level.config_id]) {
                    this.$set(this.isNextLevel, level.config_id, false);
                    return;
                }
            }

            this.$set(this.isNextLevel, level.config_id, true);
        }
    }
};
</script>

<style lang="scss" module>
$user-info-font-main-color: #9ba3bf;
$header-font-size: 16px;

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
    font-size: $header-font-size;
    color: $user-info-font-main-color;
    font-weight: 700;

    span {
        padding: 0 7.5px;

        &.active {
            color: #000000;
        }
    }
}
</style>
