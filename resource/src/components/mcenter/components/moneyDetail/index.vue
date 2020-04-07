<template>
    <div class="bank-money-detail">
        <div class="main-title clearfix">
            <h1>{{ $t('S_FUNDS_DETAILS') }}</h1>
        </div>
        <div class="money-detail-field clearfix">
            <select v-model="type" class="main-input select-list">
                <option
                    v-for="(option, index) in options"
                    :key="index"
                    :value="index"
                >
                    {{ $t(option.text) }}
                </option>
            </select>
            <div class="calendar-wrap clearfix">
                <datepicker
                    v-model="startTime"
                    :language="dateLang"
                    :disabled="{ from: estToday }"
                    :monday-first="true"
                    format="yyyy-MM-dd"
                    class="main-calendar left"
                    input-class="main-input"
                />
                <span class="date-line">-</span>
                <datepicker
                    v-model="endTime"
                    :language="dateLang"
                    :disabled="{ to:startTime, from: estToday }"
                    :monday-first="true"
                    format="yyyy-MM-dd"
                    class="main-calendar right"
                    input-class="main-input"
                />
            </div>
            <div class="main-btn inquire-btn" @click="actionSetUserdata(true);inquire('inquire', 1)">{{ $t('S_INQUIRE') }}</div>
        </div>
        <div class="money-detail-sort clearfix">
            <div
                :class="`sort-date small ${selectSort === 'asc' ? 'current' : ''}`"
                @click="changeSort('asc')"
            />
            <div
                :class="`sort-date big ${selectSort === 'desc' ? 'current' : ''}`"
                @click="changeSort('desc')"
            />
        </div>
        <table class="main-table">
            <thead class="mcenter-pc">
                <tr>
                    <th class="time">{{ $t('S_TRANSACTION_TIME') }}</th>
                    <th class="type">{{ $t('S_TYPE') }}</th>
                    <th class="tran">{{ $t('S_TRANSACTION_GOLD') }}</th>
                    <th class="amount">{{ $t('S_MAIN_SUM') }}</th>
                    <th class="number">{{ $t('S_BETTYPE_1') }}</th>
                    <th class="memo">{{ $t('S_REMARK') }}</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="noData">
                    <tr><td colspan="6" class="no-data">{{ $t('S_NO_DATA_YET') }}</td></tr>
                </template>
                <template v-else>
                    <template v-for="(list, index) in listData">
                        <tr :key="`pc-${index}`" class="mcenter-pc">
                            <td class="time">{{ list.created_at }}</td>
                            <td class="type">{{ opcodeList[list.opcode] }}</td>
                            <td :class="`tran ${Number(list.amount) < 0 ? 'negative' : ''}`">{{ list.amount }}</td>
                            <td :class="`amount ${Number(list.balance) < 0 ? 'negative' : ''}`">{{ list.balance }}</td>
                            <td class="number">{{ list.ref_id === '0' || !list.ref_id ? '--' : list.ref_id }}</td>
                            <td class="memo">{{ list.memo || '--' }}</td>
                        </tr>
                        <table :key="`pad-${index}`" class="pad">
                            <tr class="title">
                                <td class="time caption">{{ $t('S_TRANSACTION_TIME') }}</td>
                                <td class="time content">{{ list.created_at }}</td>
                            </tr>
                            <tr>
                                <td class="type caption">{{ $t('S_TYPE') }}</td>
                                <td class="type content">{{ opcodeList[list.opcode] }}</td>
                            </tr>
                            <tr>
                                <td class="tran caption">{{ $t('S_TRANSACTION_GOLD') }}</td>
                                <td :class="`tran content ${Number(list.amount) < 0 ? 'negative' : ''}`">{{ list.amount }}</td>
                            </tr>
                            <tr>
                                <td class="amount caption">{{ $t('S_MAIN_SUM') }}</td>
                                <td :class="`amount content ${Number(list.balance) < 0 ? 'negative' : ''}`">{{ list.balance }}</td>
                            </tr>
                            <tr>
                                <td class="number caption">{{ $t('S_BETTYPE_1') }}</td>
                                <td class="number content">{{ list.ref_id === '0' || !list.ref_id ? '--' : list.ref_id }}</td>
                            </tr>
                            <tr>
                                <td class="memo caption">{{ $t('S_REMARK') }}</td>
                                <td class="memo content">{{ list.memo || '--' }}</td>
                            </tr>
                        </table>
                    </template>
                </template>
            </tbody>
        </table>
        <div class="page-wrap">
            <span :class="`page-first${pageNow === 1 ? ' disable' : ''}`" @click="pageNow === 1 ? '' : inquire('pageChange', 1)" />
            <span :class="`page-pre${pageNow === 1 ? ' disable' : ''}`" @click="pageNow === 1 ? '' : inquire('pageChange', pageNow - 1)" />
            <div class="page-select-wrap">
                <select
                    v-model="pageNow"
                    class="page-select"
                    @change="inquire('pageChange', pageNow)"
                >
                    <option
                        v-for="num in pageAll"
                        :key="num"
                        :value="num"
                    >
                        {{ num }}
                    </option>
                </select>
                <span class="page-total">/&nbsp;{{ pageAll }}</span>
            </div>
            <span :class="`page-next${pageNow === pageAll ? ' disable' : ''}`" @click="pageNow === pageAll ? '' : inquire('pageChange', pageNow + 1)" />
            <span :class="`page-last${pageNow === pageAll ? ' disable' : ''}`" @click="pageNow === pageAll ? '' : inquire('pageChange', pageAll)" />
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import datepicker from 'vuejs-datepicker';
import EST from '@/lib/EST';
import common from '@/api/common';
import mcenter from '@/api/mcenter';
import datepickerLang from '@/lib/datepicker_lang';

export default {
    components: {
        datepicker
    },
    data() {
        return {
            estToday: EST(new Date(), '', true),
            dateLang: datepickerLang(this.$i18n.locale),
            noData: true,
            selectSort: 'desc',
            listData: [],
            totalCount: 0,
            numFirst: 0, // 每頁起始序
            numMax: 10, // 每頁顯示幾筆
            pageAll: 1, // 總頁數
            pageNow: 1, // 當前頁
            type: 'all',
            startTime: '',
            endTime: '',
            opcodeList: {}
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        options() {
            const options = {
                all: { text: 'S_ALL', show: true },
                deposit: { text: 'S_ACCOUNT_DEPOSITE', show: true },
                withdraw: { text: 'S_ACCOUNT_WITHDRAW', show: true },
                deposit_withdraw: { text: 'S_ACCESS', show: true },
                manual: { text: 'S_MANUAL_TRANS', show: true },
                vendor: { text: 'S_VENDOR', show: true },
                activity: { text: 'S_PROMOTIONS_2', show: true },
                rebate: { text: 'S_RAKEBACK', show: true },
                wage: { text: 'S_COMMISSION_01', show: this.memInfo.config.infinity }
            };

            return Object.keys(options).reduce((init, key) => {
                if (!options[key].show) {
                    return { ...init };
                }

                return { ...init, [key]: options[key] };
            }, {});
        }
    },
    watch: {
        startTime() {
            if (this.startTime > this.endTime) {
                this.endTime = this.startTime;
            }
        }
    },
    created() {
        this.actionSetIsLoading(true);
        this.setDayAgo(0);
        common.opcode({
            success: (response) => {
                this.opcodeList = response.ret;
            }
        })
        .then(() => {
            this.actionSetIsLoading(false);
        });
        this.inquire('inquire', 1);
    },
    methods: {
        changeSort(sort) {
            this.selectSort = sort;
            this.inquire('inquire', 1);
        },
        setDayAgo(days) {
            this.startTime = new Date(Vue.moment(this.estToday).add(-days, 'days'));
            this.endTime = this.estToday;
        },
        inquire(action, page) {
            if (action === 'pageChange') {
                this.pageNow = page;
                this.numFirst = (this.pageNow - 1) * this.numMax;
            } else {
                this.pageNow = 1;
                this.numFirst = 0;
            }
            mcenter.moneyDetail({
                params: {
                    start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00'),
                    category: this.type === 'all' ? '' : this.type,
                    first_result: this.numFirst,
                    max_results: this.numMax,
                    order: this.selectSort
                },
                success: (response) => {
                    this.listData = [];
                    this.totalCount = Number(response.pagination.total);
                    if (this.totalCount === 0) {
                        this.pageAll = 1;
                        this.noData = true;
                        return;
                    }
                    this.noData = false;
                    this.pageAll = Math.ceil(this.totalCount / this.numMax);
                    this.listData = response.ret;
                    for (let i = 0; i < this.listData.length; i += 1) {
                        this.listData[i].created_at = EST(this.listData[i].created_at);
                    }
                    window.scrollTo(0, 0);
                }
            });
        },
        ...mapActions([
            'actionSetUserdata',
            'actionSetIsLoading'
        ])
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
