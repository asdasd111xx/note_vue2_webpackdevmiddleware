<template>
    <div>
        <div /><!-- 拔了存檔整個會不見，不知道為什麼… -->
        <div v-if="isShow" :class="`slick-wrap theme-${element.theme}`">
            <slick
                ref="slick"
                :key="`slider-${curLang}`"
                :options="slickOptions"
                @reInit="reInit"
            >
                <div
                    v-for="(caseData, index) in sliderData"
                    :key="`slick-item-${index}`"
                    :class="`slick-item slick-item-${index}`"
                    :style="{
                        cursor: isBackEnd ? 'auto' : 'pointer'
                    }"
                    @click="$emit('changePage',{
                        page: caseData.linkTo,
                        type: caseData.linkType,
                        config:{
                            linkItem: (caseData.linkItem ? caseData.linkItem : '')
                        }
                    })"
                >
                    <img :src="$getCdnPath(`${cdnDomain}${caseData.sliderImg}`)" />
                </div>
            </slick>
            <div
                v-if="isBackEnd && !readOnly"
                class="btn-edit"
                @click="$emit('edit')"
            >
                {{ $t('S_EDIT') }}
            </div>
        </div>
        <sliderEdit
            v-if="isBackEnd && sliderData.length > 0 && isEdit && !readOnly"
            :element="element"
            :on-edit="onEdit"
            :close-edit="closeEdit"
            :on-slider-update="onSliderUpdate"
        />
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .slick-wrap[{{ this.$options._scopeId }}] .slick-slider .slick-dots li button {
                background: url({{ $getCdnPath('/static/image/element/slider/slider01/default/ctrl.png') }}) 100% 0 no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import slick from '@/components/lib/slickCarousel';

export default {
    components: {
        slick,
        sliderEdit: () => import(/* webpackChunkName: 'liderEdit' */'./sliderEdit')
    },
    props: {
        slickOptions: {
            type: Object,
            default: () => {}
        },
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isShow: true,
            isEdit: false
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            readOnly: 'getReadOnly'
        }),
        sliderData() {
            return JSON.parse(this.element.case.data[1].slider[this.curLang]);
        }
    },
    mounted() {
        if (this.isBackEnd) {
            this.$on('edit', this.onEdit);
        } else {
            this.$on('changePage', this.changePage);
        }

        this.$nextTick(() => {
            this.$refs.slick.reSlick();
        });
    },
    methods: {
        ...mapActions([
            'actionCaseSave',
            'actionChangePage'
        ]),
        rerender() {
            this.isShow = false;

            this.$nextTick(() => {
                this.isShow = true;
            });
        },
        updateField(data) {
            this.actionCaseSave({
                case_id: this.element.i,
                content: [],
                field: [...this.element.case.data],
                setting: { ...this.element.case.setting },
                ...data
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE'),
                        type: 'error'
                    });
                    return;
                }
                this.closeEdit();
                this.rerender();
            });
        },
        reInit() {
            // Helpful if you have to deal with v-for to update dynamic lists
            this.$nextTick(() => {
                this.$refs.slick.reSlick();
            });
        },
        onSliderUpdate(field, setting, options) {
            this.slickOptions = Object.assign(this.slickOptions, options);

            this.updateField({
                field: [
                    this.element.case.data[0],
                    {
                        slider: field
                    }
                ],
                setting: {
                    ...this.element.case.setting,
                    ...setting
                }
            });
        },
        onEdit() {
            this.isEdit = true;
        },
        closeEdit() {
            this.isEdit = false;
        },
        changePage(data) {
            this.actionChangePage(data);
        }
    }
};
</script>
<style lang="scss" scoped>
.slick-wrap {
    position: relative;
    overflow: hidden;

    /deep/.slick-slider {
        .slick-list {
            margin: 0 auto;

            .slick-track {
                &:before,
                &:after {
                    clear: both;
                    display: table;
                    content: '';
                }
            }
        }

        .slick-dots {
            position: absolute;
            bottom: 16px;
            margin: 0;
            padding: 0;

            li {
                display: inline-block;
                position: relative;
                z-index: 3;
                margin: 0 4px;

                button {
                    display: block;
                    width: 12px;
                    height: 12px;
                    font-size: 0;
                    outline: none;
                    cursor: pointer;
                }

                &.slick-active,
                &:hover {
                    button {
                        background-position: 0 0;
                    }
                }
            }
        }

        .slick-dots {
            right: 16px;
            left: 0;
            text-align: right;

            .theme-B & {
                right: 0;
                left: 16px;
                text-align: left;
            }
        }

        .slick-item {
            position: relative;
            overflow: hidden;
            float: left;
            width: 100%;

            .moblie-img {
                display: none;
            }

            .small-img {
                position: absolute;
                top: 50%;
                left: 10%;
                width: 30%;
                opacity: 0;
                transition: all 2s ease-in-out;
                transform: translate(-100%);
            }

            img {
                display: block;
                width: 100%;
            }

            &.slick-active {
                .small-img {
                    opacity: 1;
                    transform: translate(0);
                }
            }
        }
    }

    .btn-edit {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 120px;
        height: 35px;
        line-height: 35px;
        margin: -17px 0 0 -60px;
        border: 1px solid #FDFDFD;
        border-radius: 3px;
        background: #2F2F2F;
        color: #FFF;
        font-size: 14px;
        text-align: center;
        opacity: 0;
        transition: opacity .5s;
        cursor: pointer;
    }

    &:hover {
        .btn-edit {
            z-index: 3;
            opacity: 1;
        }
    }
}
</style>
