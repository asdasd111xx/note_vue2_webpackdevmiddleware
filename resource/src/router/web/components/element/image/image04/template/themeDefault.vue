<template>
    <div class="tpl-wrap clearfix">
        <element-draggable
            v-if="element.case.data.length"
            :element="element"
        >
            <element-wrap
                v-for="(caseData, index) in element.case.data"
                :key="`case-${index}`"
                :element="element"
                :config="config"
                :index="index"
                @click="changePage(caseData)"
            >
                <template slot="element">
                    <img
                        :src="caseData.image[curLang] ? $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`) : ''"
                        class="imgout"
                    />
                    <img
                        :src="caseData.imageHover[curLang] ? $getCdnPath(`${cdnDomain}${caseData.imageHover[curLang]}`) : ''"
                        class="imgin"
                    />
                </template>
            </element-wrap>
        </element-draggable>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';

export default {
    components: {
        elementWrap,
        elementDraggable
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        },
        config: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain'
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
                    linkItem: caseData.linkItem ? caseData.linkItem[this.$i18n.locale] : ''
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

/deep/ {
    .tpl-wrap {
        margin: 0 auto;
        max-width: 1920px;
    }
    .element {
        position: relative;
        width: 100%;

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
            img.imgout {
                display: none;
            }
            img.imgin {
                display: block;
            }
        }
    }

    @media screen and (min-width: $sidebar + $phone) {
        .element {
            position: relative;
            float: left;
            width: 50%;
        }
    }
}
</style>
