<template>
    <div :class="mainClass">
        <div :class="$style[`theme-${element.theme}`]">
            <dropzone
                :cur-image="value.image[curLang]"
                :types="['jpg', 'jpeg', 'gif', 'png']"
                :styles="{ width: '100%', height: '150px', 'box-sizing': 'content-box' }"
                :max-size="2097152"
                :max-width="1080"
                :min-width="1080"
                :max-height="230"
                :min-height="230"
                :on-complete="(id, name, response) => { onComplete('image', response) }"
                :on-remove="() => { onRemove('image') }"
            >
                <div :class="$style.tips">
                    <img :src="$getCdnPath('/static/image/common/upload-straight.png')" />
                    <span>JPG JPEG GIF PNG</span>
                    <br />
                    <span>{{ $text('S_MAX_SIZE', '尺寸上限') }} 1080X230</span>
                    <br />
                    <span>{{ $text('S_UPLOAD_FILE_SIZE_LIMIT', '最大档案限制不得超过') }} 2Mb</span>
                </div>
            </dropzone>
        </div>
        <div v-if="element.theme === 'A'" :class="$style.card">
            <dropzone
                :cur-image="value.card[curLang]"
                :types="['jpg', 'jpeg', 'gif', 'png']"
                :styles="{ width: '100%', height: '150px', 'box-sizing': 'content-box' }"
                :max-size="2097152"
                :max-width="366"
                :min-width="366"
                :max-height="300"
                :min-height="300"
                :on-complete="(id, name, response) => { onComplete('card', response) }"
                :on-remove="() => { onRemove('card') }"
            >
                <div :class="$style.tips">
                    <img :src="$getCdnPath('/static/image/common/upload-straight.png')" />
                    <span>JPG JPEG GIF PNG</span>
                    <br />
                    <span>{{ $text('S_MAX_SIZE', '尺寸上限') }} 366X300</span>
                    <br />
                    <span>{{ $text('S_UPLOAD_FILE_SIZE_LIMIT', '最大档案限制不得超过') }} 2Mb</span>
                </div>
            </dropzone>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dropzone from '@/components/dropzone';

export default {
    components: {
        dropzone
    },
    props: {
        value: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        }),
        mainClass() {
            const image = this.value.image[this.curLang];
            const card = this.value.card[this.curLang];
            const noImage = this.element.theme === 'A' ? !image && !card : !image;

            return {
                [this.$style['edit-image']]: true,
                [this.$style['no-image']]: noImage,
                clearfix: true
            };
        }
    },
    methods: {
        onComplete(key, response) {
            this.$emit('input', {
                ...this.value,
                [key]: {
                    ...this.value[key],
                    [this.curLang]: response.data.link
                }
            });
        },
        onRemove(key) {
            this.$emit('input', {
                ...this.value,
                [key]: {
                    ...this.value[key],
                    [this.curLang]: ''
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.edit-image {
    margin: 20px 10px 0;
}

.no-image {
    margin-bottom: 21px;
}

.image {
    float: left;
}

.theme-A {
    composes: image;
    width: 63%;
}

.theme-B {
    composes: image;
    width: 100%;
}

.card {
    float: right;
    width: 35%;
}

.tips {
    margin-top: 9px;
    text-align: center;

    > img {
        display: block;
        margin: 0 auto;
    }
}
</style>
