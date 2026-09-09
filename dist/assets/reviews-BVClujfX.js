import{i as r,s as a,b as i}from"./layout-BbULftOu.js";document.addEventListener("DOMContentLoaded",()=>{r("reviews"),document.getElementById("reviews-grid").innerHTML=a.getReviews().map(e=>{const t=a.getOperatorById(e.operatorId),s=a.getTripById(e.tripId);return`<article class="card review-card">
      <div class="stars">${i(e.rating)}</div>
      <p style="color:var(--cream);font-size:1.05rem">“${e.text}”</p>
      <p class="muted" style="margin:0;font-size:0.82rem">${e.guest}</p>
      <p class="muted" style="margin:0.35rem 0 0;font-size:0.78rem">${(s==null?void 0:s.title)||""} · ${(t==null?void 0:t.name)||""} · <span style="color:var(--teal-soft)">${e.highlight||""}</span></p>
    </article>`}).join("")});
