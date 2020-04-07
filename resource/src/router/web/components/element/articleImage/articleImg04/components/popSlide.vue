<template>
    <slide-up-down
        :active="active"
        :duration="100"
        :style="{ 'background-color': info.color[curLang] || 'transparent' }"
    >
        <div class="clearfix">
            <div
                v-for="(data, index) in slider"
                :key="index"
                :class="$style.image"
                :style="getImageStyle(data)"
                @click="$emit('change', data)"
            >
                <img :src="getImage('normal', data)" :class="$style.imgout" />
                <img :src="getImage('hover', data)" :class="$style.imgin" />
            </div>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div class="clearfix" v-html="text" />
        <!-- eslint-enable vue/no-v-html -->
    </slide-up-down>
</template>

<script>
import { mapGetters } from 'vuex';
import SlideUpDown from 'vue-slide-up-down';

/**
 * 營銷圖文板塊
 * @module element/articleImg/articleImg04/template/themeDefault
 */
export default {
    components: {
        SlideUpDown
    },
    props: {
        slider: {
            type: Array,
            required: true
        },
        info: {
            type: Object,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            required: true
        },
        getImage: {
            type: Function,
            required: true
        },
        getImageStyle: {
            type: Function,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        })
    }
};
</script>

<style lang="scss" module>
.image {
    position: relative;
    float: left;
    cursor: pointer;

    &:hover {
        .imgout {
            display: none;
        }

        .imgin {
            display: block;
        }
    }

    > img {
        width: 100%;
        pointer-events: none;
    }

    .imgout {
        display: block;
    }

    .imgin {
        display: none;
    }
}
</style>
