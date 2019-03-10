function getObj(key){
  var resStr = localStorage.getItem(key);
  return JSON.parse(resStr);
}

var backup = getObj('backup');

var res = '';
for (var i = 0;i < backup.length;i ++){
  var item = backup[i];
  res += "<a class='list-group-item' target='_blank' href='" + item.url + "'>" + item.title + "</a>";

}
console.log(res);
$('#list').html(res);

$('#list a').hover(function(){
  $(this).addClass('active');
},function(){
  $(this).removeClass('active');
});
