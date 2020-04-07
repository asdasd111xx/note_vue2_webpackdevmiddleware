<template>
    <div>
        <copywriting v-if="isCopywriting" />
        <promotion v-if="templateName === 'promotion'" />
        <sponsor v-if="templateName === 'south-sponsor'" />
        <sponsor2 v-if="templateName === 'spain-sponsor'" />
        <sportBet v-if="templateName === 'sportBet'" />
    </div>
</template>

<script>
import copywriting from './components/copywriting';
import promotion from './components/promotion';
import sponsor from './components/sponsor';
import sponsor2 from './components/sponsor2';
import sportBet from './components/sportBet';

export default {
    components: {
        copywriting,
        sponsor,
        sponsor2,
        promotion,
        sportBet
    },
    props: {
        templateName: {
            type: String,
            default: () => {}
        }
    },
    computed: {
        isCopywriting() {
            if (this.templateName.includes('sponsor') || this.templateName.includes('sportBet') || this.templateName.includes('promotion')) {
                return false;
            }
            return true;
        }
    }
};
</script>
