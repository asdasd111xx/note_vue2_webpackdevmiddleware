<template>
    <div
        :id="$style['js-nc-check-bar']"
        :class="$style['drag-verify-wrap']"
    >
        <div v-if="isBackEnd" :class="$style['nc_wrapper']">
            <div :class="$style['nc_scale']">
                <span :class="[$style['nc_iconfont'], $style['btn_slide']]"></span>
            </div>
        </div>
    </div>
</template>

<script>
/* global noCaptcha */
import { mapGetters } from 'vuex';

export default {
    props: {
        cssStyle: {
            type: Object,
            default: () => {}
        },
        successFuc: {
            type: Function,
            default: () => {}
        },
        isEnable: {
            type: Boolean,
            default: true
        },
        pageStatus: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            slideText: {
                register: ['S_SLIDE_REGISTER', '向右滑动即注册'],
                login: ['S_SLIDE_LOGIN', '请按住滑块，拖动到最右边']
            }
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd'
        }),
        $style() {
            if (this.cssStyle) {
                return this.cssStyle;
            }

            return this.$styleDefault;
        },
        langContrast() {
            return {
                'zh-tw': 'tw',
                'zh-cn': 'cn',
                en: 'en',
                ja: 'ja_JP',
                vi: 'vi_VN'
            };
        },
        ncObject() {
            const ncToken = ['FFFF0N00000000008216', (new Date()).getTime(), Math.random()].join(':');

            return {
                renderTo: this.$style['js-nc-check-bar'],
                appkey: 'FFFF0N00000000008216',
                scene: 'nc_login',
                token: ncToken,
                customWidth: '100%',
                // 錯誤訊息格式
                trans: { key1: 'code0' },
                elementID: ['usernameID'],
                is_Opt: 0,
                language: this.langContrast[this.curLang],
                isEnabled: this.isEnable,
                timeout: 3000,
                times: 5
            };
        }
    },
    watch: {
        isEnable() {
            if (this.isBackEnd) {
                return;
            }

            this.creatSlide();
        }
    },
    mounted() {
        if (this.isBackEnd) {
            return;
        }

        this.creatSlide();
    },
    methods: {
        creatSlide() {
            // eslint-disable-next-line new-cap
            const nc = new noCaptcha({
                ...this.ncObject,
                callback: (data) => {
                    this.successFuc({
                        data: {
                            token: data.token,
                            csessionid: data.csessionid,
                            sig: data.sig,
                            scene: 'nc_login'
                        },
                        slideFuc: nc
                    });
                }
            });

            nc.upLang(this.langContrast[this.curLang], {
                _startTEXT: this.$text(...this.slideText[this.pageStatus]),
                _yesTEXT: ''
            });
        }
    }
};
</script>

<style lang="scss" module="$styleDefault">
.drag-verify-wrap {
    min-height: 40px;
    line-height: 40px;
}

#js-nc-check-bar {
    &.drag-verify-wrap {
        :global {
            .nc_wrapper {
                min-height: inherit;
                height: initial;
            }

            .nc_scale {
                min-height: inherit;
                height: initial;
            }

            .nc_iconfont {
                min-height: inherit;
                line-height: inherit;
            }

            .scale_text {
                min-height: inherit;
                height: initial;
                line-height: inherit;
            }

            // 錯誤訊息
            .errloading {
                width: 100%;
                min-height: inherit;
                height: initial;
                padding: 9px 5px;
                background-color: #F3DCDB;
            }
        }
    }
}

// 廳主端樣式預設
.nc_wrapper {
    width: auto;
    height: inherit;
}

.nc_scale {
    position: relative;
    width: auto;
    height: inherit;
    margin: 0;
    padding: 0;
    background: #E8E8E8;
}

.nc_iconfont {
    position: absolute;
    z-index: 2;
    width: 40px;
    min-height: inherit;
    height: initial;
    line-height: inherit;
    left: 0;
    text-align: center;
    font-size: 16px;
    font-family: "nc_iconfont";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    border: 1px solid #CCC;
    cursor: move;
    background: #FFF;
}
</style>
