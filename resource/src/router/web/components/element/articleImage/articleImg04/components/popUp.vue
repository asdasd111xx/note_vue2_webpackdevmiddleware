<template>
    <transition v-if="active" name="pop">
        <div :class="$style['pop-up']" @click.self="$emit('close')">
            <div :class="{ [$style['is-mobile']]: isMobile, [$style['is-pc']]: !isMobile }" :style="{ 'background-color': backgroundColor }">
                <div :class="$style['close-btn']" @click="$emit('close')">×</div>
                <div v-bar>
                    <div>
                        <div class="clearfix">
                            <div :class="$style.image">
                                <img :src="getImage('normal', info)" :class="$style.imgout" />
                                <img :src="getImage('hover', info)" :class="$style.imgin" />
                            </div>
                            <div
                                v-for="(data, index) in slider"
                                :key="index"
                                :style="getImageStyle(data)"
                                :class="$style.image"
                                @click="$emit('change', data)"
                            >
                                <img :src="getImage('normal', data)" :class="$style.imgout" />
                                <img :src="getImage('hover', data)" :class="$style.imgin" />
                            </div>
                        </div>
                        <!-- eslint-disable vue/no-v-html -->
                        <div class="clearfix" v-html="text" />
                        <!-- eslint-enable vue/no-v-html -->
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import isMobile from '@/lib/is_mobile';

/**
 * 營銷圖文板塊
 * @module element/articleImg/articleImg04/template/themeDefault
 */
export default {
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
    data() {
        return {
            isMobile: isMobile()
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            curLang: 'getCurLang'
        }),
        backgroundColor() {
            if (['129', '177', '30', '32'].includes(this.webInfo.alias)) {
                return this.info.color[this.curLang];
            }

            return '';
        }
    }
};
</script>

<style lang="scss" module>
:global {
    .vb {
        height: 100%;
    }

    .vb-visible {
        padding-right: 10px;

        &:after {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            right: -5px;
            width: 10px;
            height: 100%;
            margin-right: 5px;
            border-radius: 5px;
            background-color: #BEBEBE;
        }

        > .vb-dragger {
            right: 0;
            z-index: 1;
            width: 10px;

            > .vb-dragger-styler {
                height: 100%;
                border-radius: 5px;
                background-color: #9E9E9E;
                transform: rotate3d(0, 0, 0, 0);
                transition: background-color 100ms ease-out, margin 100ms ease-out, height 100ms ease-out;
                -webkit-transform: rotate3d(0, 0, 0, 0);
                -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out, height 100ms ease-out;
            }
        }
    }
}

.pop-up {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.wrap {
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
    padding-top: 40px;
    background-color: #FFF;
}

.is-mobile {
    composes: wrap;
    top: 44px;
    bottom: 55px;
}

.is-pc {
    composes: wrap;
    top: 0;
    bottom: 0;
    width: 960px;
    height: 84%;
}

.close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 1;
    width: 30px;
    height: 30px;
    line-height: 26px;
    border-radius: 50%;
    background-color: rgba(102, 102, 102, 0.3);
    color: #FFF;
    font-size: 28px;
    text-align: center;
    outline: none;
    cursor: pointer;
}

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
