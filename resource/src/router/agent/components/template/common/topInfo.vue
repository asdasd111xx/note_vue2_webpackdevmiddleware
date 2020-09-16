<template>
    <div :class="[$style['agcenter-content-top'], $style[agentLang], 'clearfix']">
        <div :class="$style['agcenter-info-wrap']">
            <div :class="$style['content-top-title']">
                <!-- eslint-disable vue/no-v-html -->
                <span ref="content-text" v-html="contentTitle" />
                <!-- eslint-enable vue/no-v-html -->
                <span v-if="agentInfo.user.bankrupt === '1'" :class="$style.prompt">
                    <icon
                        :class="$style.warning"
                        name="exclamation-circle"
                        width="20"
                        height="20"
                    />
                    <span>{{ $t('S_BANKRUPT_PROMPT') }}</span>
                </span>
            </div>
            <div class="content-top-title">
                <span>{{ $t('S_CURRENCY') }}：{{ agentInfo.cash.currency }}</span>
            </div>
            <div :class="$style['content-top-title']">
                <span>{{ $t('S_TIME_OF_EAST_US') }}：{{ estTimeNow }}</span>
            </div>
            <div :class="$style['content-top-info']">
                <div>
                    <!-- eslint-disable vue/no-v-html -->
                    <span ref="message-text" v-html="messageText" />
                    <!-- eslint-enable vue/no-v-html -->
                </div>
                <div :class="$style['info-item']">
                    <label>{{ $t('S_LAST_LOGIN_IP') }}：</label>
                    <span>{{ agentInfo.user.last_ip || '--' }}</span>
                </div>
                <div :class="$style['info-item']">
                    <label>{{ $t('S_LAST_LOGON_TIME') }}：</label>
                    <span>{{ agentInfo.user.last_login }}</span>
                </div>
            </div>
        </div>
        <div :class="$style['agcenter-title-wrap']">
            <div :class="$style['user-icon']" />
            <div :class="$style['info-wrap']">
                <div :class="$style['title-text']">{{ $text('S_AGENT', '代理中心') }}</div>
                <div :class="$style['sub-text']">Agent center</div>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import isMobile from '@/lib/is_mobile';
import EST from '@/lib/EST';
import ajax from '@/lib/ajax';
import { API_AGENT_DISABLE_ALIAS, API_AGENT_ENABLE_ALIAS } from '@/config/api';

export default {
    props: {
        theme: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            estTimer: null,
            estTimeNow: '',
            isAjax: false
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            agentInfo: 'getAgentInfo',
            systemTime: 'getSystemTime',
            agentLang: 'getCurLang',
            agentUserConfig: 'getAgentUserConfig'
        }),
        $style() {
            if (this.theme) {
                return this.theme;
            }

            if (this.siteConfig.MCENTER_COLOR === 'theme3') {
                return this.$styleTheme3;
            }

            if (this.siteConfig.MCENTER_COLOR === 'miller') {
                return this.$styleMiller;
            }

            return this.$styleDefault;
        },
        contentTitle() {
            const contentTitle = this.$t('S_WELCOME_DEAR');
            const name = this.agentUserConfig.config && this.agentUserConfig.config.alias.display && this.agentInfo.user.show_alias ? this.agentInfo.user.alias : this.agentInfo.user.username;
            let result = contentTitle.replace('%s', `<span class="${this.$style.account}"> ${name}</span>`);

            if (this.agentUserConfig.config && this.agentUserConfig.config.alias.display) {
                result = contentTitle.replace(
                    '%s',
                    `<span class="${this.$style.account}"> ${name}</span>
                    <span class="${this.$style['change-name-wrap']}">
                        <img class="${this.$style['change-name-img']}" src="${this.$getCdnPath('/static/image/porn1/agent/mcenter/change_icon.png')}" />
                    </span>`
                );
            }

            return result;
        },
        messageText() {
            return this.$text('S_UNREAD_MESSAGE', {
                text: '您有%S條資訊未閱讀',
                replace: [
                    {
                        target: '%S',
                        value: `<span class="${this.$style.message}">${this.agentInfo.msgCount}</span>`
                    }
                ]
            });
        }
    },
    created() {
        this.actionSetSystemTime().then(() => {
            this.estClock();
        });

        this.actionSetAgcenterMsgCount();

        // 30秒更新一次未讀訊息
        window.setInterval(() => {
            this.actionSetAgcenterMsgCount();
        }, 30000);
    },
    mounted() {
        $(this.$refs['message-text']).on('click', 'span', () => this.$router.push({ path: isMobile() ? '/mobile/agcenter/message' : '/agent/infoMessage' }));
        $(this.$refs['content-text']).on('click', `.${this.$style['change-name-wrap']}`, this.changeNickname);
    },
    beforeDestroy() {
        $(this.$refs['message-text']).off('click', 'span', () => this.$router.push({ path: isMobile() ? '/mobile/agcenter/message' : '/agent/infoMessage' }));
        $(this.$refs['content-text']).off('click', `.${this.$style['change-name-wrap']}`, this.changeNickname);
    },
    methods: {
        ...mapActions([
            'actionSetAgcenterMsgCount',
            'actionSetSystemTime',
            'actionSetAgentdata'
        ]),
        estClock() {
            clearInterval(this.estTimer);
            this.estTimeNow = EST(this.systemTime);
            this.estTimer = setInterval(() => {
                this.estTimeNow = Vue.moment(this.estTimeNow).add(1, 'seconds').format('YYYY-MM-DD HH:mm:ss');
            }, 1000);
        },
        changeNickname() {
            if (this.isAjax) {
                return;
            }

            if (!this.agentInfo.user.alias) {
                alert(this.$text('S_SETTING_NICKNAME', '请先设置昵称'));
            }

            this.isAjax = true;

            ajax({
                method: 'put',
                url: this.agentInfo.user.show_alias ? API_AGENT_DISABLE_ALIAS : API_AGENT_ENABLE_ALIAS,
                errorAlert: false
            }).then(() => {
                this.actionSetAgentdata(true).then(() => {
                    this.isAjax = false;
                });
            });
        }
    }
};
</script>

<style src="../../../css/common/topInfo.module.scss" lang="scss" module="$styleDefault"></style>
<style src="../../../css/template/theme3/topInfo.module.scss" lang="scss" module="$styleTheme3"></style>
<style src="../../../css/template/miller/topInfo.module.scss" lang="scss" module="$styleMiller"></style>
<style src="../../../css/template/purple/topInfo.module.scss" lang="scss" module="$stylePurple"></style>
