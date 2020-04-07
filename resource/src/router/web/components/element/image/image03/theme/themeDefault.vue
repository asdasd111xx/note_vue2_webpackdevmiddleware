<template>
    <div class="tpl-wrap clearfix">
        <sizeImage
            :element="element"
            :config="config"
        />
        <element-draggable
            v-if="element.case.data.length"
            :element="element"
            class="image-wrap clearfix"
        >
            <template v-for="(caseData, index) in element.case.data">
                <element-wrap
                    v-if="index !== 0"
                    :key="`case-${index}`"
                    :index="index"
                    :element="element"
                    :config="config"
                    @click="changePage(caseData)"
                >
                    <template slot="element">
                        <img :src="$getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgout" />
                        <img :src="caseData.imageHover[curLang] ? $getCdnPath(`${cdnDomain}${caseData.imageHover[curLang]}`) : $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgin" />
                    </template>
                </element-wrap>
            </template>
        </element-draggable>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';
import sizeImage from '../sizeImage';

export default {
    components: {
        elementWrap,
        elementDraggable,
        sizeImage
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            curLang: 'getCurLang'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(caseData) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({
                page: caseData.linkTo[this.$i18n.locale],
                type: caseData.linkType[this.$i18n.locale],
                config: {
                    linkItem: (caseData.linkItem ? caseData.linkItem[this.$i18n.locale] : '')
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.tpl-wrap {
    margin: 0 auto;
    max-width: 1920px;

    .image-wrap {
        width: 100%;

        .element {
            position: relative;
            float: left;
            width: 50%;

            img {
                width: 100%;
                height: auto;
                cursor: pointer;

                &.imgout {
                    display: block;
                }
                &.imgin {
                    display: none;
                }
            }

            &:hover {
                .imgout {
                    display: none;
                }
                .imgin {
                    display: block;
                }
            }
        }
    }

    @media screen and (min-width: $sidebar + $pc) {
        .image-wrap {
            display: table-cell;
            width: 60%;
        }
    }

    @media screen and (min-width: $sidebar + 1500px) {
        .image-wrap {
            width: 50%;
        }
    }
}
</style>
