<template>
    <div :class="$style['video-tag-wrap']">
        <swiper :options="{ slidesPerView: 'auto', slideClass: $style['tab-wrap'] }">
            <swiper-slide
                v-for="(tTag, index) in tags"
                :key="`tag-${index}`"
            >
                <span :class="$style.tag">
                    {{ tTag }}
                </span>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import split from 'lodash/split';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
    components: {
        swiper,
        swiperSlide
    },
    props: {
        tag: {
            type: String,
            required: true
        }
    },
    computed: {
        tags() {
            return split(this.tag, ',');
        }
    }
};
</script>

<style lang="scss" module>
.video-tag-wrap {
    height: 20px;
    margin-top: 10px;
    white-space: nowrap;
}

.tab-wrap {
    display: inline-block;
}

.tag {
    line-height: 16px;
    margin-right: 10px;
    padding: 2px 10px;
    border-radius: 10px;
    background-color: #242630;
    color: #FACE15;
    font-size: 12px;
}
</style>
