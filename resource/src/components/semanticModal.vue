<template>
    <div ref="component-modal" :class="modalClasses">
        <div class="header">
            <i v-if="iconName" :class="iconName" />
            {{ title }}
            <div class="modal-close" @click="onClose" />
        </div>
        <div class="ui form content">
            <slot />
        </div>
        <div class="actions">
            <div class="ui button primary" @click="onConfirm">{{ $t('S_CONFIRM', memInfo.config.lang || 'zh-cn') }}</div>
            <button
                v-if="hasClose"
                class="ui small button"
                type="button"
                @click="onClose"
            >
                {{ $t('S_CLOSE', memInfo.config.lang || 'zh-cn') }}
            </button>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';

export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: 'small' // mini, tiny, small, large
        },
        hasClose: {
            type: Boolean,
            default: false
        },
        iconName: {
            type: String,
            default: ''
        },
        onConfirm: {
            type: Function,
            default: () => {}
        },
        onHidden: {
            type: Function,
            default: () => {}
        },
        centered: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        modalClasses() {
            return {
                ui: true,
                modal: true,
                [this.size]: true,
                'top-aligned': !this.centered
            };
        }
    },
    mounted() {
        // modal 初始設定
        $(this.$refs['component-modal']).modal({
            autofocus: false,
            closable: false,
            onHidden: this.onHidden
        });
        $(this.$refs['component-modal']).modal('show');
    },
    beforeDestroy() {
        $('.ui.modals').dimmer('hide');
        $(this.$refs['component-modal']).modal('destroy');
    },
    methods: {
        onClose() {
            this.onHidden();
            $(this.$refs['component-modal']).modal('hide');
        }
    }
};
</script>

<style lang="scss" scoped>
    .top-aligned {
        position: static !important;
        margin: 3.5rem auto !important;
    }

    .ui.form .field > label {
        .header {
            position: relative;
            color: #666;
        }
    }
    .icon-set {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url('/static/image/common/icon_set.png') 0 0 no-repeat;
        vertical-align: -4px;
    }
    .modal-close {
        position: absolute;
        top: 26px;
        right: 24px;
        background: url('/static/image/common/btn_close.png') 0 0 no-repeat;
        width: 16px;
        height: 16px;
        cursor: pointer;

        &:hover {
            background-position: 0 100%;
        }
    }
</style>
