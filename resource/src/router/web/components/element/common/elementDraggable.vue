<template>
    <draggable
        v-model="elementDnd"
        :options="optionsDnd"
        class="element-box"
    >
        <slot />
    </draggable>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import draggable from 'vuedraggable';

export default {
    components: {
        draggable
    },
    props: {
        handleClass: {
            type: String,
            default: '.sort-icon'
        },
        element: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            optionsDnd: {
                handle: this.handleClass
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        elementDnd: {
            get() {
                if (this.type === 'content') {
                    return [...this.element.case.content];
                }
                return [...this.element.case.data];
            },
            set(sort) {
                if (this.type === 'content') {
                    this.actionCaseSave({
                        case_id: this.element.i,
                        content: [...sort],
                        field: [],
                        setting: this.element.case.setting
                    }).then((response) => {
                        if (response.status !== 'Y') {
                            this.$swal({
                                title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                                type: 'error'
                            });
                        }
                    });
                } else {
                    this.actionCaseSave({
                        case_id: this.element.i,
                        content: [],
                        field: [...sort],
                        setting: this.element.case.setting
                    }).then((response) => {
                        if (response.status !== 'Y') {
                            this.$swal({
                                title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                                type: 'error'
                            });
                        }
                    });
                }
            }
        }
    },
    methods: {
        ...mapActions([
            'actionElementSave',
            'actionCaseSave'
        ])
    }
};
</script>
