<template>
    <!-- 大圖 -->
    <div>
        <div class="image-box" @click="changePage(caseData)">
            <img
                v-if="caseData"
                :src="caseData.image[curLang] ? $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`) : ''"
            />
        </div>
        <div
            v-if="isBackEnd && !readOnly"
            class="btn-edit"
            @click="isEditing = true"
        >
            {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
        </div>
        <!-- 圖片編輯模塊 -->
        <caseEdit
            v-if="isBackEnd && isEditing !== '' && !readOnly"
            :element="element"
            :config="config"
            :edit-index="0"
            @close="isEditing = ''"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import caseEdit from '../../common/new/caseEdit';

/**
 * 大圖模塊外框
 * @module element/image/image02/sizeImage
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 */
export default {
    components: {
        caseEdit
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        },
        config: {
            type: Object,
            required: true
        },
        changePage: {
            type: Function,
            required: true
        }
    },
    data() {
        // 設定編輯功能是否開啟
        return {
            isEditing: ''
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            cdnDomain: 'getCdnDomain',
            curLang: 'getCurLang',
            readOnly: 'getReadOnly'
        }),
        /**
         * 大圖模塊資料
         * @method caseData
         * @returns {object} 大圖各語系圖片連結
         */
        caseData() {
            return this.element.case.data[0];
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.element-large{
    position: relative;
    width: 100%;
    &.front {
        cursor: pointer;
    }
    .image-box {

        img {
            display: block;
            width: 100%;
        }
    }
    .btn-edit {
        position: absolute;
        top: 50%;
        left: 50%;
        opacity: 0;
        background: #2F2F2F;
        margin: -17px 0 0 -60px;
        width: 120px;
        height: 35px;
        line-height: 35px;
        border: 1px solid #FDFDFD;
        font-size: 14px;
        color: #FFF;
        text-align: center;
        border-radius: 3px;
        transition: opacity 0.5s;
        cursor: pointer;
    }
    &:hover {
        .btn-edit {
            opacity: 1;
        }
    }
}
@media screen and (min-width: $sidebar + $phone) {
    .element-large {
        float: left;
        width: 66.7%;
        &.theme-B {
            float: right;
        }
    }
}
@media screen and (min-width: $sidebar + 900px) {
    .element-large {
        width: 600px;
    }
}
</style>
