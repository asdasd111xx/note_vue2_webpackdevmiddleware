<template>
    <div v-if="isRevice">
        <template v-if="!showDetail">
            <div v-if="bankCard.length > 0" :class="$style['my-card']">
                <p :class="[$style['card-count'], 'clearfix']">
                    <span :class="$style['title']">{{ $text('S_MY_CRAD', '我的卡') }}</span>
                    <span :class="$style['count']">{{ $text('S_CRAD_COUNT', '共%s张').replace('%s', bankCard.length) }}</span>
                </p>
                <div :class="$style['bankcard-list']">
                    <div
                        v-for="item in bankCard"
                        :key="item.id"
                        :class="$style['bankcard-item']"
                        @click="getDetail(item)"
                    >
                        <div :class="[$style['bankcard-top'], 'clearfix']">
                            <div :class="$style['bankcard-logo']">
                                <img v-lazy="getImg(item.bank_id)" />
                            </div>
                            <div :class="$style['bankcard-info']">
                                <div :class="$style['bankcard-name']">
                                    {{ item.bank_name }}
                                </div>
                                <div :class="$style['bankcard-tpye']">
                                    {{ item.type }}
                                </div>
                            </div>
                        </div>
                        <div :class="$style['card-number']">
                            **** **** **** <span>{{ item.account.slice(-4) }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="{[$style['no-data']]: bankCard.length === 0}">
                <div v-if="bankCard.length === 0" :class="$style['no-bankcard']">
                    <img src="/static/image/_new/mcenter/no_bankcard.png" />
                </div>
                <template v-if="bankCard.length < 3">
                    <div :class="$style['add-card']">
                        <div :class="$style['add-wrap']">
                            <div :class="$style['add-btn']" @click="changePage('addBankCard')">
                                <img src="/static/image/_new/mcenter/add.png" />
                                <span>{{ $text('S_ADD_BANKCARD', '添加银行卡') }}</span>
                            </div>
                        </div>
                    </div>
                    <p :class="$style['remind']">{{ $t('S_BANKCARD_LIMIT').replace('%s', 3) }}</p>
                </template>
            </div>
        </template>
        <div v-else :class="$style['bankcard-detail']">
            <div :class="$style['bankcard-item']">
                <div :class="[$style['bankcard-top'], 'clearfix']">
                    <div :class="$style['bankcard-logo']">
                        <img v-lazy="getImg(bankCardDetail.bank_id)" />
                    </div>
                    <div :class="$style['bankcard-info']">
                        <div :class="$style['bankcard-name']">
                            {{ bankCardDetail.bank_name }}
                        </div>
                        <div :class="$style['bankcard-tpye']">
                            {{ bankCardDetail.type }}
                        </div>
                    </div>
                </div>
                <div :class="$style['card-number']">
                    **** **** **** <span>{{ bankCardDetail.account.slice(-4) }}</span>
                </div>
            </div>
            <div v-if="editStatus" :class="$style['edit-bankcard']">
                <div :class="$style['edit-mask']" />
                <div :class="$style['edit-button']">
                    <div :class="$style['edit-confirm']" @click="removeBankCard">解除绑定</div>
                    <div :class="$style['edit-cancel']" @click="$emit('update:editStatus', false)">取消</div>
                </div>
            </div>
            <div v-if="popStatus" :class="$style['pop-message']">正在上线 敬请期待</div>
        </div>
    </div>
</template>

<script>
import ajax from '@/lib/ajax';

export default {
    props: {
        changePage: {
            type: Function,
            default: () => {}
        },
        showDetail: {
            type: Boolean,
            required: true
        },
        editStatus: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            bankCard: [],
            bankCardDetail: {},
            popStatus: false,
            isRevice: false
        };
    },
    created() {
        ajax({
            method: 'get',
            url: '/api/v1/c/user/has-bank',
            errorAlert: false
        }).then((response) => {
            console.log('response', response);
        });
        ajax({
            method: 'get',
            url: '/api/v1/c/player/user_bank/list',
            errorAlert: false
        }).then((response) => {
            this.isRevice = true;
            if (!response || response.result !== 'ok') {
                return;
            }
            this.bankCard = response.ret.filter((item, index) => index < 3);
        });
    },
    methods: {
        getDetail(info) {
            this.bankCardDetail = info;
            this.$emit('update:showDetail', true);
        },
        removeBankCard() {
            this.popStatus = true;
            setTimeout(() => {
                this.popStatus = false;
            }, 3000);
            this.$emit('update:editStatus', false);
        },
        getImg(id) {
            return {
                src: `https://bbos.bbin-asia.com/elibom/bank/${id}.png`,
                error: this.$getCdnPath('/static/image/mcenter/bank/default.png'),
                loading: this.$getCdnPath('/static/image/game_loading_s.gif')
            };
        }
    }
};
</script>

<style lang="scss" src="./css/bankCardInfo.module.scss" module />
