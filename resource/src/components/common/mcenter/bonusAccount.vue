<template>
    <div class="bonus-account-data">
        <slot
            :total="total"
            :bonus-data="bonusData"
        />
    </div>
</template>

<script>
import mcenter from '@/api/mcenter';

export default {
    data() {
        return {
            hasReceive: false,
            bonusData: [],
            total: {}
        };
    },
    created() {
        this.getBouns();
    },
    methods: {
        getBouns() {
            mcenter.bonusAccount({
                success: ({ result, ret, total }) => {
                    this.hasReceive = true;
                    if (result !== 'ok') {
                        return;
                    }
                    this.bonusData = ret;
                    this.total = total;
                }
            });
        }
    }
};
</script>
