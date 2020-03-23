<template>

</template>

<script>
import store from '@/vuex/store'
import {mapState,mapMutations} from 'vuex'
export default {
    data() {
        return {

        }
    },
    computed: mapState(["count","msg","flag"]),
    methods: mapMutations(["add","reduce"]),
    store
}
</script>
