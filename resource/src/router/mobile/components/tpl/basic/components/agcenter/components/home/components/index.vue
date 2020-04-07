<template>
    <div class="agcenter-home">
        <div class="news-wrap clearfix">
            <div class="news-title">NEWS</div>
            <eleNews data-source="agent" />
        </div>
        <top-info />
        <top-link />
        <ag-list />
    </div>
</template>

<script>
import eleNews from '@/router/web/components/common/news';
import topInfo from './topInfo';
import topLink from './topLink';
import agList from './agList';

export default {
    components: {
        eleNews,
        topInfo,
        topLink,
        agList
    }
};
</script>

<style lang="scss" scoped>
.agcenter-home {
    background-color: #FFF;
    height: 100%;

    .news-wrap {
        position: relative;
        overflow: hidden;
        height: 21px;
        line-height: 21px;
        padding: 0 6px 0 69px;
        background-color: #2C3049;
        color: #FFF;

        .news-title {
            position: absolute;
            top: 0;
            left: 9px;
        }
    }
}
</style>
