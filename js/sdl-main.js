$(function() {
  checkSupport()
  checkLast()
})

(document).keydown(function(e) {
  if (e.keyCode == 13) {
    btnClick()
  }
});

$('#btn').click(function() {
  checkSupport()
  var e = $('#e').val().trim()
  console.log(e)
  if(e<=0||e.length == 0) {
    alert('请输入集数')
    return false
  }
  localStorage.setItem('e', e)
  self.location.href = 'result.html'
})

function btnClick() {
  checkSupport()
  var e = $('#e').val().trim()
  console.log(e)
  if(e<=0||e.length == 0) {
    alert('请输入集数')
    return false
  }
  localStorage.setItem('e', e)
  self.location.href = 'result.html'
}

function checkSupport() {
  var userAgent = navigator.userAgent
  if(userAgent.indexOf('BiliApp') > -1) {
    alert('请使用浏览器打开')
  }
  if (typeof(Storage) == 'undefined') {
    alert('请使用版本稍稍新一点的浏览器吧，你这也太旧了，不仅功能太旧而且还不安全哦。')
    return false
  }
}
 function checkLast() {
   var lastE = localStorage.getItem('e')
   if (lastE != null) {
     $('#last').text('你上次解析了第' + lastE + '集')
     $('#last').css('display', 'block')
   }
 }
