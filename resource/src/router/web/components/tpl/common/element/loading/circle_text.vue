<template>
    <div>
        <svg
            id="load"
            :style="styles"
            x="0px"
            y="0px"
            viewBox="0 0 150 150"
        >
            <circle
                id="loading-inner"
                cx="75"
                cy="75"
                r="60"
            />
        </svg>
        <h3 class="text-loading">Loading</h3>
    </div>
</template>
<script>
export default {
    props: {
        size: {
            type: String,
            default: '60px'
        }
    },
    computed: {
        styles() {
            return {
                width: this.size,
                height: this.size
            };
        }
    }
};
</script>
<style lang="scss" scoped>
    #load {
        width: 150px;
        animation: loading 3s linear infinite;
    }
    #loading-inner {
        animation: loading-circle 2s linear infinite;
        stroke: #CCC;
        fill: transparent;

        stroke: {
            dashoffset: 0;
            dasharray: 300;
            width: 10;
            miterlimit: 10;
            linecap: round;
        }
    }
    .text-loading {
        color: #D0D0D0;
        font-weight: normal;
    }

    @keyframes loading {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes loading-circle {
        0% {
            stroke-dashoffset: 0
        }
        100% {
            stroke-dashoffset: -600;
        }
    }
</style>
