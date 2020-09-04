<template>
    <div class="account-main-wrap">
        <top-info />
        <div v-if="isReady" class="account-data">
            <div class="main-title clearfix">
                <span>{{ $t('S_ACCOUNT_DATA') }}</span>
            </div>
            <div
                v-for="(item, index) in filteredDataList"
                :key="index"
                class="account-data-field clearfix"
            >
                <div :class="`main-input ${item.status === 'yet' ? item.status : 'already'}`">
                    <label>{{ $t(item.text) }}</label>
                    <span :class="item.key.toLowerCase()">{{ item.value }}</span>
                </div>
                <template v-if="item.btnShow">
                    <div class="main-btn agcenter-pc" @click="popWindow(item)">{{ item.btnText }}</div>
                    <div class="main-btn icon" @click="popWindow(item)">
                        <icon
                            :name="`${item.status === 'ok' ? 'id-card' : 'edit'}`"
                            width="30"
                            height="30"
                        />
                    </div>
                </template>
            </div>
        </div>
        <binding-device v-if="agentInfo.config.app_is_ready && agentInfo.config.slide_login" />
        <receipt-address />
    </div>
</template>

<script>
import mixin from '@/mixins/agent/accountData';
import receiptAddress from './receiptAddress';
import bindingDevice from './bindingDevice';
import topInfo from '../../template/common/topInfo';

export default {
    components: {
        topInfo,
        bindingDevice,
        receiptAddress
    },
    mixins: [mixin]
};
</script>

<style src="../css/indexAccountData.scss" lang="scss" scoped />
