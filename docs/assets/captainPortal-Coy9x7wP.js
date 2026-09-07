import{i as u,s,m as c}from"./layout-D7o9Jn7H.js";let r="op-3";function p(i,t){const o=s.getSmsTemplates();return(o[i]||o.green).replace("GCCN charter",`${t.id} charter`)}function m(){s.getOperators(),r=document.getElementById("captain-select").value||r;const t=s.getOperatorById(r),o=s.getBoats().filter(e=>e.operatorId===r),d=s.getBookings().filter(e=>e.operatorId===r);document.getElementById("cap-name").textContent=(t==null?void 0:t.name)||"",document.getElementById("cap-license").textContent=(t==null?void 0:t.uscgLicense)||"",document.getElementById("cap-avatar").src=(t==null?void 0:t.avatar)||"",document.getElementById("cap-steward").textContent=(t==null?void 0:t.stewardship)||"",document.getElementById("cap-boat").textContent=o.map(e=>`${e.name} (${e.lengthFeet}')`).join(" · ")||"No vessel assigned",document.getElementById("total-charters-count").textContent=d.length;const n=document.getElementById("manifest-container");if(!d.length){n.innerHTML='<div class="empty-state"><strong>No manifests yet</strong><p>Upcoming guest holds for this captain will appear here.</p></div>';return}n.innerHTML=d.map(e=>{const a=s.getTripById(e.tripId),l=s.getMarinaById(a==null?void 0:a.marinaId),g=e.weatherStatus==="green"?'<span class="badge badge-ok">Green Light</span>':e.weatherStatus==="yellow"?'<span class="badge badge-warn">Yellow Caution</span>':'<span class="badge badge-bad">Weather Red</span>';return`
      <article class="card" style="margin-bottom:1rem">
        <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:1rem;margin-bottom:1rem">
          <div>
            <div class="actions" style="margin-bottom:0.5rem">
              <span class="muted" style="font-family:monospace;font-weight:700">Ref #${e.id}</span>
              ${g}
              <span class="badge badge-info">${e.startTime}</span>
            </div>
            <h3 style="margin:0">${(a==null?void 0:a.title)||"Charter"}</h3>
            <p style="margin:0.25rem 0 0;font-size:0.85rem">${e.tripDate} · ${(l==null?void 0:l.name)||""} · Party of ${e.partySize}</p>
          </div>
          <div class="call-btns" aria-label="Weather call">
            <span class="muted" style="font-size:0.65rem;align-self:center;padding:0 0.35rem;text-transform:uppercase;letter-spacing:0.06em">Call</span>
            <button type="button" class="${e.weatherStatus==="green"?"active-green":""}" data-weather="${e.id}" data-status="green">Green</button>
            <button type="button" class="${e.weatherStatus==="yellow"?"active-yellow":""}" data-weather="${e.id}" data-status="yellow">Yellow</button>
            <button type="button" class="${e.weatherStatus==="red"?"active-red":""}" data-weather="${e.id}" data-status="red">Red</button>
          </div>
        </div>
        <div class="grid-3">
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Guest lead</div>
            <strong style="color:var(--cream)">${e.customerName}</strong>
            <div style="font-size:0.85rem">${e.customerPhone}</div>
            <div class="muted" style="font-size:0.8rem">${e.customerEmail}</div>
          </div>
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Readiness</div>
            <div>${e.waiverSigned?'<span class="badge badge-ok">Waiver signed</span>':'<span class="badge badge-warn">Waiver pending</span>'}</div>
            <div style="margin-top:0.35rem">${e.certVerified?'<span class="badge badge-ok">Cert verified</span>':a!=null&&a.requiresCert?'<span class="badge badge-warn">Cert needed</span>':'<span class="badge badge-info">No cert required</span>'}</div>
          </div>
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Notes</div>
            <div style="font-size:0.85rem;color:var(--cream)">${e.notes||"—"}</div>
          </div>
        </div>
        <div class="row-between" style="border-top:1px solid var(--line);padding-top:1rem;margin-top:1rem">
          <span class="muted">Total ${c(e.totalAmount)} · Deposit <strong style="color:var(--ok)">${c(e.depositPaid)}</strong></span>
          <div class="actions">
            <button type="button" class="btn btn-ghost btn-sm" data-sms="${e.id}">Guest SMS</button>
            <a class="btn btn-primary btn-sm" href="itinerary.html?id=${e.id}" target="_blank">Guest pass</a>
          </div>
        </div>
      </article>`}).join(""),n.querySelectorAll("[data-weather]").forEach(e=>{e.addEventListener("click",()=>{s.updateWeatherStatus(e.dataset.weather,e.dataset.status),m()})}),n.querySelectorAll("[data-sms]").forEach(e=>{e.addEventListener("click",()=>{const a=s.getBookingById(e.dataset.sms),l=p(a.weatherStatus||"green",a);document.getElementById("sms-modal").classList.remove("hidden"),document.getElementById("sms-to").textContent=`${a.customerName} · ${a.customerPhone}`,document.getElementById("sms-body").value=l})})}document.addEventListener("DOMContentLoaded",()=>{var o,d;u();const i=document.getElementById("captain-select"),t=new URLSearchParams(location.search).get("captain");i.innerHTML=s.getOperators().map(n=>`<option value="${n.id}" ${t===n.id?"selected":""}>${n.name}</option>`).join(""),t&&(r=t),i.addEventListener("change",m),(o=document.getElementById("sms-close"))==null||o.addEventListener("click",()=>document.getElementById("sms-modal").classList.add("hidden")),(d=document.getElementById("sms-send"))==null||d.addEventListener("click",()=>{document.getElementById("sms-modal").classList.add("hidden"),alert("Simulated SMS queued to guest. In production this connects to your SMS provider.")}),m()});
