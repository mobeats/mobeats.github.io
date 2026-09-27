const tracks=[{title:"MOBEATS RADIO",artist:"mobeats",genre:"Live · Soul · R&B · Hip-Hop",type:"radio",youtubeId:"SBnxFo7CjGU"}];
let current=0,playing=false,ytPlayer=null;
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

function renderTracks(){
  const box=$("#trackList");
  box.innerHTML=tracks.map((t,i)=>`<button class="track active" data-track="${i}"><span class="num">01</span><span class="cover c1">ON<br>AIR</span><span class="meta"><b>${t.title}</b><small>${t.artist} · ${t.genre}</small></span><span class="play">▶</span></button>`).join("");
  box.querySelector(".track").addEventListener("click",()=>toggle())
}

function selectTrack(){
  const t=tracks[0];
  $("#playerTitle").textContent=t.title;
  $("#playerGenre").textContent=t.artist+" · "+t.genre;
  $("#miniCover").innerHTML="ON<br>AIR";
  $("#time").textContent="LIVE"
}

function setPlaying(v){
  playing=v;
  $("#mainPlay").textContent=playing?"Ⅱ":"▶";
  $("#heroPlay").textContent=playing?"Ⅱ Pause":"▶ Play the vibe";
  $("#wave").classList.toggle("paused",!playing)
}

function showStatus(message,showLink=false){
  let status=$("#ytStatus");
  if(!status){
    status=document.createElement("div");
    status.id="ytStatus";
    status.style.cssText="position:absolute;inset:auto 8px 8px 8px;padding:8px 10px;border-radius:8px;background:#111;color:#fff;font:12px/1.3 system-ui;z-index:3";
    $(".yt-player").style.position="relative";
    $(".yt-player").appendChild(status)
  }
  status.innerHTML=message+(showLink?' <a href="https://www.youtube.com/watch?v='+tracks[0].youtubeId+'" target="_blank" rel="noopener" style="color:#c8a0ff">YouTube öffnen</a>':"");
}

function clearStatus(){
  const s=$("#ytStatus");
  if(s)s.remove()
}

function toggle(){
  if(!ytPlayer)return;
  clearStatus();
  if(playing)ytPlayer.pauseVideo();
  else{
    ytPlayer.unMute();
    ytPlayer.playVideo()
  }
}

function updateTime(){
  if(!ytPlayer||!ytPlayer.getPlayerState)return;
  if(ytPlayer.getPlayerState()===YT.PlayerState.PLAYING)$("#time").textContent="LIVE"
}

window.onYouTubeIframeAPIReady=function(){
  ytPlayer=new YT.Player("ytPlayer",{
    width:"200",
    height:"200",
    videoId:tracks[0].youtubeId,
    playerVars:{
      autoplay:0,
      controls:1,
      playsinline:1,
      enablejsapi:1,
      rel:0,
      origin:window.location.origin
    },
    events:{
      onReady:()=>{
        ytPlayer.setVolume(100);
        ytPlayer.unMute();
        selectTrack();
        clearStatus()
      },
      onStateChange:e=>{
        if(e.data===YT.PlayerState.PLAYING){
          clearStatus();
          setPlaying(true)
        }
        if(e.data===YT.PlayerState.PAUSED)setPlaying(false);
        if(e.data===YT.PlayerState.BUFFERING)showStatus("MOBEATS RADIO lädt …");
        if(e.data===YT.PlayerState.ENDED){
          setPlaying(false);
          showStatus("Der YouTube-Livestream ist beendet.",true)
        }
        if(e.data===YT.PlayerState.CUED)setPlaying(false)
      },
      onError:e=>{
        setPlaying(false);
        const code=e.data;
        const msg=code===101||code===150
          ?"Dieser Livestream erlaubt keine Einbettung auf mobeats.de."
          :code===100
          ?"Der YouTube-Livestream wurde nicht gefunden oder ist privat."
          :code===153
          ?"YouTube hat die Einbettung wegen fehlender Herkunftskennung abgelehnt."
          :"YouTube-Fehler ("+code+").";
        showStatus(msg,true)
      },
      onAutoplayBlocked:()=>{
        setPlaying(false);
        showStatus("Browser blockiert die automatische Wiedergabe. Klicke erneut auf Play.")
      }
    }
  });
  setInterval(updateTime,1000)
};

$("#mainPlay").addEventListener("click",toggle);
$("#heroPlay").addEventListener("click",toggle);
renderTracks();
selectTrack();