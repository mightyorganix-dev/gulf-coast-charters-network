import{i as l,s as d,m as n,c as h}from"./layout-BBrNSIJH.js";document.addEventListener("DOMContentLoaded",()=>{l();const i=d.revenueSnapshot(),s=d.fleetStats();document.getElementById("admin-stats").innerHTML=[["Manifests",i.bookings],["Gross pipeline",n(i.gross)],["Deposits held",n(i.deposits)],["Items",s.items],["Resources",s.resources],["Channels",s.channels]].map(([t,e])=>`<div class="stat"><div class="label">${t}</div><div class="value" style="font-size:1.55rem">${e}</div></div>`).join(""),document.getElementById("admin-channels").innerHTML=`
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
    </table></div>`;const o=d.getBookings();document.getElementById("admin-bookings").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Ref</th><th>Guest</th><th>Item</th><th>Date</th><th>Channel</th><th>Weather</th><th>Deposit</th><th>Status</th></tr></thead>
      <tbody>
        ${o.map(t=>{const e=d.getItemById(t.tripId),a=d.getChannels().find(m=>m.id===(t.channelId||"ch-direct"));return`<tr>
            <td><a href="itinerary.html?id=${t.id}">${t.id}</a></td>
            <td>${t.customerName}</td>
            <td>${(e==null?void 0:e.title)||t.tripId}</td>
            <td>${t.tripDate}</td>
            <td>${(a==null?void 0:a.code)||"direct_web"}</td>
            <td>${t.weatherStatus}</td>
            <td>${n(t.depositPaid)}</td>
            <td>${t.status}</td>
          </tr>`}).join("")}
      </tbody>
    </table></div>`,document.getElementById("admin-items").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Item</th><th>Category</th><th>Duration</th><th>Capacity</th><th>From</th><th>Deposit %</th></tr></thead>
      <tbody>
        ${d.getItems().map(t=>`<tr>
          <td><a href="trip.html?id=${t.id}">${t.title}</a></td>
          <td>${h(t.category)}</td>
          <td>${t.durationHours}h</td>
          <td>${t.maxParty}</td>
          <td>${n(t.basePrice)}${t.pricePer?" / "+t.pricePer:""}</td>
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
            <td>${(t.specialty||[]).map(h).join(", ")}</td>
          </tr>`}).join("")}
      </tbody>
    </table></div>`,document.getElementById("admin-boats").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Vessel</th><th>Operator</th><th>Length</th><th>Capacity</th><th>Marina</th></tr></thead>
      <tbody>
        ${d.getBoats().map(t=>{const e=d.getOperatorById(t.operatorId),a=d.getMarinaById(t.marinaId);return`<tr><td>${t.name}</td><td>${(e==null?void 0:e.name)||""}</td><td>${t.lengthFeet}'</td><td>${t.capacity}</td><td>${(a==null?void 0:a.name)||""}</td></tr>`}).join("")}
      </tbody>
    </table></div>`;const r=d.getApplications();document.getElementById("admin-apps").innerHTML=r.length?`<div class="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Company</th><th>Marina</th><th>Status</th></tr></thead><tbody>
        ${r.map(t=>`<tr><td>${t.id}</td><td>${t.name}</td><td>${t.company}</td><td>${t.marina}</td><td>${t.status}</td></tr>`).join("")}
      </tbody></table></div>`:'<p class="muted">No operator applications yet. <a href="operators.html">Join intake</a></p>'});
