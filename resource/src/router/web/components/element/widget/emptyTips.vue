<template>
    <div
        :class="$style['empty-tips-wrap']"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <div
            v-show="mode === 'view'"
            :class="$style['tip-switch-mode']"
        >
            <icon
                :class="$style.icon"
                name="hand-point-left"
                scale="1.5"
            />
            &nbsp;&nbsp;點此切換為編輯狀態
        </div>
        <div
            v-show="mode === 'edit'"
            :class="$style['tip-add-widget']"
        >
            <icon
                :class="$style.icon"
                name="hand-point-down"
                scale="1.5"
            />
            &nbsp;&nbsp;點此新增部件狀態
        </div>
    </div>
</template>

<script>
export default {
    props: {
        mode: {
            type: String,
            required: true
        }
    }
};
</script>


<style lang="scss" module>
.empty-tips-wrap {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    border: 6px dashed #999;
}

.tip {
    position: absolute;
    color: #999;
    font-size: 16px;
}

.tip-switch-mode {
    composes: tip;
    top: 12px;
    left: 100px;
    animation: shake1 3s;
    animation-iteration-count: infinite;
}

.tip-add-widget {
    composes: tip;
    bottom: 10px;
    left: 200px;
    animation: shake2 3s;
    animation-iteration-count: infinite;
}

.icon {
    vertical-align: bottom;
}

@keyframes shake1 {
    20%, 60% {
        top: 14px;
    }

    40%, 80% {
        top: 12px;
    }
}

@keyframes shake2 {
    20%, 60% {
        bottom: 12px;
    }

    40%, 80% {
        bottom: 10px;
    }
}

</style>
