import{i as h,s as e,m as n,c as p}from"./layout-D7o9Jn7H.js";document.addEventListener("DOMContentLoaded",()=>{h();const d=e.revenueSnapshot(),r=e.fleetStats();document.getElementById("admin-stats").innerHTML=[["Network holds",d.bookings],["Gross pipeline",n(d.gross)],["Deposits held",n(d.deposits)],["Avg booking",n(d.avg)],["Operators",r.operators],["Boats",r.boats]].map(([t,a])=>`<div class="stat"><div class="label">${t}</div><div class="value" style="font-size:1.55rem">${a}</div></div>`).join("");const o=e.getBookings();document.getElementById("admin-bookings").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Ref</th><th>Guest</th><th>Trip</th><th>Date</th><th>Weather</th><th>Deposit</th><th>Status</th></tr></thead>
      <tbody>
        ${o.map(t=>{const a=e.getTripById(t.tripId);return`<tr>
            <td><a href="itinerary.html?id=${t.id}">${t.id}</a></td>
            <td>${t.customerName}</td>
            <td>${(a==null?void 0:a.title)||t.tripId}</td>
            <td>${t.tripDate}</td>
            <td>${t.weatherStatus}</td>
            <td>${n(t.depositPaid)}</td>
            <td>${t.status}</td>
          </tr>`}).join("")}
      </tbody>
    </table></div>`,document.getElementById("admin-operators").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Captain</th><th>Company</th><th>Marina</th><th>★</th><th>Specialty</th></tr></thead>
      <tbody>
        ${e.getOperators().map(t=>{const a=e.getMarinaById(t.marinaId);return`<tr>
            <td><a href="captain.html?id=${t.id}">${t.name}</a></td>
            <td>${t.company}</td>
            <td>${(a==null?void 0:a.name)||""}</td>
            <td>${t.rating}</td>
            <td>${(t.specialty||[]).map(p).join(", ")}</td>
          </tr>`}).join("")}
      </tbody>
    </table></div>`,document.getElementById("admin-boats").innerHTML=`
    <div class="table-wrap"><table>
      <thead><tr><th>Vessel</th><th>Operator</th><th>Length</th><th>Capacity</th><th>Marina</th></tr></thead>
      <tbody>
        ${e.getBoats().map(t=>{const a=e.getOperatorById(t.operatorId),i=e.getMarinaById(t.marinaId);return`<tr><td>${t.name}</td><td>${(a==null?void 0:a.name)||""}</td><td>${t.lengthFeet}'</td><td>${t.capacity}</td><td>${(i==null?void 0:i.name)||""}</td></tr>`}).join("")}
      </tbody>
    </table></div>`;const s=e.getApplications();document.getElementById("admin-apps").innerHTML=s.length?`<div class="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Company</th><th>Marina</th><th>Status</th></tr></thead><tbody>
        ${s.map(t=>`<tr><td>${t.id}</td><td>${t.name}</td><td>${t.company}</td><td>${t.marina}</td><td>${t.status}</td></tr>`).join("")}
      </tbody></table></div>`:'<p class="muted">No operator applications yet. <a href="operators.html">Join intake</a></p>'});
