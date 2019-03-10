function setObj(key, obj){
  var resStr = JSON.stringify(obj);
  localStorage.setItem(key, resStr);
}

function getObj(key){
  var resStr = localStorage.getItem(key);
  return JSON.parse(resStr);
}


function freshSearch(){
  var search = getObj('search');
  var searchStr = "";
  for (var i = 0;i < search.length;i ++){
    searchStr += "<div class=\"input-group\"><span class=\"input-group-addon\">";

    if (search[i].flag){
      searchStr += "<input type=\"checkbox\" checked=\"true\">";
    }else{
      searchStr += "<input type=\"checkbox\">";
    }

    searchStr += "</span><span class=\"input-group-addon\" id=\"search-name\">" + search[i].name + "</span>";

    searchStr += "<input type=\"text\" class=\"form-control\" placeholder=\"Pattern\" value=\"" + search[i].pattern + "\">";
    searchStr += "<span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"button\" data-id=\"" + i + "\">Delete</button></span></div>";
  }

  $("#search").html(searchStr);

  $("#search button").click(function(){
    delSearch(parseInt($(this).attr('data-id')));
  })

}

function delSearch(keyPos){
  var search = getObj('search');
  search.splice(keyPos, 1);
  setObj('search', search);
  freshSearch();
}

function saveConfig(){
  var ruleElements = $('#rules .input-group');
  var rules = getObj('rules');
  for (var i = 0;i < ruleElements.length;i ++){
    var inputElements = $(ruleElements[i]).find('input');
    rules[i].flag = $(inputElements[0]).is(":checked");
    rules[i].num = parseInt($(inputElements[1]).val());
  }
  setObj('rules', rules);

  var search =[];
  var searchElements = $('#search .input-group');

  for (var i = 0;i < searchElements.length;i ++){
    var inputElements = $(searchElements[i]).find('input')
    search.push({
      flag: $(inputElements[0]).is(":checked"),
      name: $(searchElements[i]).find('#search-name').text(),
      pattern: $(inputElements[1]).val()
    });
  }

  setObj('search',search);
}


$("#save-config").click(function(){
  saveConfig();
  console.log('ok');
  $(this).button('complete');
});



//setup rules

var rules = getObj('rules');

var ruleElements = $('#rules .input-group');

for (var i = 0;i < rules.length;i ++){
  var inputElements = $(ruleElements[i]).find('input');
  if (rules[i].flag){
    $(inputElements[0]).attr('checked','true');
  }
  $(inputElements[1]).val(rules[i].num);
}

//setup search
freshSearch();

$("#search-add button").click(function(){
  var search = getObj('search');

  search.push({
    flag: true,
    name: $('#search-name input').val(),
    pattern: $('#search-pattern input').val()
  });
  setObj('search', search);

  freshSearch();

});
