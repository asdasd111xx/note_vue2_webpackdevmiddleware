<template>
    <div class="info-post">
        <div class="main-title clearfix">
            <span>{{ $t('S_HOT_NEWS') }}</span>
        </div>
        <table v-if="postData.list.length !== 0" class="main-table">
            <thead class="main-thead agcenter-pc">
                <tr>
                    <th class="number">{{ $t('S_NUMBER_NO') }}</th>
                    <th class="category">{{ $t('S_POPUP_CATEGORY') }}</th>
                    <th class="title">{{ $t('S_CR_HEADLINE') }}</th>
                    <th class="date">{{ $t('S_ADDDATE_MSG') }}</th>
                </tr>
            </thead>
            <tbody class="main-tbody">
                <template v-for="(item, index) in postData.list">
                    <template v-if="index >= (pageNow - 1) * numMax && index < pageNow * numMax">
                        <tr
                            :key="index"
                            :class="`message-list agcenter-pc ${selectId === index ? 'current' : ''}`"
                            @click="selectMessage(index)"
                        >
                            <td class="number">{{ index + 1 }}</td>
                            <td class="category">{{ $t(popupData[index]) }}</td>
                            <td class="title">{{ item.title }}</td>
                            <td class="date">{{ EST(item.enable_at) }}</td>
                        </tr>
                        <tr
                            v-if="selectId === index"
                            :key="index"
                            class="message-detail agcenter-pc ckeditor-default-style"
                        >
                            <!-- eslint-disable vue/no-v-html -->
                            <td
                                v-if="item.content"
                                class="message-detail-wrap ckeditor-default-style"
                                colspan="4"
                                v-html="item.content.replace(/\n/ig, '')"
                            />
                            <!-- eslint-enable vue/no-v-html -->
                            <td
                                v-if="item.image"
                                class="message-detail-wrap"
                                colspan="4"
                            >
                                <img
                                    :src="eleImg[item.id]"
                                    class="message-detail-img"
                                    @click="onLinkTo(item.url, item.open, item.title)"
                                />
                            </td>
                        </tr>
                        <table
                            :key="index"
                            class="pad"
                        >
                            <tr :class="`message-list ${selectId === index ? 'current' : ''}`" @click="selectMessage(index)">
                                <td colspan="2" class="number">{{ index + 1 }}</td>
                            </tr>
                            <tr :class="`message-list ${selectId === index ? 'current' : ''}`" @click="selectMessage(index)">
                                <td colspan="2" class="category">{{ $t(popupData[index]) }}</td>
                            </tr>
                            <tr :class="`message-list ${selectId === index ? 'current' : ''}`" @click="selectMessage(index)">
                                <td class="title caption">{{ $t('S_CR_HEADLINE') }}</td>
                                <td class="title content">{{ item.title }}</td>
                            </tr>
                            <tr :class="`message-list ${selectId === index ? 'current' : ''}`" @click="selectMessage(index)">
                                <td class="date caption">{{ $t('S_ADDDATE_MSG') }}</td>
                                <td class="date content">{{ EST(item.enable_at) }}</td>
                            </tr>
                            <tr v-if="selectId === index" class="message-detail ckeditor-default-style">
                                <!-- eslint-disable vue/no-v-html -->
                                <td
                                    v-if="item.content"
                                    class="message-detail-wrap ckeditor-default-style"
                                    colspan="2"
                                    v-html="item.content.replace(/\n/ig, '')"
                                />
                                <!-- eslint-enable vue/no-v-html -->
                                <td
                                    v-if="item.image"
                                    class="message-detail-wrap"
                                    colspan="2"
                                >
                                    <img
                                        :src="eleImg[item.id]"
                                        class="message-detail-img"
                                        @click="onLinkTo(item.url, item.open, item.title)"
                                    />
                                </td>
                            </tr>
                        </table>
                    </template>
                </template>
            </tbody>
        </table>
        <div v-else class="icon-wrap">
            <icon
                class="icon"
                name="exclamation-circle"
                width="120"
                height="120"
            />
            <span>{{ $text('S_NO_DATA_GENERATED', '尚未产生数据') }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import common from '@/api/common';
import EST from '@/lib/EST';

export default {
    data() {
        return {
            popData: [], // 要顯示的資料
            popupData: [], // 要顯示的類別資料
            numMax: 10, // 每頁顯示幾筆
            pageAll: 1, // 外層總頁數
            pageNow: 1, // 外層當前頁
            selectId: '',
            eleImg: {} // 圖片src路徑
        };
    },
    computed: {
        ...mapGetters({
            postData: 'getAgentPost',
            loginStatus: 'getLoginStatus'
        })
    },
    watch: {
        postData() {
            this.pageNow = 1;
            if (this.postData.list.length === 0) {
                this.pageAll = 1;
                return;
            }
            this.pageAll = Math.ceil(this.postData.list.length / this.numMax);
        }
    },
    created() {
        const data = this.postData.list;

        data.forEach((item) => {
            let category;

            switch (item.category) {
                case 1:
                    category = 'S_HOT_NEWS_2';
                    break;
                case 2:
                    category = 'S_POPUP_IMPORTANT';
                    break;
                case 3:
                    category = 'S_POPUP_ACTIVITY';
                    break;
                case 4:
                    category = 'S_POPUP_MAINTENANCE';
                    break;
                default:
                    category = 'S_POPUP_NONE';
                    break;
            }

            this.popData.push({
                ...item
            });

            this.popupData.push(category);

            if (item.image) {
                common.image({
                    success: (res) => {
                        const img = {
                            ...this.eleImg,
                            [item.id]: res.ret
                        };
                        this.eleImg = img;
                    }
                }, item.image);
            }
        });
    },
    methods: {
        pageChange(page) {
            this.pageNow = page;
        },
        selectMessage(id) {
            if (this.selectId === id) {
                this.selectId = '';
                return;
            }
            this.selectId = id;
        },
        onLinkTo(url, open, title) {
            let target;
            let setting;

            switch (open) {
                case 1:
                    target = '_self';
                    break;
                case 2:
                    target = '_blank';
                    break;
                case 3:
                    target = title;
                    setting = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=2,width=1024,height=640';
                    break;
                default:
                    target = '_self';
                    break;
            }

            if (setting) {
                window.open(url, target, setting);
                return;
            }

            window.open(url, target);
        },
        EST
    }
};
</script>

<style lang="scss" src="@/css/fckeditor.scss"></style>
<style src="../css/index.scss" lang="scss" scoped />
