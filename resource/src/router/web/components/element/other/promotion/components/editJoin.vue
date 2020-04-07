<template>
    <div :class="$style['edit-join']">
        <div>
            <input
                id="disable"
                v-model="value.join[curLang]"
                type="radio"
                name="is-show"
                value="0"
            />
            <label for="disable">{{ $text('S_NOT_DISPLAY', '不显示') }}</label>
        </div>
        <div>
            <input
                id="enable"
                v-model="value.join[curLang]"
                type="radio"
                name="is-show"
                value="1"
            />
            <label for="enable">{{ $text('S_DISPLAY', '显示') }}</label>
        </div>
        <template v-if="isReceiving">
            <icon :spin="isReceiving" name="spinner" />
        </template>
        <template v-else>
            <multiselect
                v-model="connect"
                :options="promotion"
                :disabled="!+value.join[curLang]"
                :preserve-search="true"
                :show-labels="false"
                :custom-label="getLabel"
                :placeholder="$text('S_PLEASE_SELECT', '请选择')"
                track-by="id"
            />
            <div v-if="+value.join[curLang] && !value.connect[curLang]" :class="$style.error">{{ $text('S_NOT_SELECT_PROMOTION', '尚未选择优惠') }}</div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';
import ajax from '@/lib/ajax';

export default {
    components: {
        Multiselect
    },
    props: {
        value: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            promotion: []
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang',
            memInfo: 'getMemInfo'
        }),
        isReceiving() {
            return !this.promotion.length;
        },
        connect: {
            get() {
                return this.promotion.reduce((init, info) => {
                    if (info.id === this.value.connect[this.curLang]) {
                        return { ...info };
                    }

                    return init;
                }, null);
            },
            set(option) {
                this.$emit('input', {
                    ...this.value,
                    connect: {
                        ...this.value.connect,
                        [this.curLang]: option ? option.id : ''
                    }
                });
            }
        }
    },
    created() {
        ajax({
            method: 'get',
            url: '/api/activities'
        }).then(({ status, data, message }) => {
            if (status !== 'Y') {
                this.$swal({
                    title: message || this.$text('S_CONTACT_SERVICE', this.memInfo.config.lang),
                    type: 'error'
                });

                return;
            }

            const sort = data.filter((info) => info.register).reduce((init, info) => ({
                ...init,
                [info.status]: [...init[info.status], info]
            }), {
                not_active_yet: [],
                active: [],
                pause: [],
                finish: []
            });

            this.promotion = [...sort.not_active_yet, ...sort.active, ...sort.pause, ...sort.finish];
        });
    },
    methods: {
        /**
         * 下拉選單選項名稱
         * @method getLabel
         * @param { string } status - 狀態
         * @param { string } id - ID
         * @param { string } title - 本站優惠名稱
         * @returns { string } - 名稱
         */
        getLabel({ status, id, title }) {
            const text = this.$text(`S_${status.toUpperCase()}`);

            return `(${text}) ${title} (ID:${id})`;
        }
    }
};
</script>

<style lang="scss" module>
.edit-join {
    margin: 15px 10px;

    > div {
        margin: 5px 0;
        vertical-align: middle;

        > span {
            vertical-align: middle;
        }

        > input {
            line-height: initial;
            margin-right: 3px;
        }
    }
}

.error {
    color: #F00;
    font-size: 14px;
}
</style>
