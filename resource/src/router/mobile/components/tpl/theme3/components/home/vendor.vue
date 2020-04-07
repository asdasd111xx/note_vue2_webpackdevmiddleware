<template>
    <component
        :is="model"
        :type="type"
        :model="model"
        :info="info"
        :index="index"
        :length="length"
        @play="play"
    />
</template>

<script>
import { mapGetters } from 'vuex';
import openGame from '@/lib/open_game';

export default {
    components: {
        // Card 模式
        card: () => import(/* webpackChunkName: 'card' */'./card')
    },
    props: {
        type: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        info: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        length: {
            type: Number,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        })
    },
    methods: {
        /**
         * 開啟遊戲
         * @method play
         * @param {string} vendor - 遊戲供應商名稱
         * @param {number} kind - 遊戲分類代號
         * @param {string} path - 遊戲大廳路徑
         */
        play({ vendor, kind, path }) {
            // 有遊戲大廳的遊戲
            if ([3, 5, 6].includes(kind)) {
                this.$router.push(path);
                return;
            }

            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            openGame({ vendor, kind });
        }
    }
};
</script>
