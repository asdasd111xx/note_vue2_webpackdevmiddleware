<template>
    <div v-if="isReceive" class="commission-list-wrap">
        <template v-if="commissionList.length">
            <table :class="$style['main-table']">
                <thead>
                    <tr>
                        <th :class="$style.index">{{ $text('S_NUMBER_NO', '序') }}</th>
                        <th :class="[$style.period, { [$style.active]: sort === 'period' }]" @click="onSort('period')">
                            <span>{{ $text('S_PERIOD_NAME', '期数名称') }}</span>
                            <span v-if="sort === 'period'">
                                <icon
                                    :name="`${order === 'desc' ? 'long-arrow-alt-down' : 'long-arrow-alt-up'}`"
                                    width="5"
                                    height="10"
                                />
                            </span>
                            <span v-else>
                                <icon
                                    name="long-arrow-alt-up"
                                    width="5"
                                    height="10"
                                />
                                <icon
                                    name="long-arrow-alt-down"
                                    width="5"
                                    height="10"
                                />
                            </span>
                        </th>
                        <th :class="$style.datetime">{{ $text('S_COMPUTE_WAGER_INTERVAL', '结算区间') }}</th>
                        <th :class="$style.state">{{ $text('S_STATUS', '状态') }}</th>
                        <th :class="$style.next" />
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(info, index) in commissionList">
                        <tr :key="`list-${info.id}`" @click="onClick(info)">
                            <td>{{ index + 1 }}</td>
                            <td>{{ info.period }}</td>
                            <td>
                                <span>{{ info.start_at | dateFormat }}</span>
                                <span>{{ info.end_at | dateFormat }}</span>
                            </td>
                            <td :class="$style[`state-${commissionState[info.state].key}`]">{{ commissionState[info.state].text }}</td>
                            <td>
                                <icon
                                    name="chevron-right"
                                    width="13"
                                    height="13"
                                />
                            </td>
                        </tr>
                        <tr v-show="displayDetail.includes(info.id)" :key="`detail-${info.id}`">
                            <td :class="$style['detail-wrap']" colspan="5">
                                <div :class="[$style.detail, 'clearfix']">
                                    <div :class="$style.title">{{ $text('S_ACH_VALID_MEMBERS', '有效会员') }}</div>
                                    <div :class="$style.number">{{ info.sub_user_count }}</div>
                                </div>
                                <div :class="[$style.detail, 'clearfix']">
                                    <div :class="$style.title">{{ $text('S_COMMISSION_01', '佣金') }}</div>
                                    <div :class="$style.number">{{ info.amount }}</div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
                <tfoot>
                    <tr>
                        <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_PAGE_TOTAL', '本页结果小计') }}</td>
                        <td>{{ $text('S_COMMISSION_01', '佣金') }}</td>
                        <td :class="$style['money-type']" colspan="2">{{ pageTotal.amount | amountFormat }}</td>
                    </tr>
                    <tr>
                        <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_SEARCH_TOTAL', '搜寻结果总计') }}</td>
                        <td>{{ $text('S_COMMISSION_01', '佣金') }}</td>
                        <td :class="$style['money-type']" colspan="2">{{ allTotal.amount | amountFormat }}</td>
                    </tr>
                </tfoot>
            </table>
            <pagintaion
                :class="$style.pagination"
                :page="+currentPage"
                :total="totalPage"
                @update:page="(value) => { updatePage(value); }"
            />
        </template>
        <template v-else>
            <div :class="$style['no-data']">
                <img src="/static/image/mobile/mcenter/ic_nodata.png" />
                <span>{{ $text('S_NO_DATA_YET', '暂无资料') }}</span>
            </div>
        </template>
    </div>
</template>

<script>
import commissionList from '@/mixins/mcenter/commission/commissionList';

export default {
    components: {
        pagintaion: () => import(/* webpackChunkName: 'commissionList' */ '../../../../../pagination')
    },
    mixins: [commissionList],
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
            displayDetail: []
        };
    },
    methods: {
        onClick(info) {
            if (info.state === 1) {
                this.setDetailData(info);
                this.setTabState(false);
                this.setHeaderTitle(this.$text('S_MY_REWARD', '我的返利'));
                this.$router.push('/mobile/mcenter/tcenter/commission/detail');
                return;
            }

            if (this.displayDetail.includes(info.id)) {
                this.displayDetail = [...this.displayDetail.filter((value) => value !== info.id)];
                return;
            }

            this.displayDetail = [...this.displayDetail, info.id];
        },
        updatePage(value) {
            this.currentPage = value;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
