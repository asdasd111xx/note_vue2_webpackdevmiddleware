<template>
    <div :class="$style['deposit-record-wrap']">
        <div :class="$style[`theme-${siteConfig.MCENTER_COLOR}`]" class="clearfix">
            <p :class="$style['record-title']">{{ $text('S_DEPOSIT_RECORD', '8日内存款纪录') }}</p>
            <div :class="$style['record-info-table']">
                <div :class="$style['record-info-theard']">
                    <div :class="$style['record-info-tr']">
                        <div
                            v-for="(theadInfo, index) in recordHeader"
                            :key="`record-thead-td-${index}`"
                            :class="[$style['record-info-td'], theadInfo.className]"
                        >
                            {{ theadInfo.value }}
                        </div>
                    </div>
                </div>
                <template v-if="resultRecord.length === 0">
                    <tr><td :colspan="recordHeader.length" :class="$style['no-data']">{{ $t('S_NO_DATA_YET') }}</td></tr>
                </template>
                <template v-else>
                    <div
                        v-for="info in resultRecord"
                        :key="`record-item-${info.order_number}`"
                        :class="$style['record-info-tr']"
                    >
                        <div
                            v-for="(theadInfo, index) in recordHeader"
                            :key="`record-thead-td-${index}`"
                            :class="[$style['record-info-td'], theadInfo.className]"
                        >
                            <div v-if="theadInfo.objKey === 'status'" :class="$style[`info-${info[theadInfo.objKey]}`]">
                                <span v-if="info[theadInfo.objKey] === 'submit_data'" @click="getDepositInfo(info.order_number)">{{ getSerialValue(info, theadInfo.objKey) }}</span>
                                <span v-else>{{ getSerialValue(info, theadInfo.objKey) }}</span>
                            </div>
                            <span v-else>{{ getSerialValue(info, theadInfo.objKey) }}</span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div :class="[$style['deposit-pagination-wrap'], 'clearfix']">
            <!-- eslint-disable vue/no-v-html -->
            <div :class="$style['pagination-tip']" v-html="recordText" />
            <!-- eslint-enable vue/no-v-html -->
            <pagination
                :current.sync="currentPage"
                :total="totalPage"
                :class="$style['deposit-pagination']"
            />
        </div>
        <edit-deposit-field
            v-if="isDepositInfo && !isShow"
            :required-fields="requiredFields"
            :deposit-data="singleDeposit"
            :close-fuc="showDepositInfo"
        />
    </div>
</template>

<script>
import mixin from '@/mixins/mcenter/deposit/recordDeposit';
import { mapGetters } from 'vuex';

export default {
    components: {
        pagination: () => import(/* webpackChunkName: 'pagination' */ '../../../../template/common/pagination'),
        editDepositField: () => import(/* webpackChunkName: 'editDepositField' */ './components/editDepositField')
    },
    mixins: [mixin],
    data() {
        return {
            isDepositInfo: false
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    },
    methods: {
        getDepositInfo(entryId) {
            this.getSingleInfo(entryId);
            this.showDepositInfo(true);
        },
        showDepositInfo(showView = '') {
            if (showView !== '') {
                this.isDepositInfo = showView;
                return;
            }

            this.isDepositInfo = !this.isDepositInfo;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
