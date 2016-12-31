
var $table = $('#table_body');
var $table_summary = $('#table_summary');
var $table_fields = $('#table_fields');
var $data_num = 0;
var $button = $('#button');
var $cors = true;
var $data_info = {};
var $last_field;
var $last_sum;
var dom = document.getElementById("main");
var myChart = echarts.init(dom);
var app = {};
option = null;
var date = [];
var now = 0;
var data = [];
var data_last = 0;

for (var i = 1; i < 50; i++) {
 date.push(0);
 data.push(0);
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

$table_summary.on('click-row.bs.table', function(row, $element, field){
  // console.log($element, row, field);
  if($last_field)
    $last_field.removeClass('active');
  $table.bootstrapTable('load', $data_info[$element.id]);
  $last_field = field;
  $last_field.addClass('active');
});

$table.on('click-row.bs.table', function(row, $element, field){
  // console.log($element, row, field);
  if($last_sum)
    $last_sum.removeClass('active');
  console.log(row, $element, field);
  $table_fields.bootstrapTable('load', $element.info);
  $last_sum = field;
  $last_sum.addClass('active');
});

$button.click(function(){
  $cors = !$cors;
  console.log($cors);
  if(!$cors)
    $button.addClass('active');
  else $button.removeClass('active');
})

function addData(shift, get_data) {
  // console.log(shift, get_data, data_last, get_data - data_last);
  now += 1;
  date.push(now);
  data.push(get_data - data_last);
  data_last = get_data;
  // data.push(Math.random());
  if (shift) {
     date.shift();
     data.shift();
  }
}

setInterval(function () {
  if($cors){
    $.get('/getData').done(function(gdata){
      gdata = $.parseJSON(gdata);
      // console.log(gdata);
      if($data_num >= 2000){
        $table_summary.bootstrapTable('removeAll');
        $data_num = 0;
        $data_info = {};
      }

      $data_num += gdata['summary'].length;
      for(var i in gdata['info']){
        $data_info[i] = gdata['info'][i];
      }
      $table_summary.bootstrapTable('prepend', gdata['summary']);
      // // if($last_field)
      //   $last_field.addClass('active');
      addData(true, gdata['result']);
      myChart.setOption({
          xAxis: {
              data: date
          },
          series: [{
              name:'成交',
              data: data
          }]
      });
    });
  }
}, 1000);

if (option && typeof option === "object") {
 myChart.setOption(option, true);
}
