<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['form-wrap']">
            <div :class="$style.title">更改密码</div>
            <div :class="[$style['stage-wrap'], { [$style['email-form']]: curForm === 'email'}]">
                <div
                    v-for="data in stageList"
                    :key="data.num"
                    :class="[$style['item-wrap'], { [$style.current]: status >= data.num}]"
                >
                    <div :class="$style['line-wrap']">
                        <div :class="$style.square">
                            <span>{{ data.num }}</span>
                        </div>
                    </div>
                    <div :class="$style['stage-text']">{{ data.text }}</div>
                </div>
            </div>
            <div :class="[$style['select-form'], 'clearfix']">
                <div :class="[$style['select-item'], { [$style['current-form']]: curForm === 'mobile'}]" @click="curForm = 'mobile'">手机方式找回</div>
                <div :class="[$style['select-item'], { [$style['current-form']]: curForm === 'email'}]" @click="curForm = 'email'">邮箱方式找回</div>
            </div>
            <div :class="$style['field-wrap']">
                <!-- 信箱 -->
                <template v-if="curForm === 'email'">
                    <div :class="[$style['input-wrap'], 'clearfix']">
                        <div :class="$style['input-title']">{{ $text('S_ACCOUNT', '帐号') }}</div>
                        <input
                            v-model="allValue.username"
                            :class="$style['input-content']"
                            :placeholder="$text('S_ENABLE_ACCOUNT', '请输入账号')"
                            type="text"
                            @input="verification('username')"
                        />
                        <div v-show="tips.username" :class="$style['tip-text']">{{ tips.username }}</div>
                    </div>
                    <div :class="[$style['input-wrap'], 'clearfix']">
                        <div :class="$style['input-title']">{{ $text('S_MAIL', '邮箱') }}</div>
                        <input
                            v-model="allValue.email"
                            :class="$style['input-content']"
                            :placeholder="$text('S_ENABLE_EMAIL', '请输入邮箱地址')"
                            type="text"
                            @input="verification('email')"
                        />
                        <div v-show="tips.email" :class="$style['tip-text']">{{ tips.email }}</div>
                    </div>
                    <div :class="$style.submit" @click="onMailHandler">
                        {{ $text('S_JM_SURE_SEND', '确认送出') }}
                    </div>
                </template>
                <!-- 手機 -->
                <template v-else>
                    <div v-if="status === 1" :class="[$style['input-wrap'], 'clearfix']">
                        <div :class="$style['input-title']">{{ $text('S_ACCOUNT', '帐号') }}</div>
                        <input
                            v-model="allValue.username"
                            :class="$style['input-content']"
                            :placeholder="$text('S_ENABLE_ACCOUNT', '请输入账号')"
                            type="text"
                            @input="verification('username')"
                        />
                        <div v-show="tips.username" :class="$style['tip-text']">{{ tips.username }}</div>
                    </div>
                    <div v-else-if="status === 2" :class="[$style['input-wrap'], 'clearfix']">
                        <div :class="$style['input-title']">{{ $text('S_CHECK_CODE', '验证码') }}</div>
                        <input
                            v-model="allValue.keyring"
                            :class="$style['input-content']"
                            :placeholder="$text('S_ENABLE_KEYRING', '请输入验证号码')"
                            type="text"
                        />
                    </div>
                    <template v-else>
                        <div :class="[$style['input-wrap'], 'clearfix']">
                            <div :class="$style['input-title']">{{ $text('S_NEW_PWD', '新密码') }}</div>
                            <input
                                v-model="allValue.password"
                                :class="$style['input-content']"
                                :placeholder="$text('S_ENABLE_PASSWORD', '请输入新密码')"
                                type="password"
                                @input="verification('password')"
                            />
                            <div v-show="tips.password" :class="$style['tip-text']">{{ tips.password }}</div>
                        </div>
                        <div :class="[$style['input-wrap'], 'clearfix']">
                            <div :class="$style['input-title']">{{ $text('S_CHK_PWD', '确认新密码') }}</div>
                            <input
                                v-model="allValue.confirm_password"
                                :class="$style['input-content']"
                                :placeholder="$text('S_ENABLE_CHK_PWD', '请确认新密码')"
                                type="password"
                                @input="verification('confirm_password')"
                            />
                            <div v-show="tips.confirm_password" :class="$style['tip-text']">{{ tips.confirm_password }}</div>
                        </div>
                    </template>
                    <div :class="$style.submit" @click="onMobileHandler">
                        {{ status === 3 ? $text('S_JM_SURE_SEND', '确认送出') : $text('S_NEXT_STEP', '下一步') }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import joinMemInfo from '@/config/joinMemInfo';

export default {
    props: {
        changePage: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            status: 1,
            curForm: 'mobile',
            allValue: {
                username: '',
                email: '',
                keyring: '',
                password: '',
                confirm_password: ''
            },
            resetKeyring: '',
            tips: {
                username: '',
                email: '',
                password: '',
                confirm_password: ''
            }
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        }),
        stageList() {
            const arr = [
                { num: 1, text: '填写账户名' },
                { num: 2, text: '身份验证' },
                { num: 3, text: '设置新密码' }
            ];

            if (this.curForm === 'email') {
                return arr.slice(0, 1);
            }

            return arr;
        },
        onMobileHandler() {
            if (this.status === 1) {
                return this.sendSms;
            }

            if (this.status === 2) {
                return this.verifySms;
            }

            return this.onMobileResetPwd;
        }
    },
    methods: {
        verification(target) {
            const data = joinMemInfo[target];
            const re = data.regExp;
            const msg = data.errorMsg;

            if (!this.allValue[target]) {
                this.tips[target] = this.$text('S_JM_FIELD_REQUIRE', '该栏位不得为空');
                return;
            }

            if ((re && !re.test(this.allValue[target]))
                || (target === 'confirm_password' && this.allValue.password !== this.allValue.confirm_password)
                || (data.minimum && this.allValue[target].length < data.minimum)
                || (data.maximum && this.allValue[target].length > data.maximum)
            ) {
                this.tips[target] = msg;
                return;
            }

            this.tips[target] = '';
        },
        onMailHandler() {
            if (this.tips.username || this.tips.email) {
                alert(this.$text('S_CHECK_FAIL', '验证失败'));
                return;
            }

            const data = {
                params: {
                    username: this.allValue.username,
                    email: this.allValue.email
                },
                success: (response) => {
                    let pid;
                    if (this.webInfo.alias === '500000') {
                        pid = '30734';
                    } else if (this.webInfo.alias === '48') {
                        pid = '10484';
                    } else {
                        pid = '10324';
                    }

                    if (response.result === 'ok') {
                        alert(this.$text('FORGET_PWD_SEND', '确认信已发送，请至信箱查看。'));
                        this.changePage({ page: pid });
                    }
                }
            };

            // 忘記密碼 - 會員
            member.pwdForget(data);
        },
        sendSms() {
            if (this.tips.username) {
                alert(this.$text('S_CHECK_FAIL', '验证失败'));
                return;
            }

            member.pwdForgetMobile({
                params: {
                    username: this.allValue.username
                },
                success: (response) => {
                    if (response.result === 'ok') {
                        this.status = 2;
                    }
                },
                fail: () => {
                    this.allValue.username = '';
                }
            });
        },
        verifySms() {
            if (!this.allValue.keyring) {
                alert(this.$text('S_CHECK_FAIL', '验证失败'));
                return;
            }

            member.pwdMobileVerify({
                params: {
                    username: this.allValue.username,
                    keyring: this.allValue.keyring
                },
                success: (response) => {
                    if (response.result === 'ok') {
                        this.resetKeyring = response.keyring;
                        this.status = 3;
                    }
                },
                fail: () => {
                    this.allValue.keyring = '';
                }
            });
        },
        onMobileResetPwd() {
            if (!this.tips.password || !this.tips.confirm_password) {
                alert(this.$text('S_CHECK_FAIL', '验证失败'));
                return;
            }

            member.pwdResetMobile({
                params: {
                    username: this.allValue.username,
                    new_password: this.allValue.password,
                    confirm_password: this.allValue.confirm_password,
                    keyring: this.resetKeyring
                },
                success: (response) => {
                    if (response.result === 'ok') {
                        let pid;
                        if (this.webInfo.alias === '500000') {
                            pid = '30734';
                        } else if (this.webInfo.alias === '48') {
                            pid = '10484';
                        } else {
                            pid = '10324';
                        }

                        this.changePage({ page: pid });
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss" src="./css/forgetPw.module.scss" module></style>
