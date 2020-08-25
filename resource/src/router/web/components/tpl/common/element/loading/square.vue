<template>
    <div id="squares">
        <div
            id="squares_1"
            :style="spinnerStyle"
            class="squares-item"
        />
        <div
            id="squares_2"
            :style="spinnerStyle"
            class="squares-item"
        />
        <div
            id="squares_3"
            :style="spinnerStyle"
            class="squares-item"
        />
        <div
            id="squares_4"
            :style="spinnerStyle"
            class="squares-item"
        />
        <div
            id="squares_5"
            :style="spinnerStyle"
            class="squares-item"
        />
        <div
            id="squares_6"
            :style="spinnerStyle"
            class="squares-item"
        />
        <div
            id="squares_7"
            :style="spinnerStyle"
            class="squares-item"
        />
    </div>
</template>

<script>
export default {
    props: {
        size: {
            type: String,
            default: '10px'
        }
    },
    data() {
        return {
            spinnerStyle: {
                height: this.size,
                width: this.size
            }
        };
    }
};
</script>

<style>
#squares {
    position: relative;
    width: 77px;
    height: 10px;
    margin: 0 auto;
}
.squares-item {
    position: absolute;
    top: 0;
    animation-name: bounce_squares;
    -webkit-animation-name: bounce_squares;
    animation-duration: 1.3s;
    -webkit-animation-duration: 1.3s;
    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;
    animation-direction: normal;
    -webkit-animation-direction: normal;
}
#squares_1 {
    left: 0;
    animation-delay: 0.52s;
    -webkit-animation-delay: 0.52s;
}
#squares_2 {
    left: 11px;
    animation-delay: 0.65s;
    -webkit-animation-delay: 0.65s;
}
#squares_3 {
    left: 22px;
    animation-delay: 0.78s;
    -webkit-animation-delay: 0.78s;
}
#squares_4 {
    left: 33px;
    animation-delay: 0.91s;
    -webkit-animation-delay: 0.91s;
}
#squares_5 {
    left: 44px;
    animation-delay: 1.04s;
    -webkit-animation-delay: 1.04s;
}
#squares_6 {
    left: 55px;
    animation-delay: 1.17s;
    -webkit-animation-delay: 1.17s;
}
#squares_7 {
    left: 66px;
    animation-delay: 1.3s;
    -webkit-animation-delay: 1.3s;
}

@keyframes bounce_squares {
0% {
    background-color: #333;
}
100% {
    background-color: #999;
}
}
@-webkit-keyframes bounce_squares {
0% {
    background-color: #333;
}
100% {
    background-color: #999;
}
}
</style>
