var dom = document.getElementById("main");
var myChart = echarts.init(dom);
var app = {};
option = null;
var date = [];
var now = 0;
var data = [];
var data_last = 0;

for (var i = 1; i < 100; i++) {
 date.push(0);
 data.push(0);
}

function addData(shift) {
    now += 1;
   date.push(now);
   $.get('/getData').done(function(gdata){
     gdata = $.parseJSON(gdata);
     console.log(gdata['result'] - data_last);
     data.push(gdata['result'] - data_last);
     data_last = gdata['result'];
   });
   console.log(date, data);
   // data.push(Math.random());
   if (shift) {
    //  console.log(date, data);
     date.shift();
     data.shift();
    //  console.log(date, data);

   }
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
