<template>
    <div>
        <tpl-header />
        <tpl-body />
        <tpl-footer />
    </div>
</template>

<script>
import tplHeader from './components/tplHeader';
import tplBody from './components/tplBody';
import tplFooter from './components/tplFooter';

export default {
    components: {
        tplHeader,
        tplBody,
        tplFooter
    }
};
</script>

<style lang="scss">
/****** 各模板共用 ******/
@import "~@/css/tpl/index.scss";
.body {
    padding-bottom: 40px;
    overflow-x: initial;
    word-break: break-all;
}
</style>
