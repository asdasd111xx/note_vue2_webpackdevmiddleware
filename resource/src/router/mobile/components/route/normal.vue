<script>
import kebabCase from 'lodash/kebabCase';
import config from './config';

export default {
    components: config.normal,
    render(createElement) {
        return createElement(kebabCase(`${this.$route.name}-porn1`));
    }
};
</script>
