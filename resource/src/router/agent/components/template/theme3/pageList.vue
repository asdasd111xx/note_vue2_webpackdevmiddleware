<template>
    <div :class="$style['page-list']">
        <div :class="$style['top-wrap']">
            <div :class="[$style['info-wrap'], 'clearfix']">
                <div :class="$style['profile-photo']">
                    <div
                        :class="$style['user-picture']"
                        @mouseenter="showEdit = true"
                        @mouseleave="showEdit = false"
                    >
                        <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/mcenter/avatar_${nowEditIndex}.png`)" />
                        <div
                            v-if="showEdit"
                            :class="$style['user-picture-hover']"
                            @click="showEditAvatar = true"
                        >
                            <span>{{ $text('S_USER_AVATAR', '更改头像') }}</span>
                        </div>
                    </div>
                </div>
                <div :class="$style.info">
                    <div :class="$style.greeting">歡迎你，尊貴的</div>
                    <div :class="[$style.username, 'clearfix']">
                        <span>{{ agentInfo.user.username }}</span>
                        <icon
                            name="exchange-alt"
                            width="16"
                            height="16"
                        />
                    </div>
                    <div :class="$style.greeting">幣別：{{ agentInfo.cash.currency }}</div>
                </div>
            </div>
            <div :class="$style['page-wrap']">
                <div
                    v-for="info in list"
                    :key="info.key"
                    :class="[$style['page-link'], { [$style.active]: $route.path === info.path }, 'clearfix']"
                    @click="onClick(info)"
                >
                    <div :class="$style['page-icon']">
                        <img :src="$getCdnPath(`/static/image/agent/theme3/${info.key}.png`)" />
                    </div>
                    <div :class="$style['page-title']">{{ info.title }}</div>
                </div>
            </div>
        </div>
        <div :class="$style['link-wrap']">
            <div :class="$style['link-title']">PC端代理链接</div>
            <div :class="[$style['agent-link'], 'clearfix']">
                <div :class="$style['intr-link']">{{ agentInfo.intrLink }}</div>
                <div :class="$style['btn-link-copy']" @click="onCopy">复制</div>
            </div>
        </div>
        <div v-if="showEditAvatar" :class="$style['avatar-wrap']">
            <div :class="$style['avatar-main-wrap']">
                <span :class="$style['close-btn']" @click="showEditAvatar = false">x</span>
                <div :class="$style['avatar-header']">
                    <span :class="$style['avatar-title']">{{ $text('S_MY_AVATAR', '我的头像') }}</span>
                </div>
                <div :class="$style['avatar-content']">
                    <div :class="$style['avatar-current']">
                        <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/mcenter/avatar_${nowEditIndex}.png`)" />
                        <p>{{ $text('S_AVATAR_PREVIEW', '头像预览') }}</p>
                    </div>
                    <div :class="$style['avatar-choose']">
                        <div
                            v-for="num in 5"
                            :key="num"
                            :class="$style['avatar-item']"
                        >
                            <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/mcenter/avatar_${num}.png`)" @click="nowEditIndex = num" />
                        </div>
                    </div>
                </div>
                <div :class="$style['avatar-footer']">
                    <button :class="$style.confirm" @click="setAvatar(nowEditIndex)">{{ $text('S_CONFIRM', '确认') }}</button>
                    <button @click="showEditAvatar = false">{{ $text('S_DIALOG_CLOSE_BTN', '关闭') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as axios from 'axios';
import agcenter from '@/api/agcenter';
import agValidate from '@/lib/agValidate';

export default {
    data() {
        return {
            showEdit: false,
            showEditAvatar: false,
            nowEditIndex: ''
        };
    },
    computed: {
        ...mapGetters({
            agentInfo: 'getAgentInfo',
            agcenterList: 'getAgcenterList',
            agentUserLevels: 'getAgentUserLevels',
            webInfo: 'getWebInfo'
        }),
        list() {
            return [
                {
                    key: 'account-data',
                    pageName: 'accountData',
                    title: '用戶信息',
                    path: '/agent/accountData'
                },
                {
                    key: 'report-member',
                    pageName: 'reportMember',
                    title: '会员列表',
                    path: '/agent/reportMember'
                },
                {
                    key: 'finance-reward',
                    pageName: 'financeReward',
                    title: '佣金報表',
                    path: '/agent/financeReward'
                },
                {
                    key: 'report-game-record',
                    pageName: 'reportGameRecord',
                    title: '遊戲紀錄',
                    path: '/agent/reportGameRecord'
                },
                {
                    key: 'account-bank-card',
                    pageName: 'accountBankCard',
                    title: '綁定銀行卡',
                    path: '/agent/accountBankCard'
                },
                {
                    key: 'finance-withdraw',
                    pageName: 'financeWithdraw',
                    title: '取款',
                    path: '/agent/financeWithdraw'
                },
                {
                    key: 'info-post',
                    pageName: 'infoPost',
                    title: '公告',
                    path: '/agent/infoPost'
                },
                {
                    key: 'mobile-bet',
                    pageName: 'mobileBet',
                    title: '下載APP',
                    path: ''
                }
            ];
        },
        domain_name() {
            const data = {
                500000: 30798,
                48: 10479,
                50: 10512
            };

            return `/page/${data[this.webInfo.alias]}`;
        }
    },
    created() {
        this.actionSetAgcenterLinks();
        if (this.agentInfo.user.image === 0) {
            this.nowEditIndex = 1;
        } else {
            this.nowEditIndex = this.agentInfo.user.image;
        }
    },
    methods: {
        ...mapActions([
            'actionSetAgcenterLinks',
            'actionSetPop',
            'actionSetAgentdata'
        ]),
        onCopy() {
            this.$copyText(this.agentInfo.intrLink);
        },
        onClick({ key, path, pageName }) {
            if (key === 'mobile-bet') {
                window.open('/mobileBet');
                return;
            }

            if (key === 'agent-tutorial') {
                window.open(this.domain_name);
                return;
            }

            axios.all([this.actionSetAgentdata()]).then(() => {
                if (!['accountBankCard', 'financeWithdraw'].includes(pageName)) {
                    this.$router.push(path);
                    return;
                }

                // 銀行卡
                const { bank } = this.agentUserLevels;
                // 電子錢包
                const virtual = this.agentUserLevels.virtual_bank;
                // 會員帳號出款
                const user = this.agentUserLevels.bind_user;

                if (!bank && !virtual) {
                    if (!user) {
                        alert(this.$text('S_MISTAKE_CONTACT_CUSTOM_SERVICE'));
                        return;
                    }

                    // 只開啟會員帳號出款，點擊綁定銀行卡跳出錯誤訊息
                    if (pageName === 'accountBankCard') {
                        alert(this.$text('S_MISTAKE_BANKCARD_CUSTOM_SERVICE'));
                        return;
                    }
                }

                agValidate(pageName).then((res) => {
                    // 帳號為停權狀態
                    if (res.message === 'isBankrupt') {
                        alert(this.$i18n.t('S_BANKRUPT_TIP'));
                        return;
                    }

                    // 未設定姓名, 未設定取款密碼, 綁定銀行卡內無常用帳號
                    if (res.message === 'noName' || res.message === 'noPassword' || res.message === 'noCommonAccount' || res.message === 'mobileDidNotPass') {
                        this.actionSetPop({ type: 'note' });
                        return;
                    }

                    this.$router.push(path);
                });
            });
        },
        setAvatar(index) {
            if (this.agentInfo.user.image === index) return;

            agcenter.accountDataSet({
                params: { image: index },
                success: () => {
                    this.actionSetAgentdata();
                    this.showEditAvatar = false;
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.page-list {
    float: left;
    width: 20%;
}

.top-wrap {
    margin-bottom: 17px;
    border: 1px solid #EEE;
    border-radius: 5px;
    background-color: #FFF;
}

.info-wrap {
    margin: 2px;
    padding: 17px 12px;
    border-radius: 5px;
    background-color: #222;
}

.profile-photo {
    float: left;
    width: 65px;
    height: 65px;
}

.user-picture {
    position: relative;
    width: 100%;
    height: 100%;

    > img {
        width: 100%;
        height: 100%;
    }
}

.user-picture-hover {
    position: absolute;
    top: 0;
    width: 65px;
    height: 65px;
    background-color: #000;
    border-radius: 100%;
    opacity: 0.5;
    text-align: center;

    span {
        color: #FFF;
        line-height: 65px;
    }
}

.info {
    float: right;
    width: calc(100% - 65px - 16px);
}

.greeting {
    line-height: 12px;
    margin: 5px 0;
    color: #C9C9C9;
    font-size: 12px;
}

.username {
    line-height: 16px;
    color: #EDC058;
    font-size: 14px;

    > span {
        float: left;
        margin-right: 4px;
    }

    > svg {
        float: left;
    }
}

.page-wrap {
    padding: 13px 25px 0;
}

.page-link {
    margin-bottom: 8px;
    padding: 2px 36px;
    border-radius: 17px;
    cursor: pointer;

    &.active,
    &:hover {
        background-color: #EBEBEB;
    }
}

.page-icon {
    float: left;
    width: 30px;
    height: 30px;
    margin-right: 4px;

    > img {
        display: block;
        width: 100%;
    }
}

.page-title {
    line-height: 30px;
}

.link-wrap {
    border-radius: 5px;
    border: 1px solid #EEE;
}

.link-title {
    height: 36px;
    line-height: 36px;
    background-color: #D0D0D0;
    color: #404040;
    font-size: 12px;
    text-align: center;
}

.agent-link {
    padding: 13px;
}

.intr-link {
    overflow: hidden;
    float: left;
    width: calc(100% - 46px - 5px);
    height: 36px;
    line-height: 36px;
    color: #B98C4D;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.btn-link-copy {
    float: right;
    width: 46px;
    height: 36px;
    line-height: 34px;
    border: 1px solid #999;
    color: #666;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
}

.avatar-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .4);
    z-index: 999;

    .avatar-main-wrap {
        position: relative;
        margin: 230px auto 0;
        width: 490px;
        height: 470px;
        background: #FFF;
        overflow: hidden;

        .close-btn {
            position: absolute;
            right: 5px;
            top: 15px;
            display: block;
            width: 30px;
            height: 30px;
            line-height: 26px;
            text-align: center;
            font-size: 30px;
            cursor: pointer;
        }

        .avatar-header {
            margin: 0;
            padding-left: 20px;
            width: 100%;
            height: 60px;
            font-size: 16px;
            color: #222;
            border-bottom: 1px solid #EDEDED;

            .avatar-title {
                float: left;
                line-height: 60px;
            }
        }

        .avatar-content {
            width: 100%;
            height: 330px;
            overflow: hidden;

            .avatar-current {
                width: 100%;
                height: auto;
                overflow: hidden;

                img {
                    margin: 15px auto 0;
                    width: 146px;
                    height: 146px;
                    border-radius: 50%;
                }

                p {
                    font-size: 14px;
                    color: #A4A4A4;
                }
            }

            .avatar-choose {
                margin-top: 20px;
                padding: 0 17px;
                width: 100%;
                height: 90px;

                .avatar-item {
                    margin: 0 8px;
                    display: inline-block;
                    width: 60px;
                    height: 90px;
                    cursor: pointer;

                    img {
                        width: 60px;
                    }
                }
            }
        }

        .avatar-footer {
            width: 100%;
            height: 80px;
            border-top: 1px solid #EDEDED;

            button {
                margin: 25px 15px;
                width: 100px;
                height: 30px;
                color: #666;
                background: #FFF;
                line-height: 30px;
                font-size: 14px;
                text-align: center;
                border: 1px solid #E0E0E0;
                border-radius: 20px;
                outline: none;
                cursor: pointer;
            }

            .confirm {
                color: #FFF;
                background: linear-gradient(270deg,#3a97e5,#42d2e8);
                border: none;
                box-shadow: 0 6px 7px 4px rgba(0,180,255,.15);
            }
        }
    }
}
</style>
