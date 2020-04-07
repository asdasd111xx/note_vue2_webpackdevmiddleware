<template>
    <semantic-modal
        :has-close="true"
        :on-hidden="onEditCancel"
        :on-confirm="onEditSave"
        :size="'tiny'"
        :title="$t('S_EDIT', memInfo.config.lang || 'zh-cn')"
        icon-name="icon-set"
    >
        <div class="ui form content">
            <div class="inline field">
                <label class="labelWith title">{{ $t('S_HEADER', memInfo.config.lang || 'zh-cn') }}</label>
                <input v-model="linksData.case.data[editIndex].title[curLang]" type="text" />
            </div>
            <div class="inline fields">
                <label class="labelWith">{{ $t('S_DEFAULT_COLOR', memInfo.config.lang || 'zh-cn') }}</label>
                <div class="field">
                    <color-picker
                        :color-val="linksData.case.data[editIndex].color[curLang]"
                        :on-change="onColorChang.bind(this,'color')"
                    />
                </div>
            </div>
            <div class="inline fields">
                <label class="labelWith">{{ $t('S_HOVER_COLOR', memInfo.config.lang || 'zh-cn') }}</label>
                <div class="field">
                    <color-picker
                        :color-val="linksData.case.data[editIndex].colorHover[curLang]"
                        :on-change="onColorChang.bind(this,'colorHover')"
                    />
                </div>
            </div>
            <div class="inline fields">
                <label class="labelWith">{{ $t('S_SHINE_COLOR', memInfo.config.lang || 'zh-cn') }}</label>
                <div class="field">
                    <color-picker
                        :color-val="linksData.case.data[editIndex].colorBlink[curLang]"
                        :on-change="onColorChang.bind(this,'colorBlink')"
                    />
                </div>
            </div>
            <site-link
                :theme="$style"
                :title="title"
                :value-type.sync="linkType"
                :value-to.sync="linkTo"
                :value-item.sync="linkItem"
                class="ui form three column grid setting-form space"
            />
        </div>
        <v-style :style-data="styleData" />
    </semantic-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import semanticModal from '@/components/semanticModal';
import colorPicker from '@/components/colorPicker';

export default {
    components: {
        semanticModal,
        colorPicker,
        siteLink: () => import(/* webpackChunkName: 'siteLink' */'@/components/siteLink')
    },
    props: {
        editIndex: {
            type: [String, Number],
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            linksData: {},
            links: {
                linkType: '',
                linkTo: '',
                linkItem: ''
            },
            styleData: {
                common: [
                    {
                        // eslint-disable-next-line
                        className: `.slider-btn-add[${this.$options._scopeId}]`,
                        path: '/static/image/common/icon_add.png'
                    }
                ]
            },
            title: {
                type: this.$text('S_LINK_TYPE', { text: '连结类型' }),
                to: this.$text('S_LINK', { text: '连结' })
            }
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            curLang: 'getCurLang',
            nowpage: 'getNowpage',
            pageData: 'getPageData',
            memInfo: 'getMemInfo',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain'
        }),
        linkType: {
            get() {
                return this.links.linkType;
            },
            set(value) {
                this.links.linkType = value;
            }
        },
        linkTo: {
            get() {
                return this.links.linkTo;
            },
            set(value) {
                this.links.linkTo = value;
            }
        },
        linkItem: {
            get() {
                return this.links.linkItem;
            },
            set(value) {
                this.links.linkItem = value;
            }
        }

    },
    watch: {
        // eslint-disable-next-line
        'links.linkType': function () {
            this.linksData.case.data[this.editIndex].linkType[this.curLang] = this.links.linkType;
        },
        // eslint-disable-next-line
        'links.linkTo': function () {
            this.linksData.case.data[this.editIndex].linkTo[this.curLang] = this.links.linkTo;
        },
        // eslint-disable-next-line
        'links.linkItem': function () {
            this.linksData.case.data[this.editIndex].linkItem[this.curLang] = this.links.linkItem;
        }
    },
    created() {
        this.linksData = cloneDeep(this.element);
        this.links.linkType = this.linksData.case.data[this.editIndex].linkType[this.curLang];
        this.links.linkTo = this.linksData.case.data[this.editIndex].linkTo[this.curLang];
        this.links.linkItem = this.linksData.case.data[this.editIndex].linkItem[this.curLang];
    },
    methods: {
        onEditSave() {
            if (this.links.linkTo === 'ky' && this.links.linkItem === '') {
                this.$swal({
                    title: this.$t('S_LINK_TIP'),
                    text: this.$t('S_LINK_KY_NO_SET'),
                    type: 'warning'
                });
                return;
            }
            this.$emit('editContent', this.linksData);
            this.$emit('close');
        },
        onEditCancel() {
            this.$emit('close');
        },
        onColorChang(params, val) {
            this.linksData.case.data[this.editIndex][params][this.curLang] = val;
        }
    }
};
</script>

<style lang="scss" scoped>
.ui {
    &.form {
        .inline {
            &.fields {
                margin-bottom: 35px;
            }

            &.field {
                .title {
                    width: 60px;
                    height: 20px;
                    vertical-align: middle;
                    text-align: justify;
                    text-justify: inter-ideograph;
                    -ms-text-justify: inter-ideograph;
                    -moz-text-align-last: justify;
                    -webkit-text-align-last: justify;

                    &:after {
                        content: '';
                        display: inline-block;
                        width: 100%;
                    }
                }
            }
        }
    }
}
.slider-style-wrap {
    .slider-item {
        float: left;
        margin-right: 20px;

        span, select {
            float: left;
        }

        span {
            line-height: 42px;
        }

        select {
            width: auto;
            margin-left: 10px;
        }
    }
}

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

select {
    border-radius: 5px;
    outline: none;
}
</style>

<style lang="scss" module>
.site-link-wrap {
    .field {
        min-width: 132px;
        margin-bottom: 16px;
        padding: 16px;
    }
}
.title {
    margin-bottom: 4px;
    font-weight: bold;
}
</style>
