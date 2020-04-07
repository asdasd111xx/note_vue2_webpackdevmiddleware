<template>
    <div :class="$style.wrap">
        <ul>
            <li>1. {{ currentDoc.sp1 }}</li>
            <li>2. {{ currentDoc.sp2 }}</li>
            <li>3. {{ currentDoc.sp3 }}</li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            doc: {
                'zh-tw': {
                    sp1: '標記有 * 者為必填項目。',
                    sp2: '手機與取款密碼為取款金額時的憑證，請會員務必填寫詳細資料。',
                    sp3: '若公司有其它活動會 E-MAIL 通知，請客戶填寫清楚。'
                },
                'zh-cn': {
                    sp1: '标记有 * 者为必填项目。',
                    sp2: '手机与取款密码为取款金额时的凭证，请会员务必填写详细资料。',
                    sp3: '若公司有其它活动会 E-MAIL 通知，请客户填写清楚。'
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        }),
        currentDoc() {
            if (this.curLang === 'zh-tw') {
                return this.doc[this.curLang];
            }
            return this.doc['zh-cn'];
        }
    }
};
</script>


<style lang="scss" module>
.wrap {
    clear: left;
    float: left;
    margin-top: 48px;
    margin-left: 62px;
    width: 100%;
    font-size: 16px;
}
</style>
