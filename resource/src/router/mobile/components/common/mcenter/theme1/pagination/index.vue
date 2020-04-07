<template>
    <paginate
        :value="page"
        :page-count="total"
        :prev-text="''"
        :next-text="''"
        :click-handler="setPage"
        :container-class="$style.container"
        :page-class="$style.page"
        :page-link-class="$style.link"
        :prev-class="$style.prev"
        :next-class="$style.next"
        :prev-link-class="$style['prev-link']"
        :next-link-class="$style['next-link']"
        :active-class="$style.active"
    />
</template>

<script>
import Paginate from 'vuejs-paginate';

export default {
    components: {
        Paginate
    },
    props: {
        page: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    },
    methods: {
        setPage(page) {
            this.$emit('update:page', page);
        }
    }
};
</script>

<style lang="scss" module>
.container {
    background-color: #DDD;
    margin: 0;
    padding: 6px 0 0;
    height: 42px;
    color: #333857;
    text-align: center;
    width: 100%;
    list-style-type: none;
}

.page {
    display: inline-block;
    width: 10%;
    height: 28px;
}

.prev {
    background: url('/static/image/mobile/mcenter/btn_page_previous_n.png') 0 0 / 100% 100% no-repeat;
    display: inline-block;
    width: 28px;
    height: 28px;
    vertical-align: bottom;
}

.next {
    background: url('/static/image/mobile/mcenter/btn_page_next_n.png') 0 0 / 100% 100% no-repeat;
    display: inline-block;
    width: 28px;
    height: 28px;
    vertical-align: bottom;
}

.link {
    color: inherit;
    line-height: 28px;
}

.active {
    background: url('/static/image/mobile/mcenter/btn_page_selected.png') 50% 0 / 28px 28px no-repeat;
    color: #FFF;

    :hover {
        color: #FFF;
        outline: none;
    }
}

.prev-link,
.next-link {
    display: block;
    width: inherit;
    height: inherit;
    outline: none;
}
</style>
