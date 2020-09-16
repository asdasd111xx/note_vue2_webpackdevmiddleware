<template>
    <div v-if="popType === 'note'" :class="$style['note-content']">
        <agent-note />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        agentNote: () => import(/* webpackChunkName: 'note' */'../../common/note')
    },
    computed: {
        ...mapGetters({
            popType: 'getPopType'
        })
    }
};
</script>

<style lang="scss" module>
.note-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
}
</style>
