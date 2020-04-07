<template>
    <div>
        <tpl-header />
        <tpl-body />
        <tpl-footer />
    </div>
</template>

<script>
import tplHeader from './components/tplHeader';
import tplBody from '../../page';
import tplFooter from './components/tplFooter';

export default {
    components: {
        tplHeader,
        tplBody,
        tplFooter
    }
};
</script>

<style lang="scss" src="./css/index.scss" />
