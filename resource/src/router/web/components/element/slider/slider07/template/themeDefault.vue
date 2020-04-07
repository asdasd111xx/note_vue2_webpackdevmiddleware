<template>
    <div class="slider-wrap">
        <slider
            :type="'cloud9Carousel'"
            :element="element"
            :slider-data="sliderDnd"
        />
        <!-- 編輯按鈕 -->
        <template v-if="isBackEnd">
            <div class="btn-edit" @click="isEdit = true">{{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}</div>
        </template>
        <!-- 編輯視窗 -->
        <case-edit
            v-if="isBackEnd && isEdit"
            :element="element"
            :config="config"
            :edit-index="0"
            :re-render="reRender"
            @close="onHidden"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import slider from '../../../common/new/slider';
import caseEdit from '../../../common/new/caseEdit';

/**
 * 3D透視輪播圖板塊
 * @module element/slider/slider07/template/themeDefault
 * @param {object} element - 模塊資料
 * @param {object} config - 模塊設定檔
 * @param {function} reRender - 重新渲染模塊方法
 */
export default {
    components: {
        slider,
        caseEdit
    },
    props: {
        element: {
            type: Object,
            required: true
        },
        config: {
            type: Object,
            required: true
        },
        reRender: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            isEdit: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        /**
         * 輪播圖資料
         * @method sliderDnd
         * @returns {array} - 輪播圖資料
         */
        sliderDnd() {
            if (this.element.case.data[0]) {
                return JSON.parse(this.element.case.data[0].slider[this.curLang]);
            }

            return [];
        }
    },
    methods: {
        /**
         * 關閉編輯視窗
         * @method onHidden
         */
        onHidden() {
            this.isEdit = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.slider-wrap {
    position: relative;
    z-index: 1;

    &:hover {
        .btn-edit {
            opacity: 1;
        }
    }
}

.btn-edit {
    font-size: 14px;
    line-height: 35px;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
    width: 120px;
    height: 35px;
    margin: -17px 0 0 -60px;
    cursor: pointer;
    transition: opacity .5s;
    text-align: center;
    opacity: 0;
    color: #FFF;
    border: 1px solid #FDFDFD;
    border-radius: 3px;
    background: #2F2F2F;
}
</style>
