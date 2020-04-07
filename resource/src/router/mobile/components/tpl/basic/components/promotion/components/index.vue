<template>
    <div class="promotion-wrap">
        <promotion v-if="element" :element="element" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import promotion from '@/router/web/components/element/other/promotion';

export default {
    components: {
        promotion
    },
    computed: {
        ...mapGetters({
            mobileInfo: 'getMobileInfo'
        }),
        element() {
            if (!this.mobileInfo.promotion) {
                return null;
            }

            return {
                ...this.mobileInfo.promotion,
                case: {
                    ...this.mobileInfo.promotion.case,
                    content: [...this.mobileInfo.promotion.case.data.map((info) => info.content)]
                }
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.promotion-wrap {
    background-color: #F6F6F6;
    min-height: calc(100vh - 85px);
}
</style>
