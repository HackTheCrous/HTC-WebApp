<template>
    <h3>{{ x }} {{ y }}</h3>
  <div id="map">
      <!--<l-map ref="map" :zoom="2" :center="[x,y]">
          <l-tile-layer :url="`https://tile.openstreetmap.org/0/${x}/${y}.png`"></l-tile-layer>
          <l-marker :lat-lng="[x,y]"></l-marker>
      </l-map>-->
      <l-map :zoom="zoom" :center="[47.41322, -1.219482]">
          <l-tile-layer
                  :url="`https://tile.openstreetmap.org/2/${x}/${y}.png`"
                  :lat-lgn="[47.41322, -1.219482]"
          ></l-tile-layer>
      </l-map>

  </div>
</template>

<script>
import {LMap, LMarker, LTileLayer} from "@vue-leaflet/vue-leaflet";
import {zoom} from "leaflet/src/control/Control.Zoom";

export default {
    name: "Map",
    components: {LMarker, LTileLayer, LMap},
    props: ["x","y"],
    data() {
        return {
            zoom: 2,
            center: [47.41322, -1.219482]
        }
    },
}
</script>

<style scoped>
#map {
    height: 100%;
    width: 100%;
}
</style>