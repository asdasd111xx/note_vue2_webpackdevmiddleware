<template>
    <div
        :class="['icon-wrap', { 'is-active': isActive }]"
        @mousedown="onMouseDown"
    >
        <div class="cycle" />
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    props: {
        caseData: {
            type: Array,
            default: () => []
        },
        wrapStyle: {
            type: Object,
            required: true
        },
        widgetRefs: {
            type: [Object, Array],
            required: true
        }
    },
    data() {
        return {
            isActive: false,
            minHeight: 0,
            diffY: null
        };
    },
    mounted() {
        document.addEventListener('mouseup', this.onMouseUp);
    },
    beforeDestroy() {
        document.removeEventListener('mouseup', this.onMouseUp);
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        onMouseDown(e) {
            const wrapRect = this.$parent.$refs.widget.getBoundingClientRect();
            // IE 不支援 getBoundingClientRect() (x and y)
            const wrapRectY = wrapRect.top;

            this.caseData.forEach((curData) => {
                if (this.minHeight < +curData.h + +curData.y) {
                    this.minHeight = +curData.h + +curData.y;
                }
            });

            this.isActive = true;
            this.diffY = e.clientY - (wrapRectY + wrapRect.height);
            document.addEventListener('mousemove', this.onMouseMove);
        },
        onMouseUp() {
            if (!this.isActive) {
                return;
            }

            this.isActive = false;
            this.diffY = null;
            this.minHeight = 0;

            document.removeEventListener('mousemove', this.onMouseMove);

            if (this.wrapStyle.height !== this.$parent.$refs.widget.style.height) {
                this.$emit('update:wrapStyle', { ...this.wrapStyle, height: `${this.$parent.$refs.widget.style.height}` });
            }
        },
        onMouseMove(e) {
            if (!this.isActive) {
                return;
            }

            const wrapRect = this.$parent.$refs.widget.getBoundingClientRect();
            const moveHeight = e.clientY - wrapRect.top - this.diffY;
            this.$parent.$refs.widget.style.height = `${moveHeight <= this.minHeight ? this.minHeight : moveHeight}px`;
        }
    }
};
</script>


<style lang="scss" scoped>
.icon-wrap {
    position: absolute;
    bottom: -15px;
    left: 50%;
    margin-right: 15px;
    width: 30px;
    height: 30px;
    z-index: 101;
    cursor: grab;

    &::before {
        content: '';
        position: absolute;
        background: #FFF;
        width: 10px;
        height: 10px;
        top: 50%;
        left: 50%;
        margin-top: -5px;
        margin-left: -5px;
        border-radius: 5px;
        border: 2px solid #2185D0;
    }
}
</style>
