<template>
    <div class="member-list">
        <div class="main-title clearfix">
            <div class="clearfix">
                <span>{{ $t('S_MEMBER_LIST') }}</span>
                <div class="reload-icon" @click="getMemberList()">
                    <icon
                        name="sync-alt"
                        width="16"
                        height="16"
                    />
                </div>
            </div>
        </div>
        <!-- 類別選擇 radio -->
        <div class="main-radio-wrap clearfix">
            <div
                v-for="(item, i) in allType"
                :key="i"
                :class="`main-radio ${item}`"
            >
                <input
                    :id="`promotion-${i}`"
                    :name="`promotion-class`"
                    :value="i"
                    :checked="i === selectType"
                    type="radio"
                    @click="typeChange(i)"
                /> {{ item }}
                <label :for="`promotion-${i}`">
                    <span class="radio-style" />
                </label>
            </div>
        </div>
        <table class="main-table">
            <thead class="agcenter-pc">
                <tr>
                    <th width="5%">{{ $t('S_NUMBER_NO') }}</th>
                    <th>{{ $t('S_ACCOUNT') }}</th>
                    <th width="10%">{{ $t('S_STATUS') }}</th>
                    <th width="10%">{{ $text('S_REGISTER_WAY') }}</th>
                    <th width="20%">
                        {{ $t('S_REGISTER_TIME') }}
                        <i class="sort-icon" @click="sortChange('created_at')" />
                    </th>
                    <th width="20%">
                        {{ $t('S_LAST_ONLINE_TIME') }}
                        <i class="sort-icon" @click="sortChange('last_online')" />
                    </th>
                    <th class="balance" width="17%">{{ $t('S_MAIN_BALANCE') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(item, index) in mainData"
                    :key="index"
                    :class="`member-item`"
                >
                    <td :class="['number', 'mobile-table-th']">{{ index + 1 }}</td>
                    <td>
                        <div class="mobile-item-table">
                            <div class="mobile-item-wrap">
                                <span class="mobile-item-title">{{ $t('S_ACCOUNT') }}</span>
                                <span class="mobile-item-content">{{ item.username }}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="mobile-item-table">
                            <div class="mobile-item-wrap">
                                <span class="mobile-item-title">{{ $t('S_STATUS') }}</span>
                                <span class="mobile-item-content">
                                    <span v-if="item.enable" class="mem-status-enable">{{ $t('S_ENABLE') }}</span>
                                    <span v-else class="mem-status-disable">{{ $t('S_DISABLE') }}</span>
                                    <span v-if="item.locked">/ {{ $t('S_LOCKED') }}</span>
                                    <span v-if="item.bankrupt">/ {{ $t('S_BANKRUPT') }}</span>
                                </span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="mobile-item-table">
                            <div class="mobile-item-wrap">
                                <span class="mobile-item-title">{{ $t('S_REGISTER_WAY') }}</span>
                                <span class="mobile-item-content">{{ $text(registerTrans[item.created_by]) }}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="mobile-item-table">
                            <div class="mobile-item-wrap">
                                <span class="mobile-item-title">{{ $t('S_REGISTER_TIME') }}</span>
                                <span class="mobile-item-content">{{ item.created_at }}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="mobile-item-table">
                            <div class="mobile-item-wrap">
                                <span class="mobile-item-title">{{ $t('S_LAST_ONLINE_TIME') }}</span>
                                <span class="mobile-item-content">
                                    <font v-if="item.leaveTime === 'S_ONLINE'" color="#8CC53F">{{ $t(item.leaveTime) }}</font>
                                    <font v-else>{{ item.leaveTime }}</font>
                                </span>
                            </div>
                        </div>
                    </td>
                    <td class="balance">
                        <div class="mobile-item-table">
                            <div class="mobile-item-wrap">
                                <span class="mobile-item-title">{{ $t('S_MAIN_BALANCE') }}</span>
                                <span class="mobile-item-content align-right">{{ item.cash.balance }}</span>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="mainData.length !== 0" class="page-wrap">
            <span :class="`page-first${pageNow === 1 ? ' disable' : ''}`" @click="pageNow === 1 ? '' : pageChange(1)" />
            <span :class="`page-pre${pageNow === 1 ? ' disable' : ''}`" @click="pageNow === 1 ? '' : pageChange(pageNow - 1)" />
            <div class="page-select-wrap">
                <select
                    v-model="pageNow"
                    class="page-select"
                    @change="pageChange(pageNow)"
                >
                    <option
                        v-for="(num, i) in pageAll"
                        :key="i"
                        :value="num"
                    >
                        {{ num }}
                    </option>
                </select>
                <span class="page-total">/&nbsp;{{ pageAll }}</span>
            </div>
            <span :class="`page-next${pageNow === pageAll ? ' disable' : ''}`" @click="pageNow === pageAll ? '' : pageChange(pageNow + 1)" />
            <span :class="`page-last${pageNow === pageAll ? ' disable' : ''}`" @click="pageNow === pageAll ? '' : pageChange(pageAll)" />
        </div>
    </div>
</template>

<script>
import i18n from '@/config/i18n';
import EST from '@/lib/EST';
import agcenter from '@/api/agcenter';

export default {
    data() {
        return {
            allType: {},
            selectType: 'all',
            apiParam: {
                max_results: 20, // 每頁顯示幾筆/api過濾條件
                first_result: 0 // 開始筆數/api過濾條件
            },
            pageAll: 1, // 總頁數
            pageNow: 1, // 當前頁
            enable: '', // 是否啟用/api過濾條件
            lockedBankrupt: '', // 已凍結或停權/api過濾條件
            requestLock: false, // 取資料lock機制用
            originSort: '', // 原排序欄位
            mainData: [], // 會員資料列表
            registerTrans: { // 註冊方式
                1: 'S_MEMBER_REGISTER',
                2: 'S_AGENT_JOIN_2',
                3: 'S_HALL_CREATE',
                4: 'S_HALL_CREATE_LOT',
                5: 'S_AGENT_JOIN'
            }
        };
    },
    created() {
        // 組類別選擇列表
        this.allType = {
            all: i18n.t('S_ALL'),
            enable: i18n.t('S_ENABLE'),
            disable: i18n.t('S_DISABLE'),
            locked: `${i18n.t('S_LOCKED')}/${i18n.t('S_BANKRUPT')}`
        };

        // 取會員列表資料
        this.getMemberList();
    },
    methods: {
        /**
             * 取會員列表資料
             */
        getMemberList() {
            if (this.requestLock) {
                return;
            }
            this.requestLock = true;

            const that = this;

            agcenter.memberList({
                params: this.apiParam,
                success: (response) => {
                    this.mainData = response.ret;
                    for (let i = 0; i < this.mainData.length; i += 1) {
                        this.mainData[i].leaveTime = '--';
                        if (this.mainData[i].last_online) {
                            this.mainData[i].leaveTime = EST(this.mainData[i].last_online, 'YYYY-MM-DD HH:mm:ss');

                            // "在線"條件判斷：當最後登入時間大於離線時間則表示會員還在線上
                            if (this.mainData[i].last_login
                                    && this.mainData[i].last_login > this.mainData[i].last_online
                            ) {
                                this.mainData[i].leaveTime = 'S_ONLINE';
                            }
                            // 當有登入時間、無離線時間時，表示第一次登入還在線上
                        } else if (this.mainData[i].last_login) {
                            this.mainData[i].leaveTime = 'S_ONLINE';
                        }

                        this.mainData[i].created_at = EST(this.mainData[i].created_at, 'YYYY-MM-DD HH:mm:ss');
                    }

                    this.pageAll = 1;
                    if (this.mainData.length > 0) {
                        this.pageAll = Math.ceil(response.pagination.total / this.apiParam.max_results);
                    }
                    this.requestLock = false;
                },
                fail() {
                    that.mainData = [];
                    that.requestLock = false;
                }
            });
        },
        /**
             * 切換資料顯示頁面
             *
             * @param int page
             */
        pageChange(page) {
            this.pageNow = page;
            this.apiParam.first_result = (this.pageNow - 1) * this.apiParam.max_results;
            // 取會員列表資料
            this.getMemberList();
        },
        /**
             * 指定資料排序方式
             *  - 僅開放last_online/last_online 排序條件
             *  - 必須搭配order參數
             *
             * @param string key
             */
        sortChange(key) {
            if (this.originSort === key) {
                this.apiParam.order = (this.apiParam.order === 'asc' ? 'desc' : 'asc');
            } else {
                // 設定上一個排序條件
                this.originSort = key;
                this.apiParam.sort = key;
                this.apiParam.order = 'asc';
            }
            // 重設為第1頁
            this.resetPage();
            // 取會員列表資料
            this.getMemberList();
        },
        /**
             * 切換資料顯示類別
             *
             * @param string type
             */
        typeChange(type) {
            switch (type) {
                case 'enable':
                    this.apiParam.enable = 1;
                    delete this.apiParam.locked_or_bankrupt;
                    break;
                case 'disable':
                    this.apiParam.enable = 0;
                    delete this.apiParam.locked_or_bankrupt;
                    break;
                case 'locked':
                    this.apiParam.locked_or_bankrupt = 1;
                    delete this.apiParam.enable;
                    break;
                default:
                    delete this.apiParam.enable;
                    delete this.apiParam.locked_or_bankrupt;
                    break;
            }
            this.selectType = type;
            // 重設為第1頁
            this.resetPage();
            // 取會員列表資料
            this.getMemberList();
        },
        /**
             * 重設為第1頁
             */
        resetPage() {
            this.pageNow = 1;
            this.apiParam.first_result = 0;
        }
    }
};
</script>

<style src="../css/index.scss" lang="scss" scoped></style>
