<template>
    <edit-name>
        <template scope="{ onSubmit }">
            <div :class="[$style.wrap, 'clearfix']">
                <div :class="$style.title">{{ $text('S_PERSONAL_NAME') }}</div>
                <div :class="$style['input-wrap']">
                    <input
                        :value="value"
                        :placeholder="$text('S_PERSONAL_NAME')"
                        :class="$style.input"
                        type="text"
                        @input="onInput"
                    />
                </div>
                <div :class="$style['btn-wrap']">
                    <div :class="$style['btn-cancel']" @click="$emit('cancel')">{{ $text('S_CANCEL', '取消') }}</div>
                    <div :class="$style['btn-confirm']" @click="handleSubmit(onSubmit)">{{ $text('S_CONFIRM', '確認') }}</div>
                </div>
            </div>
        </template>
    </edit-name>
</template>

<script>
import editName from '@/components/common/editName';

export default {
    components: {
        editName
    },
    data() {
        return {
            value: ''
        };
    },
    methods: {
        onInput(e) {
            this.value = e.target.value;

            // 個人姓名限制輸入上限30字元
            if (this.value.length > 30) {
                this.value = this.value.substring(0, 30);
            }
        },
        handleSubmit(submit) {
            submit(this.value).then((response) => {
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
