<template>
    <div :class="$style.btn" @click="$emit('click')">{{ text }}</div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="scss" module>
.btn {
    background-color: #FFF;
    margin-bottom: 14px;
    width: 104px;
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    text-align: center;
    border: 1px solid #D5D5D5;
    border-radius: 2px;
    color: #334D5D;
    cursor: pointer;

    &:hover {
        background-color: #00B5AD;
        color: #FFF;
    }
}
</style>
