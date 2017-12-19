
function setObj(key, obj){
  var resStr = JSON.stringify(obj);
  localStorage.setItem(key, resStr);
}

function getObj(key){
  var resStr = localStorage.getItem(key);
  return JSON.parse(resStr);
}


if (!getObj('myTabs')){
  setObj('myTabs',[]);
}

chrome.tabs.query({},function(tabList){
  var myTabs = getObj('myTabs');
  var tmpTabs = []
  for (var i = 0; i < tabList.length;i ++){
    var item = tabList[i];
    var flag = true;
    for (var j = 0;j < myTabs.length;j ++){
      if (item.id == myTabs[j].id){
        tmpTabs.push(myTabs[j]);
        flag = false;
        break;
      }

    }
    if (flag){
      item.visitTime = 0;
      tmpTabs.push(item);
    }
  }
  setObj('myTabs', tmpTabs);
});





function cleanTabs(){

  var myTabs = getObj('myTabs');
  var backupTabs = [];

  for (var i = 0; i < myTabs.length;i ++){
    if (myTabs[i].visitTime < 2){
      chrome.tabs.remove(myTabs[i].id);
      backupTabs.push({
        id: myTabs[i].id,
        url: myTabs[i].url,
        title: myTabs[i].title
      });
    }
  }
  setObj('backup', backupTabs);
  chrome.tabs.create({
    url: 'backup.html'
  });
/*
  chrome.tabs.query({},function(tabList){
    var resUrl = [];
    for (var i = 0; i < tabList.length;i ++){
      var item = tabList[i];
      if (item.url in resUrl){
        //Already Opened

      }else{
        resUrl.push(item.url);
      }
    }
  });
*/
}


chrome.tabs.onCreated.addListener(function(keyTab){
  var myTabs = getObj('myTabs');
  keyTab.visitTime = 0;
  myTabs.push(keyTab);
  setObj('myTabs', myTabs);
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  var myTabs = getObj('myTabs');
  for (var i = 0;i < myTabs.length;i ++){
    if (myTabs[i].id == tabId){
      myTabs.splice(i, 1);
      break;
    }
  }
  setObj('myTabs', myTabs);

});

chrome.tabs.onActivated.addListener(function(keyInfo){
  var myTabs = getObj('myTabs');
  for (var i = 0;i < myTabs.length;i ++){
    if (myTabs[i].id == keyInfo.tabId){
      myTabs[i].visitTime += 1;
      new Notification('test',{
        body: myTabs[i].visitTime
      });
      break;
    }
  }
  setObj('myTabs', myTabs);

});



//listening to keyboard
chrome.commands.onCommand.addListener(function(command) {
        if ('clean_tabs' === command) {
            cleanTabs();
        }
    });
