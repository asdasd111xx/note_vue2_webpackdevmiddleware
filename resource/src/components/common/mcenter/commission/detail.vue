<template>
    <div>
        <slot
            :state="state"
            :period="period"
            :level-trans="levelTrans"
            :level-list="levelList"
            :level-totle="levelTotle"
            :first-level-list="firstLevelList"
            :sort="sort"
            :order="order"
            :set-data-sort="setDataSort"
            :pageSubtotal="pageSubtotal"
            :allTotal="allTotal"
            :current-page="currentPage"
            :total-page="totalPage"
            :update-page="updatePage"
            :oauth2-detail="oauth2Detail"
        />
    </div>
</template>

<script>
import ajax from '@/lib/ajax';
import { API_COMMISSION_LEVEL_LIST, API_COMMISSION_FIRST_LEVEL_LIST } from '@/config/api';

export default {
    filters: {
        commaFormat(value) {
            if (typeof value === 'undefined') {
                return '--';
            }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    },
    props: {
        id: {
            type: String,
            required: true
        },
        period: {
            type: String,
            required: true
        },
        state: {
            type: String,
            default: ''
        },
        isOauth2: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            // 每頁限制筆數
            recordCount: 10,
            // 當前頁
            currentPage: '1',
            // 總頁數
            totalPage: 1,
            sort: '',
            order: '',
            levelTrans: {
                1: 'S_FIRST_LEVEL_FRIEND',
                2: 'S_SECOND_LEVEL_FRIEND',
                3: 'S_THIRD_LEVEL_FRIEND',
                4: 'S_FOURTH_LEVEL_FRIEND',
                5: 'S_FIFTH_LEVEL_FRIEND'
            },
            levelList: [],
            levelTotle: {},
            firstLevelList: [],
            pageSubtotal: {},
            allTotal: {},
            oauth2Detail: {}
        };
    },
    watch: {
        currentPage() {
            this.getFirstLevel();
        }
    },
    created() {
        const params = this.isOauth2 === 'Y' ? [this.getOauth2EntryDetail(this.id)] : [this.getLevelList(), this.getFirstLevel()];

        // 當所有 api 完成後再渲染
        Promise.all(params).then(() => {
            this.isReceive = true;
        });
    },
    methods: {
        updatePage(value) {
            this.currentPage = value;
        },
        getLevelList() {
            return ajax({
                method: 'get',
                url: API_COMMISSION_LEVEL_LIST,
                params: { period: this.period },
                success: ({ result, ret, total }) => {
                    if (result !== 'ok') {
                        return;
                    }

                    this.levelList = ret;
                    this.levelTotle = total;
                }
            });
        },
        getFirstLevel() {
            const params = {
                max_results: this.recordCount,
                first_result: (this.currentPage - 1) * this.recordCount
            };

            if (this.sort !== '') {
                params.sort = this.sort;
                params.order = this.order;
            }

            return ajax({
                method: 'get',
                url: `${API_COMMISSION_FIRST_LEVEL_LIST}/${this.id}/friends`,
                params,
                success: (request) => {
                    if (request.result !== 'ok') {
                        return;
                    }

                    if (request.pagination.total !== '0') {
                        // 計算資料會有幾頁，一頁最多十筆
                        this.totalPage = Math.ceil(request.pagination.total / this.recordCount);
                    }
                    // 第一級好友佣金資料列表
                    this.firstLevelList = request.ret;
                    // 小計
                    this.pageSubtotal = request.sub_total;
                    // 總計
                    this.allTotal = request.total;
                }
            });
        },
        setDataSort(sortValue) {
            let orderstate = 'asc';

            if (this.sort === sortValue) {
                orderstate = (this.order === 'asc') ? 'desc' : 'asc';
            }

            this.currentPage = '1';
            this.sort = sortValue;
            this.order = orderstate;
            this.getFirstLevel();
        },
        getOauth2EntryDetail(id) {
            return ajax({
                method: 'get',
                url: `${API_COMMISSION_FIRST_LEVEL_LIST}/${id}/oauth2/detail`,
                success: ({ result, ret }) => {
                    if (result !== 'ok') {
                        return;
                    }
                    this.oauth2Detail = ret;
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
</style>
