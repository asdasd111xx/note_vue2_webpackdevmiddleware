<template>
    <div :class="[$style['user-info-wrap'], 'clearfix']">
        <div :class="$style.head" @click="onTip('head')">
            <img :src="`/static/image/mobile/mcenter/theme1/head/ic_photo0${headId + 1}.png`" />
        </div>
        <div :class="$style['top-info']">
            <div :class="$style['account-info']">
                {{ $text('S_HELLO') }}, {{ userName }}
            </div>
            <div
                v-if="memInfo.user.alias"
                :class="$style['btn-toggle']"
                @click="onToggle"
            />
        </div>
        <div
            :class="$style['btn-logout']"
            @click="onLogout"
        >
            {{ $text('S_LOGOUT') }}
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div
            v-show="tip === 'vip'"
            :class="$style['tip-wrap']"
            v-html="vipText"
        />
        <!-- eslint-enable vue/no-v-html -->
        <div v-show="tip === 'head'" :class="$style['tip-wrap']">
            <div
                v-for="(num, index) in 5"
                :key="index"
                :class="$style['head-item']"
                @click="onSelectHead(index)"
            >
                <img :src="`/static/image/mobile/mcenter/theme1/head/ic_photo0${num}.png`" />
                <div v-if="index === headId" :class="$style['icon-check']" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import mcenter from '@/api/mcenter';
import ajax from '@/lib/ajax';
import { API_MCENTER_ENABLE_ALIAS, API_MCENTER_DISABLE_ALIAS } from '@/config/api';

export default {
    data() {
        return {
            vipData: {},
            showNickname: false,
            tip: '',
            headId: 0
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        userName() {
            return this.showNickname ? this.memInfo.user.alias : this.memInfo.user.username;
        },
        vipText() {
            if (this.vipData.is_lock) {
                return '';
            }

            if (this.vipData.is_max_level) {
                return this.$text('S_VIP_MAX_LEVEL');
            }

            if (this.vipData.is_achieve) {
                return this.$text('S_VIP_ACHIEVE', {
                    replace: [{ target: '%s', value: `<span>${this.vipData.next_level_alias}</span>` }]
                });
            }

            return this.$text('S_LEVEL_UPGRADE_PROMPT', {
                replace: [
                    { target: '%S', value: `<span>${this.formatToPrice(this.vipData.upgrade_valid_bet)}</span>` },
                    { target: '%S', value: `<span>${this.vipData.upgrade_deposit_times}</span>` },
                    { target: '%S', value: `<span>${this.formatToPrice(this.vipData.upgrade_deposit_amount)}</span>` },
                    { target: '%s', value: `<span>${this.vipData.next_level_alias}</span>` }
                ]
            });
        }
    },
    created() {
        mcenter.accountVIP({
            success: (response) => {
                this.vipData = response.ret;
            }
        });

        this.headId = this.memInfo.user.image || 0;
        this.showNickname = this.memInfo.user.show_alias;
    },
    methods: {
        ...mapActions(['actionSetUserdata']),
        formatToPrice(value) {
            return `${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        },
        onToggle() {
            ajax({
                method: 'put',
                url: !this.showNickname ? API_MCENTER_ENABLE_ALIAS : API_MCENTER_DISABLE_ALIAS,
                errorAlert: false
            }).then((response) => {
                if (response.result === 'ok') {
                    this.showNickname = !this.showNickname;
                    this.actionSetUserdata(true);
                }
            });
        },
        onTip(type) {
            if (this.tip === type) {
                this.tip = '';
                return;
            }

            this.tip = type;
        },
        onSelectHead(id) {
            mcenter.accountDataSet({
                params: { image: id },
                success: () => {
                    this.actionSetUserdata();
                    this.headId = id;
                    this.tip = '';
                }
            });
        },
        onLogout() {
            member.logout({
                success: () => {
                    window.location.reload();
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.user-info-wrap {
    position: relative;
    background: url('/static/image/mobile/mcenter/bg_money.png') 50% 0 / 100% 100% no-repeat;
    margin: 0 auto;
    padding: 0 calc(5% + 80px) 0 calc(5% + 56px);
    height: 56px;
}

.head {
    position: absolute;
    left: calc(5% + 12px);
    top: 10px;
    width: 34px;
    height: 34px;

    img {
        width: inherit;
        height: inherit;
    }
}

.top-info {
    float: left;
    width: 100%;
    padding-top: 18px;
    line-height: 1.5;
    color: #F4D8AF;
}

.vip-info {
    width: inherit;
    overflow : hidden;
    text-overflow : ellipsis;
    white-space : nowrap;
}

.btn-logout {
    position: absolute;
    top: 15px;
    right: calc(5% + 12px);
    background: url('/static/image/mobile/mcenter/btn_login_n.png') 50% 0 / 100% 100% no-repeat;
    width: 55px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    color: #00347D;
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding: 0 3px;

}

.account-info {
    float: left;
    max-width: calc(100% - 18px);
    overflow : hidden;
    text-overflow : ellipsis;
    white-space : nowrap;
}

.btn-toggle {
    float: left;
    top: 4px;
    position: relative;
    margin-left: 5px;
    background: url('/static/image/mobile/mcenter/btn_switch.png') 0 0 / 100% 100% no-repeat;
    width: 13px;
    height: 13px;
}

.btn-info {
    display: inline-block;
    background: url('/static/image/mobile/mcenter/btn_description_n.png') 0 0 / 100% 100% no-repeat;
    width: 17px;
    height: 17px;
    vertical-align: text-bottom;

    &is-open {
        background: url('/static/image/mobile/mcenter/btn_description_s.png') 0 0 / 100% 100% no-repeat;
    }
}

.tip-wrap {
    position: absolute;
    top: 55px;
    left: 0;
    background-color: #000;
    padding: 10px 5%;
    width: 100%;
    color: #FFF;
    z-index: 1;
}

.head-item {
    float: left;
    position: relative;
    margin-right: 16px;
    width: 34px;
    height: 34px;

    img {
        display: block;
        width: inherit;
        height: inherit;
    }

    .icon-check {
        position: absolute;
        left: 50%;
        top: 80%;
        background: url(/static/image/mobile/mcenter/ic_picok.png) 0 0/100% 100% no-repeat;
        margin-left: -6px;
        width: 12px;
        height: 12px;
    }
}
</style>
