<template>
    <div class="tpl-wrap clearfix">
        <div class="image-element">
            <img :src="$getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgout" />
        </div>
        <div :style="{ color: caseData.color[curLang] }" class="news-element">
            <news-element />
        </div>
        <!-- 編輯按鈕 -->
        <div
            v-if="isBackEnd"
            class="btn-edit"
            @click="isEdit = true"
        >
            {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
        </div>
        <case-edit
            v-if="isBackEnd && isEdit"
            :element="element"
            :config="config"
            :edit-index="0"
            @close="isEdit = false"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import newsElement from '../../../../common/news';
import caseEdit from '../../../common/new/caseEdit';

export default {
    components: {
        newsElement,
        caseEdit
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
            isEdit: false
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            cdnDomain: 'getCdnDomain'
        }),
        caseData() {
            return this.element.case.data[0];
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.tpl-wrap {
    position: relative;
    box-sizing: border-box;

    &:hover {
        .btn-edit {
            opacity: 1;
        }
    }

    .btn-edit {
        position: absolute;
        top: 50%;
        left: 50%;
        border: 1px solid #FDFDFD;
        border-radius: 3px;
        background: #2F2F2F;
        margin: -15px 0 0 -45px;
        width: 90px;
        height: 30px;
        line-height: 30px;
        color: #FFF;
        font-size: 14px;
        text-align: center;
        transition: opacity .5s;
        opacity: 0;
        cursor: pointer;
    }

    .image-element {
        display: inline-block;
        vertical-align: middle;
        width: 153px;

        img {
            width: 100%;
            display: block;
        }
    }

    .news-element {
        display: inline-block;
        vertical-align: middle;
        width: calc(100% - 160px);
        height: 40px;
        line-height: 40px;
    }
}
</style>
