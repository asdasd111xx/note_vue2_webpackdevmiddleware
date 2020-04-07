<template>
    <div class="ui form content dropdown-set-wrap">
        <div class="dropdown-item clearfix">
            <span>{{ $t(fieldConfig.title, memInfo.config.lang || 'zh-cn') }}</span>
            <select :value="value" @change="onSettingChange">
                <option
                    v-for="(optionsValue, key) in fieldConfig.options"
                    :key="key"
                    :value="key"
                >
                    {{ $t(optionsValue, memInfo.config.lang || 'zh-cn') }}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        element: {
            type: Object,
            default: () => ({})
        },
        fieldConfig: {
            type: Object,
            required: true
        },
        editIndex: {
            type: [String, Number],
            required: true
        },
        value: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        })
    },
    mounted() {
        this.$emit('input', this.defaultValSet(this.fieldConfig.setting, this.fieldConfig.name));
    },
    methods: {
        onSettingChange(e) {
            this.$emit('input', e.target.value);
        },
        defaultValSet(settingState, fieldName) {
            if (settingState) {
                return this.element.case.setting[fieldName];
            }

            return this.element.case.data[this.editIndex][fieldName][this.curLang];
        }
    }
};
</script>

<style lang="scss" scoped>
.dropdown-set-wrap {
    display: inline-block;
    width: 48%;

    .dropdown-item {
        width: 100%;
        margin-right: 15px;
        margin-top: 5px;

        span, select {
            float: left;
        }

        span {
            width: 133px;
            line-height: 42px;
        }

        select {
            width: 150px;
            margin-left: 10px;
            border-radius: 5px;
            outline: none;
        }
    }
}
</style>
