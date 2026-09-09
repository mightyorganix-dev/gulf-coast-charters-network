import{i as b,s as d,m as p}from"./layout-BWAD9g3P.js";import{m as f,r as w,t as E}from"./calendar-Bl8JN4N6.js";let r="op-3";const v=new Date;let i=v.getFullYear(),c=v.getMonth();function I(n,a){const s=d.getSmsTemplates();return(s[n]||s.green).replace("GCCN charter",`${a.id} charter`)}function $(n){return d.getDateStatus(r,n)}function g(){const n=document.getElementById("cap-cal-mount"),a=document.getElementById("cap-cal-label");a&&(a.textContent=f(i,c)),n&&w({mount:n,year:i,monthIndex:c,statusFor:$,selected:"",editable:!0,ariaLabel:"Edit your availability",onSelect:(s,o)=>{o==="past"||o==="booked"||(d.toggleOperatorBlockedDate(r,s),g(),y())}})}function y(){const n=document.getElementById("cap-avail-stats");if(!n)return;const s=(d.getOperatorAvailability(r).blockedDates||[]).filter(o=>o>=E()).length;n.textContent=`${s} blocked day${s===1?"":"s"} ahead · changes save to this browser (localStorage).`}function u(){r=document.getElementById("captain-select").value||r;const a=d.getOperatorById(r),s=d.getBoats().filter(e=>e.operatorId===r),o=d.getBookings().filter(e=>e.operatorId===r);document.getElementById("cap-name").textContent=(a==null?void 0:a.name)||"",document.getElementById("cap-license").textContent=(a==null?void 0:a.uscgLicense)||"",document.getElementById("cap-avatar").src=(a==null?void 0:a.avatar)||"",document.getElementById("cap-steward").textContent=(a==null?void 0:a.stewardship)||"",document.getElementById("cap-boat").textContent=s.map(e=>`${e.name} (${e.lengthFeet}')`).join(" · ")||"No vessel assigned",document.getElementById("total-charters-count").textContent=o.length,g(),y();const l=document.getElementById("manifest-container");if(!o.length){l.innerHTML='<div class="empty-state"><strong>No manifests yet</strong><p>Upcoming guest holds for this captain will appear here.</p></div>';return}l.innerHTML=o.map(e=>{const t=d.getTripById(e.tripId),m=d.getMarinaById(t==null?void 0:t.marinaId),h=e.weatherStatus==="green"?'<span class="badge badge-ok">Green Light</span>':e.weatherStatus==="yellow"?'<span class="badge badge-warn">Yellow Caution</span>':'<span class="badge badge-bad">Weather Red</span>';return`
      <article class="card" style="margin-bottom:1rem">
        <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:1rem;margin-bottom:1rem">
          <div>
            <div class="actions" style="margin-bottom:0.5rem">
              <span class="muted" style="font-family:monospace;font-weight:700">Ref #${e.id}</span>
              ${h}
              <span class="badge badge-info">${e.startTime}</span>
            </div>
            <h3 style="margin:0">${(t==null?void 0:t.title)||"Charter"}</h3>
            <p style="margin:0.25rem 0 0;font-size:0.85rem">${e.tripDate} · ${(m==null?void 0:m.name)||""} · Party of ${e.partySize}</p>
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
            <div style="margin-top:0.35rem">${e.certVerified?'<span class="badge badge-ok">Cert verified</span>':t!=null&&t.requiresCert?'<span class="badge badge-warn">Cert needed</span>':'<span class="badge badge-info">No cert required</span>'}</div>
          </div>
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Notes</div>
            <div style="font-size:0.85rem;color:var(--cream)">${e.notes||"—"}</div>
          </div>
        </div>
        <div class="row-between" style="border-top:1px solid var(--line);padding-top:1rem;margin-top:1rem">
          <span class="muted">Total ${p(e.totalAmount)} · Deposit <strong style="color:var(--ok)">${p(e.depositPaid)}</strong></span>
          <div class="actions">
            <button type="button" class="btn btn-ghost btn-sm" data-sms="${e.id}">Guest SMS</button>
            <a class="btn btn-primary btn-sm" href="itinerary.html?id=${e.id}" target="_blank">Guest pass</a>
          </div>
        </div>
      </article>`}).join(""),l.querySelectorAll("[data-weather]").forEach(e=>{e.addEventListener("click",()=>{d.updateWeatherStatus(e.dataset.weather,e.dataset.status),u()})}),l.querySelectorAll("[data-sms]").forEach(e=>{e.addEventListener("click",()=>{const t=d.getBookingById(e.dataset.sms),m=I(t.weatherStatus||"green",t);document.getElementById("sms-modal").classList.remove("hidden"),document.getElementById("sms-to").textContent=`${t.customerName} · ${t.customerPhone}`,document.getElementById("sms-body").value=m})})}document.addEventListener("DOMContentLoaded",()=>{var s,o,l,e;b();const n=document.getElementById("captain-select"),a=new URLSearchParams(location.search).get("captain");n.innerHTML=d.getOperators().map(t=>`<option value="${t.id}" ${a===t.id?"selected":""}>${t.name}</option>`).join(""),a&&(r=a),n.addEventListener("change",u),(s=document.getElementById("cap-cal-prev"))==null||s.addEventListener("click",()=>{const t=new Date(i,c-1,1);i=t.getFullYear(),c=t.getMonth(),g()}),(o=document.getElementById("cap-cal-next"))==null||o.addEventListener("click",()=>{const t=new Date(i,c+1,1);i=t.getFullYear(),c=t.getMonth(),g()}),(l=document.getElementById("sms-close"))==null||l.addEventListener("click",()=>document.getElementById("sms-modal").classList.add("hidden")),(e=document.getElementById("sms-send"))==null||e.addEventListener("click",()=>{document.getElementById("sms-modal").classList.add("hidden"),alert("Simulated SMS queued to guest. In production this connects to your SMS provider.")}),u()});
