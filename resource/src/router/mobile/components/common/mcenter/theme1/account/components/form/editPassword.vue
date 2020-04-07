<template>
    <edit-password
        :old-pw.sync="oldPw"
        :new-pw.sync="newPw"
        :confirm-pw.sync="confirmPw"
    >
        <template scope="{ tip, onInput, onSubmit }">
            <div :class="[$style.wrap, 'clearfix']">
                <div :class="$style.title">{{ $text('SS_LOGIN_PW') }}</div>
                <div :class="$style['input-wrap']">
                    <input
                        :value="oldPw"
                        :placeholder="$text('S_OLD_PWD')"
                        :class="tip['oldPw'] ? $style['input-error'] : $style.input"
                        :type="visible.oldPw ? 'text' : 'password'"
                        @input="onInput($event, 'oldPw')"
                    />
                    <!-- eslint-disable vue/no-v-html -->
                    <div :class="$style.tip" v-html="tip['oldPw']" />
                    <!-- eslint-enable vue/no-v-html -->
                    <div
                        :class="[$style['icon-eye'],{ [$style['is-visible']]: visible.oldPw }]"
                        @click="visible.oldPw = !visible.oldPw"
                    />
                </div>
                <div :class="$style['input-wrap']">
                    <input
                        :value="newPw"
                        :placeholder="$text('S_NEW_PWD')"
                        :class="tip['newPw'] ? $style['input-error'] : $style.input"
                        :type="visible.newPw ? 'text' : 'password'"
                        @input="onInput($event, 'newPw')"
                    />
                    <!-- eslint-disable vue/no-v-html -->
                    <div :class="$style.tip" v-html="tip['newPw']" />
                    <!-- eslint-enable vue/no-v-html -->
                    <div
                        :class="[$style['icon-eye'],{ [$style['is-visible']]: visible.newPw }]"
                        @click="visible.newPw = !visible.newPw"
                    />
                </div>
                <div :class="$style['input-wrap']">
                    <input
                        :value="confirmPw"
                        :placeholder="$text('S_CHK_PWD')"
                        :class="tip['confirmPw'] ? $style['input-error'] : $style.input"
                        :type="visible.confirmPw ? 'text' : 'password'"
                        @input="onInput($event, 'confirmPw')"
                    />
                    <!-- eslint-disable vue/no-v-html -->
                    <div :class="$style.tip" v-html="tip['confirmPw']" />
                    <!-- eslint-enable vue/no-v-html -->
                    <div
                        :class="[$style['icon-eye'],{ [$style['is-visible']]: visible.confirmPw }]"
                        @click="visible.confirmPw = !visible.confirmPw"
                    />
                </div>
                <div :class="$style['btn-wrap']">
                    <div :class="$style['btn-cancel']" @click="$emit('cancel')">{{ $text('S_CANCEL', '取消') }}</div>
                    <div :class="$style['btn-confirm']" @click="onSubmit">{{ $text('S_CONFIRM', '確認') }}</div>
                </div>
            </div>
        </template>
    </edit-password>
</template>

<script>
import editPassword from '@/components/common/editPassword';

export default {
    components: {
        editPassword
    },
    data() {
        return {
            oldPw: '',
            newPw: '',
            confirmPw: '',
            visible: {
                oldPw: false,
                newPw: false,
                confirmPw: false
            }
        };
    },
    methods: {
        handleSubmit(submit) {
            submit().then((response) => {
                if (response === 'error') {
                    return;
                }

                this.$emit('cancel');
            });
        }
    }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
