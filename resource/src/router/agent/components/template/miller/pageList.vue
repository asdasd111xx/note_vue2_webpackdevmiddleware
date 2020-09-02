<template>
    <div :class="$style['page-list']">
        <div :class="[$style['top-wrap'], 'clearfix']">
            <div :class="$style['profile-photo']" @click="showEditAvatar = true">
                <img :src="avatarImg" />
                <div :class="$style.mask" />
                <div :class="$style['photo-btn']">
                    <icon
                        :class="$style['photo-icon']"
                        name="camera"
                        width="20"
                        height="20"
                    />
                </div>
            </div>
            <div :class="$style['info-wrap']">
                <div :class="[$style['username-wrap'], 'clearfix']">
                    <div :class="$style['info-title']">{{ agentUserConfig.config.alias.display && agentInfo.user.show_alias ? $text('S_ALIAS', '昵称') : $text('S_ACCOUNT', '帐号') }}</div>
                    <div :class="$style['info-text']">{{ agentUserConfig.config.alias.display && agentInfo.user.show_alias ? agentInfo.user.alias : agentInfo.user.username }}</div>
                </div>
            </div>
        </div>
        <div :class="$style['nav-wrap']">
            <div
                v-for="listItem in list"
                :key="`nav-item-${listItem.key}`"
                :class="[$style['nav-item-wrap'], { [$style['is-active']]: curItemList.includes(listItem.key) }, 'clearfix']"
                @click.stop="showList(listItem.key)"
            >
                <div
                    :class="$style['list-title-wrap']"
                    :title="$t(listItem.text)"
                >
                    <div :class="$style['list-icon']">
                        <icon
                            :name="listItem.icon"
                            :class="$style['icon-img']"
                            width="30"
                            height="30"
                        />
                    </div>
                    <div :class="$style['list-title']">{{ $t(listItem.text) }}</div>
                    <div :class="$style['list-arrow']">
                        <icon
                            v-show="curItemList.includes(listItem.key)"
                            :class="$style['arrow-icon']"
                            name="chevron-down"
                            width="20"
                            height="20"
                        />
                        <icon
                            v-show="!curItemList.includes(listItem.key)"
                            :class="$style['arrow-icon']"
                            name="chevron-right"
                            width="20"
                            height="20"
                        />
                    </div>
                </div>
                <div v-if="curItemList.includes(listItem.key)" :class="$style['list-sub-wrap']">
                    <div
                        v-for="item in listItem.item"
                        :key="`list-item-${item.key}`"
                        :title="$t(item.text)"
                        :class="[$style['list-item'], { [$style['is-current']]: curItem === item.key }]"
                        @click.stop="navChange(item.key)"
                    >
                        <div :class="$style['item-line']" />
                        {{ $t(item.text) }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 頭像彈跳框 -->
        <div v-if="showEditAvatar" :class="$style['head-img-wrap']">
            <div :class="$style['head-body-wrap']">
                <div :class="[$style['close-btn-wrap'], 'clearfix']">
                    <div :class="$style['icon-wrap']" @click="closeAvatarEdit">
                        <icon
                            :class="$style['close-icon']"
                            width="24"
                            height="24"
                            name="times"
                        />
                    </div>
                </div>
                <div :class="$style['head-title']">
                    {{ $text('S_CHOOSE_AVATAR2', '选择头像') }}
                </div>
                <div :class="$style['img-wrap']">
                    <img
                        v-for="(num, imgIndex) in 16"
                        :key="num"
                        :class="[$style['head-img'], {[$style['is-current']]: nowImgIndex === imgIndex}]"
                        :src="`/static/image/mcenter/theme/miller/profile_photo_${imgIndex}.png`"
                        @click="nowImgIndex = imgIndex"
                    />
                </div>
                <div :class="$style['submit-btn']" @click="setAvatar">
                    {{ $text('S_DETDRMINE', '确定') }}
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
            showEditAvatar: false,
            curItemList: [],
            curItem: '',
            nowImgIndex: 0
        };
    },
    computed: {
        ...mapGetters({
            agentInfo: 'getAgentInfo',
            agcenterList: 'getAgcenterList',
            agentUserLevels: 'getAgentUserLevels',
            webInfo: 'getWebInfo',
            agentUserConfig: 'getAgentUserConfig'
        }),
        list() {
            return this.agcenterList.filter((info) => {
                if (info.key !== 'mobile') {
                    return true;
                }
                const { config } = this.agentInfo;

                return config.app_is_ready;
            });
        },
        nowEditIndex() {
            if (this.agentInfo.user.image === 0) {
                return 1;
            }

            return this.agentInfo.user.image;
        },
        avatarImg() {
            return this.$getCdnPath(`/static/image/mcenter/theme/miller/profile_photo_${this.nowEditIndex}.png`);
        }
    },
    watch: {
        /* eslint-disable object-shorthand */
        '$route.path'() {
            const nowItemKey = this.$route.path.split('/')[2];
            this.curItemList = [];

            this.list.forEach((listItem) => {
                const isCurItem = listItem.item.some((item) => item.key === nowItemKey);

                if (isCurItem) {
                    this.curItemList.push(listItem.key);
                }
            });

            this.curItem = nowItemKey;
        }
    },
    created() {
        this.actionSetAgcenterLinks();

        const nowItemKey = this.$route.path.split('/')[2];

        this.list.forEach((listItem) => {
            const isCurItem = listItem.item.some((item) => item.key === nowItemKey);

            if (isCurItem) {
                this.curItemList.push(listItem.key);
            }
        });

        this.curItem = nowItemKey;
        this.nowImgIndex = this.agentInfo.user.image;
    },
    methods: {
        ...mapActions([
            'actionSetAgcenterLinks',
            'actionSetPop',
            'actionSetAgentdata'
        ]),
        showList(itemKey) {
            if (this.curItemList.includes(itemKey)) {
                this.curItemList.splice(this.curItemList.indexOf(itemKey), 1);
                return;
            }

            this.curItemList.push(itemKey);
        },
        closeAvatarEdit() {
            this.showEditAvatar = false;
            this.nowImgIndex = this.agentInfo.user.image;
        },
        navChange(pageName) {
            if (pageName === 'downloadApp') {
                window.open('/mobileBet', 'mobileBet');
                return;
            }

            axios.all([this.actionSetAgentdata()]).then(() => {
                // 代理強制修改密碼機制
                if (this.agentInfo.user.password_reset) {
                    return;
                }

                if (!['accountBankCard', 'financeWithdraw'].includes(pageName)) {
                    this.$router.push(`/agent/${pageName}`);
                    this.curItem = pageName;
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

                    this.$router.push(`/agent/${pageName}`);
                    this.curItem = pageName;
                });
            });
        },
        setAvatar() {
            if (this.agentInfo.user.image === this.nowImgIndex) {
                return;
            }

            agcenter.accountDataSet({
                params: { image: this.nowImgIndex },
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
    width: 300px;
    background-color: #292929;
}

.top-wrap {
    min-height: 148px;
    background: url('/static/image/mcenter/theme/miller/side_menu_bg.png') #2A2A2A 50% 101% no-repeat
}

.profile-photo {
    position: relative;
    float: left;
    width: 50px;
    height: 50px;
    margin: 21px 0 0 21px;
    cursor: pointer;
    border-radius: 100%;
    border: 1px solid #FFF;

    img {
        display: block;
        width: 100%;
        border-radius: 50%;
    }

    &:hover {
        .mask,
        .photo-btn {
            display: block;
        }
    }
}

.mask {
    position: absolute;
    display: none;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 50%;
    background-color: #000;
    opacity: 0.5;
}

.photo-btn {
    position: absolute;
    display: none;
    top: 13px;
    right: 14px;
    margin: auto;
}

.photo-icon {
    display: block;
    margin: auto;
    color: #FFF;
}

.info-wrap {
    float: right;
    width: calc(100% - 81px);
}

.username-wrap {
    margin-top: 30px;
    color: #FFF;
}

.info-title {
    font-size: 12px;
}

.info-text {
    font-size: 18px;
}

.nav-item-wrap {
    cursor: pointer;
    background-color: #F7B500;

    &.is-active {
        background-color: #FFD152;
    }
}

.list-title-wrap {
    padding: 15px 30px 15px 40px;
    color: #292929;
}

.list-icon,
.list-title,
.list-arrow {
    display: inline-block;
    vertical-align: middle;
}

.list-icon {
    width: 30px;
    height: 30px;
    margin-right: 15px;
    border-radius: 50%;
    color: #F7B500;
    background: #FFF;
}

.list-title {
    width: 156px;
}

.list-arrow {
    color: #FFF;
}

.icon-img {
    display: block;
    margin: 0 auto;
    transform: scale(.6);
}

.arrow-icon {
    display: block;
}

.list-sub-wrap {
    background-color: #292929;
}

.list-item {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding-left: 90px;
    color: #7E7E7E;

    &:hover,
    &.is-current {
        color: #FFF;
    }
}

.item-line {
    position: absolute;
    height: 40px;
    top: 0;
    left: 53px;
    border-left: 1px solid #7E7E7E;
}


.head-img-wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.29);
}

.head-body-wrap {
    position: fixed;
    width: 395px;
    height: 536px;
    top: 97px;
    left: 42%;
    background-color: #FFF;
}

.close-btn-wrap {
    padding-bottom: 5px;
    text-align: right;
}

.icon-wrap {
    display: inline-block;
    vertical-align: top;
    margin: 10px 10px 0 0;
    cursor: pointer;
    color: #606266;

    svg {
        display: block;
    }
}

.head-title {
    margin-bottom: 25px;
    font-size: 24px;
    text-align: center;
    margin-top: 15px;
}

.img-wrap {
    overflow-y: auto;
    width: 364px;
    min-height: 320px;
    margin: 0 auto;
    text-align: center;
}

.head-img {
    display: inline-block;
    vertical-align: middle;
    width: 54px;
    height: 54px;
    margin: 0 17px 22px 17px;
    cursor: pointer;

    &.is-current {
        border: 3px solid #F7B500;
        border-radius: 50%;
    }
}

.submit-btn {
    width: 328px;
    height: 38px;
    line-height: 38px;
    margin: 33px 32px;
    text-align: center;
    cursor: pointer;
    color: #FFF;
    background-color: #F7B500;
}
</style>
