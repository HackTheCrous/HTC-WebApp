<template>
    <div ref="map-root" class="map-container">

    </div>
</template>

<script>
import TileLayer from "ol/layer/Tile";
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import {View} from "ol";

import 'ol/ol.css';
import {GeoJSON} from "ol/format";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Projection, transform} from "ol/proj";

export default {
    name: "MapContainer",
    props:{
        coords: Object
    },
    mounted() {
        console.log(this.coords);

        const data = {
            type: 'Feature',
            properties :{

            },
            geometry: {
                type: 'Point',
                coordinates: [this.coords.y, this.coords.x]
            }
        }


        const feature = new GeoJSON().readFeature(data,{
            featureProjection: 'EPSG:3857'
        })

        new Map({
            target: this.$refs['map-root'],
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                new VectorLayer({
                    source: new VectorSource({
                        features: [feature]
                    })
                })
            ],

            view: new View({
                center: transform([this.coords.y, this.coords.x], 'EPSG:4326', 'EPSG:3857'),
                zoom: 16,
            })
        })
    }
}
</script>

<style scoped>
.map-container{
    height: 50vh;
    width: 100%;
}
</style>