<template>
    <div :class="mainClass">
        <div v-if="page !== 'detail'" :class="$style['top-link']">
            <span :class="[$style.link, { [$style.active]: page === 'record' }]" @click="onClick('record')">{{ $text('S_COMMISSION_SEND_RECORD', '派发记录') }}</span>
            <span :class="[$style.link, { [$style.active]: page === 'summary' }]" @click="onClick('summary')">{{ $text('S_COMMISSION_SUMMARY', '收益概況') }}</span>
            <span :class="[$style.link, { [$style.active]: page === 'rebate' }]" @click="onClick('rebate')">{{ $text('S_COMMISSION_REBATE', '实时返利') }}</span>
        </div>
        <div v-if="page === 'record' && hasSearch" class="search-wrap">
            <div :class="$style['search-form']">
                <div :class="$style['form-row']">
                    <div :class="$style['form-title']">{{ $text('S_PLEASE_SELECT_TYPE') }}</div>
                    <select v-model="state">
                        <template v-for="info in options">
                            <option :key="`option-${info.value}`" :value="info.value">{{ info.text }}</option>
                        </template>
                    </select>
                </div>
                <div :class="[$style['form-row'], 'clearfix']">
                    <div :class="$style['form-date-start']">
                        <div :class="$style['form-title']">{{ $text('S_STARTED_DAY', '起始日') }}</div>
                        <input v-model="start" type="date" />
                    </div>
                    <div :class="$style['form-date-end']">
                        <div :class="$style['form-title']">{{ $text('S_END_DAY', '结束日') }}</div>
                        <input v-model="end" type="date" />
                    </div>
                </div>
                <div :class="$style['submit-form-row']">
                    <div :class="$style.submit" @click="onInquire">{{ $text('S_INQUIRE', '查询') }}</div>
                </div>
            </div>
        </div>
        <commission-overview v-if="page === 'summary'" />
        <commission-list
            v-show="page === 'record'"
            :set-tab-state="setTabState"
            :set-header-title="setHeaderTitle"
            :search-info="searchInfo"
            :set-detail-data="setDetailData"
        />
        <commission-detail
            v-if="page === 'detail'"
            :detail-info="detailInfo"
        />
        <commission-rebate v-if="page === 'rebate'"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { format } from 'date-fns';
import commission from '@/mixins/mcenter/commission';

export default {
    components: {
        commissionOverview: () => import(/* webpackChunkName: 'commissionOverview' */ './components/commissionOverview/index'),
        commissionList: () => import(/* webpackChunkName: 'commissionList' */ './components/commissionList/index'),
        commissionDetail: () => import(/* webpackChunkName: 'commissionDetail' */ './components/commissionDetail/index'),
        commissionRebate: () => import(/* webpackChunkName: 'commissionRebate' */ './components/CommissionRebate/index')
    },
    mixins: [commission],
    props: {
        setTabState: {
            type: Function,
            required: true
        },
        setHeaderTitle: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            isShowDetail: [],
            hasSearch: this.$route.params.page === 'record'
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        start: {
            get() {
                return format(new Date(this.startTime), 'yyyy-MM-dd'); // 格式化成原生 input date 可以使用的格式
            },
            set(date) {
                this.startTime = date;
            }
        },
        end: {
            get() {
                return format(new Date(this.endTime), 'yyyy-MM-dd'); // 格式化成原生 input date 可以使用的格式
            },
            set(date) {
                this.endTime = date;
            }
        },
        mainClass() {
            const site = `site-${this.memInfo.user.domain}`;

            return {
                'commission-wrap': true,
                [this.$style[site]]: this.$style[site],
                [this.$style['preset-color']]: !this.$style[site]
            };
        },
        page() {
            return this.$route.params.page;
        }
    },
    watch: {
        startTime() {
            this.endTime = this.startTime > this.endTime ? this.startTime : this.endTime;
        }
    },
    created() {
        if (!this.page) {
            this.$router.push('/mobile/mcenter/tcenter/commission/summary');
            return;
        }

        if (this.page !== 'detail') {
            return;
        }

        this.$router.push('/mobile/mcenter/tcenter/commission/record');
        this.hasSearch = true;
    },
    methods: {
        onClick(page) {
            this.hasSearch = page === 'record';
            this.$router.push(`/mobile/mcenter/tcenter/commission/${page}`);
        },
        onInquire() {
            this.onSearch();
            this.hasSearch = false;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
