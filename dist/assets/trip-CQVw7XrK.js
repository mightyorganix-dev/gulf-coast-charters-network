import{i as o,s as a,a as m,c as p,m as g,b as h}from"./layout-DSarl7nZ.js";document.addEventListener("DOMContentLoaded",()=>{var l;o("trips");const n=new URLSearchParams(location.search).get("id")||"trip-1",e=a.getTripById(n),d=document.getElementById("trip-detail");if(!e){d.innerHTML='<div class="empty-state"><strong>Trip not found</strong><p><a href="trips.html">Back to catalog</a></p></div>';return}const i=a.getOperatorById(e.operatorId),s=a.getBoatById(e.boatId),r=a.getMarinaById(e.marinaId),v=e.pricePer?` / ${e.pricePer}`:" per trip",c=a.getReviews().filter(t=>t.tripId===e.id||t.operatorId===e.operatorId).slice(0,3);d.innerHTML=`
    <div class="detail-hero">
      <div class="detail-media" style="--hue:200;min-height:320px">
        <img src="${m(e.image)}" alt="">
      </div>
      <div>
        <div class="eyebrow">${p(e.category)} · ${e.cxTier==="premier"?"Premier CX":"Network"}</div>
        <h1>${e.title}</h1>
        <p class="hero-lead" style="margin-top:0.5rem">${e.subtitle}</p>
        <p>${e.description}</p>
        <div class="card" style="margin:1rem 0;padding:1rem;border-color:rgba(196,165,116,0.28)">
          <div class="card-kicker">Guest experience promise</div>
          <p style="margin:0;color:var(--cream)">${e.experiencePromise||a.getCx().promise}</p>
        </div>
        <div class="stat-grid" style="grid-template-columns:repeat(2,1fr);margin:1rem 0">
          <div class="stat"><div class="label">From</div><div class="value" style="font-size:1.6rem">${g(e.basePrice)}</div><div class="muted" style="font-size:0.75rem">${v}</div></div>
          <div class="stat"><div class="label">Duration</div><div class="value" style="font-size:1.6rem">${e.durationHours}h</div><div class="muted" style="font-size:0.75rem">up to ${e.maxParty} guests</div></div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="book.html?trip=${e.id}">Reserve this trip</a>
          <a class="btn btn-ghost" href="captain.html?id=${i==null?void 0:i.id}">Meet ${((l=i==null?void 0:i.name)==null?void 0:l.split(" ").slice(-1)[0])||"captain"}</a>
        </div>
      </div>
    </div>
    <div class="grid-3" style="margin-top:2rem">
      <div class="card">
        <div class="card-kicker">Captain steward</div>
        <h3>${(i==null?void 0:i.name)||""}</h3>
        <p>${(i==null?void 0:i.stewardship)||(i==null?void 0:i.bio)||""}</p>
        <p class="muted" style="font-size:0.82rem">${i==null?void 0:i.rating} ★ · ${i==null?void 0:i.uscgLicense}</p>
      </div>
      <div class="card">
        <div class="card-kicker">Vessel</div>
        <h3>${(s==null?void 0:s.name)||""}</h3>
        <p>${s==null?void 0:s.lengthFeet}' ${s==null?void 0:s.type} · ${s==null?void 0:s.engines}</p>
        <p class="muted" style="font-size:0.82rem">${((s==null?void 0:s.features)||[]).slice(0,4).join(" · ")}</p>
      </div>
      <div class="card">
        <div class="card-kicker">Marina</div>
        <h3>${(r==null?void 0:r.name)||""}</h3>
        <p>${(r==null?void 0:r.address)||""}</p>
        <p class="muted" style="font-size:0.82rem">${(r==null?void 0:r.notes)||""}</p>
      </div>
    </div>
    <div class="check-grid" style="margin-top:1.5rem">
      <div class="card">
        <h3>Included</h3>
        <ul class="check-list">${(e.includes||[]).map(t=>`<li>${t}</li>`).join("")}</ul>
      </div>
      <div class="card">
        <h3>Plan ahead</h3>
        <ul class="check-list">
          ${(e.excludes||[]).map(t=>`<li>${t}</li>`).join("")}
          <li>Deposit ${e.depositPercent}% holds your date</li>
          <li>${e.requiresCert?"Dive certification required":"Waiver required before dock"}</li>
        </ul>
      </div>
    </div>
    ${c.length?`<div style="margin-top:2rem"><div class="section-title" style="text-align:left"><h2>Guest voices</h2></div><div class="card-grid">${c.map(t=>`<article class="card review-card"><div class="stars">${h(t.rating)}</div><p style="color:var(--cream)">“${t.text}”</p><p class="muted" style="margin:0;font-size:0.8rem">${t.guest}</p></article>`).join("")}</div></div>`:""}
  `});
