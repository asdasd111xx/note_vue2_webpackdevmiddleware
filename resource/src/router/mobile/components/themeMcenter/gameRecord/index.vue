<template>
    <div :class="$style['game-record-wrap']">
        <div v-if="!['bet', 'detail'].includes(currentPage)" :class="`${$style['top-bar']} clearfix`">
            <div :class="$style['inq-game']">
                <model-select
                    v-model="game"
                    :class="$style['top-select']"
                    :options="gameList"
                    :placeholder="$t('S_ALL')"
                />
            </div>
            <div :class="`${$style['inq-date']} ui input`">
                <flat-pickr-range
                    :min-date="fromDate"
                    :max-date="now"
                    :date.sync="date"
                />
            </div>
        </div>
        <table-1st
            v-if="currentPage === 'main'"
            :list="inq1st.list"
            :sub-total="inq1st.subTotal"
            :total="inq1st.total"
            :sort.sync="sort"
            @onInquire="onInquireBetClick"
        />
        <table-2nd
            v-if="currentPage === 'bet'"
            :list="inq2nd.list"
            :sub-total="inq2nd.subTotal"
            :total="inq2nd.total"
            :sort.sync="sort"
            @onInquire="onInquireDetailClick"
        />
        <table-3rd
            v-if="currentPage === 'detail'"
            :list="inq3rd.list"
            :sub-total="inq3rd.subTotal"
            :total="inq3rd.total"
            :sort.sync="sort"
        />
        <pagination
            v-if="currentPage"
            :key="currentPage"
            :current.sync="currentPageNum"
            :total="totalPage[currentPage]"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import { ModelSelect } from 'vue-search-select';
import mixinIndex from '@/components/mcenter/components/gameRecord/js/mixinIndex';
import flatPickrRange from '@/components/flatPickrRange';
import gameName from '@/lib/game_name';
import pagination from '@/components/mcenter/template/common/pagination';
import table1st from './components/table1st';
import table2nd from './components/table2nd';
import table3rd from './components/table3rd';

export default {
    components: {
        ModelSelect,
        pagination,
        table1st,
        table2nd,
        table3rd,
        flatPickrRange
    },
    mixins: [mixinIndex],
    props: {
        headerConfig: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            dateText: ''
        };
    },
    computed: {
        game: {
            get() {
                return this.inqGame;
            },
            set(value) {
                this.inqGame = value;
                this.onInquireClick();
            }
        },
        date: {
            get() {
                return [this.inqStartDate, this.inqEndDate];
            },
            set(value) {
                if (value.length === 2) {
                    [this.inqStartDate, this.inqEndDate] = value;
                    this.onInquireClick();
                }
            }
        },
        view() {
            return `${Vue.moment(this.date[0]).format('YYYY-MM-DD')} - ${Vue.moment(this.date[1]).format('MM-DD')}`;
        }
    },
    watch: {
        currentPage() {
            let pageInfo = {
                page: '',
                title: this.$text('S_TEAM_CENTER', '团队中心')
            };

            switch (this.currentPage) {
                case 'bet':
                    pageInfo = {
                        page: this.currentPage,
                        title: this.selectedUser
                    };
                    break;
                case 'detail':
                    pageInfo = {
                        page: this.currentPage,
                        title: gameName(this.selectedVendor, this.selectedKind)
                    };
                    break;
                default:
                    break;
            }

            this.$emit('update:pageInfo', pageInfo);

            if (!this.headerConfig) {
                return;
            }

            if (this.currentPage === 'bet') {
                this.$emit('update:headerConfig', {
                    ...this.headerConfig,
                    [this.$route.name]: {
                        ...this.headerConfig[this.$route.name],
                        name: this.selectedUser,
                        hasTitle: true,
                        back: this.onBackClick
                    }
                });
                return;
            }

            if (this.currentPage === 'detail') {
                this.$emit('update:headerConfig', {
                    ...this.headerConfig,
                    [this.$route.name]: {
                        ...this.headerConfig[this.$route.name],
                        name: gameName(this.selectedVendor, this.selectedKind),
                        hasTitle: true,
                        back: this.onBackClick
                    }
                });
                return;
            }

            this.$emit('update:headerConfig', {
                ...this.headerConfig,
                [this.$route.name]: {
                    ...this.headerConfig[this.$route.name],
                    name: 'S_TEAM_CENTER',
                    hasTitle: false,
                    back: 'push'
                }
            });
        }
    },
    mounted() {
        this.dateText = this.onInquireClick();
    },
    methods: {
        onCalendarClose(selectedDates) {
            if (selectedDates.length < 2) {
                this.$refs.pickr.fp.setDate([this.inqStartDate, this.inqEndDate]);
            }
        }
    }
};
</script>

<style lang="scss" module>
.game-record-wrap {
    background-color: #F3F3F3;
    min-height: calc(100vh - 120px);
}

.top-bar {
    margin-bottom: 10px;
    font-size: 12px;
}

.inq-game {
    float: left;
    width: 50%;

    > div {
        min-height: auto !important;
        border-radius: 0 !important;
    }
}

.inq-date {
    float: left;
    width: 50%;
    line-height: 1em;

    > input {
        border-radius: 0 !important;
    }
}

@media screen and (min-width: 480px) {
    .top-bar {
        font-size: 17px;
    }
}

@media screen and (min-width: 768px) {
    .top-bar {
        font-size: 27px;
    }
}
</style>
