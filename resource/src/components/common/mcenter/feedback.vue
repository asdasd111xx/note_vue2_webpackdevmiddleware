<template>
    <div class="mcenter-feedback">
        <slot
            :title-tab="titleTab"
            :field-list="fieldList"
            :params-data="paramsData"
            :go-image-release="goImageRelease"
            :step-text="stepText"
            :submit-data="submitData"
            :error-field="errorField"
            :set-input-value="setInputValue"
            :get-replied-list="getRepliedList"
            :replied-list="repliedList"
            :un-read-count="unReadCount"
            :delete-replied="deleteReplied"
            :open-mail-index="openMailIndex"
            :set-mail-read="setMailRead"
            :page-info="pageInfo"
            :num-max="numMax"
            :delete-status="deleteStatus"
            :get-current-massage="getCurrentMassage"
            :select-delete-data="selectDeleteData"
            :current-data="currentData"
            :change-status="changeStatus"
            :delete-list="deleteList"
            :set-delete-state="setDeleteState"
            :feedback-list="feedbackList"
            :form-status="formStatus"
            :set-form-status="setFormStatus"
            :get-feedback-record="getFeedbackRecord"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import mcenter from '@/api/mcenter';
import {
    API_FEEDBACK_TYPE_LIST, API_FEEDBACK_CREATED, API_FEEDBACK_REPLIED_LIST, API_FEEDBACK_UN_READ_COUNT, API_FEEDBACK_DELETE
} from '@/config/api';
import EST from '@/lib/EST';

export default {
    props: {
        selectTypeId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            titleTab: {
                mailbox: {
                    value: this.$text('S_MAILBOX', '收件箱')
                },
                feedbackRecord: {
                    value: this.$text('S_FEEDBACK_RECORD', '发送纪录')
                }
            },
            typeList: [],
            repliedList: [],
            unReadCount: 0,
            paramsData: {
                type_id: '',
                title: '',
                content: ''
            },
            stepText: [
                `${this.$text('S_FEEDBACK_TIP01', '步骤一： 点击「上传图片」前往网址')} (https://imgbb.com/)。`,
                this.$text('S_FEEDBACK_TIP02', '步骤二： 将图片上传并获取图片网址链结。'),
                this.$text('S_FEEDBACK_TIP03', '步骤三： 将获取的网址链结贴至对话输入框内。'),
                this.$text('S_FEEDBACK_TIP04', '特别说明： 部分浏览器不支援 拖曳 上传图片，请使用上传按钮')
            ],
            errorField: {
                title: false
            },
            openMailIndex: '',
            totalCount: 0,
            numFirst: 0, // 每頁起始序
            numMax: 10, // 每頁顯示幾筆
            pageInfo: {
                pageAll: 1, // 總頁數
                pageNow: 1 // 當前頁
            },
            deleteStatus: false,
            currentFeedback: {},
            deleteList: [],
            feedbackList: [],
            formStatus: false
        };
    },
    computed: {
        fieldList() {
            return {
                type_id: {
                    title: this.$text('S_TYPE', '类别'),
                    data: this.typeList,
                    showStar: true
                },
                title: {
                    title: this.$text('S_TITLE', '標題'),
                    data: '',
                    showStar: true
                },
                content: {
                    title: this.$text('S_CONTENT', '內容'),
                    data: '',
                    showStar: false
                }
            };
        },
        currentData() {
            if (!this.$route.params.pid) {
                return false;
            }

            return this.currentFeedback;
        }
    },
    watch: {
        // eslint-disable-next-line
        '$route.query.type'(value) {
            if (value === 'mailbox') {
                this.getRepliedList();
            }

            if (value === 'feedbackRecord') {
                this.getFeedbackRecord();
            }
        }
    },
    created() {
        const params = [];
        this.actionSetIsLoading(true);

        params.push(
            ajax({
                method: 'get',
                url: API_FEEDBACK_TYPE_LIST,
                errorAlert: false
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.typeList = response.ret;
                }
            })
        );

        if (this.$route.query.type === 'mailbox') {
            params.push(this.getRepliedList());
        } else {
            params.push(this.getFeedbackRecord());
        }

        Promise.all(params).then(() => {
            this.actionSetIsLoading(false);
        });
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading'
        ]),
        setInputValue(value, objKey) {
            this.paramsData[objKey] = value;

            if (objKey === 'title') {
                this.errorField.title = !value;
            }
        },
        goImageRelease() {
            window.open('https://imgbb.com/', 'imageWrap');
        },
        submitData() {
            if (!this.paramsData.title) {
                this.errorField.title = true;
                return;
            }

            this.paramsData.type_id = this.selectTypeId;

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

                    this.$emit('update:selectTypeId', '');
                    this.getFeedbackRecord();
                    this.formStatus = false;
                }
            });
        },
        getRepliedList(action, page) {
            if (action === 'pageChange') {
                this.pageInfo.pageNow = page;
                this.numFirst = (this.pageInfo.pageNow - 1) * this.numMax;
            } else {
                this.pageInfo.pageNow = 1;
                this.numFirst = 0;
            }

            // 取得已回覆且未讀取意見反饋數量
            ajax({
                method: 'get',
                url: API_FEEDBACK_UN_READ_COUNT,
                errorAlert: false
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.unReadCount = response.ret;
                }
            });

            // 取得已回覆意見反饋列表
            ajax({
                method: 'get',
                url: API_FEEDBACK_REPLIED_LIST,
                errorAlert: false
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.repliedList = response.ret;
                    this.totalCount = Number(response.pagination.total);

                    if (this.totalCount === 0) {
                        this.pageInfo.pageAll = 1;
                        return;
                    }

                    this.pageInfo.pageAll = Math.ceil(this.totalCount / this.numMax);

                    for (let i = 0; i < this.repliedList.length; i += 1) {
                        this.repliedList[i].created_at = EST(this.repliedList[i].created_at);
                        this.repliedList[i].replied_at = EST(this.repliedList[i].replied_at);
                    }
                }
            });
        },
        deleteReplied(key) {
            const text = window.confirm(`${this.$t('S_MSG_DELETED')}?`);

            if (!text) {
                this.setDeleteState();
                return;
            }

            // 刪除意見反饋
            ajax({
                method: 'delete',
                url: `${API_FEEDBACK_CREATED}/${key}`,
                errorAlert: false
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.getRepliedList();
                }
            });
        },
        deleteBatchReplied(key) {
            const text = window.confirm(`${this.$t('S_MSG_DELETED')}?`);

            if (!text) {
                this.setDeleteState();
                return;
            }

            // 刪除意見反饋
            ajax({
                method: 'delete',
                params: { feedback_ids: key },
                url: API_FEEDBACK_DELETE,
                errorAlert: false
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.getRepliedList();
                }
            });
        },
        setMailRead(index) {
            if (this.openMailIndex === index) {
                this.openMailIndex = '';
                return;
            }

            this.openMailIndex = index;

            for (let i = 0; i < this.repliedList.length; i += 1) {
                if (this.repliedList[i].id === index && this.repliedList[i].reply_read_at) {
                    return;
                }
            }

            // 設定讀取回覆時間
            ajax({
                method: 'put',
                url: `${API_FEEDBACK_CREATED}/${index}/reply_read_at`,
                errorAlert: false
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.getRepliedList();
                }
            });
        },
        getCurrentMassage(content, type) {
            if (this.deleteStatus) return;
            this.currentFeedback = {
                ...content,
                type
            };
            this.$router.push(`/mobile/mcenter/information/feedback/${content.id}`);
        },
        selectDeleteData(content) {
            if (!this.deleteStatus) {
                this.deleteStatus = true;
                return;
            }

            this.deleteStatus = false;

            if (content.length === 0) {
                return;
            }

            if (content.length === 1) {
                this.deleteReplied(content[0]);
                return;
            }

            this.deleteBatchReplied(content);
        },
        changeStatus(id) {
            if (!this.deleteList.includes(id)) {
                this.deleteList.push(id);
                return;
            }

            this.deleteList.splice(this.deleteList.indexOf(id), 1);
        },
        setDeleteState() {
            this.deleteStatus = false;
            this.deleteList = [];
        },
        setFormStatus(type = '') {
            if (type === 'pop') {
                this.formStatus = true;
                return;
            }

            if (this.formStatus) {
                if (window.confirm(this.$text('S_LEAVE_CURRENT_PAGE_PAGE_NOT_RETAINED', '离开页面当前资料不保留'))) {
                    this.paramsData = {
                        type_id: '',
                        title: '',
                        content: ''
                    };
                    this.formStatus = false;
                }
                return;
            }

            this.formStatus = false;
        },
        getFeedbackRecord(action, page) {
            if (action === 'pageChange') {
                this.pageInfo.pageNow = page;
                this.numFirst = (this.pageInfo.pageNow - 1) * this.numMax;
            } else {
                this.pageInfo.pageNow = 1;
                this.numFirst = 0;
            }

            mcenter.feedbackRecord({
                success: (response) => {
                    this.feedbackList = response.ret;
                    this.totalCount = Number(response.pagination.total);

                    if (this.totalCount === 0) {
                        this.pageInfo.pageAll = 1;
                        return;
                    }

                    this.pageInfo.pageAll = Math.ceil(this.totalCount / this.numMax);
                }
            });
        }
    }
};
</script>
