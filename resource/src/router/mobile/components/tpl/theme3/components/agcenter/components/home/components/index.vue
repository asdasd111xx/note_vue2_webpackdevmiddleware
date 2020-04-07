<template>
    <mobile-container :class="$style.container">
        <div slot="content">
            <page-date />
            <top-info />
            <ag-list />
        </div>
    </mobile-container>
</template>

<script>
import pageDate from './pageDate';
import topInfo from './topInfo';
import agList from './agList';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        pageDate,
        topInfo,
        agList
    }
};
</script>

<style lang="scss" module>
div.container {
    padding-bottom: 45px;
}
</style>
