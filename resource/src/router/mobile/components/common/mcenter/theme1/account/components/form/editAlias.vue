<template>
    <edit-alias :value.sync="value">
        <template scope="{ isFetching, showNickname, onToggle, onSubmit }">
            <div :class="[$style.wrap, 'clearfix']">
                <div :class="$style.title">{{ $text('S_NICKNAME') }}</div>
                <div :class="$style['input-wrap']">
                    <input
                        v-model="value"
                        :placeholder="$text('S_NICKNAME')"
                        :class="$style.input"
                        maxlength="100"
                        type="text"
                    />
                </div>
                <div :class="$style['toggle-nickname']" @click="onToggle">
                    <span>{{ $text('S_NICKNAME_SHOW', '显示昵称') }}</span>
                    <div :class="['ui toggle checkbox']">
                        <input
                            :checked="showNickname"
                            :disabled="isFetching"
                            type="checkbox"
                        />
                        <label />
                    </div>
                </div>
                <div :class="$style['btn-wrap']">
                    <div :class="$style['btn-cancel']" @click="$emit('cancel')">{{ $text('S_CANCEL', '取消') }}</div>
                    <div :class="$style['btn-confirm']" @click="handleSubmit(onSubmit)">{{ $text('S_CONFIRM', '確認') }}</div>
                </div>
            </div>
        </template>
    </edit-alias>
</template>

<script>
import editAlias from '@/components/common/editAlias';

export default {
    components: {
        editAlias
    },
    data() {
        return {
            value: ''
        };
    },
    methods: {
        handleSubmit(submit) {
            submit(this.value).then((response) => {
                if (response.msg) {
                    alert(response.msg);
                }

                if (response.status) {
                    this.$emit('cancel');
                }
            });
        }
    }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
