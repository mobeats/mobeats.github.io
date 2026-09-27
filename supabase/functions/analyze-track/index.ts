import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

serve(async (req)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  try{
    const body=await req.json();
    const filename=String(body.filename||"");
    const apiKey=Deno.env.get("OPENAI_API_KEY");
    if(!apiKey) return new Response(JSON.stringify({}),{status:200,headers:{"Content-Type":"application/json",...cors}});
    const model=Deno.env.get("OPENAI_MODEL")||"gpt-5.6-luna";
    const prompt="Analysiere den Dateinamen eines Musiktracks und liefere vorsichtige Metadaten. Wenn etwas nicht sicher erkennbar ist, lasse es leer. Antworte ausschließlich als JSON mit title, artist, genre und bpm. Erlaubte Genres: Soul, Neo Soul, R&B, Hip-Hop, Rap, Pop, Jazz, Electronic, Other. Dateiname: "+filename;
    const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},body:JSON.stringify({model,input:prompt,text:{format:{type:"json_object"}}})});
    if(!r.ok) return new Response(JSON.stringify({}),{status:200,headers:{"Content-Type":"application/json",...cors}});
    const data=await r.json();
    const raw=data.output_text||"{}";
    let parsed={}; try{parsed=JSON.parse(raw)}catch{}
    return new Response(JSON.stringify(parsed),{status:200,headers:{"Content-Type":"application/json",...cors}});
  }catch(e){
    return new Response(JSON.stringify({error:String(e)}),{status:200,headers:{"Content-Type":"application/json",...cors}});
  }
});