import{i as c,s,t as l,d,b as p}from"./layout-D7o9Jn7H.js";document.addEventListener("DOMContentLoaded",()=>{c("home");const t=s.fleetStats(),i=document.getElementById("fleet-stats");i&&(i.innerHTML=[["Operators",t.operators],["Vessels",t.boats],["Trip products",t.trips],["Marinas",t.marinas],["Avg captain ★",t.rating],["Guest promise","Once-in-a-lifetime"]].map(([e,a])=>`
      <div class="market-stat">
        <div class="label">${e}</div>
        <div class="value">${a}</div>
      </div>`).join(""));const r=s.getTrips().filter(e=>e.popular).slice(0,6);document.getElementById("featured-trips").innerHTML=r.map(l).join("");const n=s.getOperators().sort((e,a)=>a.rating-e.rating).slice(0,3);document.getElementById("featured-captains").innerHTML=n.map(d).join("");const o=s.getReviews().slice(0,3);document.getElementById("home-reviews").innerHTML=o.map(e=>`
    <article class="card review-card">
      <div class="stars">${p(e.rating)}</div>
      <p style="color:var(--cream);font-size:1.02rem">“${e.text}”</p>
      <p class="muted" style="margin:0;font-size:0.82rem">${e.guest} · <span style="color:var(--teal-soft)">${e.highlight||""}</span></p>
    </article>`).join("")});
