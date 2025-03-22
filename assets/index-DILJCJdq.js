(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const b of i.addedNodes)b.tagName==="LINK"&&b.rel==="modulepreload"&&n(b)}).observe(document,{childList:!0,subtree:!0});function r(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=r(o);fetch(o.href,i)}})();let u,g,y,p,l,w,s,E,m,c,f=!1,d=null,h=[];async function T(){try{await A(),await x(),await k(),await M(),console.log("Application initialized successfully")}catch(t){console.error("Error initializing app:",t),a("Erreur d'initialisation: "+t.message)}}async function A(){return new Promise((t,e)=>{try{p=document.querySelector("#chat-container"),l=document.querySelector("#messageInput"),w=document.querySelector("#sendBtn"),s=document.querySelector("#micButton"),E=document.querySelector("#loading"),m=document.querySelector("#error"),c=document.querySelector("#status");const n=Object.entries({chatContainer:p,messageInput:l,sendButton:w,micButton:s,loadingIndicator:E,errorDiv:m,statusDiv:c}).filter(([,o])=>!o).map(([o])=>o);if(n.length>0){e(new Error(`Éléments manquants: ${n.join(", ")}`));return}t()}catch(r){e(r)}})}async function x(){return new Promise(t=>{try{w&&w.addEventListener("click",L),l&&l.addEventListener("keypress",e=>{e.key==="Enter"&&L()}),s&&s.addEventListener("click",_),t()}catch(e){console.error("Error initializing event listeners:",e),t()}})}async function M(){return new Promise((t,e)=>{try{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){const r="Votre navigateur ne supporte pas l'enregistrement audio. Veuillez utiliser Chrome, Firefox ou Edge récent.";a(r),s&&(s.disabled=!0,s.title=r),e(new Error(r));return}if(location.protocol!=="https:"&&location.hostname!=="localhost"){const r="La reconnaissance vocale nécessite une connexion sécurisée (HTTPS)";a(r),s&&(s.disabled=!0,s.title=r),e(new Error(r));return}t()}catch(r){e(r)}})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",T):T();function k(){try{if(g="jzJqcIGaDVmmjX6vH36nyeP68xHJISFg",y="sk_e1f809d4c4fee27f4807edff13db0cfe68802b134b5ede84",u="6fb01e9625fb40c79cbc8669f287e3f6",!g||!y||!u)throw new Error("Missing required environment variables");console.log("Environment variables loaded successfully")}catch(t){console.error("Error loading environment variables:",t),a("Erreur de chargement des variables d'environnement")}}function _(){f?O():C()}async function C(){try{if(!s)throw new Error("Le bouton microphone n'est pas initialisé");const t=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,sampleRate:16e3,sampleSize:16,volume:1}}),e=MediaRecorder.isTypeSupported("audio/webm;codecs=opus")?"audio/webm;codecs=opus":"audio/webm";d=new MediaRecorder(t,{mimeType:e,audioBitsPerSecond:16e3}),h=[],d.ondataavailable=r=>{r.data.size>0&&h.push(r.data)},d.onstop=async()=>{try{if(h.length>0){const r=new Blob(h,{type:e});await R(r)}}finally{t.getTracks().forEach(r=>r.stop())}},d.start(1e3),f=!0,s.classList.add("recording"),s.innerHTML="🔴",P("Enregistrement en cours...")}catch(t){console.error("Error starting recording:",t),a(t.message||"Impossible d'accéder au microphone"),f=!1,s&&(s.classList.remove("recording"),s.innerHTML="🎤")}}function O(){d&&f&&(d.stop(),f=!1,s.classList.remove("recording"),s.innerHTML="🎤",P("Traitement de l'audio..."))}async function R(t){if(!u){a("Clé API AssemblyAI manquante"),v();return}try{const e=await q(t);if(!e||!e.upload_url)throw new Error("Échec du téléchargement de l'audio");const r=await I(e.upload_url);if(!r)throw new Error("Échec de la demande de transcription");const n=await z(r);if(!n||!n.text)throw new Error("Échec de la transcription");l.value=n.text,v()}catch(e){console.error("Error processing recording:",e),a("Erreur de traitement de l'enregistrement: "+e.message),v()}}async function q(t){try{const e=await fetch("https://api.assemblyai.com/v2/upload",{method:"POST",headers:{Authorization:u}});if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);const r=await e.json(),n=await fetch(r.upload_url,{method:"PUT",headers:{"Content-Type":"application/octet-stream"},body:t});if(!n.ok)throw new Error(`HTTP error! status: ${n.status}`);return r}catch(e){throw console.error("Error uploading audio:",e),e}}async function I(t){try{const e=await fetch("https://api.assemblyai.com/v2/transcript",{method:"POST",headers:{Authorization:u,"Content-Type":"application/json"},body:JSON.stringify({audio_url:t,language_code:"fr"})});if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return(await e.json()).id}catch(e){throw console.error("Error submitting transcription request:",e),e}}async function z(t){let r=0;for(;r<60;)try{const n=await fetch(`https://api.assemblyai.com/v2/transcript/${t}`,{method:"GET",headers:{Authorization:u}});if(!n.ok)throw new Error(`HTTP error! status: ${n.status}`);const o=await n.json();if(o.status==="completed")return o;if(o.status==="error")throw new Error("Transcription error: "+o.error);await new Promise(i=>setTimeout(i,500)),r++}catch(n){throw console.error("Error polling transcription result:",n),n}throw new Error("Transcription timeout")}async function L(){const t=l.value.trim();if(t){S("user",t),l.value="",E.style.display="block";try{const e=await H(t);S("ai",e),B(e)}catch(e){console.error("Error sending message:",e),a("Erreur d'envoi du message: "+e.message)}E.style.display="none"}}async function H(t){if(!g)throw new Error("Clé API Mistral manquante");try{const e=await fetch("https://api.mistral.ai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${g}`,"Content-Type":"application/json"},body:JSON.stringify({model:"mistral-large-latest",messages:[{role:"user",content:t}],temperature:.7,max_tokens:800})});if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return(await e.json()).choices[0].message.content}catch(e){throw console.error("Error getting Mistral response:",e),e}}async function B(t){if(!y){console.error("ElevenLabs API key missing");return}try{const r=await fetch("https://api.elevenlabs.io/v1/text-to-speech/VR6AewLTigWG4xSOukaG",{method:"POST",headers:{"xi-api-key":y,"Content-Type":"application/json"},body:JSON.stringify({text:t,model_id:"eleven_multilingual_v2",voice_settings:{stability:.5,similarity_boost:.5}})});if(!r.ok)throw new Error(`HTTP error! status: ${r.status}`);const n=await r.blob(),o=URL.createObjectURL(n);new Audio(o).play()}catch(e){console.error("Error with ElevenLabs TTS:",e),a("Erreur de synthèse vocale")}}function S(t,e){const r=document.createElement("div");r.classList.add("message",t==="user"?"user-message":"ai-message");const n=document.createElement("div");n.classList.add("message-content"),n.textContent=e,r.appendChild(n),p.appendChild(r),p.scrollTop=p.scrollHeight}function a(t){m.textContent=t,m.style.display="block",setTimeout(()=>{m.style.display="none"},5e3)}function P(t){c&&(c.textContent=t,c.style.display="block")}function v(){c&&(c.style.display="none")}document.head.insertAdjacentHTML("beforeend",`
  <style>
    #status {
      background-color: #e3f2fd;
      color: #0d47a1;
      padding: 8px;
      border-radius: 4px;
      margin-bottom: 10px;
      text-align: center;
      display: none;
    }
    
    .recording-waves {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-left: 5px;
      position: relative;
    }
    
    .recording-waves span {
      position: absolute;
      width: 8px;
      height: 8px;
      background: rgba(255,0,0,0.7);
      border-radius: 50%;
      animation: wave 1.5s infinite;
    }
    
    .recording-waves span:nth-child(2) {
      animation-delay: 0.3s;
    }
    
    .recording-waves span:nth-child(3) {
      animation-delay: 0.6s;
    }
    
    @keyframes wave {
      0% { transform: scale(0); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }
  </style>
`);
