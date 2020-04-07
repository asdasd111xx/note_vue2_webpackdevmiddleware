<template>
    <div
        ref="line-wrap"
        class="line-wrap"
    >
        <slot />
        <div
            v-for="(info, type) in lines"
            v-show="visible && info.visible"
            ref="line"
            :key="type"
            :class="`line pos-${type} is-${type[0]}`"
            :style="{ left: `${info.position[1]}px`, top: `${info.position[0]}px` }"
        />
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';

export default {
    props: {
        selectedIndex: {
            type: Number,
            required: true
        },
        widgetsInfo: {
            type: Array,
            default: () => []
        },
        visible: {
            type: Boolean,
            default: false
        },
        updateInfo: {
            type: Function,
            required: true
        }
    },
    data() {
        const lines = {
            xt: {
                visible: false,
                position: [0, 0]
            },
            xc: {
                visible: false,
                position: [0, 0]
            },
            xb: {
                visible: false,
                position: [0, 0]
            },
            yl: {
                visible: false,
                position: [0, 0]
            },
            yc: {
                visible: false,
                position: [0, 0]
            },
            yr: {
                visible: false,
                position: [0, 0]
            }
        };
        return {
            gap: 3,
            defLine: lines,
            lines: cloneDeep(lines),
            unWatch: null,
            lock: false
        };
    },
    watch: {
        selectedIndex(index) {
            if (this.unWatch) {
                this.unWatch();
            }

            if (index >= 0) {
                this.unWatch = this.$watch(`widgetsInfo.${index}`, this.setRefLine);
            }
        }
    },
    methods: {
        getPos(node) {
            const parentRect = this.$refs['line-wrap'].getBoundingClientRect();
            const draggingRect = node.getBoundingClientRect();

            return {
                width: draggingRect.width,
                height: draggingRect.height,
                top: draggingRect.top - parentRect.top,
                left: draggingRect.left - parentRect.left
            };
        },
        isNearly(dragVal, targetVal) {
            return Math.abs(dragVal - targetVal) <= this.gap;
        },
        setRefLine() {
            // 重設所有線條
            this.lines = cloneDeep(this.defLine);

            // 使用者未選取元素時不執行
            if (!(this.selectedIndex >= 0) || !this.visible) {
                return;
            }

            this.count += 1;

            const parentRect = this.$refs['line-wrap'].getBoundingClientRect();
            const nodes = this.$children.map((vueComponent) => vueComponent.$el);
            const drag = nodes[this.selectedIndex];
            const checkArr = nodes.filter((node, index) => index !== this.selectedIndex);
            const dragPos = this.getPos(drag);

            checkArr.forEach((node) => {
                const nodePos = this.getPos(node);
                const dragWidthHalf = dragPos.width / 2;
                const dragHeightHalf = dragPos.height / 2;
                const nodeWidthHalf = nodePos.width / 2;
                const nodeHeightHalf = nodePos.height / 2;

                const conditions = {
                    top: [
                        // xt-top
                        {
                            isNearly: this.isNearly(dragPos.top, nodePos.top),
                            lineNode: 'xt',
                            lineValue: nodePos.top,
                            dragValue: nodePos.top
                        },
                        // xt-bottom
                        {
                            isNearly: this.isNearly(dragPos.top + dragPos.height, nodePos.top),
                            lineNode: 'xt',
                            lineValue: nodePos.top,
                            dragValue: nodePos.top - dragPos.height
                        },
                        // xc
                        {
                            isNearly: this.isNearly(dragPos.top + dragHeightHalf, nodePos.top + nodeHeightHalf),
                            lineNode: 'xc',
                            lineValue: nodePos.top + nodeHeightHalf,
                            dragValue: (nodePos.top + nodeHeightHalf) - dragHeightHalf
                        },
                        // xb-top
                        {
                            isNearly: this.isNearly(dragPos.top, nodePos.top + nodePos.height),
                            lineNode: 'xb',
                            lineValue: nodePos.top + nodePos.height,
                            dragValue: nodePos.top + nodePos.height
                        },
                        // xb-bottom
                        {
                            isNearly: this.isNearly(dragPos.top + dragPos.height, nodePos.top + nodePos.height),
                            lineNode: 'xb',
                            lineValue: nodePos.top + nodePos.height,
                            dragValue: (nodePos.top + nodePos.height) - dragPos.height
                        }
                    ],
                    left: [
                        // yl-left
                        {
                            isNearly: this.isNearly(dragPos.left, nodePos.left),
                            lineNode: 'yl',
                            lineValue: nodePos.left,
                            dragValue: nodePos.left
                        },
                        // yl-right
                        {
                            isNearly: this.isNearly(dragPos.left + dragPos.width, nodePos.left),
                            lineNode: 'yl',
                            lineValue: nodePos.left,
                            dragValue: nodePos.left - dragPos.width
                        },
                        // yc
                        {
                            isNearly: this.isNearly(dragPos.left + dragWidthHalf, nodePos.left + nodeWidthHalf),
                            lineNode: 'yc',
                            lineValue: nodePos.left + nodeWidthHalf,
                            dragValue: (nodePos.left + nodeWidthHalf) - dragWidthHalf
                        },
                        // yr-left
                        {
                            isNearly: this.isNearly(dragPos.left, nodePos.left + nodePos.width),
                            lineNode: 'yr',
                            lineValue: nodePos.left + nodePos.width,
                            dragValue: nodePos.left + nodePos.width
                        },
                        // yr-right
                        {
                            isNearly: this.isNearly(dragPos.left + dragPos.width, nodePos.left + nodePos.width),
                            lineNode: 'yr',
                            lineValue: nodePos.left + nodePos.width,
                            dragValue: (nodePos.left + nodePos.width) - dragPos.width
                        }
                    ]
                };

                const update = {};
                let hasAttract = false;

                Object.keys(conditions).forEach((type) => {
                    conditions[type].forEach((condition) => {
                        if (!condition.isNearly) {
                            return;
                        }

                        hasAttract = true;

                        // 邊界偵測 - Start
                        let attractValue = condition.dragValue;

                        if (attractValue < 0) {
                            attractValue = 0;
                        }

                        if (type === 'top' && attractValue > parentRect.height - dragPos.height) {
                            attractValue = parentRect.height - dragPos.height;
                        }

                        if (type === 'left' && attractValue > parentRect.width - dragPos.width) {
                            attractValue = parentRect.width - dragPos.width;
                        }
                        // 邊界偵測 - End

                        // 操作 dom 執行吸附
                        drag.style[type] = `${attractValue}px`;

                        this.lines = {
                            ...this.lines,
                            [condition.lineNode]: {
                                ...this.lines[condition.lineNode],
                                position: type === 'top' ? [condition.lineValue, 0] : [0, condition.lineValue],
                                visible: true
                            }
                        };

                        update[type === 'top' ? 'y' : 'x'] = attractValue;
                    });
                });

                // 更新資料面 - widget 資訊
                this.$nextTick(() => {
                    if (this.lock) {
                        return;
                    }

                    this.updateInfo(update);

                    if (hasAttract) {
                        this.lock = true;
                    }

                    // 防止無窮吸附產生的無窮迴圈，用一偵的時間中斷組件更新
                    setTimeout(() => {
                        this.lock = false;
                    }, 1);
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>

.line-wrap {
    height: 100%;
    min-height: 1px; // 避免外層高度為 0 造成程式錯誤

    .line {
        opacity: .7;
        position: absolute;
        background: #4DAEFF;
        z-index: 199111250;
        width: 100%;
        height: 1px;

        &.is-y {
            width: 1px;
            height: 100%;
        }
    }
}
</style>
