<template>
    <div :class="$style['edit-display']">
        <div>
            <span>PC</span>
            <label :class="{ [$style.active]: +value.pc[curLang] }" @click="onClick('pc')"><span /></label>
        </div>
        <div>
            <span>MOBILE</span>
            <label :class="{ [$style.active]: +value.mobile[curLang] }" @click="onClick('mobile')"><span /></label>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        value: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        })
    },
    methods: {
        onClick(device) {
            this.$emit('input', {
                ...this.value,
                [device]: {
                    ...this.value[device],
                    [this.curLang]: !+this.value[device][this.curLang] ? '1' : '0'
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.edit-display {
    margin: 15px 10px;

    > div {
        margin: 5px 0;
        vertical-align: middle;

        > span {
            vertical-align: middle;
        }

        > label {
            display: inline-block;
            width: 50px;
            height: 30px;
            margin-left: 3px;
            border: 1px solid #EEE;
            border-radius: 15px;
            background-color: #EEE;
            vertical-align: middle;
            cursor: pointer;

            span {
                display: block;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background-color: #FFF;
                box-shadow: 0 0 2px #999;
                transition: 0.4s;
                transform: translateX(20px);
            }
        }

        .active {
            background-color: #2185D0;

            span {
                transform: translateX(0);
            }
        }
    }
}
</style>
