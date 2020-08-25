<template>
    <div :class="`${loginStatus ? 'mem-wrap' : 'login-wrap'}`">
        <div v-if="!loginStatus" class="login-centered clearfix">
            <span class="login-unit login-unit-username">
                <input
                    v-model="username"
                    :title="$t('S_ACCOUNT')"
                    :placeholder="$t('S_ACCOUNT')"
                    maxlength="20"
                    tabindex="1"
                    class="login-input"
                    @keydown.13="login()"
                />
            </span>
            <span class="login-unit login-unit-password">
                <input
                    v-model="password"
                    :title="$t('S_PASSWORD')"
                    :placeholder="$t('S_PASSWORD')"
                    type="password"
                    maxlength="12"
                    tabindex="2"
                    class="login-input"
                    @keydown.13="login()"
                />
            </span>
            <span class="login-unit login-unit-captcha">
                <input
                    v-model="captcha"
                    :title="$t('S_RELOAD_PIC')"
                    :placeholder="$t('S_CHECK_CODE')"
                    maxlength="4"
                    tabindex="3"
                    class="login-input"
                    @keydown.13="login()"
                    @focus="getCaptcha()"
                />
                <img
                    v-if="captchaImg"
                    :src="captchaImg"
                    height="30"
                    class="login-captcha-img"
                    @click="getCaptcha();"
                />
            </span>
            <div class="login-btn-wrap clearfix">
                <input
                    :value="$t('S_LOGIN')"
                    :title="$t('S_LOGIN')"
                    type="submit"
                    tabindex="4"
                    class="login-btn"
                    @click="login()"
                />
                <div
                    :title="$t('S_PASSWORD_FORGET')"
                    class="pwd-forget-btn"
                    @click="actionSetPop({ type: 'memPwdForget' })"
                >
                    {{ $t('S_PASSWORD_FORGET') }}
                </div>
                <span>{{ line }}</span>
                <div
                    :title="$t('S_JOIN_MEMBER')"
                    class="join-member"
                    @click="actionChangePage({ page: 'join', type: '' })"
                >
                    {{ $t('S_JOIN_MEMBER') }}
                </div>
            </div>
        </div>
        <div v-else-if="loginStatus" class="mem-info clearfix">
            <div class="mcenter-btn" @click="actionChangePage({ page: 'mcenter', type: '' })">{{ $t('S_MEM_CENTER') }}</div>
            <div class="mem-info-item mem-info-account">
                <span>{{ $t('S_ACCOUNT') }}：</span>
                <strong>{{ memInfo.user.username }}</strong>
            </div>
            <div class="mem-info-item mem-info-balance">
                <span>{{ $t('S_TOTAL_BALANCE') }}：</span>
                <strong>{{ memInfo.balance.total }}</strong>
            </div>
            <div
                id="js-balance-icon"
                class="mem-info-item plus"
                @mouseover="balanceShow()"
                @mouseleave="balanceSwitch = false"
            >
                <icon name="plus-square" width="14" />
                <!-- 加號展開額度列表 -->
                <div v-if="balanceSwitch" :class="`balance-wrap ${balanceRight ? 'right' : ''}`">
                    <div
                        v-for="(item, key) in memInfo.balance.vendor"
                        :key="key"
                        class="balance-item clearfix"
                    >
                        <span class="balance-text">{{ item.text }}：</span>
                        <span class="balance-money">
                            <template v-if="item.maintain">
                                <font color="red">{{ $t('S_MAINTAIN') }}</font>
                            </template>
                            <template v-else>
                                {{ item.amount }}
                            </template>
                        </span>
                    </div>
                </div>
            </div>
            <button class="logout-btn" @click="logout()">{{ $t('S_LOGOUT') }}</button>
        </div>
        <div v-if="AgentSwitch" class="agent-link-wrap">
            <span
                :title="$t('S_AGENT_LOGIN')"
                class="agent-link"
                @click="actionSetPop({ type: 'agLogin' })"
            >{{ $t('S_AGENT_LOGIN') }}</span>
            <span
                :title="$t('S_CEP_JOINAGENT')"
                class="agent-link"
                @click="actionChangePage({ page: 'joinAgent', type: '' })"
            >{{ $t('S_CEP_JOINAGENT') }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import common from '@/api/common';
import member from '@/api/member';

export default {
    props: {
        line: {
            default: '|',
            type: String
        },
        // eslint-disable-next-line vue/prop-name-casing
        AgentSwitch: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            balanceRight: false,
            username: '',
            password: '',
            captcha: '',
            captchaImg: '',
            balanceLock: false,
            lockFun: '',
            lockSec: 0,
            balanceSwitch: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            loginStatus: 'getLoginStatus'
        })
    },
    destroyed() {
        clearTimeout(this.lockFun);
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetUserBalance',
            'actionSetPop'
        ]),
        balanceShow() {
            this.balanceSwitch = true;
            const bodyWidth = document.body.clientWidth;
            const balanceLeft = document.getElementById('js-balance-icon').offsetLeft;
            if (bodyWidth - balanceLeft < 200) {
                this.balanceRight = true;
            }
            // locking return
            if (this.balanceLock) {
                return;
            }
            this.balanceLock = true;
            this.actionSetUserBalance().then(() => {
                this.lockTiming();
            });
        },
        lockTiming() {
            if (this.lockSec === 15) {
                clearTimeout(this.lockFun);
                this.lockSec = 0;
                this.balanceLock = false;
                return;
            }
            this.lockSec += 1;
            this.lockFun = setTimeout(() => {
                this.lockTiming();
            }, 1000);
        },
        login() {
            const loginInfo = {
                username: this.username,
                password: this.password,
                captcha_text: this.captcha
            };
            member.login({
                params: loginInfo,
                success: () => {
                    member.announcement({
                        success: (response) => {
                            if (response.result === 'ok') {
                                response.ret.forEach((post) => {
                                    alert(post.content);
                                });
                            }
                        }
                    }).then(() => {
                        window.location.reload();
                    });
                },
                fail: () => {
                    this.captcha = '';
                }
            });
        },
        logout() {
            member.logout({
                success: () => {
                    window.location.reload();
                }
            });
        },
        getCaptcha() {
            common.captcha({
                success: (response) => {
                    this.captchaImg = response.ret;
                }
            });
        }
    }
};
</script>
