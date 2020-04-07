<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content" :class="$style['promotion-wrap']">
            <div :class="$style['type-wrap']">
                <swiper :options="{ slidesPerView: 'auto' }">
                    <swiper-slide
                        v-for="tab in tabList"
                        :key="tab.id"
                        :class="[$style['type-btn'], { [$style.active]: tab.id === tabId }]"
                    >
                        <div @click="getPromotionList(tab.id)">{{ tab.name }}</div>
                    </swiper-slide>
                </swiper>
            </div>
            <div
                v-for="info in promotionList"
                :key="info.id"
                :class="$style.promotion"
                @click="onClick(info)"
            >
                <div :class="$style.wrap">
                    <div :class="$style['image-wrap']">
                        <img v-lazy="info.image" />
                    </div>
                    <div :class="$style['text-wrap']">
                        <div :class="$style.time">
                            <span v-if="info.end_time">{{ info.start_time }} ~ {{ info.end_time }}</span>
                            <span v-else>{{ $text('S_NOW_DATE', '即日起') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </mobile-container>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import ajax from '@/lib/ajax';
import { API_PROMOTION_LIST } from '@/config/api';
import mobileContainer from '../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        swiper,
        swiperSlide
    },
    data() {
        return {
            tabId: 0,
            tabList: [],
            promotionList: [],
            headerConfig: {
                title: this.$text('S_PROMOTIONS', '优惠活动'),
                isBackgroundGradient: true
            }
        };
    },
    created() {
        this.getPromotionList(this.tabId);
    },
    methods: {
        getPromotionList(id) {
            this.tabId = id;
            ajax({
                method: 'get',
                url: API_PROMOTION_LIST,
                params: { api_uri: '/api/promotion/list', tab_id: id },
                errorAlert: false
            }).then((response) => {
                this.promotionList = response.ret;
                if (this.tabList.length) {
                    return;
                }
                this.tabList = response.tab_list;
            });
        },
        onClick({ link }) {
            let newWindow = '';
            // 辨別裝置是否為ios寰宇瀏覽器
            const isUBMobile = navigator.userAgent.match(/UBiOS/) !== null && navigator.userAgent.match(/iPhone/) !== null;
            // 暫時用來判斷馬甲包
            const webview = window.location.hostname === 'yaboxxxapp02.com';

            // 請勿移除 window.open 裡的空格
            // 修正在 IOS Safari window.open之後，點上一頁之後會轉圈的問題
            // 此解決方法是點上一頁之後會直接關閉window.open的頁面
            if (!isUBMobile && !webview) {
                newWindow = window.open(' ');
            }
            ajax({
                method: 'get',
                url: '/api/v1/c/link/customize',
                params: { code: 'promotion', client_uri: link },
                errorAlert: isUBMobile || webview,
                success: ({
                    result, ret, msg, code
                }) => {
                    if (result !== 'ok') {
                        if (!isUBMobile && !webview) {
                            newWindow.close();
                        }
                        const errorCode = code || '';
                        alert(`${msg} ${errorCode}`);
                        return;
                    }

                    if (webview) {
                        window.location.href = ret.uri;
                        return;
                    }

                    if (!isUBMobile) {
                        newWindow.location.href = ret.uri;
                        return;
                    }

                    window.open(ret.uri);
                },
                fail: (error) => {
                    if (!isUBMobile || !webview) {
                        newWindow.alert(`${error.data.msg} ${error.data.code ? `(${error.data.code})` : ''}`);
                        newWindow.close();
                    }
                }
            });
        }
    }
};
</script>
<style lang="scss" module>
@import '~@/css/variable.scss';

.promotion-wrap {
    margin: 60px 0 45px;
}
.type-wrap {
    background-color: #272727;
    position: fixed;
    top: 43px;
    left: 0;
    width: 100%;
    z-index: 1;
}
.type-btn {
    width: calc(100% / 7);
    line-height: 21px;
    padding: 10px 0;
    background-color: #272727;
    color: #FFF;
    font-size: 15px;
    text-align: center;

    &.active {
        color: #FAD859;
        border-bottom: 3px solid #FAD859;
    }
}
.promotion {
    position: relative;
    margin: 0 15px 10px;
    padding-top: 15px;
}
.wrap {
    position: relative;
    width: 95%;
    margin: 0 auto;
}
.image-wrap {
    > img {
        display: block;
        width: 100%;
        border-radius: 10px;
    }
}
.text-wrap {
    position: absolute;
    bottom: 10px;
    padding: 0 15px;
    background-color: #FFF;
    border-radius: 10px 40px 40px 10px;
}
.name {
    line-height: 22px;
    color: #FFF;
    font-weight: 700;
    font-size: 16px;
}
.time {
    line-height: 20px;
    color: #000;
    font-size: 12px;
}
.btn-next {
    position: absolute;
    top: 50%;
    right: 15px;
    width: 28px;
    height: 28px;
    margin-top: -14px;
    background: url('/static/image/mobile/tpl/porn1/events/icon_go2_h.png') 0 0 no-repeat;
    background-size: 28px;
}
.promotion-bg {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 10px;
    background-color: #5E5450;
}

@media screen and (min-width: $phone) {
    .type-btn {
        font-size: 16px;
    }

    .time {
        font-size: 13px;
    }
}

@media screen and (min-width: $pad) {
    .type-btn {
        font-size: 18px;
    }

    .time {
        font-size: 15px;
    }
}
</style>
