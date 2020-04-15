<template>
    <div class="mcenter-vip">
        <slot
            :vip-level-list="vipLevelList"
            :vip-config="vipConfig"
            :user-vip-info="userVipInfo"
            :preview-level="previewLevel"
            :is-next-level="isNextLevel"
            :now-type-level="nowTypeLevel"
            :now-mobile-index="nowMobileIndex"
            :badge-list="badgeList"
            :is-display="isDisplay"
            :change-mobile-index="changeMobileIndex"
        />
    </div>
</template>

<script>
import mcenter from "@/api/mcenter";
import common from "@/api/common";

export default {
    data() {
        return {
            vipLevelList: {},
            vipConfig: [],
            userVipInfo: {},
            nowTypeLevel: {},
            badgeList: {},
            isNextLevel: {},
            isDisplay: false,
            mobileIndex: 0
        };
    },
    computed: {
        nowMobileIndex: {
            get() {
                return this.mobileIndex || Object.keys(this.userVipInfo)[0];
            },
            set(value) {
                this.mobileIndex = value;
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
                                            this.$set(
                                                this.userVipInfo,
                                                info.config_id,
                                                list
                                            );
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
                        this.$set(
                            this.vipLevelList,
                            info.config_id,
                            resultVipList
                        );
                    } else {
                        this.$set(
                            this.vipLevelList,
                            info.config_id,
                            result.ret
                        );
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
        },
        changeMobileIndex(nowIndex) {
            this.nowMobileIndex = nowIndex;
        }
    }
};
</script>
