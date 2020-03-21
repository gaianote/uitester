var get_top_elems = function(elems_list){
/*
从参数elems_list筛选出位于页面元素最高层的新elems列表
1. 使用getBoundingClientRect 得到elem的坐标
2. 使用elementsFromPoint得到位于该坐标的所有元素 =〉 (由上层到最下层排列)div.form-group, form#form_login, div.loginContent, div.login, div.globalBg, body, html
3. 由该坐标位置最上层的可见元素与elem对比，如果最上层的可见元素是elem自身,则该元素位于最上层，如果是遮罩层(显然不是子元素)返回false
*/
baseX = document.documentElement.scrollLeft
baseY = document.documentElement.scrollTop

  //判断元素是否为最高层元素
  var isTop = function(elem){
      var rect = elem.getBoundingClientRect()
      //如果四角任意坐标为0，则其不存在于屏幕之中
      if(!(rect.left && rect.right && rect.bottom && rect.top)){
        return false
      }

      var x = rect.left + rect.width/2
      var y = rect.top + rect.height/2
      if(document.elementsFromPoint(x,y)[0] != elem){
        // select and option

        if(elem.contains(document.elementsFromPoint(x,y)[0]) && elem.tagName == "SELECT"){
          return true
        }
        console.log('elementsFromPoint(x,y)',x,y,document.elementsFromPoint(x,y)[0] , 'elem',elem)
        return false
      }
      console.log('is Top:elementsFromPoint(x,y)',x,y,document.elementsFromPoint(x,y)[0] , 'elem',elem)

      return true
  }


  // get top elem list
  var new_elems = []
  for(var i = 0;i<elems_list.length;i++){
      if(isTop(elems_list[i])){
          new_elems.push(elems_list[i])
      }
  }
  //get top elem list by scroll screen
  var new_elems_by_scroll = []
  for(var i = 0;i<elems_list.length;i++){
      if(!isTop(elems_list[i])){
        elems_list[i].scrollIntoView(false)
        if(isTop(elems_list[i])){
          new_elems.push(elems_list[i])
        }
      }
  }

  document.documentElement.scrollTo(baseX,baseY)
  return new_elems
}


var query_by_innerText = function(innerText){
/*
筛选出innerText值 == innerText的elem列表(包含placeholder)
*/
  elems = document.querySelectorAll("*")
  var include_innerText_elems_list = []
  //找包含文本的元素
  for(var i=0;i<elems.length;i++){
      elems_innerText = elems[i].innerText && elems[i].innerText.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
      if (elems_innerText == innerText){
        include_innerText_elems_list.push(elems[i])
        //console.log(include_innerText_elems_list)
      }

  }
  //input_value为显示文字的按钮
  for(var i=0;i<elems.length;i++){
      elems_innerText = elems[i].value && elems[i].value.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
      if (elems_innerText == innerText){
        include_innerText_elems_list.push(elems[i])
      }

      elems_innerText = elems[i].placeholder && elems[i].placeholder.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
      if (elems_innerText == innerText){
        include_innerText_elems_list.push(elems[i])
      }
  }


  result = []
  for(var i = 0;i<include_innerText_elems_list.length;i++){
      flag = true
      //如果一个元素不是其他任意元素的父元素，则保留
      for(var j = 0;j<include_innerText_elems_list.length;j++){
        if(include_innerText_elems_list[i].contains(include_innerText_elems_list[j]) && (include_innerText_elems_list[i] != include_innerText_elems_list[j])){
          flag = false
        }
      }
      if (flag){
        result.push(include_innerText_elems_list[i])
      }
  }
  // console.log(result)
  return get_top_elems(result)
}

var query_by_parts_of_innerText = function(innerText){
/*
筛选出innerText值 == innerText的elem列表(包含placeholder)
*/
  elems = document.querySelectorAll("*")
  var include_innerText_elems_list = []
  //找包含文本的元素
  for(var i=0;i<elems.length;i++){
      elems_innerText = elems[i].innerText && elems[i].innerText.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
      if (elems_innerText && elems_innerText.search(innerText) != -1){
        include_innerText_elems_list.push(elems[i])
      }

  }
  //input_value为显示文字的按钮
  for(var i=0;i<elems.length;i++){
      elems_innerText = elems[i].value && elems[i].value.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
      if (elems_innerText && elems_innerText.search(innerText) != -1){
        include_innerText_elems_list.push(elems[i])
      }

      elems_innerText = elems[i].placeholder && elems[i].placeholder.replace(/(^\s*)|(\s*$)/g,"") // 去除elem字符串前后的空格
      if (elems_innerText && elems_innerText.search(innerText) != -1){
        include_innerText_elems_list.push(elems[i])
      }
  }


  result = []
  for(var i = 0;i<include_innerText_elems_list.length;i++){
      flag = true
      //如果一个元素不是其他任意元素的父元素，则保留
      for(var j = 0;j<include_innerText_elems_list.length;j++){
        if(include_innerText_elems_list[i].contains(include_innerText_elems_list[j]) && (i != j)){
          flag = false
        }
      }
      if (flag){
        result.push(include_innerText_elems_list[i])
      }
  }
  // console.log(result)
  return get_top_elems(result)
}


var query_by_css = function(css){
  return get_top_elems(document.querySelectorAll(css))
}

var query_by_placeholder = function(placeholder){
  input_elems_list = []
  var elems = document.querySelectorAll('input')
  for(var i=0;i<elems.length;i++){
      if(elems[i].getAttribute('placeholder') == placeholder){
          input_elems_list.push(elems[i])
      }
  }
  return get_top_elems(input_elems_list)
}

var query_by_locator = function(innerText,locator,text) {
  var text_elems = query_by_innerText(innerText)
  return _query_by_locator(text_elems,locator,text)
}
var query_by_part_of_locator = function(innerText,locator) {
  var text_elems = query_by_parts_of_innerText(innerText)
  return _query_by_locator(text_elems,locator)
}

var _query_by_locator = function(text_elems,locator,text){

/*
query_input 根据文字与位置关系得到input
1. 如果cross == placeholder 返回palceholder为 cross 的输入框
2. 使用query_by_innerText得到文字的位置
3. 根据文字的位置返回距离文字最近的input的位置
4. cross = 'left';'right','bottom' => 输入框在文字的左边；右边和下边
*/


    input_elems_list = []

    // 每一个Text 的最标点，并返回最近的一个input
    for(var j=0;j<text_elems.length;j++){
        // 得到文字的中心点坐标
        var rect = text_elems[j].getBoundingClientRect()
        var x = rect.left + (rect.right - rect.left)/2
        var y = rect.top + (rect.bottom - rect.top)/2

        // 计算平移的次数，每次平移10个像素
        var left = Math.floor(x/10)
        var right = Math.floor((window.screen.availWidth - x)/10)
        var top = Math.floor(y/10)
        var bottom = Math.floor((window.screen.availHeight - y)/10)
        var height = Math.floor(rect.bottom - rect.top) //y轴移动的次数


        if(locator == 'left'){
            var target_x = x
            var target_y = y
            var is_continue = true
            // x轴以中心为基点向左平移扫描(小于平移次数)
            for(var i =0;i<left;i++){

                target_x -= 10
                // y轴以中心为基点上下平移扫描
                for(var k=0;k<height;k++){
                  var elem = document.elementsFromPoint(target_x,target_y)[0]
                  if(elem && elem.tagName == 'OPTION'){elem = elem.parentElement}
                  if((elem != text_elems[j]) && elem && (elem.tagName == "INPUT" || elem.tagName == "SELECT")){
                      input_elems_list.push(elem)
                      is_continue = false
                      break
                  }
                  if(k%2 == 0){
                    target_y = y - Math.ceil(k/2) - 1
                  }else{
                    target_y = y + Math.ceil(k/2)
                  }
                }
                if(is_continue == false){
                  break
                }
            }
        }
        if(locator == 'right'){
            var target_x = x
            for(var i =0;i<right;i++){
                target_x += 10
                var elem = document.elementsFromPoint(target_x,y)[0]

                if(elem && elem.tagName == 'OPTION'){elem = elem.parentElement}
                if((elem != text_elems[j]) && elem && (elem.tagName == "INPUT" || elem.tagName == "SELECT")){

                    input_elems_list.push(elem)
                    break
                }
                if(text!=null){
                  if((elem != text_elems[j]) && elem && elem.innerText && (elem.innerText.trim() == text)){

                    input_elems_list.push(elem)
                    break
                  }
                }
            }
        }
        if(locator == 'bottom'){

            var target_y = y
            for(var i =0;i<bottom;i++){
                target_y += 10
                var elem = document.elementsFromPoint(x,target_y)[0]
                if(elem && elem.tagName == 'OPTION'){elem = elem.parentElement}
                if((elem != text_elems[j]) && elem && (elem.tagName == "INPUT" || elem.tagName == "SELECT")){
                    input_elems_list.push(elem)
                    break
                }
            }
        }
    }

return get_top_elems(input_elems_list)
}


/*
1. getElementStyleMD5 获得所有可见元素的stylemd5,text,坐标
2. getElementXPath 算出元素的xpath
3. getElementByXpath 根据xpath获取元素
4. getStringMD5 获得string的MD5
5. getDiffElement 获得元素的差异
*/
function getElementStyleMD5(){
    styles = {}
    elems = document.querySelectorAll('*')
    elems = get_top_elems(elems)
    for(var i=0;i<elems.length;i++){
     style = JSON.stringify(getComputedStyle(elems[i]))
     xpath = getElementXPath(elems[i])
     react = elems[i].getBoundingClientRect()
     text = getElementTextNodeValue(elems[i])
     styles[xpath] = [getStringMD5(style),getStringMD5(text),react]
    }
    return JSON.stringify(styles)
}

function getElementTextNodeValue(elem){
  var nodes = elem.childNodes
  var text = ""
  for(var j =0;j<nodes.length;j++){
    if (nodes[j].nodeName == "#text"){
      text += nodes[j].nodeValue
    }
  }
  return text
}
function getElementXPath(elt){
    var path = "";
    // Get Idx of an element
    function getElementIdx(elt){
        var count = 1;
        for (var sib = elt.previousSibling; sib ; sib = sib.previousSibling)
        {
            if(sib.nodeType == 1 && sib.tagName == elt.tagName)  count++
        }
        return count;
    }

    for (; elt && elt.nodeType == 1; elt = elt.parentNode)
    {
        idx = getElementIdx(elt);
        xname = elt.tagName;
        if (idx > 1) xname += "[" + idx + "]";
        path = "/" + xname + path;
    }
    return path;
}



function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


function getStringMD5(d){result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}


function getDiffElement(base){
    current = getElementStyleMD5()
    if(base == current){
      //no change
        return false
    }else{
        var base = JSON.parse(base)
        var current = JSON.parse(current)
        var base_keys = Object.keys(base)
        var current_keys = Object.keys(current)
        // get dic keys with Difference set
        var base_only = base_keys.filter(function(v){ return current_keys.indexOf(v) == -1 })
        var current_only = current_keys.filter(function(v){ return base_keys.indexOf(v) == -1 })
        var common = base_keys.filter(function(v){ return current_keys.indexOf(v) > -1 })
        var diff_style = []
        var diff_text = []
        for(var i=0;i<common.length;i++){
          console.log(common.length)
          console.log(common[i])
            if(base[common[i]][0] != current[common[i]][0]){diff_style.push(common[i])}
            if(base[common[i]][1] != current[common[i]][1]){diff_text.push(common[i])}
        }
        var result = {}
        result["base_only"] = base_only
        result["current_only"] = current_only
        result["diff_style"] = diff_style
        result["diff_text"] = diff_text
        return JSON.stringify(result)
    }
}

/* 获取elem的md5,用来录制或更新md5时调用此方法*/
// getElementStyleMD5()
/* 获得差异时调用此方法 传入base*/
// base = getElementStyleMD5()
// getDiffElement(base)