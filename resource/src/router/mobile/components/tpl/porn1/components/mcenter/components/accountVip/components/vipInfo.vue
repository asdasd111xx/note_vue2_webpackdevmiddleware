<template>
    <div :class="[$style['vip-info-wrap']]">
        <div :class="[$style['title']]">VIP3尊享</div>

        <div :class="[$style['cells-block']]">
            <div :class="[$style['cell']]" v-for="index in 5">
                <div :class="[$style['cell-icon']]">
                    <img
                        :src="
                            $getCdnPath(
                                `/static/image/_new/mcenter/vip/pic_vip_${index}.png`
                            )
                        "
                        alt="vip_bg"
                    />
                </div>
                <div :class="[$style['cell-text']]">
                    <div>5</div>
                    <div>每日提现次数</div>
                </div>
            </div>
        </div>

        <div :class="[$style['vip-detail']]">查看VIP详请 》</div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" module>
.vip-info-wrap {
    position: relative;
    width: 100%;
    height: 240px;
    top: 15px;
    padding: 0 17px;
    background: white;
}

.title {
    font-size: 18px;
    padding: 10px 0 15px 0;
    font-weight: 700;
    color: #424654;

    &::before {
        content: "";
        position: relative;
        display: inline-block;
        width: 3px;
        height: 20px;
        top: 2.5px;
        margin-right: 12px;
        background: linear-gradient(#d2bba4, #f1e5db);
    }
}

.cells-block {
    position: relative;
    display: flex;
    width: 100%;
    height: 160px;
    flex-wrap: wrap;

    .cell {
        width: 50%;
        display: flex;
    }

    .cell-icon {
        width: 35px;
        height: 35px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .cell-text {
        padding: 0 5px;
        color: #b4b9cf;

        div:first-of-type {
            font-size: 17px;
            color: black;
        }
    }
}

.vip-detail {
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: #bbab98;
}
</style>
