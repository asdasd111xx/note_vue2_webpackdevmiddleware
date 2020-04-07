<template>
    <div :class="$style.wrap">
        <div :class="$style['btn-pre']" @click="$emit('update:checkItem', '')">
            <icon
                name="arrow-left"
                width="30"
                height="30"
            />
        </div>
        <div :title="$text('S_CHECK_PLZ', '请进行验证')" :class="$style.title">{{ $text('S_CHECK_PLZ', '请进行验证') }}</div>
        <div :class="$style.content">
            <div :class="$style['content-header']" />
            <div :class="$style['content-body']">
                <div :class="$style.field">
                    <input
                        v-model="inputVal"
                        :title="checkItemInfo[checkItem].placeholder"
                        :placeholder="checkItemInfo[checkItem].placeholder"
                        type="text"
                        @keydown.13="submit"
                    />
                </div>
                <div :class="$style.submit" @click="submit">{{ $text('S_JM_SURE_SEND', '确认送出') }}</div>
                <div :class="$style['text-msg']">{{ $text('S_NO_SETTING', '若未设置，请联系线上客服') }}</div>
            </div>
            <div :class="$style['content-footer']" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        theme: {
            type: Object,
            default: null
        },
        checkItem: {
            type: String,
            required: true
        },
        onLogin: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            checkItemInfo: {
                name: {
                    title: this.$text('S_ENTER_REAL_NAME', '请输入真实姓名'),
                    placeholder: this.$text('S_REAL_NAME', '真实姓名')
                }
            },
            inputVal: '',
            lock: false
        };
    },
    computed: {
        $style() {
            return this.theme || this.$styleDefault;
        }
    },
    methods: {
        onClose() {
            this.$emit('update:checkItem', '');
        },
        submit() {
            if (this.lock) {
                return;
            }
            this.lock = true;
            this.onLogin({ [this.checkItem]: this.inputVal }).then(() => {
                this.lock = false;
            });
        }
    }
};
</script>

<style lang="scss" module="$styleDefault">
@import "~@/css/variable.scss";

.wrap {
    position: relative;
    width: 98%;
    max-width: 430px;
    margin: 194px auto 0;
    padding: 50px 0;
    background: url('/static/image/agent/agcenter_login_bg.png') 50% 0 repeat-y;
    text-align: center;

    .title {
        margin: 0 auto 52px;
        color: #FFF;
        font-size: 40px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        line-height: normal;
    }
    .content {
        margin: 0 auto;
        width: 382px;
    }
    .content-header {
        height: 100px;
        background: url('/static/image/agent/agcenter_pwdforget_top2.png') 50% 0 no-repeat;
    }
    .content-body {
        padding: 20px 0;
        background: url('/static/image/agent/agcenter_login_body_y2.png') 50% 0 repeat-y;
    }
    .content-footer {
        position: relative;
        top: -5px;
        background: url('/static/image/agent/agcenter_login_bottom2.png') 50% 100% no-repeat;
        height: 55px;
    }
    .field {
        max-width: 280px;
        margin: 0 auto 20px;
        padding: 0 10px;
    }
    input {
        display: block;
        border: none;
        background: transparent;
        border-bottom: 1px solid #EDEDED;
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #313F52;
        font-size: 16px;
        font-family: "Microsoft JhengHei", "微軟正黑體", arial, helvetica, sans-serif;
        outline: none;
    }
    .tip {
        margin-top: 6px;
        color: #F00;
        text-align: left;
    }
    .submit {
        margin: 40px auto 0;
        padding: 0 20px;
        background: url('/static/image/agent/agcenter_login_btn.png') 50% 0 no-repeat;
        width: 202px;
        height: 72px;
        line-height: 72px;
        color: #FFF;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
            color: #FF8989;
        }
    }
    .text-msg {
        margin: 12px auto 0;
        width: 82%;
        font-size: 15px;
        text-align: center;
    }
    .btn-pre {
        position: absolute;
        top: 15px;
        left: 15px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 60px;
        font-family: initial;
        color: #8190AA;
        cursor: pointer;
        transition: all .3s ease;
        &:hover {
            color: #FFF;
        }
    }
}
</style>
