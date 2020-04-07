<template>
    <div
        :style="{ 'background-image': `url(${$getCdnPath(cdnDomain + showImage)})` }"
        class="single-image-box"
        @mouseenter="showType = 'hover'"
        @mouseleave="showType = ''"
    >
        <img v-if="smallImage" :src="$getCdnPath(`${cdnDomain}${smallImage}`)" />
        <div
            v-if="isBackEnd && !readOnly"
            class="btn-edit"
            @click="isEditing = true"
        >
            {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
        </div>
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
        }
    },
    data() {
        return {
            showType: '',
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
        showImage() {
            try {
                if (this.showType === 'hover' && this.element.case.data[0].largImgHover[this.curLang]) {
                    return this.element.case.data[0].largImgHover[this.curLang];
                }
                return this.element.case.data[0].largImg[this.curLang];
            } catch (err) {
                return '';
            }
        },
        smallImage() {
            try {
                return this.element.case.data[0].smallImg[this.curLang];
            } catch (err) {
                return '';
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.single-image-box {
    position: relative;
    width: 100%;
    height: 256px;
    text-align: left;
    background-repeat: no-repeat;
    background-position: 0 50%;

    img {
        position: absolute;
        top: 31px;
        left: 7%;
        z-index: 1;
        display: block;
        max-width: 288px;
    }
    .btn-edit {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
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
        transition: opacity .5s;
        cursor: pointer;
    }

    &:hover {
        .btn-edit {
            opacity: 1;
        }
    }

    @media screen and (min-width: $sidebar + $pad) {
        height: 320px;
    }

    @media screen and (min-width: $sidebar + $pc) {
        display: table-cell;
        width: 40%;

        img {
            position: absolute;
            top: 73px;
            left: 4.94%;
            max-width: 100%;
        }
    }

    @media screen and (min-width: $sidebar + 1500px) {
        width: 50%;
    }
}
</style>
