<template>
    <div>
        <marquee
            :direction="direction"
            :scrolldelay="speed"
            :onmouseover="viewFullContent ? 'this.stop()' : ''"
            :onmouseout="viewFullContent ? 'this.start()' : ''"
            class="news-content"
            @click="showDialog()"
        >
            <span>
                {{ title }} &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
        </marquee>
        <open-dialog
            :open="isShow"
            :title="title"
            :content="content"
            :img-src="imgSrc"
            :is-text="isText"
            @showDialog="showDialog"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import common from '@/api/common';
import openDialog from './dialog';

export default {
    components: {
        openDialog
    },
    props: {
        data: {
            type: Array,
            required: true
        },
        speed: {
            type: Number,
            required: true
        },
        direction: {
            type: String,
            required: true
        },
        viewFullContent: {
            type: Boolean,
            default: true
        },
        togglePopup: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            isShow: false,
            title: '',
            content: '',
            image: '',
            isText: true,
            imgSrc: '' // 圖片src路徑
        };
    },
    computed: {
        ...mapGetters({
            postData: 'getPost',
            loginStatus: 'getLoginStatus',
            curLang: 'getCurLang'
        })
    },
    beforeMount() {
        this.getPostData();
    },
    methods: {
        ...mapActions([
            'actionSetPost'
        ]),
        showDialog() {
            this.isShow = !this.isShow;
        },
        getPostData() {
            this.actionSetPost().then((value) => {
                if (value.result !== 'ok') {
                    return;
                }

                const data = value.ret;
                const lang = this.curLang.replace('-', '_');
                const title = data[0][`${lang}_title`];
                const content = data[0][`${lang}_content`];
                const image = data[0][`${lang}_image`];
                const isText = data[0].is_text;

                this.title = title ? `${title}` : null;
                this.isText = isText;

                if (isText) {
                    this.content = content ? `${content}` : null;
                    return;
                }

                if (image) {
                    common.image({
                        success: (res) => {
                            this.imgSrc = res.ret;
                        }
                    }, image);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
    .news-content {
        display: block;
        cursor: pointer;
        white-space: nowrap;
    }
</style>
