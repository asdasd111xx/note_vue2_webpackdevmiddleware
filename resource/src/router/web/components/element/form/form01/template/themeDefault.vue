<template>
    <div class="form01-wrap">
        <div v-if="!systemEmailState" class="disable" />
        <div class="ui fluid form">
            <div :class="['element-box', `form-${element.i}`]">
                <div v-for="(caseData, index) in elementData.case.data" :key="`case-${caseData[curLang]-index}`">
                    <div v-if="caseData.key[curLang] === 'name' && caseData.state[curLang]==='Y'" class="field element clearfix">
                        <input
                            v-model="caseData.value[curLang]"
                            v-validate="{
                                required: false,
                                regex: /^[^0-9，:;！@#$%^&*?<>()+=`|[\s~\-_']*$/
                            }"
                            :name="caseData.key[curLang]"
                            :placeholder="caseData.placeholder[curLang]"
                            :readonly="isBackEnd"
                            type="text"
                            class="inputColor"
                        />
                        <div v-if="errors.has(caseData.key[curLang]) && !isBackEnd" class="ui pointing red basic label">
                            {{ $text('S_FORM_NAME_ERROR', '请勿输入数字、空白及特殊符号') }}
                        </div>
                    </div>
                    <div v-if="caseData.key[curLang] === 'username' && caseData.state[curLang]==='Y'" class="field element clearfix">
                        <input
                            v-model="caseData.value[curLang]"
                            v-validate="{
                                required: false,
                                regex: /^[a-z][a-z0-9]{3,19}$/
                            }"
                            :name="caseData.key[curLang]"
                            :placeholder="caseData.placeholder[curLang]"
                            :readonly="isBackEnd"
                            type="text"
                            class="inputColor"
                        />
                        <div v-if="errors.has(caseData.key[curLang]) && !isBackEnd" class="ui pointing red basic label">
                            {{ $text('S_FORM_ACCOUNT_ERROR', '请输入4-20码英文小写、数字，首字不得为数字') }}
                        </div>
                    </div>
                    <div v-if="caseData.key[curLang] === 'phone' && caseData.state[curLang]==='Y'" class="field element clearfix">
                        <input
                            v-model="caseData.value[curLang]"
                            v-validate="{
                                required: false,
                                regex: /^[+]?[0-9]{6,14}$/
                            }"
                            :name="caseData.key[curLang]"
                            :placeholder="caseData.placeholder[curLang]"
                            :readonly="isBackEnd"
                            type="text"
                            class="inputColor"
                        />
                        <div v-if="errors.has(caseData.key[curLang]) && !isBackEnd" class="ui pointing red basic label">
                            {{ $text('S_FORM_PHONE_ERROR', '请输入7-15码，仅允许输入数字（开头可输入+）') }}
                        </div>
                    </div>

                    <div v-if="caseData.key[curLang] === 'qq_num' && caseData.state[curLang]==='Y'" class="field element clearfix">
                        <input
                            v-model="caseData.value[curLang]"
                            v-validate="{
                                required: false,
                                regex: /^[1-9][0-9]{4,10}$/
                            }"
                            :name="caseData.key[curLang]"
                            :placeholder="caseData.placeholder[curLang]"
                            :readonly="isBackEnd"
                            type="text"
                            class="inputColor"
                        />
                        <div v-if="errors.has(caseData.key[curLang]) && !isBackEnd" class="ui pointing red basic label">
                            {{ $text('S_FORM_QQ_ERROR', '仅允许输入数字') }}
                        </div>
                    </div>
                    <div v-if="caseData.key[curLang] === 'weixin' && caseData.state[curLang]==='Y'" class="field element clearfix">
                        <input
                            v-model="caseData.value[curLang]"
                            v-validate="{
                                required: false,
                                regex: /^[-_a-zA-Z0-9]{1,32}$/
                            }"
                            :name="caseData.key[curLang]"
                            :placeholder="caseData.placeholder[curLang]"
                            :readonly="isBackEnd"
                            type="text"
                            class="inputColor"
                        />
                        <div v-if="errors.has(caseData.key[curLang]) && !isBackEnd" class="ui pointing red basic label">
                            {{ $text('S_FORM_WECHAT_ERROR', '请输入6-20码字母、数字、下划线、减号, 首字须为字母') }}
                        </div>
                    </div>
                    <div v-if="caseData.key[curLang] === 'email' && caseData.state[curLang]==='Y'" class="field element clearfix">
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
                            :readonly="isBackEnd"
                            type="text"
                            class="inputColor"
                            data-vv-validate-on="blur"
                        />
                        <div v-if="errors.has(caseData.key[curLang]) && !isBackEnd" class="ui pointing red basic label">
                            {{ $text('S_FORM_MAIL_ERROR', 'E-mail 格式不正确') }}
                        </div>
                    </div>
                    <div v-if="caseData.key[curLang] === 'content' && caseData.state[curLang]==='Y'" class="field element clearfix">
                        <span class="star">*</span>
                        <textarea
                            v-model="caseData.value[curLang]"
                            v-validate="'required'"
                            :name="caseData.key[curLang]"
                            :placeholder="caseData.placeholder[curLang]"
                            :readonly="isBackEnd"
                            data-vv-validate-on="blur"
                            class="inputColor"
                        />
                        <div v-if="errors.has(caseData.key[curLang]) && !isBackEnd" class="ui pointing red basic label">
                            {{ $text('S_FORM_REQUIRE_ERROR', '必填') }}
                        </div>
                    </div>
                </div>
                <div class="content-btn">
                    <button class="big ui button" @click="clear()">
                        {{ $text('S_FORM_CLEAR', '清除') }}
                    </button>
                    <button class="big ui button" @click="submit()">
                        {{ $text('S_FORM_SUBMIT', '送出') }}
                    </button>
                </div>
            </div>
            <!-- eslint-disable vue/html-indent -->
            <v-style>
                .form-{{ element.i }}.element-box .field.element .inputColor[{{ this.$options._scopeId }}] {
                    color: {{ element.case.setting.inputColor }};
                    border-color: {{ element.case.setting.borderColor }};
                    background: {{ element.case.setting.inputBgColor }};
                    border-radius: {{ element.case.setting.hasRadius === 'N' ? 0 : '' }};
                }

                .form-{{ element.i }}.element-box .field.element .inputColor:focus[{{ this.$options._scopeId }}] {
                    border-color: {{ element.case.setting.borderFocusColor }};
                    background: {{ element.case.setting.inputBgFocusColor }};
                }

                .form-{{ element.i }}.element-box .field.element .inputColor[{{ this.$options._scopeId }}]::placeholder {
                    color: {{ element.case.setting.inputPlaceholderColor }};
                }

                .form-{{ element.i }}.element-box .field.element .inputColor[{{ this.$options._scopeId }}]:-ms-input-placeholder {
                    color: {{ element.case.setting.inputPlaceholderColor }};
                }
            </v-style>
            <!-- eslint-enable vue/html-indent -->
        </div>
        <div
            v-if="isBackEnd && systemEmailState && !readOnly"
            class="btn-edit"
            @click="editDialogState = true"
        >
            {{ $text('S_EDIT', { text: '编辑', locale: memInfo.config.lang || 'zh-cn' }) }}
        </div>
        <div v-if="isBackEnd && !systemEmailState" class="btn-disableEdit">
            <div class="disable-title">
                <icon name="exclamation-triangle" class="noteIcon" />
                <span>{{ $text('S_FORM_NOTE', { text: '注意', locale: memInfo.config.lang || 'zh-cn' }) }}</span>
            </div>
            <span class="disable-content">{{ $text('S_DISABLE_CONTACTUS_EDIT', { text: '后台邮箱未设定无法编辑版块,请先完成设定后进行编辑，会员前台才能正常显示',locale: memInfo.config.lang || 'zh-cn' }) }}</span>
        </div>
        <editDialog
            v-if="isBackEnd && editDialogState && !readOnly"
            :element="element"
            @update="editData"
            @close="editDialogState = false"
        />
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters, mapActions } from 'vuex';
import editDialog from '../components/editDialog';

export default {
    inject: ['$validator'],
    components: {
        editDialog
    },
    props: {
        element: {
            type: Object,
            required: true
        },
        config: {
            type: Object,
            required: true
        },
        systemEmailState: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            editDialogState: false,
            elementData: {}
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            readOnly: 'getReadOnly',
            curLang: 'getCurLang'
        })
    },
    watch: {
        element(val) {
            this.elementData = val;
        }
    },
    created() {
        this.elementData = cloneDeep(this.element);
    },
    methods: {
        ...mapActions([
            'actionCaseSave',
            'actionContactUs'
        ]),
        editData(newElement) {
            this.elementData = cloneDeep(newElement);
            this.actionCaseSave({
                case_id: newElement.i,
                content: [{}],
                field: [...newElement.case.data],
                setting: { ...newElement.case.setting }
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$text('S_CONTACT_SERVICE', {
                            text: '系统错误，请联系线上客服人员',
                            locale: this.memInfo.config.lang || 'zh-cn'
                        }),
                        type: 'error'
                    });
                }
            });
        },
        async submit() {
            if (this.isBackEnd) {
                return;
            }

            const valiateState = await this.$validator.validateAll();
            if (valiateState) {
                const loader = this.$loading.show();
                const data = this.elementData.case.data.reduce((init, item) => ({
                    ...init,
                    [item.key[this.curLang]]: item.value[this.curLang]
                }), {});
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
.form01-wrap {
    .disable{
        background-color: #CCC;
        width: 100%;
        height: 100%;
        z-index: 100;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0.5;
    }

    .btn-edit {
        font-size: 14px;
        line-height: 35px;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 120px;
        height: 35px;
        margin: -17px 0 0 -60px;
        cursor: pointer;
        transition: opacity .5s;
        text-align: center;
        opacity: 0;
        color: #FFF;
        border: 1px solid #FDFDFD;
        border-radius: 3px;
        background: #2F2F2F;
    }

    &:hover {
        .btn-edit {
            z-index: 3;
            opacity: 1;
        }
    }

    .btn-disableEdit {
        font-size: 14px;
        line-height: 35px;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300px;
        height: 140px;
        margin: -100px 0 0 -150px;
        cursor: pointer;
        transition: opacity .5s;
        border: 1px solid #FDFDFD;
        border-radius: 3px;
        background: #2F2F2F;
        z-index: 150;
        padding: 20px;

        .disable-title{
            color: #E32A2A;
        }

        .disable-content{
            color: #FFF;
        }

        .noteIcon{
            vertical-align: middle;
        }
    }

    .ui {
        &.form {
            .element-box{
                margin: 0 auto;
                width: 70%;
                padding: 60px;
                max-width: 740px;

                .content-btn {
                    text-align: center;
                }

                .element{
                    padding-bottom: 10px;
                    position: relative;

                    .star{
                        position: absolute;
                        left: -25px;
                        top: 15px;
                        color: red;
                    }

                    .inputColor{
                        border-width: 1px;
                        border-style: solid;
                        font-family: inherit;
                    }

                    textarea{
                        resize: none;
                    }

                    .ui {
                        &.basic {
                            &.red {
                                &.label {
                                    float: left;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
