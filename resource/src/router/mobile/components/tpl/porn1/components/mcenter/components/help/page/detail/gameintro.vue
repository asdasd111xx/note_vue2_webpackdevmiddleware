<template>
    <div>
        1234
    </div>
</template>

<script>
import info from "../../json/gameintro.json";
export default {
    props: {
        index: {
            type: String,
            required: true
        },
        keys: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            data: info.data[this.index].list.find(item => {
                return +item.key === +this.keys;
            })
        };
    }
};
</script>

<style></style>
