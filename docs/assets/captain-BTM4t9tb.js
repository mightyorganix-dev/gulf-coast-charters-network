import{i as v,s,a as n,t as m,b as g}from"./layout-BWAD9g3P.js";document.addEventListener("DOMContentLoaded",()=>{var o,l;v("captains");const c=new URLSearchParams(location.search).get("id")||"op-3",t=s.getOperatorById(c),a=document.getElementById("captain-detail");if(!t){a.innerHTML='<div class="empty-state"><strong>Captain not found</strong></div>';return}const i=s.getMarinaById(t.marinaId),p=s.getBoats().filter(e=>e.operatorId===t.id),r=s.getTrips().filter(e=>e.operatorId===t.id),d=s.getReviews().filter(e=>e.operatorId===t.id);a.innerHTML=`
    <div class="detail-hero">
      <div>
        <img src="${n(t.avatar)}" alt="" style="width:100%;max-width:320px;border-radius:24px;border:1px solid var(--line)">
      </div>
      <div>
        <div class="eyebrow">${((o=t.tags)==null?void 0:o.slice(0,3).join(" · "))||"Network captain"}</div>
        <h1>${t.name}</h1>
        <p class="hero-lead" style="margin-top:0.35rem">${t.company}</p>
        <p>${t.bio}</p>
        <div class="card" style="margin:1rem 0">
          <div class="card-kicker">Stewardship standard</div>
          <p style="margin:0;color:var(--cream)">${t.stewardship}</p>
        </div>
        <p class="muted">${t.uscgLicense} · ${t.experienceYears} years · ${t.rating} ★ (${t.reviewCount} reviews)</p>
        <p class="muted" style="font-size:0.85rem">${i==null?void 0:i.name} · ${i==null?void 0:i.address}</p>
        <div class="hero-actions" style="margin-top:1rem">
          <a class="btn btn-primary" href="book.html?trip=${((l=r[0])==null?void 0:l.id)||""}">Book with ${t.name.split(" ").pop()}</a>
          <a class="btn btn-ghost" href="captain-portal.html?captain=${t.id}">Captain portal</a>
        </div>
      </div>
    </div>
    <div style="margin-top:2.5rem">
      <div class="section-title" style="text-align:left"><h2>Vessels</h2></div>
      <div class="card-grid">${p.map(e=>`
        <div class="card">
          <div class="listing-media" style="height:140px;margin:-1.35rem -1.35rem 1rem;border-radius:16px 16px 0 0"><img class="listing-photo" src="${n(e.image)}" alt=""></div>
          <h3>${e.name}</h3>
          <p>${e.lengthFeet}' ${e.type} · capacity ${e.capacity}</p>
          <p class="muted" style="font-size:0.8rem">${(e.features||[]).join(" · ")}</p>
        </div>`).join("")}</div>
    </div>
    <div style="margin-top:2.5rem">
      <div class="section-title" style="text-align:left"><h2>Trips</h2></div>
      <div class="card-grid">${r.map(m).join("")||'<p class="muted">No active trip products.</p>'}</div>
    </div>
    ${d.length?`<div style="margin-top:2.5rem"><div class="section-title" style="text-align:left"><h2>Guest reviews</h2></div><div class="card-grid">${d.map(e=>`<article class="card review-card"><div class="stars">${g(e.rating)}</div><p style="color:var(--cream)">“${e.text}”</p><p class="muted" style="margin:0;font-size:0.8rem">${e.guest}</p></article>`).join("")}</div></div>`:""}
  `});
