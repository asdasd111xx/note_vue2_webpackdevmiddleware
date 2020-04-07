<template>
    <div
        v-if="templateEditState"
        :ref="'floatTheme'"
        :class="{
            floatLeft:floatStyle === 'left',floatRight:floatStyle === 'right',
            leftTheme:floatStyle === 'left',rightTheme:floatStyle === 'right'
        }"
        class="clearfix theme-padding"
        @mouseleave="mouseLeaveEven('themeImg',API_CDN + editData.themeImg)"
    >
        <div v-if="templateState">
            <div
                :ref="'defaultImg'"
                :class="{
                    defaultImg:show
                }"
            >
                <img
                    :ref="'themeImg'"
                    :src="$getCdnPath(API_CDN + editData.themeImg)"
                    class="imgConfig"
                    @mouseover="mouseOverEven('themeImg',API_CDN + editData.themeImg_hover)"
                />
            </div>
            <div
                :ref="'hoverImg'"
                :class="{
                    floatLeft:floatStyle === 'left' ,floatRight:floatStyle === 'right',
                    hoverImgActive:show
                }"
                class="hoverImg"
            >
                <div
                    v-for="(item, index) in floatPic"
                    :key="index"
                    @click="openSetting(item)"
                    @mouseleave="mouseLeave(index)"
                    @mouseover="mouseOver(index)"
                >
                    <div>
                        <img
                            v-if="!item.state"
                            :src="$getCdnPath(API_CDN + item.img)"
                            class="imgConfig"
                        />
                        <img
                            v-if="item.state"
                            :src="$getCdnPath(API_CDN + item.img_hover)"
                            class="imgConfig"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {},
    props: {
        editData: {
            type: Object,
            default() {
                return {};
            }
        },
        floatStyle: {
            type: String,
            default: 'left'
        }
    },
    data() {
        return {
            templateState: true,
            show: false,
            floatPic: []
        };
    },
    computed: {
        ...mapGetters({
            API_CDN: 'getCdnDomain',
            editState: 'getFloatEditStyleState',
            isBackEnd: 'getIsBackEnd'
        }),
        templateEditState() {
            if (this.isBackEnd) {
                return this.editState;
            }
            return true;
        }
    },
    watch: {
        editData(val) {
            const ficArry = [...val.floatPic];
            ficArry.forEach((item) => {
                const data = item;
                data.state = false;
            });
            this.floatPic = ficArry;
        }
    },
    mounted() {
        const ficArry = [...this.editData.floatPic];
        ficArry.forEach((item) => {
            const data = item;
            data.state = false;
            data.templateState = true;
        });
        this.floatPic = ficArry;
    },
    updated() {
        let width = $(this.$refs.hoverImg).width();
        if (width === 0) {
            if (this.floatStyle === 'left') {
                $(this.$refs.defaultImg).css({ float: 'left' });
            } else {
                $(this.$refs.defaultImg).css({ float: 'right' });
            }
        }
        if (width > 0) {
            if (this.floatStyle === 'left') {
                $(this.$refs.defaultImg).css({ float: 'right' });
            } else {
                $(this.$refs.defaultImg).css({ float: 'left' });
            }
        }

        if (this.show) {
            $(this.$refs.floatTheme).css({
                transform: 'translate(0)',
                transition: 'all 0.1s ease-in-out'
            });
        } else {
            if (this.floatStyle === 'left') {
                width *= -1;
            }
            $(this.$refs.floatTheme).css({ transform: `translate(${width}px)` });
        }
    },
    methods: {
        ...mapActions([]),
        mouseOverEven(ref, hoverImg) {
            this.show = true;
            this.$refs[ref].src = hoverImg;
        },
        mouseLeaveEven(ref, hoverImg) {
            this.show = false;
            this.$refs[ref].src = hoverImg;
        },
        mouseLeave(index) {
            this.floatPic = {
                ...this.floatPic,
                [index]: {
                    ...this.floatPic[index],
                    state: false
                }
            };
        },
        mouseOver(index) {
            this.floatPic = {
                ...this.floatPic,
                [index]: {
                    ...this.floatPic[index],
                    state: true
                }
            };
        },
        openSetting(item) {
            if (this.isBackEnd) {
                return;
            }
            if (item.linkType === 'close') {
                this.templateState = false;
            }
            this.$emit('openSet', item);
        }
    }
};
</script>

<style lang="scss" scoped>
.floatLeft {
  float: left;
}
.floatRight {
  float: right;
}
.float-link-wrap img.imgConfig {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.theme-padding {
  margin-top: 5px;
}

.rightTheme{
    .hoverImg{
        visibility: hidden;
        cursor:pointer
    }
    .hoverImgActive{
        visibility: visible;
    }
    .defaultImg{
        float:left
    }
}
.leftTheme{
    .hoverImg{
        visibility: hidden;
        cursor:pointer
    }
    .hoverImgActive{
        visibility: visible;
    }
    .defaultImg{
        float:right
    }
}
</style>
