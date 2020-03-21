function isScrolled(el, direction = "vertical") {
    if(direction === "vertical") {
        return el.scrollHeight > el.clientHeight;
    }else if(direction === "horizontal") {
        return el.scrollWidth > el.clientWidth;
    }
}


var get_scroll_elem = function(elem){
  while(true){
    elem = elem.parentElement
    if (isScrolled(elem)){
        return elem
    }
    if(elem.tagName == "HTML"){break}
    }
}


