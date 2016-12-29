
var $table = $('#table_body');
var $table_summary = $('#table_summary');
var $data_num = 0;
var $button = $('#button');
var $cors = true;
var $data_info = [];
$table_summary.on('click-row.bs.table', function(row, $element, field){

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
      }
      $data_num += data['summary'].length;
      console.log(data);
      console.log($data_num);
      // console.log($table_summary.bootstrapTable('getScrollPosition'));
      $table_summary.bootstrapTable('prepend', data['summary']);
      // $table_summary.bootstrapTable('append', data['summary']);
      // $table_summary.bootstrapTable('scrollTo', 'bottom');
    });
  }
}, 2000);
