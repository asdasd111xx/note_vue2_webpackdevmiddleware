<template>
    <div :class="$style['pagination-wrap']">
        <div :class="[$style['first'], { [$style['disable']]: currentPage === 1 }]" @click="changePage(1)" />
        <div :class="[$style['previous'], { [$style['disable']]: currentPage === 1 }]" @click="changePage(currentPage - 1)" />
        <div :class="[$style['select-wrap'], 'clearfix']">
            <select
                :class="$style['selector']"
                :value="currentPage"
                @change="changePage($event.target.value)"
            >
                <option
                    v-for="index in totalPage"
                    :key="`page-${index}`"
                    :value="index"
                >
                    {{ index }}
                </option>
            </select>
            <div :class="$style['info']">/&nbsp;{{ totalPage }}</div>
        </div>
        <div :class="[$style['next'], { [$style['disable']]: currentPage === totalPage }]" @click="changePage(currentPage + 1)" />
        <div :class="[$style['last'], { [$style['disable']]: currentPage === totalPage }]" @click="changePage(totalPage)" />
    </div>
</template>

<script>
export default {
    props: {
        current: {
            type: String,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    },
    computed: {
        currentPage() {
            return +this.current;
        },
        totalPage() {
            return this.total;
        }
    },
    methods: {
        changePage(value) {
            if (value <= 0 || value === this.currentPage || value > this.totalPage) {
                return;
            }

            this.$emit('update:current', value.toString());
        }
    }
};
</script>

<style lang="scss" module>
.pagination-wrap {
    text-align: center;
}
.page-btn {
    display: inline-block;
    width: 42px;
    height: 42px;
    border-radius: 5px;
    border: 1px solid #CCC;
    background-color: #FFF;
    background-image: url("/static/image/member_page_arrow.png");
    background-repeat: no-repeat;
    cursor: pointer;
}
.first {
    composes: page-btn;
    margin-right: 8px;
    background-position: -120px 0;
}
.previous {
    composes: page-btn;
    background-position: -80px 0;
}
.next {
    composes: page-btn;
    margin-right: 8px;
    background-position: 0 0;
}
.last {
    composes: page-btn;
    background-position: -40px 0;
}
.disable {
    composes: page-btn;
    border-color: #F0F0F0;
    background-position-y: 100%;
    cursor: no-drop;
}

.select-wrap {
    display: inline-block;
    margin: 0 16px;

    .selector {
        float: left;
        padding: 0 24px 0 17px;
        margin-right: 8px;
        width: 68px;
        height: 42px;
        border-radius: 5px;
        border: 1px solid #CCC;
        background: #FFF url("/static/image/member_select_bg_arrow.png") 44px 50% no-repeat;
        cursor: pointer;
        outline: none;
        -webkit-appearance: none;
        -moz-appearance: none;
    }
    .info {
        float: left;
        height: 42px;
        line-height: 42px;
    }
}
</style>
