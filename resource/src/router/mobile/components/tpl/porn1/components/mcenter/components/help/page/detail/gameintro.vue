<template>
    <div
        v-if="data"
        :class="$style['detail-article-wrap']"
        :style="{ height: `${divHeight}px` }"
        ref="detail-article-wrap"
    >
        <div :class="$style['article-title']">
            {{ data.title }}
        </div>
        <div :class="$style['article-content']">
            <div
                v-for="(item, index) in data.content"
                :class="$style['article-block']"
            >
                {{ item }}
            </div>
        </div>
    </div>
</template>

<script>
import info from "../../json/gameintro.json";
export default {
    props: {
        index: {
            type: String,
            required: true
        },
        keys: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            data: info.data[this.index].list.find(item => {
                return +item.key === +this.keys;
            }),
            divHeight: 0
        };
    },
    mounted() {
        // Header height(43) + Margin top(10)
        this.divHeight = document.body.offsetHeight - 53;
    }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module />
