function getObj(key){
  var resStr = localStorage.getItem(key);
  return JSON.parse(resStr);
}

var searchPage = getObj('searchPage');
var search = getObj('search');
var res = '';
for (var i = 0;i < searchPage.length;i ++){
  if (searchPage[i].length > 0){
    res += '<div class="list-group col-md-4">';
    res += '<li class="list-group-item list-group-item-info">' + search[i].name + '</li>';
    for (var j = 0;j < searchPage[i].length;j ++){
      var item = searchPage[i][j];
      res += '<a class="list-group-item" target="_blank" href="' + item.url + '">' + item.title + '</a>';
    }
    res += '</div>'
  }


}
console.log(res);
$('#list').html(res);

$('#list a').hover(function(){
  $(this).addClass('active');
},function(){
  $(this).removeClass('active');
});
