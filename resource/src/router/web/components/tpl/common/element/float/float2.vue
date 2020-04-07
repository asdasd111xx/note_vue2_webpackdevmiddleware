<template>
    <div
        v-if="templateEditState"
        :class="{
            floatLeft:floatStyle === 'left',floatRight:floatStyle==='right',
        }"
        class="clearfix floatTheme theme-padding"
    >
        <div v-if="templateState">
            <div
                v-for="(item, index) in floatPic"
                :key="index"
                class="clearfix"
            >
                <div
                    :class="{
                        floatLeft:floatStyle === 'left',floatRight:floatStyle==='right',
                        leftTheme:floatStyle === 'left',rightTheme:floatStyle==='right',
                        themePadding:index===0
                    }"
                    @mouseleave="mouseLeave(index)"
                >
                    <div class="positionBlock">
                        <img
                            v-if="!item.state"
                            :src="$getCdnPath(API_CDN + item.img)"
                            :class="{
                                floatLeft:floatStyle === 'left',floatRight:floatStyle==='right',
                            }"
                            class="defaultImg"
                            @mouseover="mouseOver(index)"
                        />
                        <img
                            :class="{
                                hoverImgActive:item.state,
                                floatLeft:floatStyle === 'left',floatRight:floatStyle==='right',
                            }"
                            :src="$getCdnPath(API_CDN + item.img_hover)"
                            class="hoverImg"
                            @click="openSetting(item)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    mapActions,
    mapGetters
} from 'vuex';

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
    methods: {
        ...mapActions([]),
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
    .theme-padding{
        margin-top: 5px;
    }
    .floatTheme{
        overflow: hidden;
    }
    .clearfix img{
        cursor:pointer
    }
    .floatLeft {
        float: left;
    }

    .floatRight {
        float: right;
    }
    .theme-padding{
        margin-top: 5px;
         width: 100%;
    }

    .rightTheme{
        .positionBlock{
            position: relative;
        }
        .hoverImg{
            transform: translate(100%);
            cursor:pointer
        }
        .hoverImgActive{
            transition: all 0.1s ease-in-out;
            transform: translate(0);
        }
        .defaultImg{
            position: absolute;
            top: 0px;
            right: 0px;
            cursor:pointer
        }
    }
    .leftTheme{
        .positionBlock{
            position: relative;
        }
        .hoverImg{
            transform: translate(-100%);
            cursor:pointer
        }
        .hoverImgActive{
            transition: all 0.1s ease-in-out;
            transform: translate(0);
        }
        .defaultImg{
            position: absolute;
            top: 0px;
            left: 0px;
            cursor:pointer
        }
    }
</style>
