<template>
    <feedback :select-type-id.sync="currentTypeId" :class="$style[curTemplate]">
        <!-- eslint-disable vue/no-template-shadow -->
        <template scope="{ titleTab, fieldList, paramsData, goImageRelease, stepText, submitData, errorField, setInputValue, getRepliedList, repliedList, unReadCount, deleteReplied, openMailIndex, setMailRead, pageInfo, numMax, feedbackList, formStatus, setFormStatus, getFeedbackRecord }">
            <div :class="[$style.tabbed, $style.round ,'clearfix']">
                <li
                    v-for="(tabInfo, keyValue) in titleTab"
                    :key="`${keyValue}-tab-index`"
                    :class="[$style['tab-button'], { [$style['active']]: keyValue === curTag }]"
                    @click="changeType(keyValue); setFormStatus()"
                >
                    <div
                        v-if="keyValue === 'mailbox'"
                        :class="$style['button-text']"
                        :title="`${tabInfo.value} ( ${unReadCount} )`"
                    >
                        <span>{{ tabInfo.value }}</span>
                        <span v-if="unReadCount > 0"> ( {{ unReadCount }} ) </span>
                    </div>
                    <div v-else :class="$style['button-text']">{{ tabInfo.value }}</div>
                </li>
                <button :class="$style['add-btn']" @click="setFormStatus('pop')">+{{ $text('S_ADD', '新增') }}</button>
                <div :class="[$style['tab-line'], {[$style['is-mail']] : curTag === 'mailbox' }]" />
            </div>
            <div v-if="formStatus" :class="[$style['field-wrap'], $style['feedback-form-wrap'], { [$style.pop]: !isMobile }]">
                <div
                    v-for="(info, objKey) in fieldList"
                    :key="`${objKey}-field`"
                    :class="[$style['feedback-field'], 'clearfix']"
                >
                    <div :class="$style['field-title']">
                        <span v-if="info.showStar" :class="$style['field-star-icon']">*</span>
                        <span>{{ info.title }}</span>
                    </div>
                    <Multiselect
                        v-if="objKey === 'type_id'"
                        v-model="selectType"
                        :class="$style['field-select']"
                        :placeholder="$text('S_WRITE_QUESTION_TYPE', '请选择您要反馈的问题类别')"
                        :options="fieldList[objKey].data"
                        :searchable="false"
                        :show-labels="false"
                        track-by="id"
                        label="content"
                    />
                    <textarea
                        v-else-if="objKey === 'content'"
                        :value="paramsData[objKey]"
                        :class="$style['field-textarea']"
                        :placeholder="$text('S_WRITE_QUESTION', '请描述您的问题')"
                        maxlength="1000"
                        @input="setInputValue($event.target.value, objKey)"
                    />
                    <input
                        v-else
                        :value="paramsData[objKey]"
                        :class="[$style['field-input'], { [$style['is-error']]: errorField[objKey] }]"
                        :placeholder="$text('S_TITLE_WRITE', '请输入标题')"
                        maxlength="100"
                        @input="setInputValue($event.target.value, objKey)"
                    />
                </div>
                <div :class="$style['image-release-btn']" @click="goImageRelease">{{ $text('S_IMAGE_RELEASE', '上传图片') }}</div>
                <div :class="$style['feedback-tip-wrap']">
                    <div
                        v-for="(text, index) in stepText"
                        :key="`tip-${index}`"
                        :class="$style['tip-text']"
                    >
                        {{ text }}
                    </div>
                </div>
                <div :class="[$style['feedback-btn-list'], 'clearfix']">
                    <div :class="$style['feedback-btn']" @click="submitData">{{ $text('S_FORM_SUBMIT', '送出') }}</div>
                    <div :class="$style['feedback-btn']" @click="setFormStatus">{{ $text('S_CANCEL', '取消') }}</div>
                </div>
            </div>
            <div v-else-if="$route.query.type === 'feedbackRecord'" :class="$style['field-wrap']">
                <table :class="$style['feedback-table']">
                    <thead :class="$style['feedback-thead']">
                        <tr :class="$style['feedback-thead-wrap']">
                            <th :class="[$style['feedback-type'], $style['index']]">{{ $text('S_NUMBER_NO', '序') }}</th>
                            <th :class="[$style['feedback-type'], $style['title']]">{{ $text('S_TITLE', '標題') }}</th>
                            <th :class="[$style['feedback-type'], $style['time']]">{{ $text('S_ADDDATE_MSG', '发送时间') }}</th>
                        </tr>
                    </thead>
                    <tbody
                        v-for="(reply, idx) in feedbackList.slice((pageInfo.pageNow - 1) * numMax, pageInfo.pageNow * numMax)"
                        :key="`reply-${idx}`"
                        :class="$style['feedback-tbody']"
                    >
                        <tr :class="$style['feedback-tbody-wrap']">
                            <td :class="[$style['feedback-type'], $style['index']]">{{ idx + 1 }}</td>
                            <td :class="[$style['feedback-type'], $style['title']]" @click="setMailRead(reply.id)">{{ reply.title }}</td>
                            <td :class="[$style['feedback-type'], $style['time']]">{{ EST(reply.created_at) }}</td>
                        </tr>
                        <tr v-if="openMailIndex === reply.id" :class="$style['feedback-tbody-wrap']">
                            <td :class="$style['feedback-content']" colspan="5">
                                <!-- eslint-disable vue/no-v-html -->
                                <div :class="$style['content-top']" v-html="reply.content.replace(/\n/ig, '<br/>')" />
                                <!-- eslint-enable vue/no-v-html -->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="feedbackList.length < 1" :class="$style.empty">{{ $text('S_NO_DATA_YET', '暂无资料') }}</div>
                <div :class="$style['page-wrap']">
                    <span :class="[$style['page-first'], { [$style['disable']]: pageInfo.pageNow === 1 }]" @click="pageInfo.pageNow === 1 ? '' : getFeedbackRecord('pageChange', 1)" />
                    <span :class="[$style['page-pre'], { [$style['disable']]: pageInfo.pageNow === 1 }]" @click="pageInfo.pageNow === 1 ? '' : getFeedbackRecord('pageChange', pageInfo.pageNow - 1)" />
                    <div :class="$style['page-select-wrap']">
                        <select
                            v-model="pageInfo.pageNow"
                            :class="$style['page-select']"
                            @change="getFeedbackRecord('pageChange', pageInfo.pageNow)"
                        >
                            <option
                                v-for="num in pageInfo.pageAll"
                                :key="num"
                                :value="num"
                            >
                                {{ num }}
                            </option>
                        </select>
                        <span :class="$style['page-total']">/&nbsp;{{ pageInfo.pageAll }}</span>
                    </div>
                    <span :class="[$style['page-next'], { [$style['disable']]: pageInfo.pageNow === pageInfo.pageAll }]" @click="pageInfo.pageNow === pageInfo.pageAll ? '' : getFeedbackRecord('pageChange', pageInfo.pageNow + 1)" />
                    <span :class="[$style['page-last'], { [$style['disable']]: pageInfo.pageNow === pageInfo.pageAll }]" @click="pageInfo.pageNow === pageInfo.pageAll ? '' : getFeedbackRecord('pageChange', pageInfo.pageAll)" />
                </div>
            </div>
            <div v-else :class="$style['field-wrap']">
                <table :class="$style['feedback-table']">
                    <thead :class="$style['feedback-thead']">
                        <tr :class="$style['feedback-thead-wrap']">
                            <th :class="[$style['feedback-type'], $style['index']]">{{ $text('S_NUMBER_NO', '序') }}</th>
                            <th :class="[$style['feedback-type'], $style['title']]">{{ $text('S_TITLE', '標題') }}</th>
                            <th :class="[$style['feedback-type'], $style['time']]">{{ $text('S_ADDDATE_MSG', '发送时间') }}</th>
                            <th :class="[$style['feedback-type'], $style['status']]">{{ $text('S_STATUS', '状态') }}</th>
                            <th :class="[$style['feedback-type'], $style['operate']]">{{ $text('S_FUNCTION', '功能') }}</th>
                        </tr>
                    </thead>
                    <tbody
                        v-for="(reply, idx) in repliedList.slice((pageInfo.pageNow - 1) * numMax, pageInfo.pageNow * numMax)"
                        :key="`reply-${idx}`"
                        :class="$style['feedback-tbody']"
                    >
                        <tr :class="$style['feedback-tbody-wrap']">
                            <td :class="[$style['feedback-type'], $style['index']]">{{ idx + 1 }}</td>
                            <td :class="[$style['feedback-type'], $style['title']]" @click="setMailRead(reply.id)">{{ reply.reply_title }}</td>
                            <td :class="[$style['feedback-type'], $style['time']]">{{ reply.replied_at }}</td>
                            <td :class="[$style['feedback-type'], $style['status']]">
                                <span v-if="!reply.reply_read_at" :class="$style['msg-unread']">{{ $text('S_MSG_UNREAD', '未读') }}</span>
                                <span v-else :class="$style['msg-read']">{{ $text('S_MSG_READ', '已读') }}</span>
                            </td>
                            <td :class="[$style['feedback-type'], $style['operate']]">
                                <button :class="$style['operate-icon']" @click="deleteReplied(reply.id)">
                                    <icon
                                        name="trash-alt"
                                        width="18"
                                        height="18"
                                    />
                                </button>
                            </td>
                        </tr>
                        <tr v-if="openMailIndex === reply.id" :class="$style['feedback-tbody-wrap']">
                            <td :class="$style['feedback-content']" colspan="5">
                                <!-- eslint-disable vue/no-v-html -->
                                <div :class="$style['content-top']" v-html="reply.reply_content" />
                                <div :class="$style['content-bottom']">
                                    <span>| {{ $text('S_FEEDBACK', '意见反馈') }} {{ $text('S_ADDDATE_MSG', '发送时间') }} {{ reply.created_at }}</span>
                                    <div v-html="reply.title" />
                                    <div v-html="reply.content.replace(/\n/ig, '<br/>')" />
                                </div>
                                <!-- eslint-enable vue/no-v-html -->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="repliedList.length < 1" :class="$style.empty">{{ $text('S_NO_DATA_YET', '暂无资料') }}</div>
                <div :class="$style['page-wrap']">
                    <span :class="[$style['page-first'], { [$style['disable']]: pageInfo.pageNow === 1 }]" @click="pageInfo.pageNow === 1 ? '' : getRepliedList('pageChange', 1)" />
                    <span :class="[$style['page-pre'], { [$style['disable']]: pageInfo.pageNow === 1 }]" @click="pageInfo.pageNow === 1 ? '' : getRepliedList('pageChange', pageInfo.pageNow - 1)" />
                    <div :class="$style['page-select-wrap']">
                        <select
                            v-model="pageInfo.pageNow"
                            :class="$style['page-select']"
                            @change="getRepliedList('pageChange', pageInfo.pageNow)"
                        >
                            <option
                                v-for="num in pageInfo.pageAll"
                                :key="num"
                                :value="num"
                            >
                                {{ num }}
                            </option>
                        </select>
                        <span :class="$style['page-total']">/&nbsp;{{ pageInfo.pageAll }}</span>
                    </div>
                    <span :class="[$style['page-next'], { [$style['disable']]: pageInfo.pageNow === pageInfo.pageAll }]" @click="pageInfo.pageNow === pageInfo.pageAll ? '' : getRepliedList('pageChange', pageInfo.pageNow + 1)" />
                    <span :class="[$style['page-last'], { [$style['disable']]: pageInfo.pageNow === pageInfo.pageAll }]" @click="pageInfo.pageNow === pageInfo.pageAll ? '' : getRepliedList('pageChange', pageInfo.pageAll)" />
                </div>
            </div>
            <div v-if="formStatus && !isMobile" :class="$style.mask" />
        </template>
    </feedback>
</template>

<script>
import { mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';
import isMobile from '@/lib/is_mobile';
import feedback from '@/components/common/agent/feedback';
import EST from '@/lib/EST';

export default {
    components: {
        Multiselect,
        feedback
    },
    data() {
        return {
            selectType: '',
            formStatus: false,
            isMobile: isMobile()
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        }),
        currentTypeId: {
            get() {
                return this.selectType ? this.selectType.id : '';
            },
            set(value) {
                this.selectType = value;
            }
        },
        curTemplate() {
            if (this.siteConfig.MCENTER_COLOR === '519') {
                return 'theme-519';
            }

            if (this.siteConfig.MCENTER_COLOR === 'theme3') {
                return 'theme-theme3';
            }

            return `theme-${this.siteConfig.MCENTER_COLOR}`;
        },
        curTag() {
            return this.$route.query.type || 'mailbox';
        }
    },
    created() {
        if (!this.$route.query.type) {
            this.$route.query.type = 'mailbox';
        }
    },
    methods: {
        changeType(type) {
            if (this.isMobile) {
                this.$router.push(`/mobile/agcenter/feedBack?type=${type}`);
                return;
            }

            this.$router.push(`/agent/feedBack?type=${type}`);
        },
        EST
    }
};
</script>

<style src="../css/index.scss" lang="scss" module></style>
