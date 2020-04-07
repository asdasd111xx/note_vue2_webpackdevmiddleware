<template>
    <div
        :class="['element-wrap', `theme-${element.theme}`, `tpl-${webInfo.model}`, webInfo.style_color]"
        :style="bgStyle"
    >
        <!-- 模塊主要內容 -->
        <div class="content">
            <slot />
        </div>
        <!-- 板塊控制項目 -->
        <main-panel
            v-if="isBackEnd && !readOnly"
            :config="config"
            :element="element"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import positionTrans from '@/lib/position_trans';
import { getElementInfo } from '@/lib/element_default';
import mainPanel from './mainPanel';

export default {
    components: {
        mainPanel
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: null
        },
        onReady: {
            type: Function,
            default: null
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            lang: 'getLang',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            readOnly: 'getReadOnly'
        }),
        /**
         * 模塊背景 css 樣式
         * @method bgStyle
         * @returns {object} css 樣式物件
         */
        bgStyle() {
            const settings = this.element.case.setting;
            const background = ['background-color', 'background-image', 'background-position', 'background-repeat'];

            return background.reduce((init, key) => {
                if (key === 'background-image') {
                    const src = settings[key] ? this.$getCdnPath(`${this.cdnDomain}${settings[key]}`) : '';

                    return { ...init, [key]: settings[key] ? `url(${src})` : src };
                }

                if (key === 'background-position') {
                    const position = settings['background-image'] && settings[key] ? positionTrans(settings[key]) : false;

                    return { ...init, [key]: position };
                }

                if (key === 'background-repeat') {
                    const repeat = settings['background-image'] && settings[key] ? settings[key] : false;

                    return { ...init, [key]: repeat };
                }

                return { ...init, [key]: settings[key] || false };
            }, {});
        }
    },
    created() {
        if (!this.isBackEnd || Object.keys(this.element.case.setting).length) {
            if (this.onReady) {
                this.onReady();
            }

            return;
        }

        this.initCase();
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        /**
         * 新增預設資料
         * @method initCase
         */
        initCase() {
            if (!this.isBackEnd) {
                if (this.onReady) {
                    this.onReady();
                }
                return;
            }

            const eleData = getElementInfo(this.config.name, this.webInfo.model, this.webInfo.style_color);

            const data = eleData.data.reduce((initial, info) => {
                const result = this.config.fields.common.reduce((init, key) => {
                    const name = typeof key === 'object' ? key.name : key;

                    if (name === 'text') {
                        const content = Object.keys(this.lang).reduce((ini, lang) => ({
                            ...ini,
                            [lang]: info[name]
                        }), {});

                        return { ...init, content: { ...init.content, ...content } };
                    }

                    const field = Object.keys(this.lang).reduce((ini, lang) => ({
                        ...ini,
                        [name]: {
                            ...ini[name],
                            [lang]: info[name]
                        }
                    }), { [name]: {} });

                    return { ...init, field: { ...init.field, ...field } };
                }, { field: {}, content: {} });

                return {
                    ...initial,
                    fields: [...initial.fields, result.field],
                    contents: [...initial.contents, result.content]
                };
            }, { fields: [], contents: [] });

            const setting = Object.keys(eleData.setting).reduce((initial, key) => {
                if (typeof eleData.setting[key] !== 'object') {
                    return {
                        ...initial,
                        [key]: eleData.setting[key]
                    };
                }

                if (key === 'promotion-category') {
                    const category = eleData.setting[key].map((info) => Object.keys(this.lang).reduce((init, lang) => ({
                        ...init,
                        [lang]: info
                    }), {}));

                    return {
                        ...initial,
                        [key]: JSON.stringify(category)
                    };
                }

                return {
                    ...initial,
                    [key]: JSON.stringify(eleData.setting[key])
                };
            }, {});

            this.actionCaseSave({
                case_id: this.element.i,
                content: [...data.contents],
                field: [...data.fields],
                setting
            }).then(({ status, message }) => {
                if (this.onReady) {
                    this.onReady();
                }

                if (status === 'Y') {
                    return;
                }

                this.$swal({
                    title: message || this.$text('S_CONTACT_SERVICE', this.memInfo.config.lang),
                    type: 'error'
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.element-wrap {
    position: relative;
    box-sizing: border-box;

    &:hover {
        .main-panel {
            opacity: 1;
        }
    }
}

.main-panel {
    position: absolute;
    z-index: 7;
    top: 10px;
    left: 14px;
    opacity: 0;
    transition: opacity .3s;
}
</style>
