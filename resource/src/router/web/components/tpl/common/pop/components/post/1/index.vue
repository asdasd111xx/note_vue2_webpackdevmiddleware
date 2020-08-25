<template>
    <transition name="fade">
        <div class="pop-post-wrap pop-class">
            <div class="close-btn" @click="close()">×</div>
            <div class="title">{{ $t('S_HOT_NEWS') }}</div>
            <div class="content-wrap">
                <div class="content">
                    <template v-for="(item, index) in data">
                        <template v-if="index < 3">
                            <div :key="index" class="content-title">
                                {{ item.title }}
                            </div>
                            <!-- eslint-disable vue/no-v-html -->
                            <div
                                :key="index"
                                class="content-detail ckeditor-default-style"
                                v-html="item.content.replace(/\n/ig, '')"
                            />
                            <!-- eslint-enable vue/no-v-html -->
                        </template>
                    </template>
                </div>
            </div>
            <div class="bottom">
                <input
                    id="checkbox"
                    type="checkbox"
                    class="checkbox"
                    @click="showToggle"
                />
                <label for="checkbox">
                    {{ $t('S_SHOW_TODAY') }}
                </label>
            </div>
        </div>
    </transition>
</template>

<script>
/* global $ */
import { mapActions } from 'vuex';

export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        close() {
            this.actionSetPop();
        },
        showToggle() {
            this.$cookie.set('postStatus', $(this.$el).find('#checkbox').prop('checked'));
        },
        ...mapActions([
            'actionSetPop'
        ])
    }
};
</script>

<style lang="scss" src="@/css/fckeditor.scss" scoped></style>
<style lang="scss" src="../../../css/post/1/index.scss" scoped></style>
