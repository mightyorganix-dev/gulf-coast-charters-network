import{i as g,s as a,m as s,c}from"./layout-BbULftOu.js";document.addEventListener("DOMContentLoaded",()=>{g();const r=a.revenueSnapshot(),o=a.fleetStats();document.getElementById("admin-stats").innerHTML=[["Manifests",r.bookings],["Gross pipeline",s(r.gross)],["Deposits held",s(r.deposits)],["Items",o.items],["Resources",o.resources],["Channels",o.channels]].map(([t,e])=>`<div class="stat"><div class="label">${t}</div><div class="value" style="font-size:1.55rem">${e}</div></div>`).join(""),document.getElementById("admin-channels").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Channel</th><th>Code</th><th>Status</th><th>Commission</th><th>Notes</th></tr></thead>
      <tbody>
        ${a.getChannels().map(t=>`<tr>
          <td>${t.name}</td>
          <td><code>${t.code}</code></td>
          <td>${t.status}</td>
          <td>${t.commissionPercent==null?"—":t.commissionPercent+"%"}</td>
          <td>${t.notes||""}</td>
        </tr>`).join("")}
      </tbody>
    </table></div>`;const $=a.getBookings();document.getElementById("admin-bookings").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Ref</th><th>Guest</th><th>Item</th><th>Date</th><th>Channel</th><th>Weather</th><th>Deposit</th><th>Status</th></tr></thead>
      <tbody>
        ${$.map(t=>{const e=a.getItemById(t.tripId),d=a.getChannels().find(n=>n.id===(t.channelId||"ch-direct"));return`<tr>
            <td><a href="itinerary.html?id=${t.id}">${t.id}</a></td>
            <td>${t.customerName}</td>
            <td>${(e==null?void 0:e.title)||t.tripId}</td>
            <td>${t.tripDate}</td>
            <td>${(d==null?void 0:d.code)||"direct_web"}</td>
            <td>${t.weatherStatus}</td>
            <td>${s(t.depositPaid)}</td>
            <td>${t.status}</td>
          </tr>`}).join("")}
      </tbody>
    </table></div>`,document.getElementById("admin-items").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Item</th><th>Category</th><th>Duration</th><th>Capacity</th><th>From</th><th>Deposit %</th></tr></thead>
      <tbody>
        ${a.getItems().map(t=>`<tr>
          <td><a href="trip.html?id=${t.id}">${t.title}</a></td>
          <td>${c(t.category)}</td>
          <td>${t.durationHours}h</td>
          <td>${t.maxParty}</td>
          <td>${s(t.basePrice)}${t.pricePer?" / "+t.pricePer:""}</td>
          <td>${t.depositPercent}%</td>
        </tr>`).join("")}
      </tbody>
    </table></div>`,document.getElementById("admin-operators").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Captain</th><th>Company</th><th>Marina</th><th>★</th><th>Specialty</th></tr></thead>
      <tbody>
        ${a.getOperators().map(t=>{const e=a.getMarinaById(t.marinaId);return`<tr>
            <td><a href="captain.html?id=${t.id}">${t.name}</a></td>
            <td>${t.company}</td>
            <td>${(e==null?void 0:e.name)||""}</td>
            <td>${t.rating}</td>
            <td>${(t.specialty||[]).map(c).join(", ")}</td>
          </tr>`}).join("")}
      </tbody>
    </table></div>`,document.getElementById("admin-boats").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Vessel</th><th>Operator</th><th>Length</th><th>Capacity</th><th>Marina</th></tr></thead>
      <tbody>
        ${a.getBoats().map(t=>{const e=a.getOperatorById(t.operatorId),d=a.getMarinaById(t.marinaId);return`<tr><td>${t.name}</td><td>${(e==null?void 0:e.name)||""}</td><td>${t.lengthFeet}'</td><td>${t.capacity}</td><td>${(d==null?void 0:d.name)||""}</td></tr>`}).join("")}
      </tbody>
    </table></div>`;const h=t=>String(t).padStart(2,"0"),l=t=>`${t.getFullYear()}-${h(t.getMonth()+1)}-${h(t.getDate())}`,y=l(new Date);document.getElementById("admin-availability").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Captain</th><th>Blocked ahead</th><th>Next blocked</th><th>Open sample</th><th>Edit</th></tr></thead>
      <tbody>
        ${a.getOperators().map(t=>{const e=(a.getOperatorAvailability(t.id).blockedDates||[]).filter(i=>i>=y).sort(),d=[],n=new Date;for(let i=0;i<45&&d.length<3;i++){const p=l(n);a.isDateAvailable(t.id,p)&&d.push(p),n.setDate(n.getDate()+1)}return`<tr>
            <td><a href="captain.html?id=${t.id}">${t.name}</a></td>
            <td>${e.length}</td>
            <td>${e.slice(0,3).join(", ")||"—"}</td>
            <td>${d.join(", ")||"—"}</td>
            <td><a href="captain-portal.html?captain=${t.id}">Portal calendar</a></td>
          </tr>`}).join("")}
      </tbody>
    </table></div>
    <p class="muted" style="font-size:0.82rem;margin-top:0.75rem">Availability = per-captain blockedDates + active bookings (whole-boat day). Guests see open dates on trip &amp; book flows.</p>`;const m=a.getApplications();document.getElementById("admin-apps").innerHTML=m.length?`<div class="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Company</th><th>Marina</th><th>Status</th></tr></thead><tbody>
        ${m.map(t=>`<tr><td>${t.id}</td><td>${t.name}</td><td>${t.company}</td><td>${t.marina}</td><td>${t.status}</td></tr>`).join("")}
      </tbody></table></div>`:'<p class="muted">No operator applications yet. <a href="operators.html">Join intake</a></p>'});
