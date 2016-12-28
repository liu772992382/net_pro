var dom = document.getElementById("main");
var myChart = echarts.init(dom);
var app = {};
option = null;
var date = [0];
var now = 0;
var data = [0];
var data_last = 0;

function addData(shift) {
    now += 1;
   date.push(now);
   $.get('/getData').done(function(gdata){
     data.push(gdata - data_last);
     data_last = gdata;
   });
   // data.push(Math.random());
   if (shift) {
       date.shift();
       data.shift();
   }
  }

for (var i = 1; i < 100; i++) {
 addData();
}

option = {
 xAxis: {
     type: 'category',
     boundaryGap: false,
     data: date
 },
 yAxis: {
     boundaryGap: [0, '50%'],
     type: 'value'
 },
 series: [
     {
         name:'成交',
         type:'line',
         smooth:true,
         symbol: 'none',
         stack: 'a',
         areaStyle: {
             normal: {}
         },
         data: data
     }
 ]
};

setInterval(function () {
 addData(true);
 myChart.setOption({
     xAxis: {
         data: date
     },
     series: [{
         name:'成交',
         data: data
     }]
 });
}, 1000);;
if (option && typeof option === "object") {
 myChart.setOption(option, true);
}
