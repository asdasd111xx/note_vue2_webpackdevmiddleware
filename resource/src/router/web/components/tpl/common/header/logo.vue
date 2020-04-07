<template>
    <div
        :style="{
            'width': `${logoWidth}px`,
            'height': `${logoHeight}px`,
            'line-height': `${logoHeight}px`
        }"
        class="header-logo-wrap"
    >
        <!-- 未點擊編輯時, 才顯示 -->
        <template v-if="!dropSwitch">
            <!-- 尚未上傳logo -->
            <div
                v-if="!webInfo.logo"
                class="logo-default"
                @click="$emit('changePage', { page: webInfo.page[0].pid, type: 'custom' })"
            >
                LOGO
            </div>
            <!-- 當前已上傳的logo -->
            <img
                v-else
                :src="webInfo.logo ? $getCdnPath(`${cdnDomain}${webInfo.logo}`) : ''"
                class="header-logo"
                width="100%"
                @click="$emit('changePage', { page: webInfo.page[0].pid, type: 'custom' })"
            />
        </template>
        <!-- 編輯鈕 -->
        <div
            v-if="isBackEnd & !dropSwitch"
            class="btn-edit"
            @click="getLogo();dropSwitch = true"
        >
            {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
        </div>
        <!-- 圖片上傳區 -->
        <dropzone
            v-if="isBackEnd & dropSwitch"
            :types="['jpg', 'jpeg', 'gif', 'png']"
            :styles="dropStyle"
            :cur-image="image"
            :on-complete="onUpload"
            :on-remove="onRemove"
            :preview-width="logoWidth"
            preview-height="auto"
        >
            <div
                slot="closeBtn"
                class="close-btn"
                @click.stop="dropClose"
            />
            <div class="drop-img">
                {{ $t('CLICK_UPLOAD_IMG') }}
            </div>
            <div class="drop-tip">
                ( {{ $t('S_RECOMMEND_SIZE') }}：{{ logoWidth }} x {{ logoHeight }} px )
            </div>
        </dropzone>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dropzone from '@/components/dropzone';

export default {
    components: {
        dropzone
    },
    props: {
        logoWidth: {
            type: Number,
            default: 0
        },
        logoHeight: {
            type: Number,
            default: 0
        },
        logoAlign: {
            type: String,
            default: 'centerCenter'
        },
        isModifyStyle: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dropSwitch: false,
            dropStyle: {
                width: '250px',
                height: '100px'
            },
            image: ''
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
            nowtpl: 'getNowtpl',
            isBackEnd: 'getIsBackEnd'
        })
    },
    created() {
        if (this.isBackEnd) {
            this.dropPosition();
            this.getLogo();
        }
    },
    mounted() {
        if (!this.isBackEnd) {
            this.$on('changePage', this.changePage);
        }
    },
    methods: {
        ...mapActions([
            'actionLogoUpdate',
            'actionChangePage'
        ]),
        getLogo() {
            if (this.webInfo.logo) {
                this.image = this.webInfo.logo;
            }
        },
        onUpload(id, name, response) {
            if (response.status === 'Y') {
                this.image = response.data.link;

                const data = {
                    template_id: this.nowtpl,
                    logo: response.data.link
                };
                this.actionLogoUpdate(data).then(({ status, message }) => {
                    if (status !== 'Y') {
                        this.$swal({
                            title: message || this.$t('S_CONTACT_SERVICE'),
                            type: 'error'
                        });
                    }
                });
            }
        },
        onRemove() {
            this.image = '';
        },
        dropPosition() {
            let style = {};
            let modifyStyle = {};

            if (this.isModifyStyle) {
                modifyStyle = {
                    width: `${this.logoWidth}px`,
                    height: `${this.logoHeight}px`
                };
            }

            switch (this.logoAlign) {
                case 'leftTop':
                    style = {
                        top: 0,
                        left: 0
                    };
                    break;
                case 'centerTop':
                    style = {
                        top: 0,
                        left: '50%',
                        'margin-left': '-125px'
                    };
                    break;
                case 'rightTop':
                    style = {
                        top: 0,
                        right: 0
                    };
                    break;
                case 'leftCenter':
                    style = {
                        top: '50%',
                        left: 0,
                        'margin-top': '-50px'
                    };
                    break;
                case 'centerCenter':
                    style = {
                        top: '50%',
                        left: '50%',
                        margin: '-50px 0 0 -125px'
                    };
                    break;
                case 'rightCentr':
                    style = {
                        top: '50%',
                        right: 0,
                        'margin-top': '-50px'
                    };
                    break;
                default:
            }
            this.dropStyle = {
                position: 'absolute',
                ...this.dropStyle,
                ...style,
                ...modifyStyle
            };
        },
        dropClose(e) {
            e.preventDefault();
            this.dropSwitch = false;
        },
        changePage(data) {
            this.actionChangePage(data);
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
    /deep/ .image-upload-wrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.95;
        z-index: 10;
        .close-btn {
            position: absolute;
            top: 0;
            right: 0;
            background: url('/static/image/common/btn_close2.png') 50% 50% #333 no-repeat;
            width: 27px;
            height: 26px;
            cursor: pointer;
        }
        .images-block {
            width: 100%;
            height: 100%;
            .uploaded-block {
                top: 26px;
                right: 0;
                left: auto;
                padding: 0;
                width: 26px;
                height: 23px;
                .ui {
                    &.button {
                        position: absolute;
                        right: 0;
                        display: block;
                    }
                }
                .preview-btn {
                    top: 0;
                }
                .delete-btn {
                    bottom: -23px;
                    border-radius: 0;
                }
                img {
                    width: 130px;
                    height: 50px;
                }
            }
        }
        .default-block {
            width: 100%;
            height: 100%;
            line-height: 28px;
            text-align: center;
            .drop-img {
                background: url('/static/image/common/icon_file.png') 50% 50% no-repeat;
                background-size: 30%;
                height: 70px;
                line-height: 70px;
                color: #545454;
                font-size: 18px;
                font-weight: bold;
            }
            .drop-tip {
                color: #8B8B8B;
                font-size: 14px;
                line-height: 20px;
            }
        }
    }
}

.logo-default {
    box-sizing: border-box;
    border: 1px solid transparent;
    width: 100%;
    height: 100%;
    color: #FFF;
    font-size: 30px;
    text-align: center;
    cursor: pointer;
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
</style>
