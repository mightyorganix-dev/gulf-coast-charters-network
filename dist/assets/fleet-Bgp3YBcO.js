import{i as n,s as i,a as r}from"./layout-DSarl7nZ.js";document.addEventListener("DOMContentLoaded",()=>{n("fleet");const s=i.getBoats();document.getElementById("fleet-grid").innerHTML=s.map(e=>{const t=i.getOperatorById(e.operatorId),a=i.getMarinaById(e.marinaId);return`
      <article class="card listing-card">
        <div class="listing-media" style="--hue:210"><img class="listing-photo" src="${r(e.image)}" alt=""></div>
        <div class="card-kicker">${e.type} · ${e.lengthFeet}' · capacity ${e.capacity}</div>
        <h3>${e.name}</h3>
        <p>${(t==null?void 0:t.name)||""} · ${(a==null?void 0:a.name)||""}</p>
        <p class="muted" style="font-size:0.8rem">${e.engines}</p>
        <p style="font-size:0.82rem">${(e.features||[]).join(" · ")}</p>
        <a class="card-link" href="captain.html?id=${e.operatorId}">Captain profile</a>
      </article>`}).join("")});
