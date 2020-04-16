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
                                '/static/image/_new/mcenter/vip/ic_vip03.png'
                            )
                        "
                        alt=""
                    />
                </div>
            </div>
        </div>

        <!-- 進度條 -->
        <div :class="[$style['run-block']]">
            <div :class="[$style['run-level'], $style['current']]">
                {{ userVipInfo.now_level_name }}
            </div>
            <div :class="[$style['run-bar']]">{{ userVipInfo.percent }}</div>
            <div :class="[$style['run-level'], $style['next']]">
                {{ userVipInfo.next_level_name }}
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
$height: 350px;
$user-info-font-main-color: #9ba3bf;
$main-linear-background: linear-gradient(to right, #f9ddbd, #bd9d7d);
$border-radius: 10px;
$header-font-size: 18px;

.user-info-wrap {
    position: relative;
    width: 100%;
    height: $height;
    padding: 55px 17px 0;
}

.user-info-block {
    position: relative;
    height: 130px;
    display: flex;
    justify-content: space-between;

    .user-info-name {
        position: relative;
        align-self: center;
        display: flex;

        .avatar {
            width: 55px;
            height: 55px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        // name text
        span:first-of-type {
            color: #484c59;
            font-size: $header-font-size;
            font-weight: bold;
            padding: 2.5px 5px 0px 10px;
        }

        // vip text
        span:last-of-type {
            background: $main-linear-background;
            color: white;
            align-self: flex-start;
            width: 50px;
            padding: 2px 0;
            text-align: center;
            font-weight: bold;
            border-radius: 5px;
        }
    }
}

.user-vip-desc {
    width: 90px;
    height: 100%;
    text-align: center;

    // VIP 詳情
    .vip-text {
        font-size: 16px;
        font-weight: bold;
    }

    // VIP 详情的image
    .vip-level {
        width: 100%;
        height: 100px;
        margin-top: 10px;

        img {
            width: 100%;
            height: 100%;
        }
    }
}

.run-block {
    position: relative;
    width: 100%;
    height: 30px;
    display: flex;
}

.run-level {
    width: 50px;
    color: white;
    text-align: center;
    align-self: center;
    border-radius: $border-radius * 2;

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
    background: pink;
    flex: 1;
    margin: 0px 10px;
}

.user-desc-block {
    color: $user-info-font-main-color;
    font-size: 12px;

    .desc-text {
        padding: 2.5px 0px;
    }

    .money {
        color: #000000;
    }
}
</style>
