
var audio = new Audio()
audio.autoplay = true

var musicList = []
var currentIndex = 0


getMusicList(function(list){
    musicList = list
    loadMusic(musicList[currentIndex])
    generateList(musicList)
})



 audio.ontimeupdate = function () {
     $('.musicBox .progress-now').style.width = (this.currentTime/this.duration)*100 + '%'
 }


audio.onplay = function () {
    clock = setInterval(function(){
        var min = Math.floor(audio.currentTime/60)
        var sec = Math.floor(audio.currentTime)%60 + ''
        sec = sec.length === 2? sec : '0' + sec
        $('.musicBox .time').innerText = min + ':' + sec
    },1000)
}

audio.onpause = function(){
    clearInterval(clock)
}

audio.onended = function () {
    currentIndex = (++currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}


$('.musicBox .play').onclick = function(){
    audio.pause()
    $('.pause .icon.active').classList.remove('active')
    $('.play .icon').classList.add('active')
}
$('.musicBox .pause').onclick = function(){
    audio.play()
    $('.play .icon.active').classList.remove('active')
    $('.pause .icon').classList.add('active')
}


$('.musicBox .forward').onclick = function(){
    currentIndex = (++currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}
$('.musicBox .back').onclick = function(){
    currentIndex = (musicList.length + (--currentIndex))%musicList.length
    loadMusic(musicList[currentIndex])
}

$('.musicBox .bar').onclick = function(e){
    var percent = e.offsetX/parseInt(getComputedStyle(this).width)
    audio.currentTime = audio.duration * percent
}

$('.musicBox .list').onclick = function(e){
    if(e.target.tagName.toLowerCase() === 'li'){
        var len = this.children.length
        for(var i = 0; i < len; i++){
            !function (i) {
                if($('.musicBox .list').children[i] === e.target){
                    currentIndex = i
                }
            }(i)
        }
        loadMusic(musicList[currentIndex])
    }
}


function getMusicList(callback){
    var xhr = new XMLHttpRequest()
    xhr.open('GET','music.json',true)  // 这样写，请求的时候域名是与网页保持一致
    xhr.onload = function() {
        if((xhr.status >= 200 && xhr.status <= 300) || xhr.status === 304){
            // console.log(JSON.parse(xhr.responseText))
            callback(JSON.parse(xhr.responseText))
        }else{
            console.log('获取数据失败')
        }
    }
    xhr.onerror = function () {
        console.log('网络异常')
    }
    xhr.send()
}


function loadMusic(musicObject){
    // console.log('begin play',musicObject)
    audio.src = musicObject.src
    $('.musicBox .title').innerText = musicObject.title
    $('.musicBox .author').innerText = musicObject.author
    $('.cover').style.backgroundImage = 'url('+ musicObject.img +')'
    if($('.play .icon.active')){
        $('.play .icon.active').classList.remove('active')
        $('.pause .icon').classList.add('active')
    }
    for(var i = 0; i < $('.musicBox .list').children.length; i++){
        $('.musicBox .list').children[i].classList.remove('playing')
        $('.musicBox .list').children[currentIndex].classList.add('playing')
    }
}


function generateList(musicList){
    var container = document.createDocumentFragment()
    musicList.forEach(function (musicObj) {
        var node = document.createElement('li')
        node.innerText = musicObj.title + '-' + musicObj.author
        container.appendChild(node)
    })
    $('.musicBox .list').appendChild(container)
    $('.musicBox .list').children[0].classList.add('playing')
}


function $(selector) {
    return document.querySelector(selector)
}
