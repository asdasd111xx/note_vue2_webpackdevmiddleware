<template>
    <mobile-container :header-config="headerConfig" :has-footer="hasFooter">
        <div slot="content" :class="$style['content-wrap']">
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
                                <img src="/static/image/_new/mcenter/feedback/question_0.png" />
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
                            <img src="/static/image/_new/mcenter/feedback/question_0.png" />
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
                            <img :class="$style['detail-icon']" src="/static/image/_new/mcenter/feedback/question_0.png" />
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
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mcenter from '@/api/mcenter';
import mobileContainer from '../../../common/new/mobileContainer';
import ajax from '@/lib/ajax';
import { API_FEEDBACK_REPLIED_LIST } from '@/config/api';
import EST from '@/lib/EST';

export default {
    components: {
        mobileContainer
    },
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
            hasFooter: false,
            feedbackList: [],
            currentFeedback: {},
            unReadCount: 0,
            repliedList: [],
            isReceive: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        headerConfig() {
            return {
                prev: true,
                title: this.$text(...this.$route.params.id ? ['S_FEEDBACK_DETAIL', '反馈详情'] : ['S_MY_FEEDBACK', '我的反馈']),
                onClick: () => { this.$router.back(); }
            };
        }
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
            this.$router.push(`/mobile/mcenter/feedbackList/${content.id}`);
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

<style lang="scss" module>
html {
    font-size: 50px;
}

[v-cloak] {
  display: none;
}

.content-wrap {
  background: #F8F8F7;
  min-height: calc(100vh - 0.86rem);
  position: relative;
}

.no-feedback {
    width: 3.6rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    img {
        display: block;
        max-width: 100%;
    }

    p {
        line-height: 0.44rem;
        margin: 0.32rem 0 0.58rem;
        font-size: 0.32rem;
        color: #A6A9B2;
    }

    button {
        width: 2.8rem;
        height: 0.8rem;
        background: #BD9D7D;
        background-image: -webkit-linear-gradient(right ,#BD9D7D, #F9DDBD);
        background-image: linear-gradient(right ,#BD9D7D, #F9DDBD);
        font-size: 0.28rem;
        color: #FFF;
        font-weight: 700;
        border: none;
        outline: 0;
        border-radius: 0.1rem;
    }
}

.feedback-list {
    padding: 0.22rem 0;
    margin: 0;
}

.feedback-item {
    height: 1.4rem;
    padding: 0 0 0 0.36rem;
    background: #FEFFFE;
    list-style: none;
}

.feedback-icon {
    float: left;
    width: 0.48rem;
    margin-right: 0.28rem;
    position: relative;
    top: 50%;
    transform: translateY(-50%);

    img {
        display: block;
        max-width: 100%;
    }
}

.feedback-content {
    float: left;
    width: calc(100% - 0.76rem);
    height: 1.4rem;
    padding: 0.31rem 0.36rem 0 0;
    border-bottom: 1px solid #EEE;

    .title {
        float: left;
        line-height: 0.38rem;
        margin-bottom: 0;
        font-size: 0.28rem;
        color: #414655;
        font-weight: 700;
    }

    .time {
        float: right;
        line-height: 0.38rem;
        font-size: 0.2rem;
        color: #A6A9B2;
    }

    .question {
        line-height: 0.32rem;
        margin-top: 0.08rem;
        font-size: 0.24rem;
        color: #A6A9B2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.feedback-detail {
    padding-top: 0.22rem;
}

.detail-content {
    padding-left: 0.36rem;
    background: #FEFFFE;
    min-height: calc(100vh - 1.08rem);
}

.detail-title {
    border-bottom: 1px solid #EEE;
    position: relative;

    h3 {
        float: left;
        height: 1.2rem;
        line-height: 1.2rem;
        margin: 0 0 0 0.2rem;
        font-size: 0.28rem;
        font-weight: normal;
        color: #414655;
    }

    img {
        float: left;
        width: 0.48rem;
        height: 0.48rem;
        margin-top: 0.36rem;
    }
}

.detail-question,
.detail-service {
    padding-top: 0.4rem;
}

.detail-icon {
    float: left;
    width: 0.48rem;
    margin-right: 0.28rem;
}

.question-info {
    float: left;
    width: calc(100% - 0.76rem);
    padding: 0 0.36rem 0.18rem 0;
    border-bottom: 1px solid #EEE;
}

.question-name {
    line-height: 0.48rem;
    font-size: 0.28rem;
    color: #414655;
}

.question-description {
    margin-bottom: 0.18rem;
    line-height: 0.36rem;
    font-size: 0.24rem;
    color: #414655;
}

// .question-img {
//     margin: 0.08rem 0 0.2rem;

//     img {
//         width: 1rem;
//         height: 1rem;
//         margin-right: 0.2rem;
//         vertical-align: top;
//     }
// }

.question-time {
    line-height: 0.26rem;
    margin-bottom: 0;
    font-size: 0.2rem;
    color: #A6A9B2;
}
</style>
