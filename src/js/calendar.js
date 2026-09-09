/**
 * Quiet-luxury month calendar for private-day availability.
 * Used on trip detail, book flow, and captain portal.
 */

function pad(n) { return String(n).padStart(2, '0'); }

export function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISODate(iso) {
  const [y, m, day] = String(iso).split('-').map(Number);
  return new Date(y, m - 1, day);
}

export function todayISO() {
  return toISODate(new Date());
}

export function formatLongDate(iso) {
  if (!iso) return '';
  const d = parseISODate(iso);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export function monthLabel(year, monthIndex) {
  return new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * @param {object} opts
 * @param {HTMLElement} opts.mount
 * @param {number} opts.year
 * @param {number} opts.monthIndex 0-11
 * @param {(iso: string) => 'available'|'unavailable'|'blocked'|'booked'|'past'} opts.statusFor
 * @param {string} [opts.selected]
 * @param {(iso: string, status: string) => void} [opts.onSelect]
 * @param {boolean} [opts.editable] if true, unavailable/blocked days are still clickable (captain toggle)
 * @param {string} [opts.ariaLabel]
 */
export function renderMonthCalendar(opts) {
  const {
    mount,
    year,
    monthIndex,
    statusFor,
    selected = '',
    onSelect,
    editable = false,
    ariaLabel = 'Availability calendar',
  } = opts;

  const first = new Date(year, monthIndex, 1);
  const startPad = first.getDay(); // Sun=0
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startPad; i++) {
    cells.push(`<div class="cal-cell cal-cell--empty" aria-hidden="true"></div>`);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
    const status = statusFor(iso);
    const isSelected = selected === iso;
    const clickable = editable || status === 'available';
    const labelMap = {
      available: 'Available',
      unavailable: 'Unavailable',
      blocked: 'Blocked by captain',
      booked: 'Already booked',
      past: 'Past date',
    };
    const aria = `${labelMap[status] || status}, ${formatLongDate(iso)}${isSelected ? ', selected' : ''}`;
    const cls = [
      'cal-cell',
      `cal-cell--${status}`,
      isSelected ? 'is-selected' : '',
      clickable ? 'is-interactive' : '',
    ].filter(Boolean).join(' ');

    if (clickable) {
      cells.push(`<button type="button" class="${cls}" data-date="${iso}" data-status="${status}" aria-label="${aria}" aria-pressed="${isSelected ? 'true' : 'false'}">${day}</button>`);
    } else {
      cells.push(`<button type="button" class="${cls}" data-date="${iso}" data-status="${status}" aria-label="${aria}" disabled>${day}</button>`);
    }
  }

  mount.innerHTML = `
    <div class="cal" role="group" aria-label="${ariaLabel}">
      <div class="cal-weekdays" aria-hidden="true">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>
      <div class="cal-grid">${cells.join('')}</div>
    </div>`;

  mount.querySelectorAll('[data-date].is-interactive').forEach((el) => {
    el.addEventListener('click', () => {
      onSelect?.(el.dataset.date, el.dataset.status);
    });
  });
}

export function attachMonthNav({ prevBtn, nextBtn, labelEl, getView, setView, onChange }) {
  const sync = () => {
    const { year, monthIndex } = getView();
    if (labelEl) labelEl.textContent = monthLabel(year, monthIndex);
  };
  prevBtn?.addEventListener('click', () => {
    const { year, monthIndex } = getView();
    const d = new Date(year, monthIndex - 1, 1);
    setView(d.getFullYear(), d.getMonth());
    sync();
    onChange?.();
  });
  nextBtn?.addEventListener('click', () => {
    const { year, monthIndex } = getView();
    const d = new Date(year, monthIndex + 1, 1);
    setView(d.getFullYear(), d.getMonth());
    sync();
    onChange?.();
  });
  sync();
}
