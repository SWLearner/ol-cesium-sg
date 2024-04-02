import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer.js';
import XYZ from 'ol/source/XYZ';
import { TileImage} from 'ol/source.js';
import TileWMS from 'ol/source/TileWMS.js';
import { get } from 'ol/proj';
import TileGrid from "ol/tilegrid/TileGrid";
//天地图矢量图层(默认显示)
export const TiandiMap_vec = new TileLayer({
	source: new XYZ({
		url: "http://t0.tianditu.gov.cn/DataServer?T=vec_w&tk=f47da4a06995b322a237c9278a84f12c&x={x}&y={y}&l={z}",
		projection: "EPSG:3857",
		// projection: "EPSG:4326",
		// wrapX:false,
	})
});
//天地图矢量注记图层
export const TiandiMap_cva = new TileLayer({
	source: new XYZ({
		url: "http://t0.tianditu.gov.cn/DataServer?T=cva_w&tk=f47da4a06995b322a237c9278a84f12c&x={x}&y={y}&l={z}",
		projection: "EPSG:3857",
		// projection: "EPSG:4326",
		// wrapX:false,
	})
});
//天地图影像图层
export const TiandiMap_img = new TileLayer({
	className: "tdmImg",
	source: new XYZ({
		url:"http://t0.tianditu.gov.cn/DataServer?T=img_w&tk=f47da4a06995b322a237c9278a84f12c&x={x}&y={y}&l={z}",
		projection: "EPSG:3857",
		// wrapX:false,
	}),
	visible: false,
});

//天地图影像注记图层
export const TiandiMap_cia = new TileLayer({
	className: "tdmCia",
	source: new XYZ({
		url: "http://t0.tianditu.gov.cn/DataServer?T=cia_w&tk=f47da4a06995b322a237c9278a84f12c&x={x}&y={y}&l={z}",
		projection: "EPSG:3857",
		// wrapX:false,
	}),
	visible: false,
});
//高德地图
export const GaodeLayer = new TileLayer({
	className: "gaodeLayer",
	source: new XYZ({
		url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
		// projection:"ESPG:3857",
		// crossOrigin: "anonymous"
	}),
	visible: false
})
//智图
export const geoq = new TileLayer({
	className: "geoq",
	source: new XYZ({
		url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
		projection: "EPSG:3857",
		// projection: "EPSG:4326",

	}),
	visible: false,
});
//百度地图
let projection: any = get("ESPG:3857");
//分辨率
let resolutions = [];
for (let i = 0; i < 19; i++) {
	resolutions[i] = Math.pow(2, 18 - i)
}
let tilegrd = new TileGrid({
	origin: [0, 0],
	resolutions: resolutions
});
//拼接百度底图出图地址
let baidu_source = new TileImage({
	projection: projection,
	tileGrid: tilegrd,
	tileUrlFunction: function (tileCoord) {
		if (!tileCoord) {
			return "";
		}
		let z = tileCoord[0];
		let x: number | string = tileCoord[1];
		//ol6加载地图的方式是右下递增，原先是右上递增，此处改为负数
		let y: number | string = -tileCoord[2];
		if (x < 0) {
			x = "M" + (-x);
		}
		if (y < 0) {
			y = "M" + (-y);
		}
		return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20151021&scaler=1&p=1";
	}
})
export const BaiduLayer = new TileLayer({
	className: "baiduLayer",
	source: baidu_source,
	visible: false
});

// geoserver发布服务数据加载
export const chinaSource = new TileWMS({
	//test图层的工作区+wms
	url: 'http://localhost:8080/geoserver/sf/wms',
	params: {
		'LAYERS': 'sf:archsites',
		'TILED': true,

	},
	serverType: 'geoserver',
	// crossOrigin: 'anonymous',
})
// export const china = new TileLayer({
// 	className:'china',
// 	source: chinaSource,
// 	visible: false,
// }) 

export const coastlines = new TileLayer({
	className: 'coastlines',
	source: new TileWMS({
		//test图层的工作区+wms
		url: 'http://localhost:8080/geoserver/ne/wms',
		params: {
			'LAYERS': '	ne:coastlines',
			'TILED': true,

		},
		serverType: 'geoserver',
		// wrapX:false,
		// crossOrigin: 'anonymous',
	}),

})
export const restricted = new TileLayer({
	className: 'restricted',
	source: new TileWMS({
		//test图层的工作区+wms
		url: 'http://localhost:8080/geoserver/sf/wms',
		params: {
			'LAYERS': 'sf:restricted',
			'TILED': true,

		},
		serverType: 'geoserver',
		// wrapX:false,
		// crossOrigin: 'anonymous',
	}),

})

export const wmsSource = new TileWMS({
	//test图层的工作区+wms
	url: 'http://localhost:8080/geoserver/test/wms',
	params: {
		'LAYERS': 'test:省',
		'TILED': true,

	},
	serverType: 'geoserver',
	wrapX:false,
	// crossOrigin: 'anonymous',
})
export const china = new TileLayer({
	className: 'china',
	source:wmsSource,
	visible: true,
	// zIndex:99999
})
export const railwaySource = new TileWMS({
	//test图层的工作区+wms
	url: 'http://localhost:8080/geoserver/railway/wms',
	params: {
		'LAYERS': 'railway:Railway',
		'TILED': true,

	},
	serverType: 'geoserver',
	wrapX:false,
	// crossOrigin: 'anonymous',
})
export const railway = new TileLayer({
	className: 'railway',
	source:railwaySource,
	visible: true,
	minZoom:19,
})
export const fenceSource = new TileWMS({
	//test图层的工作区+wms
	url: 'http://localhost:8080/geoserver/railway/wms',
	params: {
		'LAYERS': 'railway:RaiwayFence',
		'TILED': true,

	},
	serverType: 'geoserver',
	wrapX:false,
	// crossOrigin: 'anonymous',
})
export const fence = new TileLayer({
	className: 'fence',
	source:fenceSource,
	visible: true,
	// minZoom:11,
})
export const stationSource = new TileWMS({
	//test图层的工作区+wms
	url: 'http://localhost:8080/geoserver/railway/wms',
	params: {
		'LAYERS': 'railway:Trainstation',
		'TILED': true,

	},
	serverType: 'geoserver',
	wrapX:false,
	// crossOrigin: 'anonymous',
})
export const station = new TileLayer({
	className: 'station',
	source:stationSource,
	visible: true,
	minZoom:11,
})
export const layerGroup = new LayerGroup({
	layers: [coastlines, restricted]
})



