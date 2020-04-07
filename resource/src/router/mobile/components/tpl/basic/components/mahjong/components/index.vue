<template>
    <div class="mahjong-wrap">
        <mahjong v-if="isReceive" :element="element" />
    </div>
</template>

<script>
import ajax from '@/lib/ajax';
import * as api from '@/config/api';
import mahjong from '@/router/web/components/element/hall/gameList';

export default {
    components: {
        mahjong
    },
    data() {
        return {
            isReceive: false,
            element: {
                i: 'mahjong',
                category: 'hall',
                type: 'gameList',
                theme: 'A',
                case: {
                    data: [],
                    setting: {
                        'background-color': null,
                        'background-image': null,
                        'background-position': 'ct',
                        'background-repeat': 'no-repeat'
                    }
                }
            }
        };
    },
    created() {
        const params = {
            kind: 6,
            vendor: this.$route.params.vendor,
            label: '',
            first_result: 0,
            max_results: 1000,
            enable: true
        };

        ajax({ method: 'get', url: api.gameList, params })
            .then((response) => {
                if (response.result === 'ok') {
                    this.element.case.data = response.ret.map((item) => ({ gameType: item.code, vendor: item.vendor, kind: item.kind }));
                    this.isReceive = true;
                }
            });
    }
};
</script>

<style lang="scss" scoped>
.mahjong-wrap {
    min-height: calc(100vh - 85px);
    background-color: #272637;

    /deep/ {
        .tpl-wrap {
            .game-list-wrap {
                padding: 15px 0;
            }
        }
    }
}
</style>
