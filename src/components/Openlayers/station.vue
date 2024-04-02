<template>
    <div>
        <stationList ></stationList>
        <stationSummary></stationSummary>
    </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';
import stationList from './stationList.vue'
import stationSummary from './stationSummary.vue'
import { Map} from 'ol';
type Props = {
	map:Map,
}
let {map}=defineProps<Props>();
    watch(
    ()=>map,
    async(val)=>{
        console.log('watch-val',val)
        map=val
        console.log('watch-map',map)

    },
    { deep: true,immediate:true }
)
</script>

<style lang="scss" scoped></style>
