import{i as D,s as r,a as L,c as z,m as u,b as H}from"./layout-BbULftOu.js";import{m as S,r as F,f as O}from"./calendar-Bl8JN4N6.js";document.addEventListener("DOMContentLoaded",()=>{var P;D("trips");const B=new URLSearchParams(location.search).get("id")||"trip-1",t=r.getTripById(B),g=document.getElementById("trip-detail");if(!t){g.innerHTML='<div class="empty-state"><strong>Trip not found</strong><p><a href="trips.html">Back to catalog</a></p></div>';return}const a=r.getOperatorById(t.operatorId),s=r.getBoatById(t.boatId),n=r.getMarinaById(t.marinaId),x=t.pricePer?` / ${t.pricePer}`:" private day",h=r.getReviews().filter(e=>e.tripId===t.id||e.operatorId===t.operatorId).slice(0,3),b=r.getTripCaptainIds(t),y=b.map(e=>r.getOperatorById(e)).filter(Boolean);let d=b[0]||t.operatorId,l="";const f=new Date;let c=f.getFullYear(),o=f.getMonth();function $(e=4){return t.pricePer==="person"?t.basePrice*e:t.pricePer==="ski"?t.basePrice*Math.max(1,Math.ceil(e/2)):t.basePrice}function C(e=4){return Math.round($(e)*(t.depositPercent/100))}function w(e){const i=r.getDateStatus(d,e);return i==="available"?"available":i==="blocked"||i==="booked"||i==="past"?i:"unavailable"}function M(){let e=`book.html?trip=${t.id}`;return d&&(e+=`&captain=${d}`),l&&(e+=`&date=${l}`),e}function k(){const e=l?"Hold this date":"Reserve this trip";["trip-reserve-cta","trip-hold-cta"].forEach(i=>{const p=document.getElementById(i);p&&(p.href=M(),p.textContent=e)})}function m(){const e=document.getElementById("trip-date-price");if(!e)return;if(!l){e.innerHTML='<p class="muted" style="margin:0">Select an open date to see your hold amount.</p>',k();return}const i=r.getOperatorById(d);e.innerHTML=`
      <div class="cal-price-line"><span>Selected</span><strong>${O(l)}</strong></div>
      <div class="cal-price-line"><span>Captain</span><strong>${(i==null?void 0:i.name)||"—"}</strong></div>
      <div class="cal-price-line"><span>Trip total</span><strong class="cal-price-accent">${u($())}${t.pricePer?" · est.":""}</strong></div>
      <div class="cal-price-line"><span>Deposit hold (${t.depositPercent}%)</span><strong>${u(C())}</strong></div>
      <p class="muted" style="font-size:0.78rem;margin:0.75rem 0 0">Private whole-boat day. Balance dockside / before departure. Weather Red = deposit credit.</p>`,k()}function I(){const e=document.getElementById("trip-captain-pick");if(e){if(y.length<=1){e.innerHTML="",e.classList.add("hidden");return}e.classList.remove("hidden"),e.innerHTML=`
      <div class="card-kicker">Choose your captain</div>
      <div class="captain-pick" role="listbox" aria-label="Captains for this trip">
        ${y.map(i=>`
          <button type="button" class="captain-pick-btn${i.id===d?" is-selected":""}"
            data-captain="${i.id}" role="option" aria-selected="${i.id===d}">
            <img src="${L(i.avatar)}" alt="" width="40" height="40">
            <span>
              <strong>${i.name}</strong>
              <em>${i.rating} ★ · ${i.uscgLicense||"USCG"}</em>
            </span>
          </button>`).join("")}
      </div>`}}function v(){var p;const e=document.getElementById("trip-cal-mount"),i=document.getElementById("trip-cal-label");i&&(i.textContent=S(c,o)),e&&F({mount:e,year:c,monthIndex:o,statusFor:w,selected:l,ariaLabel:`Open dates for ${((p=r.getOperatorById(d))==null?void 0:p.name)||"captain"}`,onSelect:(E,T)=>{T==="available"&&(l=E,v(),m())}})}g.innerHTML=`
    <div class="detail-hero">
      <div class="detail-media" style="--hue:200;min-height:320px">
        <img src="${L(t.image)}" alt="">
      </div>
      <div>
        <div class="eyebrow">${z(t.category)} · ${t.cxTier==="premier"?"Premier CX":"Network"}</div>
        <h1>${t.title}</h1>
        <p class="hero-lead" style="margin-top:0.5rem">${t.subtitle}</p>
        <p>${t.description}</p>
        <div class="card" style="margin:1rem 0;padding:1rem;border-color:rgba(196,165,116,0.28)">
          <div class="card-kicker">Guest experience promise</div>
          <p style="margin:0;color:var(--cream)">${t.experiencePromise||r.getCx().promise}</p>
        </div>
        <div class="stat-grid" style="grid-template-columns:repeat(2,1fr);margin:1rem 0">
          <div class="stat"><div class="label">From</div><div class="value" style="font-size:1.6rem">${u(t.basePrice)}</div><div class="muted" style="font-size:0.75rem">${x}</div></div>
          <div class="stat"><div class="label">Duration</div><div class="value" style="font-size:1.6rem">${t.durationHours}h</div><div class="muted" style="font-size:0.75rem">up to ${t.maxParty} guests</div></div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" id="trip-reserve-cta" href="book.html?trip=${t.id}">Reserve this trip</a>
          <a class="btn btn-ghost" href="captain.html?id=${a==null?void 0:a.id}">Meet ${((P=a==null?void 0:a.name)==null?void 0:P.split(" ").slice(-1)[0])||"captain"}</a>
        </div>
      </div>
    </div>

    <section class="cal-panel" aria-labelledby="avail-heading" style="margin-top:2.25rem">
      <div class="section-title" style="text-align:left;margin-bottom:1rem">
        <h2 id="avail-heading">Select your date</h2>
        <p>Private whole-boat day · live open dates for the captain stewarding this trip.</p>
      </div>
      <div id="trip-captain-pick" class="cal-captain-block"></div>
      <div class="cal-layout">
        <div class="card cal-card">
          <div class="cal-toolbar">
            <button type="button" class="btn btn-ghost btn-sm" id="trip-cal-prev" aria-label="Previous month">‹</button>
            <strong id="trip-cal-label" class="cal-month-label"></strong>
            <button type="button" class="btn btn-ghost btn-sm" id="trip-cal-next" aria-label="Next month">›</button>
          </div>
          <div id="trip-cal-mount"></div>
          <div class="cal-legend" aria-hidden="true">
            <span><i class="cal-dot cal-dot--available"></i> Available</span>
            <span><i class="cal-dot cal-dot--blocked"></i> Unavailable</span>
            <span><i class="cal-dot cal-dot--selected"></i> Selected</span>
          </div>
        </div>
        <div class="card cal-price-card">
          <div class="card-kicker">Your hold</div>
          <div id="trip-date-price"></div>
          <div class="hero-actions" style="margin-top:1.25rem">
            <a class="btn btn-primary" id="trip-hold-cta" href="book.html?trip=${t.id}">Continue to reserve</a>
          </div>
        </div>
      </div>
    </section>

    <div class="grid-3" style="margin-top:2rem">
      <div class="card">
        <div class="card-kicker">Captain steward</div>
        <h3>${(a==null?void 0:a.name)||""}</h3>
        <p>${(a==null?void 0:a.stewardship)||(a==null?void 0:a.bio)||""}</p>
        <p class="muted" style="font-size:0.82rem">${a==null?void 0:a.rating} ★ · ${a==null?void 0:a.uscgLicense}</p>
      </div>
      <div class="card">
        <div class="card-kicker">Vessel</div>
        <h3>${(s==null?void 0:s.name)||""}</h3>
        <p>${s==null?void 0:s.lengthFeet}' ${s==null?void 0:s.type} · ${s==null?void 0:s.engines}</p>
        <p class="muted" style="font-size:0.82rem">${((s==null?void 0:s.features)||[]).slice(0,4).join(" · ")}</p>
      </div>
      <div class="card">
        <div class="card-kicker">Marina</div>
        <h3>${(n==null?void 0:n.name)||""}</h3>
        <p>${(n==null?void 0:n.address)||""}</p>
        <p class="muted" style="font-size:0.82rem">${(n==null?void 0:n.notes)||""}</p>
      </div>
    </div>
    <div class="check-grid" style="margin-top:1.5rem">
      <div class="card">
        <h3>Included</h3>
        <ul class="check-list">${(t.includes||[]).map(e=>`<li>${e}</li>`).join("")}</ul>
      </div>
      <div class="card">
        <h3>Plan ahead</h3>
        <ul class="check-list">
          ${(t.excludes||[]).map(e=>`<li>${e}</li>`).join("")}
          <li>Deposit ${t.depositPercent}% holds your date</li>
          <li>${t.requiresCert?"Dive certification required":"Waiver required before dock"}</li>
        </ul>
      </div>
    </div>
    ${h.length?`<div style="margin-top:2rem"><div class="section-title" style="text-align:left"><h2>Guest voices</h2></div><div class="card-grid">${h.map(e=>`<article class="card review-card"><div class="stars">${H(e.rating)}</div><p style="color:var(--cream)">“${e.text}”</p><p class="muted" style="margin:0;font-size:0.8rem">${e.guest}</p></article>`).join("")}</div></div>`:""}
  `,document.getElementById("trip-cal-prev").addEventListener("click",()=>{const e=new Date(c,o-1,1);c=e.getFullYear(),o=e.getMonth(),v()}),document.getElementById("trip-cal-next").addEventListener("click",()=>{const e=new Date(c,o+1,1);c=e.getFullYear(),o=e.getMonth(),v()}),document.getElementById("trip-captain-pick").addEventListener("click",e=>{const i=e.target.closest("[data-captain]");i&&(d=i.dataset.captain,l="",I(),v(),m())}),I(),v(),m()});
