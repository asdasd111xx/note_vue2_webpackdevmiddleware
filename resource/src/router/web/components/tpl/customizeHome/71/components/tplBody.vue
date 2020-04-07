<template>
    <div>
        <slider />
        <promotions />
        <game />
        <bottom />
    </div>
</template>

<script>
import slider from './slider';
import promotions from './promotions';
import game from './game';
import bottom from './bottom';

export default {
    components: {
        slider,
        promotions,
        game,
        bottom
    }
};
</script>
