console.log('back running');
function setObj(key, obj){
  var resStr = JSON.stringify(obj);
  localStorage.setItem(key, resStr);
}

function getObj(key){
  var resStr = localStorage.getItem(key);
  return JSON.parse(resStr);
}

function createTab(keyTab){
  var tmpItem = {
    id: keyTab.id,
    frequency: 0,
    lastActive: (new Date()).getTime(),
    activeTime: 0,
  };
  return tmpItem;

}

//init
if (!getObj('myTabs')){
  setObj('myTabs',[]);
}


if (!localStorage.rules){
  setObj('rules',[
    {
      flag: false,
      num: 2
    },
    {
      flag: false,
      num: 100000
    },
    {
      flag: false,
      num: 100000
    }
  ]);
}

if (!localStorage.search){
  setObj('search',[
    {
      flag: false,
      name: "Baidu",
      pattern: "www.baidu.com/s"
    },
    {
      flag: false,
      name: "Google",
      pattern: "www.google.com/search"
    },
    {
      flag: false,
      name: "Baidu",
      pattern: "github.com/search"
    }
  ]);
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
      var tmpItem = createTab(item);
      tmpTabs.push(tmpItem);
    }
    if (item.active){
      localStorage.currentActive = item.id;
      localStorage.activeStart = (new Date()).getTime();
    }
  }
  setObj('myTabs', tmpTabs);
});

function ifRemove(keyTab, rules){

  if (rules[0].flag && keyTab.frequency < rules[0].num){
    return true;
  }

  if (rules[1].flag && (new Date()).getTime() - keyTab.lastActive > rules[1].num * 1000){
    return true;
  }

  if (rules[2].flag && keyTab.activeTime < rules[2].num * 1000){
    return true;
  }
  return false;

}

function ifSearch(keyUrl, search){
  for (var i = 0;i < search.length;i ++){
    console.log(search)
    var tmpPattern = new RegExp(search[i].pattern, "i");

    if (keyUrl.search(tmpPattern) >= 0){
      return i;
    }
  }
  return -1;
}


function cleanTabs(){

  var myTabs = getObj('myTabs');
  var rules = getObj('rules');
  var search = getObj('search');

  var searchPages = [];
  for (var i = 0;i < search.length;i ++){
    searchPages.push([]);
  }

  var toRemove = [];
  for (var i = 0; i < myTabs.length;i ++){

    if (ifRemove(myTabs[i], rules)){
      //chrome.tabs.remove(myTabs[i].id);
      toRemove.push(myTabs[i].id);
    }
  }
  chrome.tabs.query({},function(tabList){
    var backupTabs = [];

    for (var i = 0;i < tabList.length;i ++){

      var searchPos = ifSearch(tabList[i].url, search);
      console.log(searchPos);
      var removePos = toRemove.indexOf(tabList[i].id);


      if (searchPos >= 0){
        searchPages[searchPos].push({
          id: tabList[i].id,
          url: tabList[i].url,
          title: tabList[i].title
        });
        if (removePos < 0){
          //toRemove.splice(removePos, 1);
          toRemove.push(tabList[i].id);
        }
        continue;
      }
      if (removePos >= 0){
        backupTabs.push({
          id: tabList[i].id,
          url: tabList[j].url,
          title: tabList[j].title
        });
      }
    }

    chrome.tabs.remove(toRemove);


    setObj('searchPage', searchPages);
    setObj('backup', backupTabs);
    chrome.tabs.create({
      url: 'pages/backup.html'
    });
    chrome.tabs.create({
      url: 'pages/search.html'
    });



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
  //keyTab.visitTime = 0;
  var tmpItem = createTab(keyTab);
  myTabs.push(tmpItem);
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
      myTabs[i].frequency += 1;
      break;
    }
  }
  for (var i = 0;i < myTabs.length;i ++){
    if (myTabs[i].id == localStorage.currentActive){
      myTabs[i].lastActive = (new Date()).getTime;
      myTabs[i].activeTime += (new Date()).getTime() - localStorage.activeStart;
    }
  }
  localStorage.currentActive = keyInfo.tabId;
  localStorage.activeStart = (new Date()).getTime();
  setObj('myTabs', myTabs);
});



//listening to keyboard
chrome.commands.onCommand.addListener(function(command) {
        if ('clean_tabs' === command) {
            cleanTabs();
        }
    });
