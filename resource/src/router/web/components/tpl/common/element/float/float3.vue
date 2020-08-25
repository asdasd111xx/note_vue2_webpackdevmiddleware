<template>
    <div
        v-if="templateEditState"
        :class="{
            floatLeft:floatStyle === 'left',floatRight:floatStyle==='right'
        }"
        class="clearfix floatTheme theme-padding"
    >
        <div v-if="templateState">
            <div
                v-for="(item, index) in floatPic"
                :key="index"
                class="clearfix themePadding"
            >
                <div
                    :class="{
                        floatLeft:floatStyle === 'left',
                        floatRight:floatStyle==='right',
                    }"
                    @mouseover="mouseOver(index)"
                    @mouseleave="mouseLeave(index)"
                >
                    <div
                        :class="{floatLeft:floatStyle === 'left',floatRight:floatStyle==='right'}"
                        @click="openSetting(item)"
                    >
                        <img
                            v-if="item.state"
                            :src="$getCdnPath(API_CDN + item.img_hover)"
                        />
                        <img
                            v-if="!item.state"
                            :src="$getCdnPath(API_CDN + item.img)"
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

<style scoped>
    .floatTheme{
        overflow: hidden;
    }
    .theme-padding{
        margin-top: 5px;
    }
    .clearfix img{
        cursor:pointer;
        height: 100%;
    }
    .floatLeft {
        float: left;
    }

    .floatRight {
        float: right;
    }
    .hidden {
        display: none;
    }

    .imgConfig{
        width: 100%;
        height: 100%;
    }
    .themePadding{
        margin-top: 5px;
        width: 100%;
    }
</style>
