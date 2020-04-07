<template>
    <div
        class="flash-viewer-container"
        @click="toggleFlsState"
    >
        <object
            :data="flashUrl"
            :style="`top: calc(50% - ${flashHeight / 2}px);`"
            type="application/x-shockwave-flash"
            class="flash-preview"
        />
    </div>
</template>

<script>
export default {
    props: {
        flashHeight: {
            type: [String, Number],
            required: true
        },
        flashUrl: {
            type: String,
            required: true
        }
    },
    data() {
        return {
        };
    },
    methods: {
        toggleFlsState() {
            document.querySelector('.flash-viewer-container').style.display = 'none';
        }
    }
};
</script>


<style lang="scss" scoped>
    .flash-viewer-container {
        background: rgba(0, 0, 0, 0.85);
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        text-align: center;

        .flash-preview {
            position: relative;
        }
    }
</style>
