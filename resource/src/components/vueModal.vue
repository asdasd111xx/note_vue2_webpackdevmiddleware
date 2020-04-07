<template>
    <transition :name="$style.modal">
        <div :class="$style['modal-mask']">
            <div :class="$style['modal-wrapper']">
                <div :class="$style['modal-container']">
                    <div :class="$style['modal-header']">
                        <slot name="header">
                            {{ title }}
                            <div class="close-btn" @click="emit('close')">×</div>
                        </slot>
                    </div>
                    <div :class="$style['modal-body']">
                        <slot />
                    </div>
                    <div :class="$style['modal-footer']">
                        <slot name="footer">
                            <button class="modal-default-button" @click="$emit('confirm')">
                                {{ $text('S_JM_SURE_SEND', '确认送出') }}
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {};
    },
    computed: {
        ...mapGetters({})
    },
    methods: {
        ...mapActions([])
    }
};
</script>

<style lang="scss" module>
.modal-mask {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    background-color: #FFF;
    margin: 0px auto;
    width: 98%;
    max-width: 700px;
    min-height: 336px;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
    background-color: #333;
    height: 50px;
    line-height: 50px;
    color: #FFF;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
}

.modal-body {
    margin: 20px 0;
    padding: 20px 30px;
}

.modal-default-button {
    float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal {
    &:global(-enter) {
        opacity: 0;

        .modal-container {
            -webkit-transform: scale(1.1);
            transform: scale(1.1);
        }
    }
    &:global(-leave-active) {
        opacity: 0;

        .modal-container {
            -webkit-transform: scale(1.1);
            transform: scale(1.1);
        }
    }
}

</style>
