<template>
    <div class="info-message">
        <div class="main-title clearfix">
            <h1>{{ $t('S_PERSONAL_MESSAGE') }}</h1>
        </div>
        <div class="msg-fliter-box">
            <div class="current-message-type">
                <model-select
                    v-model="tempMsgType"
                    :options="msgTypeOptions"
                    :placeholder="$t('S_ALL')"
                />
            </div>
            <div class="msg-filter-btn" @click="updateCurMsgType">{{ $t('S_INQUIRE') }}</div>
        </div>
        <table v-if="hasReceive" :class="['main-table', { 'no-data': !filterMessageData.length }]">
            <thead class="mcenter-pc">
                <tr>
                    <th class="number">{{ $t('S_NUMBER_NO') }}</th>
                    <th class="category">{{ $t('S_CATEGORY') }}</th>
                    <th class="title">{{ $t('S_CR_HEADLINE') }}</th>
                    <th class="date">{{ $t('S_ADDDATE_MSG') }}</th>
                    <th class="status">{{ $t('S_STATUS') }}</th>
                    <th class="delete">{{ $t('S_FUNCTION') }}</th>
                </tr>
            </thead>
            <tbody v-if="filterMessageData.length === 0">
                <tr class="message-list">
                    <td colspan="6">
                        {{ $t('S_NO_DATA_YET') }}
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <template v-for="(list, index) in curMsgList">
                    <tr
                        :key="`pc-title-${index}`"
                        :class="`message-list mcenter-pc ${!list.read ? 'yet' : 'already' } ${selectId == list.id ? 'current' : ''}`"
                        @click="selectMessage(list.id, index)"
                    >
                        <td class="number">{{ index + 1 }}</td>
                        <td class="category">{{ msgTypeOptions[list.kind].text }}</td>
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <td class="title" v-html="list.title" />
                        <td class="date">{{ EST(list.sent_at) }}</td>
                        <td class="status">{{ $t(list.read ? 'S_MSG_READ' : 'S_MSG_UNREAD') }}</td>
                        <td class="delete">
                            <button @click.stop="deleteMessgae(list.id)"><icon name="trash-alt" /></button>
                        </td>
                    </tr>
                    <tr
                        v-if="selectId == list.id"
                        :key="`pc-content-${index}`"
                        class="message-detail mcenter-pc"
                    >
                        <!-- eslint-disable vue/no-v-html -->
                        <td colspan="6" v-html="messageContent" />
                        <!-- eslint-enable vue/no-v-html -->
                    </tr>
                    <table :key="`pad-${index}`" class="pad">
                        <tr :class="`message-list ${!list.read ? 'yet' : 'already' } ${selectId == list.id ? 'current' : ''}`" @click="selectMessage(list.id, index)">
                            <td colspan="2" class="number">{{ index + 1 }}</td>
                        </tr>
                        <tr :class="`message-list ${!list.read ? 'yet' : 'already' } ${selectId == list.id ? 'current' : ''}`" @click="selectMessage(list.id, index)">
                            <td class="category caption">{{ $t('S_CATEGORY') }}</td>
                            <td class="category content">{{ msgTypeOptions[list.kind].text }}</td>
                        </tr>
                        <tr :class="`message-list ${!list.read ? 'yet' : 'already' } ${selectId == list.id ? 'current' : ''}`" @click="selectMessage(list.id, index)">
                            <td class="title caption">{{ $t('S_CR_HEADLINE') }}</td>
                            <!-- eslint-disable-next-line vue/no-v-html -->
                            <td class="title content" v-html="list.title" />
                        </tr>
                        <tr :class="`message-list ${!list.read ? 'yet' : 'already' } ${selectId == list.id ? 'current' : ''}`" @click="selectMessage(list.id, index)">
                            <td class="date caption">{{ $t('S_ADDDATE_MSG') }}</td>
                            <td class="date content">{{ EST(list.sent_at) }}</td>
                        </tr>
                        <tr :class="`message-list ${!list.read ? 'yet' : 'already' } ${selectId == list.id ? 'current' : ''}`" @click="selectMessage(list.id, index)">
                            <td class="status caption">{{ $t('S_STATUS') }}</td>
                            <td class="status content">{{ $t(list.read ? 'S_MSG_READ' : 'S_MSG_UNREAD') }}</td>
                        </tr>
                        <tr :class="`message-list ${!list.read ? 'yet' : 'already' } ${selectId == list.id ? 'current' : ''}`" @click="selectMessage(list.id, index)">
                            <td class="delete caption">{{ $t('S_FUNCTION') }}</td>
                            <td class="delete content"><button @click.stop="deleteMessgae(list.id)" /></td>
                        </tr>
                        <tr v-if="selectId == list.id" class="message-detail">
                            <!-- eslint-disable vue/no-v-html -->
                            <td colspan="2" v-html="messageContent" />
                            <!-- eslint-enable vue/no-v-html -->
                        </tr>
                    </table>
                </template>
            </tbody>
        </table>
        <div v-if="hasReceive && filterMessageData.length !== 0" class="page-wrap">
            <span :class="`page-first${pageNow === 1 ? ' disable' : ''}`" @click="pageNow === 1 ? '' : pageChange(1)" />
            <span :class="`page-pre${pageNow === 1 ? ' disable' : ''}`" @click="pageNow === 1 ? '' : pageChange(pageNow - 1)" />
            <div class="page-select-wrap">
                <select
                    v-model="pageNow"
                    class="page-select"
                    @change="pageChange(pageNow)"
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
            <span :class="`page-next${pageNow === pageAll ? ' disable' : ''}`" @click="pageNow === pageAll ? '' : pageChange(pageNow + 1)" />
            <span :class="`page-last${pageNow === pageAll ? ' disable' : ''}`" @click="pageNow === pageAll ? '' : pageChange(pageAll)" />
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { ModelSelect } from 'vue-search-select';
import EST from '@/lib/EST';
import mcenter from '@/api/mcenter';

export default {
    components: {
        ModelSelect
    },
    data() {
        return {
            hasReceive: false,
            numMax: 10, // 每頁顯示幾筆
            pageAll: 1, // 外層總頁數
            pageNow: 1, // 外層當前頁
            selectId: '',
            messageData: [],
            messageContent: '',
            tempMsgType: 'all',
            curMsgType: 'all',
            msgTypeOptions: [{ // 站内信下拉式類別選項
                value: 'all', text: this.$t('S_ALL')
            }, {
                value: 'average', text: this.$t('S_AVERAGE_NOTIFICATION')
            }, {
                value: 'promotion', text: this.$t('S_PROMOTION_NOTIFICATION')
            }, {
                value: 'financial', text: this.$t('S_FINANCIAL_NOTIFICAITION')
            }, {
                value: 'system', text: this.$t('S_SYSTEM_NOTIFICATION')
            }, {
                value: 'others', text: this.$t('S_OTHER_NOTIFICATION')
            }]
        };
    },
    computed: {
        curMsgList() {
            const first = (this.pageNow - 1) * this.numMax;
            const last = this.pageNow * this.numMax;
            return this.filterMessageData.slice(first, last);
        },
        filterMessageData() {
            if (this.curMsgType === 'all') {
                return this.messageData;
            }

            return this.messageData.filter((info) => this.msgTypeOptions[info.kind].value === this.curMsgType);
        }
    },
    watch: {
        filterMessageData() {
            this.pageNow = 1;
            if (this.filterMessageData.length === 0) {
                this.pageAll = 1;
                return;
            }

            this.pageAll = Math.ceil(this.filterMessageData.length / this.numMax);
        }
    },
    created() {
        this.actionSetIsLoading(true);
        this.getMessgae();
    },
    methods: {
        getMessgae() {
            mcenter.message({
                success: (response) => {
                    this.messageData = response.ret;
                    this.hasReceive = true;
                }
            })
                .then(() => {
                    this.actionSetIsLoading(false);
                });
        },
        updateCurMsgType() {
            if (this.curMsgType !== this.tempMsgType) {
                this.selectId = '';
                this.curMsgType = this.tempMsgType;
            }
        },
        pageChange(page) {
            this.selectId = '';
            this.pageNow = page;
            window.scrollTo(0, 0);
        },
        selectMessage(id, index) {
            this.messageContent = '';
            mcenter.messageContent({
                success: (response) => {
                    this.messageContent = response.ret.content.replace(/\n/ig, '<br/>');
                    if (!this.messageData[index].read) {
                        this.messageData[index].read = true;
                    }

                    this.actionSetMcenterMsgCount();
                }
            }, id);
            if (this.selectId === id) {
                this.selectId = '';
                return;
            }

            this.selectId = id;
        },
        deleteMessgae(id) {
            const text = window.confirm(`${this.$t('S_MSG_DELETED')}?`);

            if (!text) {
                return;
            }

            this.selectId = '';
            this.hasReceive = false;
            mcenter.messageDelete({
                success: () => {
                    this.getMessgae();
                    this.actionSetMcenterMsgCount();
                }
            }, id);
        },
        EST,
        ...mapActions([
            'actionSetMcenterMsgCount',
            'actionSetIsLoading'
        ])
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
