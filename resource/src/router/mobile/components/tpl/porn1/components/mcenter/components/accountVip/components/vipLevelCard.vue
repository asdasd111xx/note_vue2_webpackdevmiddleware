<template>
    <div :class="[$style['vip-card-wrap']]">
        <!-- vip-level thumbs -->
        <div :class="[$style['card-level-container']]">
            <swiper
                ref="vip-level-thumb"
                :options="{
                    slidesPerView: 4
                }"
            >
                <swiper-slide :class="[$style['level-slide']]">
                    <div
                        :class="[$style['level-thumb-cell'], $style['active']]"
                    >
                        Lv0
                    </div>
                </swiper-slide>

                <swiper-slide
                    :class="[$style['level-slide']]"
                    v-for="(item, index) in vipLevelList"
                    :key="index"
                >
                    <div :class="[$style['level-thumb-cell']]">
                        Lv{{ index + 1 }}
                    </div>
                </swiper-slide>
            </swiper>
        </div>

        <!-- vip-card thumbs -->
        <div :class="[$style['card-desc-container']]">
            <swiper
                ref="vip-card-thumb"
                :options="{
                    spaceBetween: 20
                }"
            >
                <swiper-slide v-for="index in 10" :key="index">
                    <div :class="[$style['card-thumb-cell']]">
                        <img
                            :src="
                                $getCdnPath(
                                    `/static/image/_new/mcenter/vip/vipcard_bg.png`
                                )
                            "
                            alt="vipcard_bg"
                        />
                        <div :class="[$style['card-level-text']]">
                            VIP{{ index }}
                        </div>
                        <img
                            :class="[$style['card-level-image']]"
                            :src="
                                $getCdnPath(
                                    `/static/image/_new/mcenter/vip/ic_s_vip03.png`
                                )
                            "
                            alt="vipcard_bg"
                        />
                        <div :class="[$style['card-desc-block']]">
                            <div>
                                3,000 <br />
                                累计充值
                            </div>
                            <div>
                                3,000 <br />
                                流水要求
                            </div>
                            <div>
                                保级推广3位 <br />
                                有效会员(充值100)
                            </div>
                        </div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>

        <!-- page -->
        <div :class="[$style['card-page']]"><span>1</span>/<span>10</span></div>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    props: {
        vipLevelList: {
            type: Array,
            required: true
        }
    },
    mounted() {
        console.log(this.vipLevelList);
    }
};
</script>

<style lang="scss" module>
$card-width: calc(100% - 30px);
$border-radius: 10px;

.vip-card-wrap {
    position: relative;
    // height: 260px;
    padding: 0px 17px;
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.16);
    background: white;
}

.card-level-container {
    position: relative;
    width: 100%;
    height: auto;
    padding: 30px 0 25px 0;

    .level-thumb-cell {
        width: fit-content;
        min-width: 35px;
        padding: 0px 3px;
        font-size: 12px;
        text-align: center;
        color: #6f748b;
        background: #d4d5df;
        border: 2px solid #bcc1ca;
        border-radius: 15px;

        &.active {
            color: white;
            background: #757a90;
            border: 2px solid #bcc1ca;
        }
    }
}

.level-slide {
    &:not(:last-of-type)::before {
        content: "";
        width: 105%;
        height: 3px;
        background: #e9e7e4;
        position: absolute;
        top: 50%;
        z-index: -1;
    }
}

.card-desc-container {
    position: relative;
    width: $card-width;
    height: 135px;
    text-align: center;
    margin: 0 auto;
}

.card-thumb-cell {
    position: relative;
    width: 100%;
    height: 140px;
    color: #fff;

    img {
        width: 100%;
        height: 100%;
    }

    // VIP等級
    .card-level-text {
        position: absolute;
        font-size: 22px;
        font-weight: 700;
        top: 25px;
        left: 35px;
    }

    // VIP徽章
    .card-level-image {
        position: absolute;
        width: 50px;
        height: 60px;
        top: 0;
        right: 10%;
    }

    // VIP下方資訊
    .card-desc-block {
        position: absolute;
        display: flex;
        justify-content: space-around;
        width: calc(100% - 20px);
        height: 35px;
        bottom: 25px;
        font-size: 12px;
        left: 50%;
        transform: translateX(-50%);

        div {
            min-width: 65px;
        }
    }
}

.card-page {
    width: $card-width;
    padding: 15px 10px 15px 0;
    margin: 0 auto;
    text-align: right;
    font-size: 12px;
    color: #bcc1ca;

    span:first-of-type {
        color: #7e818b;
    }
}
</style>
