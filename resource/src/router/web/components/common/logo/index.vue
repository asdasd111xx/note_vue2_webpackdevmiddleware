<template>
    <div
        :style="{
            'width': `${logoWidth}px`,
            'height': `${logoHeight}px`,
            'line-height': `${logoHeight}px`,
            cursor: isBackEnd ? 'default' : 'pointer'
        }"
        class="header-logo-wrap"
        @mouseover="logoHoverState = true"
        @mouseout="logoHoverState = false"
    >
        <!-- 當前已上傳的logo -->
        <div
            v-if="isFlash"
            :class="['flash-box', isBackEnd ? '' : 'is-front']"
            @click="changePage"
        >
            <object
                :data="$getCdnPath(`${cdnDomain}${webInfo.flash_logo}`)"
                type="application/x-shockwave-flash"
                class="header-flash"
            >
                <param name="quality" value="high" />
            </object>
        </div>
        <img
            v-else-if="webInfo.logo"
            :src="$getCdnPath(`${cdnDomain}${!logoHoverState ? webInfo.logo : webInfo.logo_hov || webInfo.logo}`)"
            class="header-logo"
            @click="changePage"
        />
        <!-- 尚未上傳logo -->
        <div
            v-else
            class="logo-default"
            @click="changePage"
        >
            LOGO
        </div>
        <!-- 編輯鈕 -->
        <div
            v-if="isBackEnd && !readOnly"
            class="btn-edit"
            @click="isEditing = true"
        >
            {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
        </div>
        <!-- 圖片上傳區 -->
        <logo-edit
            v-if="isBackEnd & isEditing && !readOnly"
            :logo-width="logoWidth"
            :logo-height="logoHeight"
            @close="isEditing = false"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import logoEdit from './logoEdit';

export default {
    components: {
        logoEdit
    },
    props: {
        logoWidth: {
            type: Number,
            default: 0
        },
        logoHeight: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isEditing: false,
            submitting: false,
            logoHoverState: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            cdnDomain: 'getCdnDomain',
            webInfo: 'getWebInfo',
            isBackEnd: 'getIsBackEnd',
            readOnly: 'getReadOnly'
        }),
        isFlash() {
            let detectFlashState;
            if (window.ActiveXObject) {
                try {
                    // eslint-disable-next-line
                    if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) {
                        detectFlashState = true;
                    }
                } catch (e) {
                    detectFlashState = !!navigator.plugins['Shockwave Flash'];
                }
            }

            detectFlashState = !!navigator.plugins['Shockwave Flash'];
            return this.webInfo.flash_logo && this.webInfo.flash_switch === 'on' && detectFlashState;
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage() {
            if (!this.isBackEnd) {
                this.actionChangePage({ page: this.webInfo.page[0].pid, type: 'custom' });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.header-logo-wrap {
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
    .logo-default {
        box-sizing: border-box;
        border: 1px solid transparent;
        width: inherit;
        height: inherit;
        color: #FFF;
        font-size: 30px;
        text-align: center;
    }
    .header-logo,
    .header-flash,
    .flash-box {
        width: inherit;
        height: inherit;
    }
    .is-front {
        &:before {
            content: "";
            position: absolute;
            cursor: pointer;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
