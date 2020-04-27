<template>
    <div>
        <template v-if="!$route.params.id">
            <template v-if="isReceive">
                <div v-if="feedbackList.length === 0" :class="$style['no-feedback']">
                    <img src="/static/image/_new/mcenter/feedback/no_feedback.png" />
                    <p>{{ $text('S_NO_FEEDBACK', '暂无反馈记录') }}</p>
                    <button @click="$router.push({ name: 'mcenter-feedback' })">{{ $text('S_SEND_FEEDBACK', '立即反馈') }}</button>
                </div>
                <ul v-else :class="$style['feedback-list']">
                    <li
                        v-for="message in feedbackList"
                        :key="message.id"
                        :class="[$style['feedback-item'], 'clearfix']"
                        @click="getCurrentMassage(message)"
                    >
                        <div :class="$style['feedback-icon']">
                            <img :src="`/static/image/_new/mcenter/feedback/question_${iconList[memInfo.user.domain][message.type_id] ? iconList[memInfo.user.domain][message.type_id] : 8}.png`" />
                        </div>
                        <div :class="$style['feedback-content']">
                            <div class="clearfix">
                                <h3 :class="$style['title']">{{ message.title }}</h3>
                                <p :class="$style['time']">{{ message.created_at | getTime }}</p>
                            </div>
                            <p :class="$style['question']">{{ message.content }}</p>
                        </div>
                    </li>
                </ul>
            </template>
        </template>
        <template v-else>
            <div :class="$style['feedback-detail']">
                <div :class="$style['detail-content']">
                    <div :class="[$style['detail-title'], 'clearfix']">
                        <img :src="`/static/image/_new/mcenter/feedback/question_${iconList[memInfo.user.domain][currentFeedback.type_id] ? iconList[memInfo.user.domain][currentFeedback.type_id] : 8}.png`" />
                        <h3>{{ currentFeedback.title }}</h3>
                    </div>
                    <div :class="[$style['detail-question'], 'clearfix']">
                        <img :class="$style['detail-icon']" :src="`/static/image/_new/mcenter/default/avatar_${memInfo.user.image}.png`" />
                        <div :class="$style['question-info']">
                            <div :class="$style['question-name']">
                                {{ memInfo.user.username }}
                            </div>
                            <p :class="$style['question-description']" v-html="currentFeedback.content" />
                            <p :class="$style['question-time']">{{ currentFeedback.created_at | getDeatilTime }}</p>
                        </div>
                    </div>
                    <div v-if="currentFeedback.reply_content" :class="[$style['detail-service'], 'clearfix']">
                        <img :class="$style['detail-icon']" src="/static/image/_new/mcenter/feedback/feedback_yabo.png" />
                        <div :class="$style['question-info']">
                            <div :class="$style['question-name']">
                                亚博直播
                            </div>
                            <p :class="$style['question-description']"  v-html="currentFeedback.reply_content" />
                            <p :class="$style['question-time']">{{ currentFeedback.replied_at | getDeatilTime }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import mcenter from '@/api/mcenter';
import ajax from '@/lib/ajax';
import { API_FEEDBACK_REPLIED_LIST } from '@/config/api';
import EST from '@/lib/EST';

export default {
    filters: {
        getTime(time) {
            if (!time) {
                return '';
            }

            return EST(time, 'YYYY-MM-DD');
        },
        getDeatilTime(time) {
            if (!time) {
                return '';
            }

            return EST(time);
        }
    },
    data() {
        return {
            feedbackList: [],
            currentFeedback: {},
            unReadCount: 0,
            repliedList: [],
            isReceive: false,
            iconList: {
                500015: {
                    260: 1,
                    261: 2,
                    262: 3,
                    263: 4,
                    264: 5,
                    265: 6,
                    266: 7
                },
                69: {
                    90: 1,
                    91: 2,
                    92: 3,
                    93: 4,
                    94: 5,
                    95: 6,
                    96: 7
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
        // currentData() {
        //     if (!this.$route.params.pid) {
        //         return '';
        //     }

        //     return this.currentFeedback;
        // }
    },
    created() {
        this.getFeedbackRecord();
        this.getRepliedList();
    },
    methods: {
        getFeedbackRecord() {
            mcenter.feedbackRecord({
                success: (response) => {
                    this.isReceive = true;
                    this.feedbackList = response.ret;
                }
            });
        },
        getCurrentMassage(content) {
            this.currentFeedback = this.repliedList.find((item) => item.id === content.id) || content;
            this.$router.push(`/mobile/mcenter/feedback/feedbackList/${content.id}`);
        },
        getRepliedList() {
            ajax({
                method: 'get',
                url: API_FEEDBACK_REPLIED_LIST,
                errorAlert: false
            }).then((response) => {
                if (response.result !== 'ok') {
                    return;
                }
                this.repliedList = response.ret;
            });
        }
    }
};
</script>

<style lang="scss" src="./css/feedbackList.module.scss" module />
