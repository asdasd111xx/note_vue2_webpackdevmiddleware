<template>
    <div>
        <div :class="$style.title">{{ title }}</div>
        <div :class="$style['image-uploader']">
            <dropzone
                :cur-image="imagePath"
                :types="uploadType"
                :styles="dzStyle"
                :on-complete="onComplete"
                :on-remove="onRemove"
            >
                <div :class="$style['icon-upload-cloud']" />
                <div :class="$style['uploader-text']">
                    <div>{{ $text('S_UPLOAD_IMG_HERE', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
                    <div>{{ $text('S_OR', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
                </div>
                <div :class="$style['btn-upload']">{{ $text('S_UPLOAD_FILE', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
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
        title: {
            type: String,
            required: true
        },
        imagePath: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            dzStyle: {
                width: '190px',
                height: '168px',
                border: 'none'
            },
            uploadType: ['jpg', 'jpeg', 'gif', 'png']
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        onComplete(id, name, response) {
            this.$emit('update:imagePath', response.data.link);
        },
        onRemove() {
            this.$emit('update:imagePath', '');
        }
    }
};
</script>

<style lang="scss" module>
.image-uploader {
    width: 192px;
    height: 170px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #D5D5D5;
}

.icon-upload-cloud {
    background: url('/static/image/element/widget/ui/bg_upload.png') 0 0 no-repeat;
    margin: 32px auto 8px;
    width: 50px;
    height: 36px;
}

.uploader-text {
    line-height: 1.3;
    font-size: 13px;
    color: #ACDEDC;
}

.btn-upload {
    background: url('/static/image/element/widget/ui/icon_arrow.png') 12px 6px no-repeat #00B5AD;
    display: inline-block;
    width: 90px;
    height: 26px;
    line-height: 2.2;
    font-size: 12px;
    color: #FFF;
    border-radius: 13px;
    text-indent: 12px;
}
</style>
