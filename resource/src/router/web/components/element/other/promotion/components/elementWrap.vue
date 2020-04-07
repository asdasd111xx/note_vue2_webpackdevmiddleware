<template>
    <div :class="['element', isBackEnd ? 'is-back' : 'is-front']">
        <div class="element-btn clearfix" @click="$emit('click')">
            <slot name="element" />
            <case-panel
                v-if="isBackEnd && config.casePanel && !readOnly"
                :index="index"
                :config="config"
                :element="element"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import casePanel from './casePanel';

export default {
    components: {
        casePanel
    },
    props: {
        index: {
            type: Number,
            required: true
        },
        config: {
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
            isBackEnd: 'getIsBackEnd',
            readOnly: 'getReadOnly'
        })
    }
};
</script>
