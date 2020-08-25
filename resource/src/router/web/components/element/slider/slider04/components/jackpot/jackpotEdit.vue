<template>
    <semantic-modal
        :has-close="true"
        :on-hidden="onEditCancel"
        :on-confirm="onJackpotSave"
        :title="$t('S_EDIT', memInfo.config.lang || 'zh-cn')"
        icon-name="icon-set"
    >
        <div class="slider-style-wrap clearfix">
            <label>
                {{ $t('S_IMG_UPLOAD') }}
                <span class="ui teal label">{{ recommendSizeMsg }}</span>
            </label>
            <!-- 圖片上傳 -->
            <dropzone
                :styles="dropStyle"
                :types="['jpg', 'jpeg', 'gif', 'png']"
                :cur-image="jackpotImg"
                :on-complete="onComplete.bind(this,'jackpotImg')"
                :on-remove="onRemove.bind(this,'jackpotImg')"
                class="dropzone-block"
            >
                <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                <p class="type-list">JPG JPEG GIF PNG</p>
                <p class="reminder">
                    <span class="tip-text">
                        {{ $text('S_UPLOAD_FILE_SIZE_SUGGEST', {
                            text: '上传档案大小建议为',
                            locale: memInfo.config.lang || 'zh-cn'
                        }) }}
                    </span>
                    <span class="tip-size">500 KB</span>
                    ，
                    <span class="tip-text">
                        {{ $text('S_UPLOAD_FILE_SIZE_LIMIT', {
                            text: '最大档案限制不得超过',
                            locale: memInfo.config.lang || 'zh-cn'
                        }) }}
                    </span>
                    <span class="tip-size">2 MB</span>
                </p>
            </dropzone>
            <!-- 文字及間距設定 -->
            <div class="field bg-color">
                <label>{{ $t('S_FONT_COLOR') }}</label>
                <color-picker
                    :color-val="fontColor || ''"
                    :on-change="(val) => { onColorChange('fontColor', val) }"
                />
            </div>
            <div class="field bg-position-repeat">
                <label>{{ $t('S_FONT_SIZE') }}</label>
                <div class="ui right labeled small field input">
                    <input
                        v-model="fontSize"
                        :keyup="fontSize = fontSize.replace(/\D/g, '')"
                        type="text"
                    />
                    <div class="ui label label">px</div>
                </div>
                <label class="bg-repeat-label">{{ $t('S_TOP_SPACE') }}</label>
                <div class="ui right labeled small field input">
                    <input
                        v-model="paddingTop"
                        :keyup="paddingTop = paddingTop.replace(/\D/g, '')"
                        type="text"
                    />
                    <div class="ui label label">px</div>
                </div>
            </div>
        </div>
    </semantic-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

export default {
    components: {
        semanticModal: () => import(/* webpackChunkName: 'emanticModal' */'@/components/semanticModal'),
        dropzone: () => import(/* webpackChunkName: 'dropzone' */'@/components/dropzone'),
        colorPicker: () => import(/* webpackChunkName: 'colorPicker' */'@/components/colorPicker')
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        },
        onEdit: {
            type: Function,
            required: true
        },
        closeEdit: {
            type: Function,
            required: true
        },
        updateField: {
            type: Function,
            required: true
        },
        config: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            jackpotData: {},
            dropStyle: {
                width: '600px',
                height: '250px',
                'border-radius': '3px'
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        jackpotImg: {
            get() {
                return this.jackpotData[this.curLang][0].jackpotImg;
            },
            set(val) {
                this.jackpotData[this.curLang][0].jackpotImg = val;
            }
        },
        fontColor: {
            get() {
                return this.jackpotData[this.curLang][0].fontColor;
            },
            set(val) {
                this.jackpotData[this.curLang][0].fontColor = val;
            }
        },
        fontSize: {
            get() {
                return this.jackpotData[this.curLang][0].fontSize;
            },
            set(val) {
                this.jackpotData[this.curLang][0].fontSize = val;
            }
        },
        paddingTop: {
            get() {
                return this.jackpotData[this.curLang][0].paddingTop;
            },
            set(val) {
                this.jackpotData[this.curLang][0].paddingTop = val;
            }
        },
        recommendSizeMsg() {
            return `${this.$t('S_RECOMMEND_SIZE')}: ${this.config.popupEdit[0][0].size.join('x')}`;
        }
    },
    created() {
        this.jackpotData = cloneDeep(this.element.case.data[0].jackpot);

        Object.keys(this.jackpotData).forEach((lang) => {
            this.jackpotData[lang] = JSON.parse(this.jackpotData[lang]);
        });
    },
    methods: {
        /**
         * 背景更新，設定 data 資料
         * @method onColorChange
         * @param {string} prop - 背景資料的 key 值
         * @param {string} val - 更新背景資料的值
         */
        onColorChange(prop, val) {
            this.fontColor = val;
        },
        onJackpotSave() {
            const fieldUpdata = cloneDeep(this.jackpotData);

            Object.keys(fieldUpdata).forEach((lang) => {
                fieldUpdata[lang] = JSON.stringify(fieldUpdata[lang]);
            });

            this.updateField({
                field: [
                    {
                        jackpot: fieldUpdata
                    },
                    this.element.case.data[1]
                ]
            });
        },
        onEditCancel() {
            this.jackpotData = cloneDeep(this.element.case.data[0]);
            this.closeEdit();
        },
        onComplete(params, id, name, response) {
            if (response.status === 'N') {
                this.$swal({
                    text: response.message,
                    type: 'error'
                });
                return;
            }
            this[params] = response.data.link;
        },
        /**
         * 代入 dropzone 組件的 onRemove 事件
         */
        onRemove(params) {
            this[params] = '';
        }
    }
};
</script>

<style lang="scss" scoped>

.slider-style-wrap {
    label {
        display: block;
    }

    .dropzone-block {
        margin-top: 10px;

        /deep/ {
            .default-block {
                width: inherit;
                text-align: center;
                padding-top: 59px;

                img {
                    display: block;
                    margin: 0 auto 8px;
                }

                .type-list {
                    color: #D2D2D2;
                    font-size: 14px;
                    margin: 0;
                }

                .reminder {
                    font-size: 13px;
                    margin: 14px auto 0;

                    .tip-text {
                        color: #131304;
                    }

                    .tip-size {
                        font-weight: bold;
                        color: #1783D2;
                        text-decoration: underline;
                    }
                }
            }
        }
    }


    .field {
        &.bg-color {
            clear: none;
            float: left;
            margin-right: 30px;
        }

        &.bg-position-repeat {
            clear: none;
            float: left;
            min-width: 314px;

            .bg-repeat-label {
                margin-top: 8px;
            }
        }
    }

    .style-bg-color-dropdown {
        border: none;
    }
}
</style>
