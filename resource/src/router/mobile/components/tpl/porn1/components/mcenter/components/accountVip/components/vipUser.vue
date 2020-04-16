<template>
    <div :class="[$style['user-info-wrap']]">
        <!-- 個人資訊 -->
        <div :class="[$style['user-info-block']]">
            <div :class="[$style['user-info-name']]">
                <div :class="[$style['avatar']]">
                    <img
                        :src="
                            $getCdnPath(
                                '/static/image/_new/mcenter/vip/image-avatar-01.png'
                            )
                        "
                        alt="avatar"
                    />
                </div>
                <span>testvip00111</span>
                <span>{{ userVipInfo.now_level_name }}</span>
            </div>
            <div :class="[$style['user-vip-desc']]">
                <div :class="[$style['vip-text']]">VIP详情</div>
                <div :class="[$style['vip-level']]">
                    <img
                        :src="
                            $getCdnPath(
                                '/static/image/_new/mcenter/vip/ic_vip00.png'
                            )
                        "
                        alt="vip"
                    />
                </div>
            </div>
        </div>

        <!-- 進度條 -->
        <div :class="[$style['run-block']]">
            <div :class="[$style['run-level'], $style['current']]">
                <span>{{ userVipInfo.now_level_name }}</span>
            </div>
            <div :class="[$style['run-bar']]">{{ userVipInfo.percent }}</div>
            <div :class="[$style['run-level'], $style['next']]">
                <span>{{ userVipInfo.next_level_name }}</span>
            </div>
        </div>

        <!-- 說明資訊 -->
        <div :class="[$style['user-desc-block']]">
            <div :class="[$style['desc-text']]">
                ●累计充值(元)：
                <span :class="[$style['money']]">10,000.00</span>
                (0.00/30,0000)
            </div>
            <div :class="[$style['desc-text']]">
                ●当前流水(元)：
                <span :class="[$style['money']]">178,888.00</span>
                (0.00/10,0000)
            </div>
            <div :class="[$style['desc-text']]">
                ●保级推广(位)：
                <span :class="[$style['money']]">12</span>
                (有效会员充值100 , 保级90天)
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        userVipInfo: {
            type: Object,
            required: true
        }
    },
    created() {
        console.log(this.userVipInfo);
        console.log(this.userVipInfo.now_level_name);
    },
    mounted() {}
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
    flex: 1;
    margin: 0px 5px;
    height: 15px;
    background: url(/static/image/_new/mcenter/vip/vip_runbg.png);
    background-size: cover;
    background-repeat: no-repeat;
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
