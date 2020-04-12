<template>
    <edit-facebook>
        <template scope="{ onSubmit }">
            <div :class="[$style.wrap, 'clearfix']">
                <div :class="$style.title">{{ $text('S_FACEBOOK') }}</div>
                <div :class="$style['input-wrap']">
                    <input
                        v-model="value"
                        :placeholder="$text('S_FACEBOOK')"
                        :class="$style.input"
                        type="text"
                    />
                </div>
                <div :class="$style['btn-wrap']">
                    <div :class="$style['btn-cancel']" @click="$emit('cancel')">{{ $text('S_CANCEL', '取消') }}</div>
                    <div :class="$style['btn-confirm']" @click="handleSubmit(onSubmit)">{{ $text('S_CONFIRM', '確認') }}</div>
                </div>
            </div>
        </template>
    </edit-facebook>
</template>

<script>
import editFacebook from '@/components/common/editFacebook';

export default {
    components: {
        editFacebook
    },
    data() {
        return {
            value: ''
        };
    },
    methods: {
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
