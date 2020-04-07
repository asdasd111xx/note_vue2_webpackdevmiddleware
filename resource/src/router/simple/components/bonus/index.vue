<template>
    <div class="bonus-wrap">
        <bonus-account />
    </div>
</template>

<script>
import bonusAccount from '@/components/mcenter/components/bonusAccount';

export default {
    components: {
        bonusAccount
    }
};
</script>

<style lang="scss" scoped>
.bonus-wrap {
    padding-top: 20px;
}
</style>
