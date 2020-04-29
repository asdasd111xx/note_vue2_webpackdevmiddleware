<template>
    <div :class="[$style['withdraw-record-wrap'], colorClass]">
        <div class="clearfix">
            <div :class="$style['record-title-wrap']">
                <span :class="$style['record-title']">近10笔提现记录</span>
                <div :class="$style['icon-wrap']" @click="getRecordData">
                    <icon
                        name="sync-alt"
                        width="10"
                        height="10"/>
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
                <div :class="$style['record-info-body']">
                    <div
                        v-for="info in resultTypeRecord[currentBookmark]"
                        :key="`record-item-${info.order_number}`"
                        :class="$style['record-info-tr']"
                    >
                        <div
                            v-for="(theadInfo, index) in recordHeader"
                            :key="`record-thead-td-${index}`"
                            :class="[$style['record-info-td'], theadInfo.className, { [$style['status-processing']]: info[theadInfo.objKey] === 'processing' }]"
                        >
                            <span
                                v-if="theadInfo.objKey === 'status' && !info.locked"
                                :class="$style['withdraw-info-btn']"
                                @click="openEdit(true, info)"
                            >
                                提交提现资料
                            </span>
                            <span v-else>{{ getCurrentText(info, theadInfo.objKey) }}</span>
                            <div
                                v-if="theadInfo.objKey === 'status' && info.memo"
                                :class="$style['tip-icon-wrap']"
                                @click="alertMsg(info.memo)"
                            >
                                <icon name="info-circle" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <edit-withdraw-field
            v-if="editOpen"
            :withdraw-data="withdrawData"
            :close-fuc="openEdit"
            :change-third-url="changeThirdUrl"
        />
        <div v-if="isShow" :class="$style['loading-wrap']">
            <div :class="$style['loading-item']">
                <ele-loading />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import mixin from '@/mixins/mcenter/withdraw/withdrawRecord';

export default {
    components: {
        editWithdrawField: () => import(/* webpackChunkName: 'editWithdrawField' */ './editWithdrawField'),
        eleLoading: () => import(/* webpackChunkName: 'eleLoading' */ '@/router/web/components/tpl/common/element/loading/circle')
    },
    mixins: [mixin],
    props: {
        changeThirdUrl: {
            type: Function,
            default: () => {}
        },
        isOpenOrder: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isFirst: false
        };
    },
    computed: {
        ...mapGetters({
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
    },
    watch: {
        resultTypeRecord() {
            if (this.isOpenOrder && this.isFirst) {
                this.editOpen = this.isOpenOrder;
                this.changeType('notFinish');
                [this.withdrawData] = this.resultTypeRecord.notFinish;
            }
        }
    },
    mounted() {
        this.isFirst = true;
    },
    methods: {
        alertMsg(msg) {
            alert(msg);
        },
        openEdit(showEdit, info) {
            if (!showEdit) {
                this.$emit('update:isOpenOrder', showEdit);
            }

            this.openEditWithdraw(showEdit, info);
        }
    }
};
</script>

<style lang="scss" src="../css/indexWithdrawRecord.module.scss" module></style>
