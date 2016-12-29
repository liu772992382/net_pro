
var $table = $('#table_body');
var $table_summary = $('#table_summary');
var $data_num = 0;
var $button = $('#button');
var $cors = true;
var $data_info = {};
$table_summary.on('click-row.bs.table', function(row, $element, field){
  console.log($element, $data_info[$element.id]);
  $table.bootstrapTable('append', $data_info[$element.id]);
});

$button.click(function(){
  $cors = !$cors;
  console.log($cors);
  if(!$cors)
    $button.addClass('active');
  else $button.removeClass('active');
})

setInterval(function () {
  if($cors){
    $.get('/getData').done(function(gdata){
      data = $.parseJSON(gdata);
      if($data_num >= 2000){
        $table_summary.bootstrapTable('removeAll');
        $data_num = 0;
        $data_info = {};
      }
      $data_num += data['summary'].length;
      for(var i in data['info']){
        $data_info[i] = data['info'][i];
      }
      console.log(data['summary']);
      console.log($data_info);
      // console.log($data_num);
      $table_summary.bootstrapTable('prepend', data['summary']);
    });
  }
}, 2000);
