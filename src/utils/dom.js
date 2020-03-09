export function addClass(el, className) {
  if (hasClass(el, className)) return
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function removeClass(el, className) {
  if(hasClass(el, className)){
    var regex = new RegExp('(^|\\s)' + className + '(\\s|$)','g');
    el.className = el.className.replace(regex, '');
    return true;
  }
  return false;
}