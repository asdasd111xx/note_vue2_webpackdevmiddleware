<template>
    <edit-birthday>
        <template scope="{ dateLang, limit, onSubmit }">
            <div :class="[$style.wrap, 'clearfix']">
                <div :class="$style.title">{{ $text('S_BIRTHDAY_DATE') }}</div>
                <datepicker
                    v-model="value"
                    :wrapper-class="$style.datepicker"
                    :input-class="$style['datepicker-input']"
                    :language="dateLang"
                    :disabled="{ from: limit }"
                    :open-date="limit"
                    :clear-button="true"
                    :monday-first="true"
                    :placeholder="$t('S_BIRTHDAY_DATE')"
                    format="yyyy/MM/dd"
                    initial-view="year"
                    @cleared="value = ''"
                />
                <div :class="$style['btn-wrap']">
                    <div :class="$style['btn-cancel']" @click="$emit('cancel')">{{ $text('S_CANCEL', '取消') }}</div>
                    <div :class="$style['btn-confirm']" @click="handleSubmit(onSubmit)">
                        {{ $text('S_CONFIRM', '確認') }}
                    </div>
                </div>
            </div>
        </template>
    </edit-birthday>
</template>

<script>
import datepicker from 'vuejs-datepicker';
import editBirthday from '@/components/common/editBirthday';

export default {
    components: {
        editBirthday,
        datepicker
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
