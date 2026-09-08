import{i as f,s as t,t as i,d as y,b as E}from"./layout-YHxjb9E0.js";document.addEventListener("DOMContentLoaded",()=>{f("home");const s=t.fleetStats(),r=document.getElementById("fleet-stats");r&&(r.innerHTML=[["Items",s.items],["Resources",s.resources],["Channels",s.channels],["Marinas",s.marinas],["Avg captain ★",s.rating],["Guest promise","Premier CX"]].map(([e,a])=>`
      <div class="market-stat">
        <div class="label">${e}</div>
        <div class="value">${a}</div>
      </div>`).join(""));const p=t.getTrips().filter(e=>e.popular).slice(0,8),n=document.getElementById("popular-trips");n&&(n.innerHTML=p.map(i).join(""));const d=t.filterTrips({group:"adventures"}).slice(0,4),o=document.getElementById("adventure-trips");o&&(o.innerHTML=d.map(i).join(""));const m=t.filterTrips({group:"watersports"}).slice(0,4),c=document.getElementById("watersport-trips");c&&(c.innerHTML=m.map(i).join(""));const v=t.filterTrips({category:"private"}).slice(0,4),l=document.getElementById("private-trips");l&&(l.innerHTML=v.map(i).join(""));const u=t.getOperators().sort((e,a)=>a.rating-e.rating).slice(0,3);document.getElementById("featured-captains").innerHTML=u.map(y).join("");const g=t.getReviews().slice(0,3);document.getElementById("home-reviews").innerHTML=g.map(e=>`
    <article class="card review-card">
      <div class="stars">${E(e.rating)}</div>
      <p style="color:var(--cream);font-size:1.02rem">“${e.text}”</p>
      <p class="muted" style="margin:0;font-size:0.82rem">${e.guest} · <span style="color:var(--teal-soft)">${e.highlight||""}</span></p>
    </article>`).join("")});
