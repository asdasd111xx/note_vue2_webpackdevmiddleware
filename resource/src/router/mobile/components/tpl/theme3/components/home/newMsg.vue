<template>
    <!-- 最新消息 -->
    <div :class="[$style['news-wrap'], 'clearfix']">
        <news
            :class="$style.news"
            :speed="150"
            :view-full-content="true"
        />
    </div>
</template>

<script>
import news from '@/router/web/components/common/news';

export default {
    components: {
        news
    }
};
</script>

<style lang="scss" module>
    .news-wrap {
        .news {
            height: 31px;
            line-height: 31px;
            color: #FFF;
            font-size: 12px;
        }
    }
</style>
