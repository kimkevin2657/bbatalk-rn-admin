## Apex Option

```js
// DataLabels
options : {
	bar : {
		dataLabels: { // columns/bar 차트인 경우에 해당 옵션 제공됨.
			position: 'top' // top, bottom, 
		},	
	},
	dataLabels: {
		enabled: true,
		style: {
			colors: ['#333']
		},
		offsetX: 30, // 라벨의 이동을 원한다면 설정, X축
		offsetY: 30,  // 라벨의 이동을 원한다면 설정, Y축
		formatter: function(val, opt) { // Custom Label
		    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
		},
	}
}

//locales
chart: {
  defaultLocale: 'en',
  locales: [{
    name: 'en',
    options: {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      toolbar: {
        download: 'Download SVG',
        selection: 'Selection',
        selectionZoom: 'Selection Zoom',
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        pan: 'Panning',
        reset: 'Reset Zoom',
      }
    }
  }]
}

//toolbar
chart: {
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true | '<img src="/static/icons/reset.png" width="20">',
        customIcons: []
      },
      autoSelected: 'zoom' 
    },
}

//Legend: https://apexcharts.com/docs/options/legend/
chart: {
	legend: {
		show: false //show/hide
		position: 'top', // top, right, bottom, left
		horizontalAlign: 'right', // 수평정렬: center, left, right
		onItemClick: {
			toggleDataSeries: true // 범례의 series를 클릭하여 show/hide
		},
		onItemHover: {
			highlightDataSeries: true // 범례의 seires를 마우스 hover 하였을때에 하이라이트 효과
		}
	},
}


// DataType 

// 1. Single Values
series: [{
	data: [23, 34, 12, 54, 32 ] // y축의 값
}]
// x축 정보가 반드시 필요
xaxis:{
  categories: ["Jan", "Feb", "Mar", ... , "Dec"]
}
//or
xaxis:{
  type: "datetime"
}

//2. Pared value
series: [{
	data: [[1, 34], [3, 54], [5, 23]] // [x, y]
}]
//or
series: [{
    data: [
    	{ x: 'Apple', y: 54 },
    	{ x: 'Orange', y: 66 }
	]
}]

//3. Timeline Series
// timestamps
series: [{
  data: [[1324508400000, 34], [1324594800000, 54] , ... , [1326236400000, 43]]
}]
xaxis:{
  type: "datetime"
}

// Date strings
series: [{
  data: [{ x: '05/06/2014', y: 54 }, { x: '05/08/2014', y: 17 } , ... , { x: '05/28/2014', y: 26 }]
}
xaxis:{
  type: "datetime"
}

// 4. Pie/Donuts/ RadialBars
series: [23, 11, 54, 72, 12]
labels: ["Apple", "Mango", "Banana", "Papaya", "Orange"]
```
