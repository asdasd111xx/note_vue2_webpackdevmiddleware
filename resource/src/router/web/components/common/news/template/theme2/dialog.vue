<template>
    <div>
        <div v-if="open" class="dialog-mask" />
        <div v-if="open" class="dialog-wrap">
            <div class="dialog-content">
                <span class="title">{{ title }}</span>
                <!-- eslint-disable vue/no-v-html -->
                <span
                    v-if="isText"
                    class="content"
                    v-html="content"
                />
                <!-- eslint-enable vue/no-v-html -->
                <img v-else :src="imgSrc" />
            </div>
            <div class="dialog-btn clearfix">
                <div class="close-btn" @click="closeDialog()">{{ $text('S_DIALOG_CLOSE_BTN', '关闭') }}</div>
                <div class="view-btn" @click="goPostPage()">{{ $text('S_DIALOG_ALL_BTN', '查看全部') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        open: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        imgSrc: {
            type: String,
            default: ''
        },
        isText: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapGetters({
            postData: 'getPost',
            loginStatus: 'getLoginStatus',
            curLang: 'getCurLang'
        })
    },
    methods: {
        closeDialog() {
            this.$emit('showDialog');
        },
        goPostPage() {
            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }
            this.$router.push('/mobile/mcenter/post');
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~@/css/variable.scss';

.dialog-mask,
.dialog-wrap {
    position: fixed;
    top: 0;
    left: 0;
    padding: 0;
    background: #000;
    z-index: 999;
}
.dialog-mask {
    width: 100%;
    height: 100%;
    opacity: 0.5;
}
.dialog-wrap {
    top: 50%;
    left: 50%;
    padding: 17px 0;
    background: #F8F1EB;
    width: 93%;
    max-height: 80%;
    color: #999;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    .dialog-content {
        padding: 0 20px;
        .title {
            color: #000;
            font-size: 14px;
            font-weight: bold;
            display: block;
        }
        .content {
            color: #5E5450;
            font-size: 13px;
        }
        img {
            width: 100%;
        }
    }
}
.dialog-btn {
    padding: 0 3%;
    margin-top: 9px;
    .close-btn,
    .view-btn {
        border-radius: 5px;
        background: url('/static/image/mobile/tpl/theme3/home/dialog_btn_bg.png');
        background-size: 100%;
        width: 128px;
        height: 37px;
        line-height: 37px;
        color: #FFF;
        text-align: center;
        cursor: pointer;
    }
    .close-btn {
        float: left;
    }
    .view-btn {
        float: right;
    }
}

// pc
@media screen and (min-width: $pc) {
    .dialog-wrap {
        width: 1200px;
        margin: 0 auto;
    }
}
</style>
