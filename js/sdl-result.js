//https://www.daserste.de/unterhaltung/soaps-telenovelas/sturm-der-liebe/videos/folge-3056-video-100~playerXml.xml?t=18-12-13-04-46
var sdlXML
var v720p
var v540p
var v270p
var title
var desc
var subUrl
var e
var vttStr
var srtStr

$(function() {
  if (typeof(Storage) == 'undefined') {
    alert('请使用版本稍稍新一点的浏览器吧，你这也太旧了，不仅功能太旧而且还不安全哦。')
    return false
  }

  e = localStorage.getItem('e')
  getXML('https://www.daserste.de/unterhaltung/soaps-telenovelas/sturm-der-liebe/videos/folge-' + e + '-video-100~playerXml.xml')
})

function getXML(url) {
  $.ajax({
    url : url,
    type : 'GET',
    dataType : 'xml',
    success : function(data) {
        sdlXML = data
        getURLs()
        setData()
        $('#topAlert').css('display', 'none')
        $('#all').css('display', 'block')
		},
    error : function(data) {
        alert('解析失败，也许集数过时失效了，也许还未放送，也许……')
    }
  })
}

function getURLs() {
  $(sdlXML).find("playlist").each(function() {
    let playlist = $(this)
    v720p = playlist.find("[type*=720] fileName").text()
    console.log(v720p)
    v540p = playlist.find("[type*=540] fileName").text()
    console.log(v540p)
    v270p = playlist.find("[type*=270] fileName").text()
    console.log(v270p)
    title = playlist.find("video title").text()
    console.log(title)
    desc = playlist.find("video desc").text()
    console.log(desc)
    subUrl = playlist.find('dataTimedTextVtt').first().attr('url').trim()
    console.log(subUrl)
  })
}

function setData() {
  $('#title').text(title)
  $('#v720url').val(v720p)
  $('#v540url').val(v540p)
  $('#v270url').val(v270p)
}

function onVideoURLClick(type) {
  if (type == 'v720p') { $('#v720url').select() }
  if (type == 'v540p') { $('#v540url').select() }
  if (type == 'v270p') { $('#v270url').select() }
  document.execCommand("copy")
}

function getWebVTT() {
  download(subUrl, 'sdl-' + e + '.vtt', "text/vtt")
}

function getSRT() {
  $('#strbtn').text('转换中…')
  $.ajax({
    url : subUrl,
    type : 'GET',
    success : function(data) {
        vttStr = data
        vttStr = vtt2srt(data)
        downloadSRT(vttStr)
        $('#strbtn').text('SRT(*.str)')
		},
    error : function(data) {
        alert('反正就是失败了，要不再点一次试试？')
        $('#strbtn').text('SRT(*.str)')
    }
  })
}

function vtt2srt(data) {
  data = webvtt2srt(data)
  return data
}

function downloadSRT(vttStr) {
  var srtBlob = new Blob([vttStr])
  console.log(srtBlob)
  download(srtBlob, 'sdl-' + e + '.srt', "text/srt")
}

function webvtt2srt(data) {
      data = data.replace("WEBVTT\n\n","")
      data = data.replace(/\<c\.S3\>/g,"")
      data = data.replace(/\<\/c\>/g,"")
      // remove dos newlines
      var srt = data.replace(/\r+/g, '')
      // trim white space start and end
      srt = srt.replace(/^\s+|\s+$/g, '')
      // get cues
      var cuelist = srt.split('\n\n')
      var result = ""
      if (cuelist.length > 0) {
        for (var i = 0; i < cuelist.length; i=i+1) {
          result += convertSrtCue(cuelist[i])
        }
      }
      return result
    }
    function convertSrtCue(caption) {
      // remove all html tags for security reasons
      //srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, '');
      var cue = ""
      var s = caption.split(/\n/);
      // concatenate muilt-line string separated in array into one
      while (s.length > 3) {
          for (var i = 3; i < s.length; i++) {
              s[2] += "\n" + s[i]
          }
          s.splice(3, s.length - 3)
      }
      var line = 0
      // detect identifier
      if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
        cue += s[0].match(/\w+/) + "\n"
        line += 1
      }
      // get time strings
      if (s[line].match(/\d+:\d+:\d+/)) {
        // convert time string
        var m = s[1].match(/(\d+):(\d+):(\d+)(?:.(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:.(\d+))?/)
        if (m) {
          cue += m[1]+":"+m[2]+":"+m[3]+","+m[4]+" --> "
                +m[5]+":"+m[6]+":"+m[7]+","+m[8]+"\n"
          line += 1
        } else {
          // Unrecognized timestring
          return ""
        }
      } else {
        // file format error or comment lines
        return ""
      }
      // get cue text
      if (s[line]) {
        cue += s[line] + "\n\n"
      }
      return cue
    }
