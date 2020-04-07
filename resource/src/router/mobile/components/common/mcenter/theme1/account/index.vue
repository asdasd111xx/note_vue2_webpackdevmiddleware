<template>
    <div :class="colorClass">
        <mcenter-header :header-setting="headerSetting" />
        <account-wrap>
            <template scope="{ filteredDataList }">
                <div :class="[$style['account-list-wrap'], 'clearfix']">
                    <div
                        v-for="(item, index) in filteredDataList"
                        :key="`account-list-${index}`"
                        :class="[$style['account-list-item'], { [$style['is-current']]: currentTab === index }]"
                        :style="{ width: `${100 / filteredDataList.length}%` }"
                        @click="currentTab = index"
                    >
                        {{ $t(item.text) }}
                    </div>
                </div>
                <template v-for="(item, index) in filteredDataList">
                    <div
                        v-if="currentTab === index && index === 1"
                        :key="index"
                        :class="$style['top-tip-personal']"
                    >
                        {{ $text('S_PERSONAL_INFORMATION_SET') }}
                    </div>
                    <receipt-address
                        v-if="currentTab === index && index === 2"
                        :key="index"
                    />
                    <div
                        v-if="currentTab === index"
                        :key="index"
                        :class="$style['account-data-wrap']"
                    >
                        <template v-for="(field, fieldIndex) in item.field">
                            <component
                                :is="`edit-${currentEdit}`"
                                v-if="field.key === currentEdit"
                                :key="`${currentEdit}-${fieldIndex}`"
                                :info="field"
                                @cancel="currentEdit = ''"
                            />
                            <div
                                v-else
                                :key="fieldIndex"
                                :class="[$style['account-data-field'], 'clearfix']"
                            >
                                <span :class="$style['field-title']">{{ $t(field.text) }}</span>
                                <span :class="[$style['field-text'], { [$style.yet]: field.status === 'yet' }]">{{ field.value }}</span>
                                <template v-if="field.btnShow">
                                    <div :class="$style['feature-btn']" @click="currentEdit = field.key">
                                        <div>
                                            <icon
                                                name="edit"
                                                width="20"
                                                height="20"
                                            />
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>
                </template>
            </template>
        </account-wrap>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        mcenterHeader: () => import(/* webpackChunkName: 'mcenterHeader' */'../header'),
        accountWrap: () => import(/* webpackChunkName: 'accountWrap' */'@/components/common/mcenter/accountWrap'),
        editName: () => import(/* webpackChunkName: 'editName' */'./components/form/editName'),
        editAlias: () => import(/* webpackChunkName: 'editAlias' */'./components/form/editAlias'),
        editEmail: () => import(/* webpackChunkName: 'editEmail' */'./components/form/editEmail'),
        editPhone: () => import(/* webpackChunkName: 'editPhone' */'./components/form/editPhone'),
        editPassword: () => import(/* webpackChunkName: 'editPassword' */'./components/form/editPassword'),
        editWithdrawPwd: () => import(/* webpackChunkName: 'editWithdrawPwd' */'./components/form/editWithdrawPwd'),
        editBirthday: () => import(/* webpackChunkName: 'editBirthday' */'./components/form/editBirthday'),
        editGender: () => import(/* webpackChunkName: 'editGender' */'./components/form/editGender'),
        editQq_num: () => import(/* webpackChunkName: 'editQq_num' */'./components/form/editQq_num'),
        editWeixin: () => import(/* webpackChunkName: 'editWeixin' */'./components/form/editWeixin'),
        editLine: () => import(/* webpackChunkName: 'editLine' */'./components/form/editLine'),
        editFacebook: () => import(/* webpackChunkName: 'editFacebook' */'./components/form/editFacebook'),
        editSkype: () => import(/* webpackChunkName: 'editSkype' */'./components/form/editSkype'),
        editZalo: () => import(/* webpackChunkName: 'editZalo' */'./components/form/editZalo'),
        receiptAddress: () => import(/* webpackChunkName: 'receiptAddress' */'./components/receiptAddress')
    },
    data() {
        return {
            headerSetting: {
                title: this.$text('S_ACCOUNT_DATA', '帐户资料'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.$router.push('/mobile/mcenter')
                },
                balance: true
            },
            currentTab: 0,
            currentEdit: ''
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            memInfo: 'getMemInfo'
        }),
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    }
};
</script>
<style lang="scss" src="./css/index.module.scss" module></style>
