<template>
    <div :class="[$style['withdraw-record-wrap'], $style[`theme-${siteConfig.MCENTER_COLOR}`]]">
        <div class="clearfix">
            <div :class="$style['record-title']">
                <span :class="$style['record-text']">{{ $text('S_WITHDRAW_RECORD', '近10笔取款记录') }}</span>
                <div :class="$style['icon-wrap']" @click="getRecordData">
                    <icon
                        width="13"
                        height="13"
                        name="sync"
                    />
                </div>
            </div>
            <div :class="$style['record-status-wrap']">
                <div :class="[$style['withdraw-bookmark-btn'], { [$style['is-current']]: currentBookmark === 'apply' }]" @click="changeType('apply')">
                    <span :class="$style['withdraw-bookmark-text']" :title="$text('S_APPLY', '已申请')">{{ $text('S_APPLY', '已申请') }}</span>
                </div>
                <div :class="[$style['withdraw-bookmark-btn'], { [$style['is-current']]: currentBookmark === 'notFinish' }]" @click="changeType('notFinish')">
                    <span :class="$style['withdraw-bookmark-text']" :title="$text('S_NOT_FINISH', '未完成')">{{ $text('S_NOT_FINISH', '未完成') }}</span>
                    <span v-if="resultTypeRecord.notFinish.length > 0" :class="$style['finish-msg']">{{ resultTypeRecord.notFinish.length }}</span>
                </div>
            </div>
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
                <template v-if="resultTypeRecord[currentBookmark].length === 0">
                    <tr><td :colspan="recordHeader.length" :class="$style['no-data']">{{ $t('S_NO_DATA_YET') }}</td></tr>
                </template>
                <template v-else>
                    <div
                        v-for="info in resultTypeRecord[currentBookmark]"
                        :key="`record-item-${info.order_number}`"
                        :class="$style['record-info-tr']"
                    >
                        <div
                            v-for="(theadInfo, index) in recordHeader"
                            :key="`record-thead-td-${index}`"
                            :class="[$style['record-info-td'], theadInfo.className, { [$style['status-processing']]: info[theadInfo.objKey] === 'processing' && info.locked }]"
                        >
                            <span
                                v-if="theadInfo.objKey === 'status' && !info.locked"
                                :class="$style['withdraw-info-btn']"
                                @click="openEdit(true, info)"
                            >
                                {{ $text('S_SUBMIT_WITHDRAW', '提交取款资料') }}
                            </span>
                            <span v-else>{{ getCurrentText(info, theadInfo.objKey) }}</span>
                            <div
                                v-if="theadInfo.objKey === 'status' && info.memo"
                                :class="$style['tip-icon-wrap']"
                                :title="info.memo"
                            >
                                <icon name="info-circle" />
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <edit-withdraw-field
            v-if="editOpen"
            :third-url.sync="resultThirdUrl"
            :withdraw-data="withdrawData"
            :close-fuc="openEdit"
        />
        <!-- 企劃說先拔掉... 2019/12/06 10:00 AM..... -->
        <!-- <div :class="[$style['withdraw-pagination-wrap'], 'clearfix']">
            <div :class="$style['pagination-tip']" v-html="recordText" />
            <pagination
                :current.sync="currentPage"
                :total="totalPage"
                :class="$style['withdraw-pagination']"
            />
        </div> -->
        <div v-if="isShow" :class="$style['loading-wrap']">
            <div :class="$style['loading-item']">
                <ele-loading />
            </div>
        </div>
    </div>
</template>

<script>
import mixin from '@/mixins/mcenter/withdraw/withdrawRecord';
import { mapGetters } from 'vuex';

export default {
    components: {
        editWithdrawField: () => import(/* webpackChunkName: 'editWithdrawField' */ './editWithdrawField'),
        eleLoading: () => import(/* webpackChunkName: 'eleLoading' */ '@/router/web/components/tpl/common/element/loading/circle')
    },
    mixins: [mixin],
    props: {
        isOpenOrder: {
            type: Boolean,
            default: false
        },
        thirdUrl: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        }),
        resultThirdUrl: {
            get() {
                return this.thirdUrl;
            },
            set(value) {
                this.$emit('update:thirdUrl', value);
            }
        }
    },
    watch: {
        isOpenOrder() {
            if (this.isOpenOrder) {
                this.editOpen = this.isOpenOrder;
                this.changeType('notFinish');
                [this.withdrawData] = this.resultTypeRecord.notFinish;
            }
        }
    },
    methods: {
        openEdit(showEdit, info) {
            if (!showEdit) {
                this.$emit('update:isOpenOrder', showEdit);
            }

            this.openEditWithdraw(showEdit, info);
        }
    }
};
</script>

<style lang="scss" src="../css/withdrawRecord.scss" module></style>
