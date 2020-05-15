<template>
    <div :class="[$style['promotion-wrap'], 'clearfix']">
        <promotion-category
            :setting="setting"
            :active="active"
            @active="onChange"
        />
        <template v-if="elementDnd.case.data.length">
            <element-draggable :element="elementDnd" class="clearfix">
                <element-wrap
                    v-for="(info, index) in elementDnd.case.data"
                    :key="`case-${index}-${active}`"
                    :index="index"
                    :element="elementDnd"
                    :config="config"
                    :class="$style[`theme-${elementDnd.theme}`]"
                >
                    <template slot="element">
                        <component
                            :is="template"
                            :setting="setting"
                            :info="info"
                            :content="elementDnd.case.content[index]"
                            :has-joined="hasJoined.includes(info.connect[curLang])"
                            @update="getHasJoined"
                        />
                    </template>
                </element-wrap>
            </element-draggable>
        </template>
        <template v-if="isBackEnd && !readOnly">
            <div :class="$style['add-case']" @click="onAdd">{{ $text('S_ADD01') }}</div>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as moment from 'moment-timezone';
import split from 'lodash/split';
import toString from 'lodash/toString';
import { API_PROMOTION_MEM } from '@/config/api';
import ajax from '@/lib/ajax';
import EST from '@/lib/EST';
import isMobile from '@/lib/is_mobile';
import promotionCategory from '../components/promotionCategory';
import elementWrap from '../components/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';

export default {
    components: {
        promotionCategory,
        elementDraggable,
        elementWrap,
        modeCard: () => import(/* webpackChunkName: 'modeCard' */'../components/modeCard'),
        modeImage: () => import(/* webpackChunkName: 'modeImage' */'../components/modeImage')
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isMobile: isMobile(),
            active: 0,
            hasJoined: []
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            lang: 'getLang',
            curLang: 'getCurLang',
            loginStatus: 'getLoginStatus',
            readOnly: 'getReadOnly'
        }),
        template() {
            if (this.element.theme === 'A') {
                return 'mode-card';
            }

            return 'mode-image';
        },
        setting() {
            return Object.keys(this.element.case.setting).reduce((init, key) => {
                try {
                    return { ...init, [key]: JSON.parse(this.element.case.setting[key]) };
                } catch (e) {
                    return { ...init, [key]: this.element.case.setting[key] };
                }
            }, {});
        },
        elementDnd() {
            if (this.isBackEnd) {
                return this.element;
            }

            const now = moment(EST(new Date(), 'YYYY-MM-DD HH')).tz('Asia/Shanghai');
            const device = this.isMobile ? 'mobile' : 'pc';
            const result = this.element.case.data.reduce((init, info, index) => {
                if (!info.date[this.curLang]) {
                    return init;
                }

                const time = split(info.date[this.curLang], ' ~ ');
                const start = moment(time[0]).tz('Asia/Shanghai');
                const end = moment(time[1]).tz('Asia/Shanghai');

                if (!now.isBetween(start, end)) {
                    return init;
                }

                if (!+info[device][this.curLang]) {
                    return init;
                }

                if (!split(info.category[this.curLang], '-').includes(toString(this.active))) {
                    return init;
                }

                return {
                    content: [...init.content, this.element.case.content[index]],
                    data: [...init.data, info]
                };
            }, { content: [], data: [] });

            return {
                ...this.element,
                case: {
                    ...this.element.case,
                    ...result
                }
            };
        }
    },
    created() {
        this.getHasJoined();
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        /**
         * 取得會員已經加入過的優惠列表
         * @method getHasJoined
         */
        getHasJoined() {
            if (this.isBackEnd || !this.loginStatus) {
                return;
            }

            ajax({
                method: 'get',
                url: API_PROMOTION_MEM
            }).then(({ result, ret }) => {
                if (result !== 'ok') {
                    return;
                }

                this.hasJoined = ret.map((info) => info.id);
            });
        },
        /**
         * 切換當前分類
         * @method onChange
         */
        onChange(e) {
            if (this.isBackEnd) {
                return;
            }

            this.active = e;
        },
        /**
         * 新增
         * @method onAdd
         */
        onAdd() {
            if (!this.isBackEnd) {
                return;
            }

            const eleData = '';
            const data = this.config.fields.common.reduce((initial, key) => {
                const name = typeof key === 'object' ? key.name : key;

                if (name === 'text') {
                    const content = Object.keys(this.lang).reduce((init, lang) => ({
                        ...init,
                        [lang]: eleData.data[0][name]
                    }), {});

                    return { ...initial, content: { ...initial.content, ...content } };
                }

                const field = Object.keys(this.lang).reduce((init, lang) => ({
                    ...init,
                    [name]: { ...init[name], [lang]: eleData.data[0][name] }
                }), { [name]: {} });

                return { ...initial, field: { ...initial.field, ...field } };
            }, { field: {}, content: {} });

            this.actionCaseSave({
                case_id: this.element.i,
                content: [...this.element.case.content, data.content],
                field: [...this.element.case.data, data.field],
                setting: { ...this.element.case.setting }
            }).then(({ status, message }) => {
                if (status === 'Y') {
                    return;
                }

                this.$swal({
                    title: message || this.$t('S_CONTACT_SERVICE'),
                    type: 'error'
                });
            });
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.promotion-wrap {
    position: relative;

    &:hover {
        .add-case {
            opacity: 1;
        }
    }
}

.theme-A {
    position: relative;
    float: left;
    width: 100%;
    padding: 1.3%;
}

.theme-B {
    position: relative;
    margin-bottom: 30px;
}

.add-case {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    width: 132px;
    height: 35px;
    line-height: 35px;
    margin: -17.5px 0 0 -66px;
    background-color: #AFAFAF;
    text-align: center;
    opacity: 0;
    transition: opacity .5s;
    cursor: pointer;
}

@media screen and (min-width: $phone + $sidebar) {
    .theme-A {
        width: 50%;
    }
}

@media screen and (min-width: $pad + $sidebar) {
    .theme-A {
        width: 33.333%;
    }
}
</style>
