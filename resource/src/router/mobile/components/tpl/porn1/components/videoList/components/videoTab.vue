<template>
    <div :class="$style.box">
        <swiper :options="{ slidesPerView: 'auto', slideClass: $style.tab }">
            <swiper-slide v-for="info in videoTabs" :key="info.id">
                <div
                    :class="[$style.wrap, { [$style.active]: info.id === +sortId }]"
                    @click="$emit('update:sortId', `${info.id}`)"
                >
                    <span>{{ info.title }}</span>
                    <div />
                </div>
            </swiper-slide>
        </swiper>
        <div
            :class="Permutation"
            @click="$emit('update:isSingle')"
        />
    </div>
</template>

<script>
import axios from 'axios';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    props: {
        sortId: {
            type: Number,
            required: true
        },
        isSingle: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            videoTabs: []
        };
    },
    computed: {
        Permutation() {
            return this.isSingle ? this.$style['is-single'] : this.$style['is-multiple'];
        }
    },
    created() {
        axios({
            method: 'get',
            url: `${API_PORN1_DOMAIN}/api/v1/video/sort`,
            timeout: 30000,
            headers: {
                Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                Version: 1
                // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // origin: 'http://127.0.0.1'
            }
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }

            this.videoTabs = [{ id: 0, title: '全部' }, ...response.data.result];
        });
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.box {
    position: relative;
    padding-right: 40px;
}

.tab {
    display: inline-block;
    margin: 0 15px;
}

.wrap {
    position: relative;
    line-height: 44px;
    color: #BCBDC1;
    font-size: 14px;
    text-align: center;
    white-space: nowrap;

    &.active {
        color: #FACE15;

        > div {
            display: block;
        }
    }

    > div {
        display: none;
        position: absolute;
        right: 25%;
        bottom: 2px;
        left: 25%;
        height: 2px;
        border-radius: 1px;
        background-color: #FACE15;
    }
}

.btn-column {
    $size: 20px;
    position: absolute;
    top: 50%;
    right: 10px;
    width: $size;
    height: $size;
    background-position: 0 50%;
    background-repeat: no-repeat;
    background-size: $size $size;
    transform: translateY(-50%);
}

.is-multiple {
    composes: btn-column;
    background-image: url('/static/image/mobile/tpl/porn1/home/icon_double.png');
}

.is-single {
    composes: btn-column;
    background-image: url('/static/image/mobile/tpl/porn1/home/icon_single.png');
}

@media screen and (min-width: $phone) {
    .wrap {
        font-size: 15px;
    }
}

@media screen and (min-width: $pad) {
    .wrap {
        font-size: 16px;
    }
}
</style>
