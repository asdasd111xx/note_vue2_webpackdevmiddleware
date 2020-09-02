<template>
    <div class="ui fluid form">
        <element-draggable
            v-if="element.case.data.length"
            :element="element"
            class="element-box"
        >
            <div
                v-for="(caseData, index) in elementData.case.data"
                :key="`case-${caseData[curLang]-index}`"
            >
                <div
                    v-if="caseData.key[curLang] === 'name' && caseData.state[curLang]==='Y'"
                    class="field element clearfix"
                >
                    <input
                        v-model="caseData.value[curLang]"
                        v-validate="{
                            required: false,
                            regex: /^[^0-9，:;！@#$%^&*?<>()+=`|[\s~\-_']*$/
                        }"
                        :name="caseData.key[curLang]"
                        :placeholder="caseData.placeholder[curLang]"
                        :class="{
                            inputColor:webInfo.model === 6
                        }"
                        :readonly="isBackEnd"
                        type="text"
                    />
                    <div
                        v-if="errors.has(caseData.key[curLang]) && !isBackEnd"
                        class="ui pointing red basic label"
                    >
                        {{ $t('S_FORM_NAME_ERROR') }}
                    </div>
                </div>
                <div
                    v-if="caseData.key[curLang] === 'username' && caseData.state[curLang]==='Y'"
                    class="field element clearfix"
                >
                    <input
                        v-model="caseData.value[curLang]"
                        v-validate="{
                            required: false,
                            regex: /^[a-z][a-z0-9]{3,19}$/
                        }"
                        :name="caseData.key[curLang]"
                        :placeholder="caseData.placeholder[curLang]"
                        :class="{
                            inputColor:webInfo.model === 6
                        }"
                        :readonly="isBackEnd"
                        type="text"
                    />
                    <div
                        v-if="errors.has(caseData.key[curLang]) && !isBackEnd"
                        class="ui pointing red basic label"
                    >
                        {{ $text('S_FORM_ACCOUNT_ERROR', { text: '请输入4-20位英文小写、数字，首字不得为数字', replace: [{ target: '%s', value: '<br />'}] }) }}
                    </div>
                </div>
                <div
                    v-if="caseData.key[curLang] === 'phone' && caseData.state[curLang]==='Y'"
                    class="field element clearfix"
                >
                    <input
                        v-model="caseData.value[curLang]"
                        v-validate="{
                            required: false,
                            regex: /^[+]?[0-9]{6,14}$/
                        }"
                        :name="caseData.key[curLang]"
                        :placeholder="caseData.placeholder[curLang]"
                        :class="{
                            inputColor:webInfo.model === 6
                        }"
                        :readonly="isBackEnd"
                        type="text"
                    />
                    <div
                        v-if="errors.has(caseData.key[curLang]) && !isBackEnd"
                        class="ui pointing red basic label"
                    >
                        {{ $t('S_FORM_PHONE_ERROR') }}
                    </div>
                </div>

                <div
                    v-if="caseData.key[curLang] === 'qq_num' && caseData.state[curLang]==='Y'"
                    class="field element clearfix"
                >
                    <input
                        v-model="caseData.value[curLang]"
                        v-validate="{
                            required: false,
                            regex: /^[1-9][0-9]{4,10}$/
                        }"
                        :name="caseData.key[curLang]"
                        :placeholder="caseData.placeholder[curLang]"
                        :class="{
                            inputColor:webInfo.model === 6
                        }"
                        :readonly="isBackEnd"
                        type="text"
                    />
                    <div
                        v-if="errors.has(caseData.key[curLang]) && !isBackEnd"
                        class="ui pointing red basic label"
                    >
                        {{ $t('S_FORM_QQ_ERROR') }}
                    </div>
                </div>
                <div
                    v-if="caseData.key[curLang] === 'weixin' && caseData.state[curLang]==='Y'"
                    class="field element clearfix"
                >
                    <input
                        v-model="caseData.value[curLang]"
                        v-validate="{
                            required: false,
                            regex: /^[-_a-zA-Z0-9]{1,32}$/
                        }"
                        :name="caseData.key[curLang]"
                        :placeholder="caseData.placeholder[curLang]"
                        :class="{
                            inputColor:webInfo.model === 6
                        }"
                        :readonly="isBackEnd"
                        type="text"
                    />
                    <div
                        v-if="errors.has(caseData.key[curLang]) && !isBackEnd"
                        class="ui pointing red basic label"
                    >
                        {{ $t('S_FORM_WECHAT_ERROR') }}
                    </div>
                </div>

                <div
                    v-if="caseData.key[curLang] === 'email' && caseData.state[curLang]==='Y'"
                    class="field element clearfix"
                >
                    <span class="star">*</span>
                    <input
                        v-model="caseData.value[curLang]"
                        v-validate="{
                            required: true,
                            regex: /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
                            min: 3,
                            max: 100
                        }"
                        :name="caseData.key[curLang]"
                        :placeholder="caseData.placeholder[curLang]"
                        :class="{
                            inputColor:webInfo.model === 6
                        }"
                        :readonly="isBackEnd"
                        type="text"
                        data-vv-validate-on="blur"
                    />
                    <!-- eslint-disable vue/no-v-html -->
                    <div
                        v-if="errors.has(caseData.key[curLang]) && !isBackEnd"
                        class="ui pointing red basic label"
                        v-html="$text('S_JM_EMAIL_FORMAT_UNAVAILABLE', {
                            text: 'E-mail 格式不正确',
                            replace: [{
                                target: '%s', value: '<br/>'
                            }]
                        })"
                    />
                    <!-- eslint-enable vue/no-v-html -->
                </div>
                <div
                    v-if="caseData.key[curLang] === 'content' && caseData.state[curLang]==='Y'"
                    class="field element clearfix"
                >
                    <span class="star">*</span>
                    <textarea
                        v-model="caseData.value[curLang]"
                        v-validate="'required'"
                        :name="caseData.key[curLang]"
                        :placeholder="caseData.placeholder[curLang]"
                        :class="{
                            inputColor:webInfo.model === 6
                        }"
                        :readonly="isBackEnd"
                        data-vv-validate-on="blur"
                    />
                    <div
                        v-if="errors.has(caseData.key[curLang]) && !isBackEnd"
                        class="ui pointing red basic label"
                    >
                        {{ $t('S_FORM_REQUIRE_ERROR') }}
                    </div>
                </div>
            </div>
            <div>
                <button class="big ui button" @click="clear()">
                    {{ $t('S_FORM_CLEAR') }}
                </button>
                <button class="big ui button" @click="submit()">
                    {{ $t('S_FORM_SUBMIT') }}
                </button>
            </div>
        </element-draggable>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import elementDraggable from '../../../common/elementDraggable';

export default {
    inject: ['$validator'],
    components: {
        elementDraggable
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            elementData: {}
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain'
        })
    },
    watch: {
        element(val) {
            this.elementData = cloneDeep(val);
        }
    },
    created() {
        this.elementData = cloneDeep(this.element);
    },
    mounted() {
        this.errors.clear();
    },
    methods: {
        ...mapActions([
            'actionContactUs'
        ]),
        async submit() {
            if (this.isBackEnd) {
                return;
            }
            const valiateState = await this.$validator.validateAll();
            if (valiateState) {
                const loader = this.$loading.show();
                const data = {};
                this.elementData.case.data.forEach((item) => {
                    data[item.key[this.curLang]] = item.value[this.curLang];
                });
                const res = await this.actionContactUs(data);
                if (res.data.result === 'ok') {
                    this.clear();
                    this.$swal({
                        title: this.$t('S_CR_SUCCESS'),
                        type: 'success'
                    });
                } else {
                    alert(`${res.data.msg} (${res.data.code})`);
                }
                await loader.hide();
            }
        },
        clear() {
            if (this.isBackEnd) {
                return;
            }
            this.errors.clear();
            this.elementData = cloneDeep(this.element);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";
.element-box{
   margin: 0 auto;
   width: 70%;
   padding: 60px;
   max-width: 740px;
}
.element{
    padding-bottom: 10px;
    position: relative;
}
.star{
    position: absolute;
    left:-25px;
    top: 15px;
    color: red;
}

.ui.form input.inputColor{
    border-radius:0 !important;
    border: 2px solid #BFA07C;
    color: #BFA07C !important;
}

.ui.form textarea{
    resize: none;
}

.ui.form textarea.inputColor{
    border-radius:0 !important;
    border: 2px solid #BFA07C;
    color: #BFA07C !important;
}

.ui.basic.red.label{
    float: left;
}

//placeholder color
.inputColor::-webkit-input-placeholder {
    color: #BFA07C !important;
}

.inputColor:-moz-placeholder { /* Firefox 18- */
    color: #BFA07C !important;
}

.inputColor::-moz-placeholder {  /* Firefox 19+ */
    color: #BFA07C !important;
}

.inputColor:-ms-input-placeholder {
    color: #BFA07C !important;
}
</style>
