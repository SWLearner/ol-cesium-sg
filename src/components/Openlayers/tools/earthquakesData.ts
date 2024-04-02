import {  Tile as TileLayer } from 'ol/layer.js';
//大数据点展示-cluster
import { Vector as VectorLayer } from 'ol/layer.js';
import { Cluster, Stamen, Vector as VectorSource } from 'ol/source.js';
import { Style, Text, Stroke, Fill, RegularShape } from 'ol/style';
import KML from 'ol/format/KML.js';
import CircleStyle from 'ol/style/Circle';
import { createEmpty, extend, getHeight, getWidth } from 'ol/extent';

//大数据点展示-地震数据
let maxFeatureCount:number;
let currentResolution:any;
export const earthquakeVector=new VectorLayer({
	source:new Cluster({
		distance:40,
		source:new VectorSource({
			url:'./earthquakes.kml',
			format:new KML({
				extractStyles:false,
			})
		})
	}),
	style:ClusterStyleFunction,
})
export const raster=new TileLayer({
    source:new Stamen({
        layer:'toner',
    }),
})
//最初的点样式
function earthquakeStyle(feature:any){
    const name=feature.get('name');
    const magnitude=parseFloat(name.substr(2));
    const radius=5+20*(magnitude-5);
    return new Style({
        geometry:feature.getGeometry(),
        image: new RegularShape({
            radius1:radius,
            radius2:3,
            points:5,
            angle:Math.PI,
            fill:new Fill({
                color:'rgba(255, 153, 0, 0.8)',
            }),
            stroke:new Stroke({
                color:'rgba(255, 204, 0, 0.2)',
                width:1
            })
        })
    })

}
//计算cluster信息以创建cluster样式
function calculateClusterInfo(resolution:any,vector:VectorLayer<Cluster>){
    maxFeatureCount=0;
    const features=vector.getSource()!.getFeatures();
    let feature,radius;
    for(let i=features.length-1;i>=0;--i){
        feature=features[i];
        const originalFeatures=feature.get('features');
        const extent=createEmpty();
        let j,jj;
        for(j=0,jj=originalFeatures.length;j<jj; ++j){
            extend(extent,originalFeatures[j].getGeometry().getExtent());
        }
        maxFeatureCount=Math.max(maxFeatureCount,jj);
        radius=(0.25*(getWidth(extent)+getHeight(extent)))/resolution;
        feature.set('radius',radius);
    }
}
//cluster的样式
function ClusterStyleFunction(feature:any,resolution:any){
    if(resolution!=currentResolution){
        calculateClusterInfo(resolution,earthquakeVector);
        currentResolution=resolution;
    };
    let style;
    const size=feature.get('features').length;
    if(size>1){
        style=new Style({
            image:new CircleStyle({
                radius:feature.get('radius'),
                fill:new Fill({
                    color:[255, 153, 0, Math.min(0.8, 0.4 + size / maxFeatureCount)],
                }),
            }),
            text:new Text({
                text:size.toString(),
                fill:new Fill({
                    color:'#fff',
                }),
                stroke:new Stroke({
                    color:'rgba(0,0,0,0.6)',
                    width:3,
                }),
            }),
        });
    }else{
        const originalFeature=feature.get('features')[0];
        style=earthquakeStyle(originalFeature);
    }
    return style
}
export function selectStyleFunction(feature:any){
    const styles=[
        new Style({
            image:new CircleStyle({
                radius:feature.get('radius'),
                fill:new Fill({
                    color:'rgba(255, 255, 255, 0.01)',
                }),
            }),
        }),
    ];
    const originalFeatures=feature.get('features');
    let originalFeature;
    for(let i=originalFeatures.length-1;i>=0;--i){
        originalFeature=originalFeatures[i];
        styles.push(earthquakeStyle(originalFeature));
    }
    return styles;
}