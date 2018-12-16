$(function() {
  checkSupport()
  checkLast()
})

$('#btn').click(function() {
  checkSupport()
  var e = $('#e').val().trim()
  console.log(e)
  if(e<=0||e.length == 0) {
    alert('请输入集数')
    return false
  }
  location.href = 'result.html?e=' + e
})

function checkSupport() {
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
