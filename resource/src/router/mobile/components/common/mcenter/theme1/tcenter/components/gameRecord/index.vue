<template>
    <div :class="[$style['main-wrap'], $style[`theme-${siteConfig.MCENTER_COLOR}`]]">
        <div :class="$style['top-wrap']">
            <div
                :class="[$style['icon-inquire'], { [$style['is-active']]: hasSearch }]"
                @click="hasSearch = !hasSearch"
            />
        </div>
        <game-record
            :inq-game="inqGame"
            :inq-start="inqStart"
            :inq-end="inqEnd"
        >
            <template
                scope="{
                    inq1st,
                    inq2nd,
                    inq3rd,
                    gameList,
                    currentPage,
                    page,
                    totalPage,
                    countOfPage,
                    sort,
                    updatePage,
                    onSort,
                    onSearch,
                    onSearchBet,
                    onSearchDetail
                }"
            >
                <div v-show="hasSearch" :class="[$style['form-search'], 'clearfix']">
                    <div :class="$style['field-game-wrap']">
                        <div :class="$style.title">{{ $text('S_GAMETYPE2') }}</div>
                        <select v-model="inqGame" :class="$style.select">
                            <option
                                v-for="info in gameList"
                                :key="`list-${info.value}`"
                                :value="info.value"
                            >
                                {{ info.text }}
                            </option>
                        </select>
                    </div>
                    <div :class="[$style['field-date-wrap'], $style['start-date']]">
                        <div :class="$style.title">{{ $text('S_STARTED_DAY') }}</div>
                        <input
                            v-model="inqStart"
                            :class="$style.date"
                            :min="fromDate"
                            :max="inqEnd"
                            type="date"
                        />
                    </div>
                    <div :class="[$style['field-date-wrap'], $style['end-date']]">
                        <div :class="$style.title">{{ $text('S_END_DAY') }}</div>
                        <input
                            v-model="inqEnd"
                            :class="$style.date"
                            :min="inqStart"
                            :max="endDate"
                            type="date"
                        />
                    </div>
                    <div :class="$style['field-search-wrap']">
                        <div :class="$style['btn-search']" @click="onSearch">{{ $text('S_INQUIRE') }}</div>
                    </div>
                </div>
                <template v-if="currentPage === 'main' && inq1st.list.length">
                    <table-1st
                        :list="inq1st.list"
                        :sub-total="inq1st.subTotal"
                        :total="inq1st.total"
                        :sort="sort"
                        @update:sort="onSort"
                        @onInquire="onSearchBet"
                    />
                    <pagintaion
                        :class="$style.pagination"
                        :page="+page.main"
                        :total="totalPage.main"
                        @update:page="(value) => { updatePage('main', `${value}`) }"
                    />
                </template>
                <template v-if="currentPage === 'bet' && inq2nd.list.length">
                    <table-2nd
                        :list="inq2nd.list"
                        :sub-total="inq2nd.subTotal"
                        :total="inq2nd.total"
                        :sort="sort"
                        @update:sort="onSort"
                        @onInquire="onSearchDetail"
                    />
                    <pagintaion
                        :class="$style.pagination"
                        :page="+page.bet"
                        :total="totalPage.bet"
                        @update:page="(value) => { updatePage('bet', `${value}`) }"
                    />
                </template>
                <template v-if="currentPage === 'detail' && inq3rd.list.length">
                    <table-3rd
                        :list="inq3rd.list"
                        :sub-total="inq3rd.subTotal"
                        :total="inq3rd.total"
                        :sort="sort"
                        @update:sort="onSort"
                    />
                    <pagintaion
                        :class="$style.pagination"
                        :page="+page.detail"
                        :total="totalPage.detail"
                        @update:page="(value) => { updatePage('detail', `${value}`) }"
                    />
                </template>
            </template>
        </game-record>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import EST from '@/lib/EST';
import gameRecord from '@/components/common/mcenter/gameRecord';
import pagintaion from '../../../pagination';
import table1st from './table1st';
import table2nd from './table2nd';
import table3rd from './table3rd';

export default {
    components: {
        gameRecord,
        pagintaion,
        table1st,
        table2nd,
        table3rd
    },
    data() {
        const now = EST(new Date(), '', true);

        return {
            hasSearch: true,
            fromDate: Vue.moment(now).add(-60, 'days').format('YYYY-MM-DD'),
            endDate: Vue.moment(now).format('YYYY-MM-DD'),
            inqGame: '',
            inqStart: Vue.moment(now).add(-6, 'days').format('YYYY-MM-DD'),
            inqEnd: Vue.moment(now).format('YYYY-MM-DD')
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    }
};
</script>

<style lang="scss" module>
.main-wrap {
    padding-bottom: 42px;
}
.top-wrap {
    background-color: #DDD;
    padding: 1px;
}

.icon-inquire {
    background: url('/static/image/mobile/mcenter/theme1/btn_inquire.png') 0 0 / 100% 100% no-repeat;
    margin: 8px 10px;
    width: 26px;
    height: 26px;

    &.is-active {
        background: url('/static/image/mobile/mcenter/theme1/btn_inquire_h.png') 0 0 / 100% 100% no-repeat;
    }
}

.form-search {
    background-color: #FFF;
    border-top: 1px solid #BEBCBC;
    border-bottom: 1px solid #BEBCBC;

    .title {
        left: 12px;
        color: #BEBCBC;
    }
}

.field-wrap {
    padding: 4px 12px;
}

.field-game-wrap {
    composes: field-wrap;
    border-bottom: 1px solid #BEBCBC;

    select {
        background: transparent;
        border: none;
        appearance: none;
        outline: none;
    }
}

.field-date-wrap {
    composes: field-wrap;
    float: left;
    width: 50%;

    &.start-date {
        border-right: 1px solid #BEBCBC;
    }

    .date {
        outline: none;
        width: 100%;
    }

    input {
        border: none;
        outline: none;
        background: transparent;
        appearance: none;
    }
}

.field-search-wrap {
    padding: 8px 0;
    clear: left;
    border-top: 1px solid #BEBCBC;

    .btn-search {
        background-color: #00347C;
        margin: 0 auto;
        width: 75%;
        line-height: 30px;
        border-radius: 6px;
        text-align: center;
        color: #FFF;
    }
}

.select {
    background-color: inherit;
    width: 100%;
    border: none;
    outline: none;
}

.pagination {
    position: fixed;
    bottom: 55px;
}

.theme-miller {
    .field-search-wrap {
        .btn-search {
            background-color: #F7B500;
        }
    }
}
</style>
