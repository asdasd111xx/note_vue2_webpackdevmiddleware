<template>
    <div class="tpl-wrap">
        <element-draggable
            v-if="element.case.data.length"
            :element="element"
            class="clearfix"
        >
            <element-wrap
                v-for="(caseContent, index) in element.case.content"
                :key="`case-${index}`"
                :index="index"
                :element="element"
                :config="config"
            >
                <template slot="element">
                    <!-- eslint-disable vue/no-v-html -->
                    <div v-html="isBackEnd ? caseContent[curLang] : content[index]" />
                    <!-- eslint-enable vue/no-v-html -->
                </template>
            </element-wrap>
        </element-draggable>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';

export default {
    components: {
        elementWrap,
        elementDraggable
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            content: [],
            isEditing: ''
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            lang: 'getLang',
            curLang: 'getCurLang'
        })
    },
    created() {
        if (!this.isBackEnd) {
            this.element.case.content.forEach((contentInfo, index) => {
                if (contentInfo[this.curLang] === '') {
                    return;
                }
                const url = `/tpl/${this.memInfo.user.domain}${contentInfo[this.curLang]}`;

                axios.get(url)
                    .then((res) => {
                        this.content[index] = res.data;

                        // vue 無法監聽 content 內容的變動，在此階段強制更新組件
                        this.$forceUpdate();
                    })
                    .catch(() => {
                        this.content[index] = '';
                    });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.tpl-wrap {
    width: 1000px;
    margin: 0 auto;
    position: relative;
    padding: 20px 97px 8px;

    .element {
        float: left;
        position: relative;
        width: 268px;
        min-height: 115px;
    }

    &:hover {
        .add-case,
        .btn-edit {
            opacity: 1;
        }
    }

    .btn-edit {
        background: #2F2F2F;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 120px;
        height: 35px;
        margin: -17px 0 0 -60px;
        border: 1px solid #FDFDFD;
        border-radius: 3px;
        line-height: 35px;
        transition: opacity .5s;
        opacity: 0;
        color: #FFF;
        text-align: center;
        cursor: pointer;
    }
}
</style>
