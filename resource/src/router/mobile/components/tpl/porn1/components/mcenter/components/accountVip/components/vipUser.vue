<template>
    <div :class="$style['user-info-wrap']">
        <!-- 個人資訊 -->
        <div :class="$style['user-info-block']">
            <div :class="$style['user-info-name']">
                <div :class="$style['avatar']">
                    <img :src="avatarSrc" alt="avatar" />
                </div>
                <span>{{ memInfo.user.username }}</span>
                <span>VIP{{ userVipInfo.now_level_seq }}</span>
            </div>
            <div :class="$style['user-vip-desc']">
                <div
                    :class="$style['vip-text']"
                    @click="$router.push('/mobile/mcenter/accountVIP/detail')"
                >
                    VIP详情
                </div>
                <div :class="$style['vip-level']">
                    <img
                        :src="
                            $getCdnPath(
                                `/static/image/_new/mcenter/vip/ic_vip${userVipInfo.now_level_seq}.png`
                            )
                        "
                        alt="vip"
                    />
                </div>
            </div>
        </div>

        <!-- 進度條 -->
        <div :class="$style['run-block']">
            <div :class="[$style['run-level'], $style['current']]">
                <p>VIP{{ userVipInfo.now_level_seq }}</p>
            </div>
            <div :class="$style['run-bar']">
                <div
                    :class="$style['run-ok-bar']"
                    :style="{ width: runPercent }"
                >
                    <img
                        :src="
                            $getCdnPath(
                                `/static/image/_new/mcenter/vip/vip_run.png`
                            )
                        "
                        :style="
                            `right: ${
                                userVipInfo.percent > 77
                                    ? userVipInfo.percent - 100
                                    : -23
                            }px`
                        "
                        alt="run"
                    />
                    <span
                        ::style="`right: ${userVipInfo.percent > 90 ? -10 : -15 }px`"
                        >{{ userVipInfo.percent }}%</span
                    >
                </div>
            </div>

            <div :class="[$style['run-level'], $style['next']]">
                <p>VIP{{ userVipInfo.next_level_seq }}</p>
            </div>
        </div>

        <!-- 說明資訊 -->
        <div :class="$style['user-desc-block']">
            <div :class="$style['desc-text']">
                ●累计充值(元)：
                <span :class="$style['money']">{{
                    userVipInfo.amount_info.deposit_amount
                }}</span>
                ({{ userVipInfo.amount_info.deposit_amount }}/{{
                    userVipInfo.next_level_deposit_amount
                }})
            </div>
            <div :class="$style['desc-text']">
                ●当前流水(元)：
                <span :class="$style['money']">{{
                    userVipInfo.amount_info.valid_bet
                }}</span>
                ({{ userVipInfo.amount_info.valid_bet }}/{{
                    userVipInfo.next_level_valid_bet
                }})
            </div>
            <div :class="$style['desc-text']">
                ●保级推广(位)：
                <span :class="$style['money']">{{
                    userVipInfo.downgrade_members
                }}</span>
                (有效会员充值{{ userVipInfo.downgrade_valid_bet }} , 保级{{
                    userVipInfo.downgrade_day
                }}天)
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    props: {
        userVipInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            imgIndex: 0,
            levelIcon: "00"
        };
    },
    computed: {
        ...mapGetters({
            memInfo: "getMemInfo"
        }),
        avatarSrc() {
            return this.imgIndex == 0
                ? this.$getCdnPath(
                      `/static/image/_new/mcenter/avatar_nologin.png`
                  )
                : this.$getCdnPath(
                      `/static/image/_new/mcenter/default/avatar_${this.imgIndex}.png`
                  );
        },
        runPercent() {
            return this.userVipInfo.percent + "%";
        }
    },
    created() {
        if (this.memInfo.user.image === 0 || !this.memInfo.user.image) {
            this.imgIndex = 0;
            return;
        }
        this.imgIndex = this.memInfo.user.image;
    }
};
</script>

<style lang="scss" module>
$main-linear-background: linear-gradient(to right, #f9ddbd, #bd9d7d);

.user-info-wrap {
    position: relative;
    width: 100%;
    height: 290px;
    padding: 10px 17px 0;
}

.user-info-block {
    position: relative;
    height: 110px;
    display: flex;
    justify-content: space-between;

    .user-info-name {
        position: relative;
        align-self: center;
        display: flex;

        .avatar {
            width: 48px;
            height: 48px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        // name text
        span:first-of-type {
            color: #484c59;
            font-size: 16px;
            font-weight: 700;
            padding: 2.5px 5px 0px 10px;
        }

        // vip text
        span:last-of-type {
            background: linear-gradient(to right, #eeddd0, #d5b69c);
            margin: 5px 0 0 5px;
            padding: 0px 5px;
            font-size: 12px;
            line-height: 20px;
            height: 20px;
            color: #ffffff;
            text-align: center;
            font-weight: 700;
            border-radius: 4px;
        }
    }

    .user-vip-desc {
        width: 80px;
        height: 100%;
        text-align: center;

        // VIP 詳情
        .vip-text {
            font-size: 14px;
            font-weight: 700;
        }

        // VIP 详情的image
        .vip-level {
            width: 100%;

            img {
                width: 80px;
                height: 90px;
            }
        }
    }
}

.run-block {
    position: relative;
    display: flex;
    width: 100%;
    height: 30px;
    margin: 10px 0;
    padding-right: 10px;
    align-items: center;
}

.run-level {
    width: 40px;
    color: white;
    text-align: center;
    align-self: center;
    border-radius: 14px;
    font-size: 12px;

    p {
        width: 30px;
        margin: 0 auto;
        line-height: 1;
        padding: 2px 0;
    }

    &.current {
        background: #ceb89f;
    }

    &.next {
        background: linear-gradient(
            to left,
            rgba(black, 0.1),
            #b4b9cf,
            #bcc1ca
        );
    }
}

.run-bar {
    position: relative;
    flex: 1;
    margin: 0px 5px;
    height: 15px;
    background: url(/static/image/_new/mcenter/vip/vip_runbg.png);
    background-size: cover;
    background-repeat: no-repeat;
}

.run-ok-bar {
    position: relative;
    background: url(/static/image/_new/mcenter/vip/vip_runok.png);
    background-size: cover;
    background-repeat: no-repeat;
    width: 20%; // 要透過JS動態給值
    height: 15px;

    img {
        position: absolute;
        width: 23px;
        height: 15px;
        bottom: 3px;
        right: -23px;
    }

    span {
        position: absolute;
        font-size: 12px;
        font-weight: 700;
        bottom: 25px;
        right: -15px;

        &::after {
            content: "";
            position: absolute;
            bottom: 2px;
            right: 12.5px;
            transform: translate(50%, 100%);
            border-top: 7px solid black;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
        }
    }
}

.user-desc-block {
    padding-top: 5px;
    color: #9ba3bf;
    font-size: 12px;

    .desc-text {
        padding: 2.5px 0px;
    }

    .money {
        color: #000000;
    }
}
</style>
