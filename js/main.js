//https://www.daserste.de/unterhaltung/soaps-telenovelas/sturm-der-liebe/videos/folge-3056-video-100~playerXml.xml?t=18-12-13-04-46
var sdlXML;

$(function() {
  getXML('https://www.daserste.de/unterhaltung/soaps-telenovelas/sturm-der-liebe/videos/folge-3056-video-100~playerXml.xml?t=18-12-13-04-46')
})

function getXML(url) {
  $.ajax({
    url: url,
    type: 'GET',
    dataType : 'xml',
    success : function(data) {
        sdlXML = data
        getURLs()
			}
  })
}

function getURLs() {
  $(sdlXML).find("playlist").each(function() {
    let playlist = $(this)
    let v720p = playlist.find("[type*=720] fileName").text()
    console.log(v720p);
    let v540p = playlist.find("[type*=540] fileName").text()
    console.log(v540p);
    let v270p = playlist.find("[type*=270] fileName").text()
    console.log(v270p);
    let title = playlist.find("video title").text()
    console.log(title);
    let desc = playlist.find("video desc").text()
    console.log(desc);
    let subUrl = "https:" + playlist.find("dataTimedTextVtt").first().attr("url").trim();
    console.log(subUrl);
  })
}
