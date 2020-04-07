<template>
    <div :class="[$style['game-record-wrap'], $style[`theme-${siteConfig.MCENTER_COLOR}`]]">
        <div :class="$style.title">
            <template v-for="(crumb, index) in breadcrumb">
                <span
                    :key="crumb.id"
                    :class="crumb.clickable && $style['is-link']"
                    @click="() => { crumb.clickable && onCrumbClick(crumb.id); }"
                >
                    {{ crumb.text }}
                </span>
                {{ breadcrumb.length > index + 1 ?' > ' : '' }}
            </template>
        </div>
        <div
            v-if="currentPage === 'bet' || currentPage === 'detail'"
            :class="$style['btn-back']"
            @click="onBackClick"
        >
            {{ $text('S_BACK_PAGE', '上一页') }}
        </div>
        <div v-if="hasSearchBar" :class="$style.form">
            <div :class="`${$style['field-account']} ui input`">
                <input
                    v-model="inqAcc"
                    :placeholder="$text('S_S_FIRST_LEVEL_FRIEND', '一级好友帐号')"
                    type="text"
                />
            </div>
            <div :class="$style['inq-game']">
                <model-select
                    v-model="inqGame"
                    :options="gameList"
                    :placeholder="$t('S_ALL')"
                />
            </div>
            <datepicker
                v-model="inqStartDate"
                :language="dateLang"
                :disabled="{ from: now, to: fromDate }"
                :monday-first="true"
                :wrapper-class="`${$style['date-picker']} ui input`"
                :calendar-class="`${$style.calendar}`"
                format="yyyy-MM-dd"
            />
            <div :class="$style.line">-</div>
            <datepicker
                v-model="inqEndDate"
                :language="dateLang"
                :disabled="{ from: now, to: inqStartDate }"
                :monday-first="true"
                :wrapper-class="`${$style['date-picker']} ui input`"
                :calendar-class="`${$style.calendar}`"
                format="yyyy-MM-dd"
            />
            <div :class="$style['btn-inquire']" @click="onInquireClick">{{ $t('S_INQUIRE') }}</div>
        </div>
        <div :class="$style.content">
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
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ModelSelect } from 'vue-search-select';
import datepicker from 'vuejs-datepicker';
import mixinIndex from './js/mixinIndex';
import pagination from '../../template/common/pagination';
import table1st from './table1st';
import table2nd from './table2nd';
import table3rd from './table3rd';

export default {
    components: {
        ModelSelect,
        datepicker,
        pagination,
        table1st,
        table2nd,
        table3rd
    },
    mixins: [mixinIndex],
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
