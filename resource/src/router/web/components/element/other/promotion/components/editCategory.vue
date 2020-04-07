<template>
    <div :class="$style['edit-category']">
        <multiselect
            :options="options"
            :multiple="true"
            :preserve-search="true"
            :show-labels="false"
            :searchable="false"
            :value="list"
            label="text"
            track-by="key"
            @select="onSelect"
            @remove="onRemove"
        >
            <template slot="tag" scope="{ option, remove }">
                <span :class="[$style.wrap, { [$style['no-remove']]: option.key === 0 }]">
                    <span :class="$style.text">{{ option.text }}</span>
                    <span :class="$style.icon" @click="remove(option)"><icon name="times" scale="0.8" /></span>
                </span>
            </template>
        </multiselect>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';
import split from 'lodash/split';
import join from 'lodash/join';

export default {
    components: {
        Multiselect
    },
    props: {
        value: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        }),
        list: {
            get() {
                const category = split(this.value.category[this.curLang], '-').map((info) => +info);

                return this.options.filter((option) => category.includes(option.key));
            },
            set(options) {
                this.$emit('input', {
                    ...this.value,
                    category: {
                        ...this.value.category,
                        [this.curLang]: join(options.map((option) => option.key), '-')
                    }
                });
            }
        },
        options() {
            const category = JSON.parse(this.element.case.setting['promotion-category']);

            return category.map((info) => info[this.curLang] || info['zh-cn']);
        }
    },
    methods: {
        /**
         * 選擇分類
         * @method onSelect
         * @param { object } option - 分類資訊
         */
        onSelect(option) {
            if (option.key === 0) {
                return;
            }

            this.list = [...this.list, option];
        },
        /**
         * 移除分類
         * @method onRemove
         * @param { object } option - 分類資訊
         */
        onRemove(option) {
            if (option.key === 0) {
                return;
            }

            this.list = this.list.filter((info) => info.key !== option.key);
        }
    }
};
</script>

<style lang="scss" module>
.edit-category {
    margin: 15px 10px;
}

.wrap {
    display: inline-block;
    position: relative;
    line-height: 20px;
    margin: 0 10px 5px 0;
    padding: 4px 22px 4px 6px;
    border-radius: 5px;
    background-color: #CCC;
    color: #000;
}

.no-remove {
    padding-right: 6px;

    .icon {
        display: none;
    }
}

.text {
    display: inline-block;
}

.icon {
    position: absolute;
    top: 0;
    right: 4px;
    bottom: 0;
    width: 16px;
    height: 16px;
    margin: auto;
    border-radius: 5px;
    text-align: center;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        background-color: #BBB;
    }
}
</style>
