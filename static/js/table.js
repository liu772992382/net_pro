$('#table_t').bootstrapTable({
  url:'test_table',
  striped: true,
  clickToSelect: true,
  columns: [{
    field: 'id',
    title: 'Item ID'
    }, {
    field: 'name',
    title: 'Item Name'
    }, {
    field: 'price',
    title: 'Item Price'
    }]
});


setInterval(function () {
 $('#table_t').bootstrapTable('append', {id:2, name:'t', price:'s'});
}, 1000);
