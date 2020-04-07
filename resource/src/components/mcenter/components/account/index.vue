<template>
    <div v-if="isReady" class="account-data">
        <top-info :is-mobile-web="isMobileWeb" :is-nickname-show="mcenterUserField.config ? mcenterUserField.config.alias.display : false" />
        <div
            v-for="(item, index) in filteredDataList"
            :key="index"
            :class="`main-area ${index === 0 ? 'top' : ''}`"
        >
            <div class="main-title clearfix">
                <span class="title-text">{{ $t(item.text) }}</span>
                <div v-if="index === 1" class="tip">
                    <span>{{ $t('S_PERSONAL_INFORMATION_SET') }}</span>
                </div>
            </div>
            <div
                v-for="(field, fieldIndex) in item.field"
                :key="fieldIndex"
                class="account-data-field clearfix"
            >
                <div :class="`main-input ${field.status === 'yet' ? field.status : 'already'}`">
                    <label>{{ $t(field.text) }}</label>
                    <span>{{ field.value }}</span>
                </div>
                <template v-if="field.btnShow">
                    <div class="main-btn mcenter-pc" @click="popWindow(field)">{{ field.btnText }}</div>
                    <div class="main-btn icon" @click="popWindow(field)">
                        <icon
                            :name="`${field.status === 'ok' ? 'id-card' : 'edit'}`"
                            width="30"
                            height="30"
                        />
                    </div>
                </template>
            </div>
        </div>
        <binding-device v-if="!isException" />
        <receipt-address v-if="isShowAddress" />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import mcenter from '@/api/mcenter';
import mixin from '@/mixins/mcenter/account';
import receiptAddress from './receiptAddress';
import bindingDevice from './bindingDevice';
import topInfo from './topInfo';

export default {
    components: {
        topInfo,
        bindingDevice,
        receiptAddress
    },
    mixins: [mixin],
    props: {
        isMobileWeb: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isShowAddress: false
        };
    },
    created() {
        this.actionSetIsLoading(true);
        this.showAddress();
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading'
        ]),
        showAddress() {
            // 顯示/隱藏 收貨地址
            return mcenter.showAddress({
                success: (response) => {
                    this.isShowAddress = response.ret.config.address.display;
                }
            })
                .then(() => {
                    this.actionSetIsLoading(false);
                });
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
