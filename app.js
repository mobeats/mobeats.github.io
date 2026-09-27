const tracks=[{title:"WATER BOY",artist:"Pi'erre Bourne",genre:"SoundCloud · Hip-Hop",type:"soundcloud",soundcloudUrl:"https://soundcloud.com/pierrebourne/water-boy"}];
let playing=false,scWidget=null;
const $=s=>document.querySelector(s);

function wave(){
  const w=$("#wave");
  for(let i=0;i<38;i++){
    const b=document.createElement("i");
    b.className="bar";
    b.style.height=(5+Math.random()*18)+"px";
    b.style.animationDelay=(Math.random()*.8)+"s";
    w.appendChild(b)
  }
}
wave();

function selectTrack(){
  const t=tracks[0];
  $("#playerTitle").textContent=t.title;
  $("#playerGenre").textContent=t.artist+" · "+t.genre;
  $("#miniCover").innerHTML="SC";
  $("#time").textContent="0:00"
}

function setPlaying(v){
  playing=v;
  $("#mainPlay").textContent=playing?"Ⅱ":"▶";
  $("#heroPlay").textContent=playing?"Ⅱ Pause":"▶ Play the vibe";
  $("#wave").classList.toggle("paused",!playing)
}

function showStatus(message,showLink=false){
  let status=$("#scStatus");
  if(!status){
    status=document.createElement("div");
    status.id="scStatus";
    status.style.cssText="position:absolute;inset:auto 8px 8px 8px;padding:8px 10px;border-radius:8px;background:#111;color:#fff;font:12px/1.3 system-ui;z-index:3";
    $(".yt-player").style.position="relative";
    $(".yt-player").appendChild(status)
  }
  status.innerHTML=message+(showLink?' <a href="'+tracks[0].soundcloudUrl+'" target="_blank" rel="noopener" style="color:#c8a0ff">SoundCloud öffnen</a>':"");
}

function clearStatus(){
  const s=$("#scStatus");
  if(s)s.remove()
}

function toggle(){
  if(!scWidget)return;
  clearStatus();
  if(playing)scWidget.pause();
  else scWidget.play();
}

function updateTime(){
  if(!scWidget)return;
  scWidget.getPosition(p=>{
    if(typeof p==="number"){
      const sec=Math.floor(p/1000);
      $("#time").textContent=Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0")
    }
  })
}

function initSoundCloud(){
  const host=$("#ytPlayer");
  const iframe=document.createElement("iframe");
  iframe.id="scPlayer";
  iframe.width="200";
  iframe.height="200";
  iframe.scrolling="no";
  iframe.frameBorder="no";
  iframe.allow="autoplay";
  iframe.src="https://w.soundcloud.com/player/?url="+encodeURIComponent(tracks[0].soundcloudUrl)+"&color=%23c8a0ff&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false";
  host.innerHTML="";
  host.appendChild(iframe);

  scWidget=SC.Widget(iframe);
  scWidget.bind(SC.Widget.Events.READY,()=>{
    selectTrack();
    clearStatus()
  });
  scWidget.bind(SC.Widget.Events.PLAY,()=>{
    clearStatus();
    setPlaying(true)
  });
  scWidget.bind(SC.Widget.Events.PAUSE,()=>setPlaying(false));
  scWidget.bind(SC.Widget.Events.FINISH,()=>{
    setPlaying(false);
    $("#time").textContent="0:00"
  });
  scWidget.bind(SC.Widget.Events.ERROR,e=>{
    setPlaying(false);
    showStatus("SoundCloud konnte den Track nicht laden.",true)
  });
  setInterval(updateTime,1000)
}

$("#mainPlay").addEventListener("click",toggle);
$("#heroPlay").addEventListener("click",toggle);
renderTracks();
selectTrack();

if(window.SC&&SC.Widget)initSoundCloud();
else window.addEventListener("load",initSoundCloud);