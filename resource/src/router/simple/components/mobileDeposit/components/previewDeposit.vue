<template>
    <div class="basic-wrap">
        <div class="deposit-preview-wrap">
            <div class="preview-wrap">
                <div
                    v-for="index in 3"
                    :key="`preview-group-${index}`"
                    class="pay-group-item"
                >
                    <div class="preview-img" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.preview-wrap {
    margin-top: 25px;
}

.pay-group-item {
    display: inline-block;
    vertical-align: top;
    width: 46%;
    height: 38px;
    margin: 0 0 10px 3%;
    border-radius: 4px;
    background-color: #DEDEDE;
}

.preview-img {
    width: 115px;
    height: 16px;
    margin: 12px auto;
    background-color: #E5E5E5;
}
</style>
