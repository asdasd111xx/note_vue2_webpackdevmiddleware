<template>
    <div class="ui form content slider-image-upload-wrap">
        <draggable
            v-model="sliderDataDnd"
            :options="{handle: '.sort-icon'}"
            class="element-box"
        >
            <slider-image-item
                v-for="(caseData, index) in sliderDataDnd"
                :key="`dropzone-${index}-${token}`"
                :index="index"
                :field-config-setting="fieldConfig"
                :case-data="caseData"
                :remove-case="removeCase"
                :on-link-change="onLinkChange"
                :on-image-change="onImageChange"
                class="dropzone-items"
            />
        </draggable>
        <button
            type="button"
            class="slider-btn-add"
            @click="addCase"
        >
            {{ $t('S_ADD_IMG', memInfo.config.lang || 'zh-cn') }}
        </button>
        <v-style :style-data="styleData" />
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import sliderImageItem from './sliderImageItem';

export default {
    components: {
        draggable,
        sliderImageItem
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        },
        editIndex: {
            type: [String, Number],
            required: true
        },
        fieldConfig: {
            type: Object,
            required: true
        }
    },
    data() {
        const styleData = {
            common: [
                {
                    // eslint-disable-next-line
                    className: `.slider-image-upload-wrap .slider-btn-add[${this.$options._scopeId}]`,
                    path: '/static/image/common/icon_add.png'
                }
            ]
        };

        return {
            sliderData: [],
            token: 0,
            styleData
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            lang: 'getLang',
            curLang: 'getCurLang',
            webInfo: 'getWebInfo',
            isBackEnd: 'getIsBackEnd'
        }),
        sliderDataDnd: {
            get() {
                return this.sliderData;
            },
            set(sort) {
                this.sliderData = [...sort];
                this.$emit('input', this.sliderData);
                this.token += 1;
            }
        }
    },
    created() {
        this.sliderData = [...JSON.parse(this.element.case.data[this.editIndex].slider[this.curLang])];
    },
    mounted() {
        this.$emit('input', this.sliderData);
    },
    methods: {
        // 新增項目
        addCase() {
            // 防止超過預設數量
            // if (this.element.case.data.length >= this.config.max) {
            //     return;
            // }'
            const eleData = '';
            const result = Object.keys(eleData[0]).reduce((init, key) => {
                if (['image', 'imageHover'].includes(key)) {
                    return { ...init, [key]: '' };
                }

                return { ...init, [key]: eleData[0][key] };
            }, {});
            this.sliderData = [...this.sliderData, result];
            this.$emit('input', this.sliderData);
            $(window).trigger('resize');
        },
        // 移除項目
        removeCase(index) {
            this.sliderData = this.sliderData.filter((item, i) => index !== i);
            this.$emit('input', this.sliderData);
        },
        onLinkChange(singleData, index) {
            this.sliderData = this.sliderData.map((item, i) => {
                if (i !== index) {
                    return item;
                }

                const result = {
                    ...item,
                    linkType: singleData.linkType,
                    linkTo: singleData.linkTo,
                    linkItem: singleData.linkItem
                };
                return result;
            });
            this.$emit('input', this.sliderData);
        },
        onImageChange(key, data, index) {
            this.sliderData = this.sliderData.map((item, itemIndex) => {
                if (itemIndex !== index) {
                    return item;
                }

                const { width, height, link } = data;
                const info = { ...item, [key]: link };

                if (`${key}Info` in info) {
                    info[`${key}Info`] = [width, height];
                }

                return info;
            });
            this.$emit('input', this.sliderData);
        }
    }
};
</script>

<style lang="scss" scoped>
.slider-image-upload-wrap {
    width: 100%;

    .dropzone-items {
        padding: 10px 0 20px;
        border-bottom: 1px solid #E4E4E4;

        &:last-child {
            border-bottom: none;
        }
    }
    .slider-btn-add {
        line-height: 24px;
        padding-left: 29px;
        outline: none;
        background-position: 0 50%;
        background-repeat: no-repeat;
    }
}
</style>
