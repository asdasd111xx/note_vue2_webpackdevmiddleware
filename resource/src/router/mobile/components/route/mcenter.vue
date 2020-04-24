<script>
import kebabCase from 'lodash/kebabCase';
import config from './config';

export default {
    components: config.mcenter,
    props: {
        headerConfig: {
            type: Object,
            default: null
        }
    },
    computed: {
        headerConfigValue: {
            get() {
                return this.headerConfig;
            },
            set(value) {
                this.$emit('update:headerConfig', value);
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next();
    },
    render(createElement) {
        const routeName = this.$route.name.replace(/^mcenter-/, '');

        return createElement(kebabCase(`${routeName}-porn1`), {
            props: {
                headerConfig: this.headerConfigValue
            },
            on: {
                'update:headerConfig': (value) => { this.headerConfigValue = value; }
            }
        });
    }
};
</script>
