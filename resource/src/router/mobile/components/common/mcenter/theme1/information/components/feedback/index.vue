<template>
    <feedback :select-type-id.sync="currentTypeId" :class="colorClass">
        <template scope="{ titleTab, fieldList, paramsData, goImageRelease, stepText, submitData, errorField, setInputValue, getRepliedList, repliedList, unReadCount, setMailRead, deleteStatus, getCurrentMassage, selectDeleteData, currentData, changeStatus, deleteList, setDeleteState, feedbackList, formStatus, setFormStatus }">
            <div v-if="!currentData">
                <div :class="$style['feedback-button-wrap']">
                    <div
                        v-for="(tabInfo, keyValue) in titleTab"
                        :key="`${keyValue}-tab-index`"
                        :class="[$style['tab-button'], { [$style['is-current']]: keyValue === $route.query.type }]"
                        @click="changeType(keyValue); setFormStatus()"
                    >
                        {{ tabInfo.value }}
                        <span v-if="keyValue === 'mailbox' && unReadCount > 0"> ( {{ unReadCount }} ) </span>
                    </div>
                    <div :class="$style['add-btn']" @click="setFormStatus('pop')"><div><span>+</span></div></div>
                </div>
                <div v-if="formStatus" :class="$style['field-wrap']">
                    <div
                        v-for="(info, objKey) in fieldList"
                        :key="`${objKey}-field`"
                        :class="[$style['feedback-field'], 'clearfix', { [$style['is-content']]: objKey === 'content' }]"
                    >
                        <div :class="$style['field-title']">
                            <span v-if="info.showStar" :class="$style['field-star-icon']">*</span>
                            <span>{{ info.title }}</span>
                        </div>
                        <select
                            v-if="objKey === 'type_id'"
                            v-model="selectType"
                            :class="$style['field-select']"
                            :placeholder="$text('S_WRITE_QUESTION_TYPE', '请选择您要反馈的问题类别')"
                            :options="fieldList[objKey].data"
                        >
                            <option
                                disabled
                                selected
                                hidden
                                value=""
                            >
                                {{ $text('S_WRITE_QUESTION_TYPE', '请选择您要反馈的问题类别') }}
                            </option>
                            <option
                                v-for="data in fieldList[objKey].data"
                                :key="data.id"
                                :value="data"
                            >
                                {{ data.content }}
                            </option>
                        </select>
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
                    <div :class="$style['feedback-btn']" @click="submitData">{{ $text('S_FORM_SUBMIT', '送出') }}</div>
                </div>
                <div v-else-if="$route.query.type === 'feedbackRecord'" :class="$style['field-wrap']">
                    <div
                        v-for="(reply, idx) in feedbackList"
                        :key="`reply-${idx}`"
                        :class="[$style['message-item'], { [$style.active] : deleteStatus }, { [$style['no-read']] : !reply.reply_read_at } ]"
                        @click="setMailRead(reply.id); getCurrentMassage(reply, 'feedback'); $emit('changeTitle', $text('S_FEEDBACK_RECORD', '发送纪录'))"
                    >
                        <div :class="[$style['message-item-top'], 'clearfix']">
                            <div :class="$style['message-item-category']">
                                {{ reply.title }}
                            </div>
                            <div :class="$style['message-item-time']">
                                {{ EST(reply.created_at) }}
                            </div>
                        </div>
                        <!-- eslint-disable vue/no-v-html -->
                        <div :class="$style['message-item-title']" v-html="reply.content" />
                        <!-- eslint-enable vue/no-v-html -->
                    </div>
                    <div :class="$style['message-delete-wrap']" />
                    <p v-if="feedbackList.length < 1" :class="$style['no-message']">{{ $text('S_NO_MESSAGE', '无资料') }}</p>
                </div>
                <div v-else-if="$route.query.type === 'mailbox'" :class="[$style['field-wrap'], $style['field-wrap-mailbox']]">
                    <div :class="[$style['message-delete-wrap'], 'clearfix']">
                        <div
                            :class="[$style['message-cancel'], { [$style.active] : deleteStatus } ]"
                            @click="setDeleteState"
                        >
                            <span :class="$style['message-cancel-text']">{{ $text('S_CANCEL', '取消') }}</span>
                        </div>
                        <div
                            v-if="repliedList.length"
                            :class="$style['message-delete']"
                            @click="selectDeleteData(deleteList)">
                            <icon
                                name="regular/trash-alt"
                                width="24"
                                height="21"
                            />
                        </div>
                    </div>
                    <div
                        v-for="(reply, idx) in repliedList"
                        :key="`reply-${idx}`"
                        :class="[$style['message-item'], { [$style.active] : deleteStatus }, { [$style['no-read']] : !reply.reply_read_at } ]"
                        @click="setMailRead(reply.id); getCurrentMassage(reply, 'mailbox'); $emit('changeTitle', $text('S_MAILBOX', '收件箱'))"
                    >
                        <div
                            v-if="deleteStatus"
                            :class="$style['message-item-check']"
                            @click="changeStatus(reply.id)"
                        >
                            <img :src="`/static/image/mobile/mcenter/btn_check_${deleteList.includes(reply.id)? 's' : 'n'}.png`" />
                        </div>
                        <div :class="[$style['message-item-top'], 'clearfix']">
                            <div :class="$style['message-item-category']">
                                {{ reply.reply_title }}
                            </div>
                            <div :class="$style['message-item-time']">
                                {{ reply.replied_at }}
                            </div>
                        </div>
                        <!-- eslint-disable vue/no-v-html -->
                        <div :class="$style['message-item-title']" v-html="reply.reply_content" />
                        <!-- eslint-enable vue/no-v-html -->
                    </div>
                    <p v-if="repliedList.length < 1" :class="$style['no-message']">{{ $text('S_NO_MESSAGE', '无资料') }}</p>
                </div>
            </div>
            <context
                v-else
                :datalist="currentData"
            />
        </template>
    </feedback>
</template>

<script>
import { mapGetters } from 'vuex';
import feedback from '@/components/common/mcenter/feedback';
import EST from '@/lib/EST';

export default {
    components: {
        context: () => import(/* webpackChunkName: 'commonContext' */ './components/context'),
        feedback
    },
    data() {
        return {
            selectType: '',
            currentTab: 'mailbox'
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            memInfo: 'getMemInfo'
        }),
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        },
        currentTypeId: {
            get() {
                return this.selectType ? this.selectType.id : '';
            },
            set(value) {
                this.selectType = value;
            }
        }
    },
    watch: {
        /* eslint-disable object-shorthand */
        '$route.params.pid'() {
            if (!this.$route.params.pid) {
                this.$emit('changeTitle', this.$text('S_MSG_CENTER', '信息中心'));
            }
        }
    },
    created() {
        if (!this.$route.query.type) {
            this.$route.query.type = 'mailbox';
        }
    },
    methods: {
        changeType(type) {
            this.$router.push(`/mobile/mcenter/information/feedback?type=${type}`);
        },
        EST
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module />
