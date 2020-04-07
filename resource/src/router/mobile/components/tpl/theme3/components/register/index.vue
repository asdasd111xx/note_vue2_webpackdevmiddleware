<template>
    <div slot="content" class="loginpage">
        <article>
            <div class="logobox">
                <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/login/logo.png')" />
            </div>
            <div class="downbox">
                <div class="input-box black">
                    <div class="side" @click="$router.push('/mobile/login')">
                        <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/login/username.png')" />
                        <p>{{ this.$text('S_BACK_TO_LOGIN', '返回登录') }}</p>
                    </div>
                    <div class="major">
                        <p class="major-title">{{ this.$text('S_REGISTER', '注册') }}</p>
                        <ul>
                            <li v-for="item in joinusData" :key="item">
                                <img :src="$getCdnPath(item.icon)" />
                                <input
                                    v-if="item.type === 'text'"
                                    v-model="item.input"
                                    :placeholder="item.placeholder"
                                    :maxlength="item.maxlength"
                                    :class="{error: errorMsg[item.name]}"
                                    type="text"
                                    @input="onInput($event, item.name)"
                                />
                                <input
                                    v-else-if="item.type === 'password'"
                                    v-model="item.input"
                                    :placeholder="item.placeholder"
                                    :maxlength="item.maxlength"
                                    :class="{error: errorMsg[item.name]}"
                                    type="password"
                                    @input="onInput($event, item.name)"
                                />
                                <img
                                    v-if="item.captchaImg"
                                    :src="$getCdnPath(item.captchaImgSrc)"
                                    class="captcha-img"
                                    @click="getCaptcha"
                                />
                                <span v-show="errorMsg[item.name]">{{ errorMsg[item.name] }}</span>
                            </li>
                        </ul>
                        <button @click="onRegister">{{ this.$text('S_REGISTER', '注册') }}</button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import common from '@/api/common';
import member from '@/api/member';
import joinMemInfo from '@/config/joinMemInfo';

export default {
    data() {
        const fields = {
            username: '',
            password: '',
            confirm_password: '',
            captcha_text: ''
        };

        return {
            isCheck: false,
            joinusData: [
                {
                    name: 'username',
                    type: 'text',
                    icon: '/static/image/mobile/tpl/theme3/login/username.png',
                    input: '',
                    maxlength: 20,
                    placeholder: this.$text('S_USER_NAME', '用户名')
                },
                {
                    name: 'password',
                    type: 'password',
                    icon: '/static/image/mobile/tpl/theme3/login/password.png',
                    input: '',
                    maxlength: 12,
                    placeholder: this.$text('S_PASSWORD', '密码')
                },
                {
                    name: 'confirm_password',
                    type: 'password',
                    icon: '/static/image/mobile/tpl/theme3/login/password.png',
                    input: '',
                    maxlength: 12,
                    placeholder: this.$text('S_PWD_CONFIRM', '确认密码')
                },
                {
                    name: 'captcha_text',
                    type: 'text',
                    icon: '/static/image/mobile/tpl/theme3/login/captcha.png',
                    input: '',
                    placeholder: this.$text('S_CHECK_CODE', '验证码'),
                    captchaImg: true,
                    captchaImgSrc: ''
                }
            ],
            fieldValue: { ...fields },
            errorMsg: { ...fields }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    watch: {
        fieldValue: {
            handler() {
                const msg = {};
                Object.keys(this.errorMsg).forEach((fieldName) => {
                    if (this.fieldValue[fieldName] === '') {
                        return;
                    }

                    /* 全部驗證 */
                    if (joinMemInfo[fieldName].regExp && !joinMemInfo[fieldName].regExp.test(this.fieldValue[fieldName])) {
                        msg[fieldName] = this.$t(joinMemInfo[fieldName].errorMsg);
                        return;
                    }

                    /* 密碼與確認密碼驗證 */
                    if (fieldName === 'confirm_password' && this.fieldValue.password !== this.fieldValue.confirm_password) {
                        msg[fieldName] = this.$text('S_PASSWD_CONFIRM_ERROR', '确认密码预设要跟密码一致');
                        return;
                    }

                    msg[fieldName] = '';
                });

                this.errorMsg = {
                    ...this.errorMsg,
                    ...msg
                };
            },
            deep: true
        }
    },
    created() {
        this.getCaptcha();
    },
    methods: {
        /**
         * 取得驗證碼
         * @method getCaptcha
         */
        getCaptcha() {
            common.captcha({
                success: (response) => {
                    const index = this.joinusData.map((item) => item.captchaImg).indexOf(true);
                    this.joinusData[index].captchaImgSrc = response.ret;
                }
            });
        },
        onInput(e, fieldName) {
            this.fieldValue[fieldName] = e.target.value;
        },
        /**
         * 註冊
         * @method onRegister
         */
        onRegister() {
            let checkResult = true;

            Object.keys(this.fieldValue).forEach((fieldName) => {
                if (!this.fieldValue[fieldName] || this.errorMsg[fieldName]) {
                    checkResult = false;
                }
            });

            if (!checkResult) {
                alert(this.$text('S_JM_MSG_COMPLETE', '请填写完整'));
                return;
            }

            member.join({
                params: {
                    ...this.fieldValue,
                    speedy: true
                },
                success: () => {
                    alert(this.$text('S_CR_SUCCESS', '成功'));

                    // GA流量統計
                    window.dataLayer.push({
                        dep: 2,
                        event: 'ga_click',
                        eventCategory: 'sign_up',
                        eventAction: 'sign_up',
                        eventLabel: 'sign_up',
                        ga_hall_id: 3820325,
                        ga_domain_id: this.memInfo.user.domain
                    });
                },
                fail: () => {
                    const index = this.joinusData.map((item) => item.name).indexOf('captcha_text');
                    this.joinusData[index].input = '';
                    this.getCaptcha();
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.loginpage {
    padding: 0 20px;
    text-align: center;
    background-image: url('/static/image/mobile/tpl/theme3/login/bg.png');
    background-size: cover;
    min-height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    article {
        width: 100%;
    }
    .downbox {
        position: relative;
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .logobox {
        width: 200px;
        height: auto;
        margin: 0 auto 25px;
        img {
            width: 100%;
        }
    }
    .input-box {
        transition: .5s;
        width: 100%;
        font-size: 14px;
        letter-spacing: 1.5px;
        line-height: 22px;
        display: flex;
        color: #fff;
        &.white {
            .major {
                background: rgba(255,255,255,.2);
            }
            .side {
                background: rgba(0,0,0,.2);
            }
        }
        &.black {
            .major {
                background: rgba(0,0,0,.2);
            }
            .side {
                background: rgba(255,255,255,.2);
            }
        }
        .major {
            padding: 45px 5% 50px;
            width: 100%;
            border-radius: 5px;
            .major-title {
                font-size: 17px;
                font-weight: bold;
                line-height: 25px;
            }
            .major-down {
                display: flex;
                justify-content: space-between;
                margin-bottom: 35px;
                padding: 0 5px;
                div {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .checked span::after {
                    opacity: 1;
                }
                input[type="checkbox"] {
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                span {
                    display: inline-block;
                    border: 2px solid #fff;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    margin-right: 5px;
                    position: relative;
                    &::after {
                        content: '';
                        opacity: 0;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%) rotate(45deg);
                        width: 5px;
                        height: 10px;
                        border-right: 2px solid #fff;
                        border-bottom: 2px solid #fff;
                        border-radius: 5px;
                        transition: .5s;
                    }
                }
                a {
                    color: #fff;
                }
            }
        }
        .side {
            writing-mode: vertical-lr;
            letter-spacing: 4px;
            padding: 0 10px;
            border-radius: 5px;
            img {
                width: 27px;
                height: 27px;
                margin-bottom: 5px;
            }
            p {
                display: inline-block;
            }
        }
        ul {
            padding: 0;
        }
        button {
            background: -webkit-linear-gradient(left,#efdfaf,#edbf6b);
            background: -o-linear-gradient(right,#efdfaf,#edbf6b);
            background: -moz-linear-gradient(right,#efdfaf,#edbf6b);
            background: linear-gradient(to right,#efdfaf,#edbf6b);
            color: #9C6E54;
            padding: 15px 10px;
            text-align: center;
            width: 100%;
            border: none;
            border-radius: 25px;
            margin-bottom: 20px;
        }
    }
    .input-box li{
        list-style: none;
        padding: 10px;
        background: rgba(255,255,255,.1);
        margin-bottom: 10px;
        border-radius: 25px;
        position: relative;
        .captcha-img {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            width: 80px;
        }
        img {
            width: 27px;
            height: 27px;
            float: left;
        }
        input {
            background: rgba(255,255,255,0);
            border: none;
            width: calc(100% - 27px);
            color: #fff;
            height: 27px;
            padding: 0 0 0 5px;
            &.error {
                border: 1px solid red;
            }
        }
    }
}


</style>
