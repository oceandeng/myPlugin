/*
* @Author: ocean
* @Date:   2016-04-06 13:41:02
* @Last Modified by:   ocean
* @Last Modified time: 2016-04-07 14:09:37
*/

// require.config({
//     paths: {
// 		echarts: '../bower_components/echarts/src'
//     }
// });
// require(
//     [
//         'echarts',
//         'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
//         'echarts/chart/bar'
//     ],
//     function (ec) {
//         var myChart = ec.init(document.getElementById('main'));
//         var option = {
// 		    title: {
// 		        text: 'ECharts 入门示例'
// 		    },
// 		    tooltip: {},
// 		    legend: {
// 		        data:['销量']
// 		    },
// 		    xAxis: {
// 		        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
// 		    },
// 		    yAxis: {},
// 		    series: [{
// 		        name: '销量',
// 		        type: 'bar',
// 		        data: [5, 20, 36, 10, 10, 20]
// 		    }]
// 		};
//         myChart.setOption(option);
//     }
// );

(function(){
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('main'));

	// 指定图表的配置项和数据
	var option = {
	    title: {
	        text: '未来一周气温变化',
	        subtext: '纯属虚构'
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['最高气温','最低气温']
	    },
	    toolbox: {
	        show: true,
	        feature: {
	            dataZoom: {},
	            dataView: {readOnly: false},
	            magicType: {type: ['line', 'bar']},
	            restore: {},
	            saveAsImage: {}
	        }
	    },
	    xAxis:  {
	        type: 'category',
	        boundaryGap: false,
	        data: ['周一','周二','周三','周四','周五','周六','周日']
	    },
	    yAxis: {
	        type: 'value',
	        axisLabel: {
	            formatter: '{value} °C'
	        }
	    },
	    series: [
	        {
	            name:'最高气温',
	            type:'line',
	            data:[11, 11, 15, 13, 12, 13, 10],
	            markPoint: {
	                data: [
	                    {type: 'max', name: '最大值'},
	                    {type: 'min', name: '最小值'}
	                ]
	            },
	            // markLine: {
	            //     data: [
	            //         {type: 'average', name: '平均值'}
	            //     ]
	            // }
	        },
	        // {
	        //     name:'最低气温',
	        //     type:'line',
	        //     data:[1, -2, 2, 5, 3, 2, 0],
	        //     markPoint: {
	        //         data: [
	        //             {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
	        //         ]
	        //     },
	        //     // markLine: {
	        //     //     data: [
	        //     //         {type: 'average', name: '平均值'}
	        //     //     ]
	        //     // }
	        // }
	    ]
	};

	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);

	console.log(myChart);


console.log(myChart._$handlers.showtip[0].h);

})();
