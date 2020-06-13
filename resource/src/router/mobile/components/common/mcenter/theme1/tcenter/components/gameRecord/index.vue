<template>
    <div :class="mainClass">
        <game-record
            :inq-game.sync="inqGame"
            :inq-start.sync="inqStart"
            :inq-end.sync="inqEnd"
            :set-header-title="setHeaderTitle"
            :set-tab-state="setTabState"
        >
            <template
                scope="{
                    inq1st,
                    inq2nd,
                    hasSearch,
                    searchTabs,
                    currentCondition,
                    gameList,
                    currentPage,
                    changeSearchCondition,
                    onSearch,
                    onSearchBet,
                    showInfinite,
                    infiniteHandler,
                    control1stData,
                    control2ndData,
                    mainNoData
                }"
            >
                <div v-if="currentPage === 'main'" :class="$style['top-wrap']">
                    <div
                        v-for="info in searchTabs"
                        :key="info.key"
                        :class="[
                            $style['search-tab'],
                            { [$style.active]: currentCondition === info.key }
                        ]"
                        @click="changeSearchCondition(info.key)"
                    >
                        <span>{{ info.name }}</span>
                    </div>
                </div>

                <div
                    v-show="currentPage === 'main' && hasSearch"
                    :class="[$style['form-search'], 'clearfix']"
                >
                    <div :class="$style['field-game-wrap']">
                        <div :class="$style.title">
                            {{ $text("S_GAMETYPE2") }}
                        </div>
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
                    <div
                        :class="[
                            $style['field-date-wrap'],
                            $style['start-date']
                        ]"
                    >
                        <div :class="$style.title">
                            {{ $text("S_STARTED_DAY") }}
                        </div>
                        <input
                            v-model="inqStart"
                            :class="$style.date"
                            :min="fromDate"
                            :max="inqEnd"
                            type="date"
                        />
                        <span>{{ inqStart | dateFormat }}</span>
                    </div>
                    <div
                        :class="[$style['field-date-wrap'], $style['end-date']]"
                    >
                        <div :class="$style.title">
                            {{ $text("S_END_DAY") }}
                        </div>
                        <input
                            v-model="inqEnd"
                            :class="$style.date"
                            :min="inqStart"
                            :max="endDate"
                            type="date"
                        />
                        <span>{{ inqEnd | dateFormat }}</span>
                    </div>
                    <div :class="$style['field-search-wrap']">
                        <div :class="$style['btn-search']" @click="onSearch">
                            {{ $text("S_INQUIRE") }}
                        </div>
                    </div>
                </div>

                <template v-if="currentPage === 'main'">
                    <table-1st
                        :list="control1stData"
                        :total="inq1st.total"
                        :counts="inq1st.counts"
                        :inqStart="inqStart"
                        :inqEnd="inqEnd"
                        :hasSearch="hasSearch"
                        @onInquire="onSearchBet"
                    />
                    <infinite-loading
                        v-if="showInfinite"
                        ref="infiniteLoading"
                        @infinite="infiniteHandler"
                    >
                        <span slot="no-more" />
                        <span slot="no-results" />
                    </infinite-loading>
                </template>

                <template v-if="currentPage === 'bet' && inq2nd.list.length">
                    <table-2nd
                        :list="control2ndData"
                        :total="inq2nd.total"
                        :counts="inq2nd.counts"
                    />

                    <infinite-loading
                        v-if="showInfinite"
                        ref="infiniteLoading"
                        @infinite="infiniteHandler"
                    >
                        <span slot="no-more" />
                        <span slot="no-results" />
                    </infinite-loading>
                </template>

                <div
                    v-if="currentPage === 'main' && mainNoData"
                    :class="$style['no-data']"
                >
                    <img src="/static/image/_new/mcenter/ic_nodata.png" />
                    <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
                </div>
            </template>
        </game-record>
    </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import { format } from 'date-fns';
import EST from "@/lib/EST";
import gameRecord from "@/components/common/mcenter/gameRecord";
import table1st from "./table1st";
import table2nd from "./table2nd";

export default {
    components: {
        InfiniteLoading,
        gameRecord,
        table1st,
        table2nd
    },
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
        const now = EST(new Date(), "", true);

        return {
            fromDate: Vue.moment(now)
                .add(-60, "days")
                .format("YYYY-MM-DD"),
            endDate: Vue.moment(now).format("YYYY-MM-DD"),
            inqGame: "",
            inqStart: Vue.moment(now).format("YYYY-MM-DD"),
            inqEnd: Vue.moment(now).format("YYYY-MM-DD")
        };
    },
    computed: {
        ...mapGetters({
            memInfo: "getMemInfo"
        }),
        mainClass() {
            const site = `site-${this.memInfo.user.domain}`;

            return {
                [this.$style["main-wrap"]]: true,
                [this.$style[site]]: this.$style[site],
                [this.$style["preset-color"]]: !this.$style[site]
            };
        }
    },
    filters: {
        dateFormat(value) {
            return Vue.moment(value).format('YYYY/MM/DD')
        }
    },
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
