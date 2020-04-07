<template>
    <div
        ref="component-modal"
        class="ui modal small"
    >
        <div class="header">
            <i class="edit outline large icon" />
            {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
        </div>
        <div class="content">
            <div class="ui form">
                <div class="field clearfix">
                    <label>
                        {{ $t('S_STATIC_LOGO', memInfo.config.lang || 'zh-cn') }}
                        <span class="required">*{{ $t('S_FORM_REQUIRE_ERROR', memInfo.config.lang || 'zh-cn') }}</span>
                        <span class="ui teal label">{{ recommendSizeMsg }}</span>
                    </label>
                    <label class="logo-size-note">
                        {{ $t('UPLOAD_FILE_SIZE_RECOMMENDED', memInfo.config.lang || 'zh-cn') }}
                        <span class="limit-size"> 500KB</span>
                        ，
                        {{ $t('MAX_FILE_LIMIT_CANT_EXCEED', memInfo.config.lang || 'zh-cn') }}
                        <span class="limit-size"> 2MB</span>
                    </label>
                    <div class="dropzone-out">
                        <dropzone
                            :cur-image="logoFields.logo"
                            :on-complete="(id, name, response) => onUpload('logo', response)"
                            :on-remove="() => onRemove('logo')"
                            :max-height="logoHeight"
                            :max-width="logoWidth"
                            :min-height="logoHeight"
                            :min-width="logoWidth"
                            :types="['jpg', 'jpeg', 'gif', 'png']"
                        >
                            <div class="dropzone-empty-icon">
                                <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                                <p>JPG JPEG GIF PNG</p>
                            </div>
                        </dropzone>
                        <span>{{ `※ ${$t('S_IMAGE_DROP_IN', memInfo.config.lang || 'zh-cn')}` }}</span>
                    </div>
                    <div class="dropzone-in">
                        <dropzone
                            :cur-image="logoFields.logo_hov"
                            :on-complete="(id, name, response) => onUpload('logo_hov', response)"
                            :on-remove="() => onRemove('logo_hov')"
                            :max-height="logoHeight"
                            :max-width="logoWidth"
                            :min-height="logoHeight"
                            :min-width="logoWidth"
                            :types="['jpg', 'jpeg', 'gif', 'png']"
                        >
                            <div class="dropzone-empty-icon">
                                <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                                <p>JPG JPEG GIF PNG</p>
                            </div>
                        </dropzone>
                        <span>{{ `※ ${$t('S_IMAGE_DROP_OUT', memInfo.config.lang || 'zh-cn')}` }}</span>
                    </div>
                </div>
                <div class="field clearfix dynamic-logo">
                    <label class="display-title">{{ $t('S_USE_DYNAMIC_LOGO', memInfo.config.lang || 'zh-cn') }}</label>
                    <div class="ui toggle checkbox right">
                        <input
                            :checked="flashEditState"
                            type="checkbox"
                            @change="toggleSwitch"
                        />
                        <label />
                    </div>
                    <label v-show="flashEditState" class="dynamic-recommend-msg">
                        <span class="ui teal label">{{ recommendSizeMsg }}</span>
                    </label>
                    <label v-show="flashEditState" class="logo-size-note">
                        {{ $t('UPLOAD_FILE_SIZE_RECOMMENDED', memInfo.config.lang || 'zh-cn') }}
                        <span class="limit-size"> 500KB</span>
                        ，
                        {{ $t('MAX_FILE_LIMIT_CANT_EXCEED', memInfo.config.lang || 'zh-cn') }}
                        <span class="limit-size"> 2MB</span>
                    </label>
                </div>
                <div :class="['field clearfix', !flashEditState ? 'min-height-field' : '']">
                    <div
                        v-show="flashEditState"
                        class="dropzone-out"
                    >
                        <dropzone
                            :cur-image="logoFields.flash_logo"
                            :on-complete="(id, name, response) => onUpload('flash_logo', response)"
                            :on-remove="() => onRemove('flash_logo')"
                            :types="['swf']"
                            :max-height="logoHeight"
                            :max-width="logoWidth"
                            :min-height="logoHeight"
                            :min-width="logoWidth"
                            @click.native="preventSwitchoffClick"
                        >
                            <div class="dropzone-empty-icon">
                                <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                                <p>SWF</p>
                            </div>
                        </dropzone>
                    </div>
                </div>
            </div>
        </div>
        <div class="actions">
            <div
                class="ui button primary"
                @click="onConfirm"
            >
                {{ $t('S_CONFIRM', memInfo.config.lang || 'zh-cn') }}
            </div>
            <button
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
import { mapGetters, mapActions } from 'vuex';
import dropzone from '@/components/dropzone';

export default {
    components: {
        dropzone
    },
    props: {
        logoWidth: {
            type: Number,
            required: true
        },
        logoHeight: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            logoFields: {}
        };
    },
    computed: {
        ...mapGetters({
            nowtpl: 'getNowtpl',
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain'
        }),
        /**
         * 測試 recommendSizeMsg
         * @method recommendSizeMsg
         * @returns {string} 圖片建議尺寸文字內容
         */
        recommendSizeMsg() {
            return `${this.$text('S_SIZE_LIMITATION', {
                text: '尺寸限制： %s x %s',
                locale: this.memInfo.config.lang || 'zh-cn',
                replace: [
                    { target: '%s', value: this.logoWidth },
                    { target: '%s', value: this.logoHeight }
                ]
            })}`;
        },
        flashEditState() {
            return this.logoFields.flash_switch === 'on';
        }
    },
    mounted() {
        this.logoFields = {
            ...this.logoFields,
            logo: this.webInfo.logo,
            logo_hov: this.webInfo.logo_hov,
            flash_logo: this.webInfo.flash_logo,
            flash_switch: this.webInfo.flash_switch
        };
        // modal 初始設定
        $(this.$refs['component-modal']).modal({
            autofocus: false,
            closable: false,
            onVisible: () => {
                setTimeout(() => {
                    $(window).trigger('resize');
                }, 100);
            },
            onHidden: () => {
                this.$emit('close');
            }
        });
        $(this.$refs['component-modal']).modal('show');
    },
    beforeDestroy() {
        $(this.$refs['component-modal']).modal('destroy');
    },
    methods: {
        ...mapActions([
            'actionLogoUpdate'
        ]),
        /**
         * 圖片上傳
         * @function onUpload
         * @param {string} name - 檔案名稱
         * @param {object} response - 上傳後 server 回傳資料
         */
        onUpload(name, response) {
            if (response.data.height !== this.logoHeight || response.data.width !== this.logoWidth) {
                this.$swal({
                    title: `${this.$text('S_SIZE_LIMITATION', {
                        text: '尺寸限制： %s x %s',
                        locale: this.memInfo.config.lang || 'zh-cn',
                        replace: [
                            { target: '%s', value: this.logoWidth },
                            { target: '%s', value: this.logoHeight }
                        ]
                    })}`,
                    type: 'error'
                });
                return;
            }
            if (response.status === 'Y') {
                this.logoFields = {
                    ...this.logoFields,
                    [name]: response.data.link
                };
            }
        },
        /**
         * 移除圖片
         * @method onRemove
         * @param {string} name - 檔案名稱
         */
        onRemove(name) {
            this.logoFields = {
                ...this.logoFields,
                [name]: ''
            };
        },
        onClose() {
            $(this.$refs['component-modal']).modal('hide');
            this.$emit('close');
        },
        /**
         * flash_switch 狀態切換
         * @function toggleSwitch
         * @param {string} e - input argument
         */
        toggleSwitch(e) {
            this.logoFields = {
                ...this.logoFields,
                flash_switch: e.target.checked ? 'on' : 'off'
            };
        },
        onConfirm() {
            // 防連點
            if (this.submitting) return;

            // 驗證必填 logo
            if (this.logoFields.logo === '') {
                this.$swal({
                    title: this.$t('S_UPLOAD_STATIC_LOGO', this.memInfo.config.lang || 'zh-cn'),
                    type: 'error'
                });
                return;
            }

            const data = {
                template_id: this.nowtpl,
                logo: this.logoFields.logo,
                logo_hov: this.logoFields.logo_hov,
                flash_logo: this.logoFields.flash_logo,
                flash_switch: this.logoFields.flash_switch || 'off'
            };

            // 防連點
            this.submitting = true;
            this.actionLogoUpdate(data).then(({ status, message }) => {
                if (status !== 'Y') {
                    this.$swal({
                        title: message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                        type: 'error'
                    });
                } else {
                    this.onClose();
                }
                this.submitting = false;
            });
        },
        // 預防影藏狀態點擊
        preventSwitchoffClick(e) {
            if (this.logoFields.flash_switch === 'off') {
                e.preventDefault();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.content {
    > div {
        margin-bottom: 14px;
    }
    .dropzone-empty-icon {
        width: 200px;
        height: 200px;
        text-align: center;
        padding-top: 49px;
        > p {
            width: 100%;
            margin-top: 3px;
            color: #D2D2D2;
            font-size: 12px;
            text-align: center;
        }
    }
    .field {
        label {
            &.logo-size-note {
                color: #131304;
                font-size: 13px;
                font-weight: normal;
            }
            .limit-size {
                color: #1783D2;
                font-weight: bold;
                text-decoration: underline;
            }
            span.label {
                margin: 0 0 0 8px;
            }
        }
        &.min-height-field {
            min-height: 200px;
        }
        .display-title {
            float: left;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .checkbox {
            margin: 0 0 0 22px;
        }
        .dynamic-recommend-msg {
            display: inline-block;
        }
        .required {
            color: red;
            font-size: 12px;
        }
        &.dynamic-logo {
            .display-title,
            .dynamic-recommend-msg,
            .checkbox {
                line-height: 29px;
                vertical-align: middle;
                margin-bottom: 0;
            }
            .logo-size-note {
                margin-top: 6px;
            }
        }
    }
    .dropzone-out {
        float: left;
        margin: 0 10px 0 0;
        span {
            display: block;
            font-size: 12px;
            text-align: center;
        }
    }
    .dropzone-in {
        float: left;
        span {
            display: block;
            font-size: 12px;
            text-align: center;
        }
    }
}
</style>
