<template>
    <div class="article-links-wrap">
        <div
            v-for="(linksInfo, index) in linksData"
            :key="`links-${index}`"
            class="article-links"
            @click="changePage(linksInfo.pageType)"
        >
            <button>{{ linksInfo.title[language] }}</button>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import i18nList from '../config/lang';

export default {
    data() {
        return {
            linksData: [
                {
                    title: i18nList.articleLinks01,
                    pageType: {
                        page: 6052,
                        type: 'custom'
                    }
                },
                {
                    title: i18nList.articleLinks02,
                    pageType: {
                        page: 6053,
                        type: 'custom'
                    }
                },
                {
                    title: i18nList.articleLinks03,
                    pageType: {
                        page: 6054,
                        type: 'custom'
                    }
                },
                {
                    title: i18nList.articleLinks04,
                    pageType: {
                        page: 6055,
                        type: 'custom'
                    }
                },
                {
                    title: i18nList.articleLinks05,
                    pageType: {
                        page: 6056,
                        type: 'custom'
                    }
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang'
        }),
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(pageType) {
            if (this.isBackEnd) {
                return;
            }
            this.actionChangePage(pageType);
        }
    }
};
</script>

<style lang="scss" src="../css/articleLinks.scss" scoped />
