<template>
    <div class="collection-wrap">
        <collection-tab
            :self-store="$observables"
            :store-methods="collection.getMethods($observables)"
        />
        <collection-content
            :self-store="$observables"
            :store-methods="collection.getMethods($observables)"
        />
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import collection from './js/collection';
import collectionTab from './components/collectionTab';
import collectionContent from './components/collectionContent';

/**
 * 客端下方最近玩過、最愛快捷選單
 * @module tpl/collection
 */
export default {
    components: {
        collectionTab,
        collectionContent
    },
    subscriptions() {
        return cloneDeep(collection.props);
    },
    data() {
        return {
            collection
        };
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
