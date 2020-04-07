<template>
    <!-- 大圖 -->
    <div class="sizeImg">
        <div class="image-box" @click="changePage(caseData)">
            <img :src="$getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgout" />
            <img :src="caseData.imageHover[curLang] ? $getCdnPath(`${cdnDomain}${caseData.imageHover[curLang]}`) : $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgin" />
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
import caseEdit from '../../../common/new/caseEdit';

/**
 * 大圖模塊外框
 * @module element/image/image05/sizeImg
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
            cdnDomain: 'getCdnDomain',
            memInfo: 'getMemInfo',
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

.sizeImg{
    position: relative;
    width: 50%;
    float: left;
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
    .image-box {
        cursor: pointer;
        img {
            width: 100%;
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
@media screen and (max-width: $sidebar + $pad) {
    .sizeImg{
        width: 100%;
        float: left;
    }

}

</style>
