<template>
    <div>
        <div :class="$style['question-category']">
            {{ $text('S_QUESTION_TYPE', '问题类型') }}
        </div>
        <div :class="$style['select-category']" @click="isShow = true">
            <img
                v-if="currentIndex !== ''"
                :class="$style['select-icon']"
                :src="`/static/image/_new/mcenter/feedback/question_${iconList[memInfo.user.domain][paramsData.type_id] ? iconList[memInfo.user.domain][paramsData.type_id] : 8}.png`"
            />
            <span :class="{[$style['select-active']] : paramsData.title}">
                {{ paramsData.title || $text('S_SELECT_QUESTION_CATEGORY', '请选择问题类型') }}
            </span>
            <img :class="$style['arrow-icon']" src="/static/image/_new/common/arrow_next.png" />
        </div>
        <div :class="$style['question-description']">
            {{ $text('S_DESCRIBE_QUESTION', '问题描述') }} <span :class="$style['context-limit']">({{ contextLimit }})</span>
        </div>
        <div :class="$style['feedback-content']">
            <textarea
                :value="paramsData.content"
                :placeholder="$t('S_DESCRIBE_PROBLEM').replace('%s', 20)"
                minlength="20"
                maxlength="200"
                @input="setValue($event.target.value)"
            />
            <span :class="$style['text-count']">{{ paramsData.content.length }}/200</span>
            <div v-if="popStatus" :class="$style['pop-message']" v-html="message" />
        </div>
        <div :class="$style['feedback-img']">
            <!-- <div :class="$style['img-count']">0/3</div> -->
            <div :class="$style['img-wrap']">
                <img src="/static/image/_new/mcenter/img_upload.png" @click="goImageRelease" />
            </div>
            <div :class="$style['feedback-tip-wrap']">
                <div
                    v-for="(text, index) in stepText"
                    :key="`tip-${index}`"
                    :class="$style['tip-text']"
                >
                    {{ text }}
                </div>
            </div>
        </div>
        <div
            :class="[$style['submit'], {[$style['disabled']] : paramsData.content.length < 20}]"
            @click="submitFeedback"
        >
            {{ $text('S_SUBMIT', '提交') }}
        </div>
        <div v-if="isShow" :class="$style['pop-wrap']">
            <div :class="$style['pop-mask']" />
            <div :class="$style['pop-menu']">
                <div :class="$style['pop-title']">
                    <span @click="isShow = false">{{ $text('S_CANCEL', '取消') }}</span>
                    {{ $text('S_QUESTION_CATEGORY', '选择问题类型') }}
                </div>
                <ul :class="$style['pop-list']">
                    <li
                        v-for="(item, index) in typeList"
                        :key="item.id"
                        @click="getCategory(item, index)"
                    >
                        <img :src="`/static/image/_new/mcenter/feedback/question_${iconList[memInfo.user.domain][item.id] ? iconList[memInfo.user.domain][item.id] : 8}.png`" />
                        {{ item.content }}
                        <icon
                            v-if="item.id === paramsData.type_id"
                            :class="$style['select-check']"
                            name="check"
                        />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';
import { API_FEEDBACK_TYPE_LIST, API_FEEDBACK_CREATED } from '@/config/api';

export default {
    data() {
        return {
            paramsData: {
                type_id: '',
                title: '',
                content: ''
            },
            currentIndex: '',
            typeList: [],
            isShow: false,
            popStatus: false,
            stepText: [
                `${this.$text('S_FEEDBACK_TIP01', '步骤一： 点击「上传图片」前往网址')} (https://imgbb.com/)。`,
                this.$text('S_FEEDBACK_TIP02', '步骤二： 将图片上传并获取图片网址链结。'),
                this.$text('S_FEEDBACK_TIP03', '步骤三： 将获取的网址链结贴至对话输入框内。'),
                this.$text('S_FEEDBACK_TIP04', '特别说明： 部分浏览器不支援 拖曳 上传图片，请使用上传按钮')
            ],
            message: '',
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
                },
                67: {
                    79: 1,
                    80: 2,
                    81: 3,
                    82: 4,
                    83: 5,
                    84: 6,
                    85: 7
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        contextLimit() {
            return this.$text('S_CONTEXT_LIMIT', {
                replace: [
                    { target: '%s', value: 20 },
                    { target: '%S', value: 200 }
                ]
            });
        }
    },
    created() {
        ajax({
            method: 'get',
            url: API_FEEDBACK_TYPE_LIST,
            errorAlert: false
        }).then((response) => {
            if (response && response.result === 'ok') {
                this.typeList = response.ret;
            }
        });
    },
    methods: {
        setValue(value) {
            this.paramsData.content = value;
        },
        getCategory(info, index) {
            this.paramsData.type_id = info.id;
            this.paramsData.title = info.content;
            this.currentIndex = index;
            this.isShow = false;
        },
        submitFeedback() {
            if (!this.paramsData.title) {
                if (this.popStatus) {
                    return;
                }

                this.message = this.$text('S_SELECT_QUESTION_CATEGORY', '请选择问题类型');
                this.popStatus = true;
                setTimeout(() => {
                    this.popStatus = false;
                }, 2000);
                return;
            }

            ajax({
                method: 'post',
                url: API_FEEDBACK_CREATED,
                params: this.paramsData,
                errorAlert: true
            }).then((response) => {
                if (response && response.result === 'ok') {
                    alert(this.$text('S_FEEDBACK_SUCCESS', '您的意见反馈已送出'));

                    Object.keys(this.paramsData).forEach((info) => {
                        this.paramsData[info] = '';
                    });

                    this.currentIndex = '';
                }
            });
        },
        goImageRelease() {
            const url = 'https://imgbb.com/';
            if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || window.location.hostname === 'yaboxxxapp02.com') {
                if (this.popStatus) {
                    return;
                }

                this.$copyText(url);
                this.message = '「上传图片」链接已复制<br />请使用浏览器打开';
                this.popStatus = true;
                setTimeout(() => {
                    this.popStatus = false;
                }, 2000);
                return;
            }

            window.open(url, 'imageWrap');
        }
    }
};
</script>

<style lang="scss" src="./css/sendFeedback.module.scss" module />
