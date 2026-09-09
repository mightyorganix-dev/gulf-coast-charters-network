import{i as g,s as d,m as r,c as u}from"./layout-BWAD9g3P.js";document.addEventListener("DOMContentLoaded",()=>{var m;g();const s=d.revenueSnapshot(),o=d.fleetStats();document.getElementById("admin-stats").innerHTML=[["Manifests",s.bookings],["Gross pipeline",r(s.gross)],["Deposits held",r(s.deposits)],["Items",o.items],["Resources",o.resources],["Channels",o.channels]].map(([t,e])=>`<div class="stat"><div class="label">${t}</div><div class="value" style="font-size:1.55rem">${e}</div></div>`).join(""),document.getElementById("admin-channels").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Channel</th><th>Code</th><th>Status</th><th>Commission</th><th>Notes</th></tr></thead>
      <tbody>
        ${d.getChannels().map(t=>`<tr>
          <td>${t.name}</td>
          <td><code>${t.code}</code></td>
          <td>${t.status}</td>
          <td>${t.commissionPercent==null?"—":t.commissionPercent+"%"}</td>
          <td>${t.notes||""}</td>
        </tr>`).join("")}
      </tbody>
    </table></div>`;const y=d.getBookings();document.getElementById("admin-bookings").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Ref</th><th>Guest</th><th>Item</th><th>Date</th><th>Channel</th><th>Weather</th><th>Deposit</th><th>Status</th></tr></thead>
      <tbody>
        ${y.map(t=>{const e=d.getItemById(t.tripId),a=d.getChannels().find(n=>n.id===(t.channelId||"ch-direct"));return`<tr>
            <td><a href="itinerary.html?id=${t.id}">${t.id}</a></td>
            <td>${t.customerName}</td>
            <td>${(e==null?void 0:e.title)||t.tripId}</td>
            <td>${t.tripDate}</td>
            <td>${(a==null?void 0:a.code)||"direct_web"}</td>
            <td>${t.weatherStatus}</td>
            <td>${r(t.depositPaid)}</td>
            <td>${t.status}</td>
          </tr>`}).join("")}
      </tbody>
    </table></div>`,document.getElementById("admin-items").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Item</th><th>Category</th><th>Duration</th><th>Capacity</th><th>From</th><th>Deposit %</th></tr></thead>
      <tbody>
        ${d.getItems().map(t=>`<tr>
          <td><a href="trip.html?id=${t.id}">${t.title}</a></td>
          <td>${u(t.category)}</td>
          <td>${t.durationHours}h</td>
          <td>${t.maxParty}</td>
          <td>${r(t.basePrice)}${t.pricePer?" / "+t.pricePer:""}</td>
          <td>${t.depositPercent}%</td>
        </tr>`).join("")}
      </tbody>
    </table></div>`,document.getElementById("admin-operators").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Captain</th><th>Company</th><th>Marina</th><th>★</th><th>Specialty</th></tr></thead>
      <tbody>
        ${d.getOperators().map(t=>{const e=d.getMarinaById(t.marinaId);return`<tr>
            <td><a href="captain.html?id=${t.id}">${t.name}</a></td>
            <td>${t.company}</td>
            <td>${(e==null?void 0:e.name)||""}</td>
            <td>${t.rating}</td>
            <td>${(t.specialty||[]).map(u).join(", ")}</td>
          </tr>`}).join("")}
      </tbody>
    </table></div>`,document.getElementById("admin-boats").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Vessel</th><th>Operator</th><th>Length</th><th>Capacity</th><th>Marina</th></tr></thead>
      <tbody>
        ${d.getBoats().map(t=>{const e=d.getOperatorById(t.operatorId),a=d.getMarinaById(t.marinaId);return`<tr><td>${t.name}</td><td>${(e==null?void 0:e.name)||""}</td><td>${t.lengthFeet}'</td><td>${t.capacity}</td><td>${(a==null?void 0:a.name)||""}</td></tr>`}).join("")}
      </tbody>
    </table></div>`;const l=t=>String(t).padStart(2,"0"),c=t=>`${t.getFullYear()}-${l(t.getMonth()+1)}-${l(t.getDate())}`,b=c(new Date);document.getElementById("admin-availability").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Captain</th><th>Blocked ahead</th><th>Next blocked</th><th>Open sample</th><th>Edit</th></tr></thead>
      <tbody>
        ${d.getOperators().map(t=>{const e=(d.getOperatorAvailability(t.id).blockedDates||[]).filter(i=>i>=b).sort(),a=[],n=new Date;for(let i=0;i<45&&a.length<3;i++){const $=c(n);d.isDateAvailable(t.id,$)&&a.push($),n.setDate(n.getDate()+1)}return`<tr>
            <td><a href="captain.html?id=${t.id}">${t.name}</a></td>
            <td>${e.length}</td>
            <td>${e.slice(0,3).join(", ")||"—"}</td>
            <td>${a.join(", ")||"—"}</td>
            <td><a href="captain-portal.html?captain=${t.id}">Portal calendar</a></td>
          </tr>`}).join("")}
      </tbody>
    </table></div>
    <p class="muted" style="font-size:0.82rem;margin-top:0.75rem">Availability = per-captain blockedDates + active bookings (whole-boat day). Guests see open dates on trip &amp; book flows.</p>`;const h=d.getOperatorPackets();document.getElementById("admin-packets").innerHTML=h.length?`<div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>Operator</th><th>Vessel</th><th>Trip</th><th>Submitted</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${h.map(t=>{const e=t.agreement||{},a=t.addendum||{};return`<tr>
              <td>${t.id}</td>
              <td>${e.operatorName||"—"}</td>
              <td>${e.vessel||"—"}</td>
              <td>${a.tripTitle||"—"}</td>
              <td>${(t.createdAt||"").slice(0,10)}</td>
              <td><span class="badge badge-warn">${t.statusLabel||t.status||"Under review"}</span></td>
              <td><button type="button" class="btn btn-ghost btn-sm" data-packet='${t.id}'>View JSON</button></td>
            </tr>`}).join("")}
        </tbody></table></div>
        <p class="muted" style="font-size:0.82rem;margin-top:0.75rem">Applications only — never auto clear-to-list. Countersignature and listing activation are manual.</p>`:'<p class="muted">No operator packet applications yet. <a href="operator-packet.html">Open packet</a></p>',(m=document.getElementById("admin-packets"))==null||m.querySelectorAll("[data-packet]").forEach(t=>{t.addEventListener("click",()=>{const e=h.find(n=>n.id===t.dataset.packet);if(!e)return;const a=window.open("","_blank");a&&(a.document.write(`<pre style="white-space:pre-wrap;font:12px/1.4 ui-monospace,monospace;padding:1rem">${JSON.stringify(e,null,2).replace(/</g,"&lt;")}</pre>`),a.document.close())})});const p=d.getApplications();document.getElementById("admin-apps").innerHTML=p.length?`<div class="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Company</th><th>Marina</th><th>Status</th></tr></thead><tbody>
        ${p.map(t=>`<tr><td>${t.id}</td><td>${t.name}</td><td>${t.company}</td><td>${t.marina}</td><td>${t.status}</td></tr>`).join("")}
      </tbody></table></div>`:'<p class="muted">No operator applications yet. <a href="operators.html">Join intake</a></p>'});
