#!/usr/bin/env python3
"""Polished captain-facing Operator Packet PDF (Forms 01-03). No DRAFT word on surface.
Form 04 is staff-only and omitted. Counsel blanks left as underlines (no COUNSEL TO DRAFT labels).
"""
from pathlib import Path
from fpdf import FPDF

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
OUTS = [
    PROJECT / "GCCN_Operator_Packet.pdf",
    ROOT / "GCCN_Operator_Packet.pdf",
]

def safe(s: str) -> str:
    return (
        s.replace("\u2014", "-").replace("\u2013", "-")
        .replace("\u2018", "'").replace("\u2019", "'")
        .replace("\u201c", '"').replace("\u201d", '"')
        .replace("\u2022", "-").replace("\u00b7", "-")
        .replace("\u2610", "[ ]").replace("☐", "[ ]")
        .replace("≈", "~").replace("≥", ">=").replace("→", "->")
        .replace("—", "-").replace("–", "-")
    )

class PacketPDF(FPDF):
    def header(self):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(26, 111, 143)
        self.cell(0, 6, safe("Gulf Coast Charters Network  |  Operator Packet  |  Forms 01-03"), align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(2)
        self.set_draw_color(26, 138, 124)
        self.set_line_width(0.4)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(6)
        self.set_x(self.l_margin)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 5, safe(f"Electronic / print application  ·  Pending Network countersignature  ·  Page {self.page_no()}/{{nb}}"), align="C")

    def h1(self, t):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(11, 21, 36)
        self.multi_cell(0, 8, safe(t))
        self.ln(1)
        self.set_x(self.l_margin)

    def h2(self, t):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(26, 111, 143)
        self.multi_cell(0, 7, safe(t))
        self.ln(1)
        self.set_x(self.l_margin)

    def h3(self, t):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(26, 138, 124)
        self.multi_cell(0, 6, safe(t))
        self.ln(0.5)
        self.set_x(self.l_margin)

    def body(self, t):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 40, 50)
        self.multi_cell(0, 5, safe(t))
        self.ln(1.5)
        self.set_x(self.l_margin)

    def muted(self, t):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(90, 100, 110)
        self.multi_cell(0, 4.5, safe(t))
        self.ln(1.5)
        self.set_x(self.l_margin)

    def blank_line(self, label, width=70):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 40, 50)
        label_w = 55
        self.cell(label_w, 7, safe(label))
        x = self.get_x()
        y = self.get_y() + 5.5
        self.line(x, y, min(x + width, self.w - self.r_margin), y)
        self.ln(8)
        self.set_x(self.l_margin)

    def sig_block(self, who):
        self.ln(2)
        self.set_x(self.l_margin)
        self.set_draw_color(180, 180, 180)
        y0 = self.get_y()
        if y0 > 250:
            self.add_page()
            y0 = self.get_y()
        self.rect(self.l_margin, y0, self.w - self.l_margin - self.r_margin, 36, style="D")
        self.set_xy(self.l_margin + 4, y0 + 3)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(90, 100, 110)
        self.cell(0, 5, safe(f"{who} acknowledgment (application - pending Network countersignature)"), new_x="LMARGIN", new_y="NEXT")
        self.set_x(self.l_margin + 4)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 40, 50)
        self.cell(55, 7, safe("Typed full name"))
        x = self.get_x()
        self.line(x, self.get_y() + 5.5, self.w - self.r_margin - 4, self.get_y() + 5.5)
        self.ln(10)
        self.set_x(self.l_margin + 4)
        self.cell(55, 7, safe("Date"))
        x = self.get_x()
        self.line(x, self.get_y() + 5.5, x + 50, self.get_y() + 5.5)
        self.set_y(y0 + 38)
        self.set_x(self.l_margin)

def build():
    pdf = PacketPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.set_margins(14, 18, 14)

    # Cover
    pdf.add_page()
    pdf.ln(20)
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(11, 21, 36)
    pdf.multi_cell(0, 10, safe("Operator Packet"), align="C")
    pdf.ln(2)
    pdf.set_font("Helvetica", "", 12)
    pdf.set_text_color(26, 111, 143)
    pdf.multi_cell(0, 6, safe("Gulf Coast Charters Network"), align="C")
    pdf.ln(4)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(70, 80, 90)
    pdf.multi_cell(0, 5, safe("Alabama Gulf Coast flagship · Multi-operator marketplace"), align="C")
    pdf.ln(8)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(30, 40, 50)
    for line in [
        "Contents",
        "  01  Operator / Independent Contractor Participation",
        "  02  Trip Listing Addendum (signature private trip)",
        "  03  Compliance Checklist acknowledgment",
        "",
        "How to use",
        "  1. Fill blanks for legal names, vessel, and trip specifics.",
        "  2. Type name + date as electronic acknowledgment of this application.",
        "  3. Submit / return to Network for review.",
        "  4. Listing activation and Network countersignature follow human review.",
        "",
        "Economics (proposed Network terms): ~12% Network fee / ~88% Operator / Non-exclusive / Stripe deposits per addendum.",
        "",
        "Status after submit: Submitted / Under review. This packet does not auto-clear listings or certify vessel seaworthiness.",
    ]:
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(0, 5.5, safe(line))
    pdf.ln(6)
    pdf.muted("Guest waivers, tax forms, and bank onboarding are handled separately and are not part of this packet.")

    # Form 01
    pdf.add_page()
    pdf.h1("01  Operator / Independent Contractor Participation")
    pdf.muted("Marketplace participation terms for the GCCN lean dock path.")
    pdf.blank_line("Effective date")
    pdf.blank_line("Network entity / dba", 100)
    pdf.blank_line("Operator legal name / dba", 100)
    pdf.blank_line("Vessel (name / HIN / docs)", 100)
    pdf.blank_line("Primary dock / home waters", 100)
    pdf.ln(1)
    pdf.h3("1. Relationship")
    pdf.body("Operator participates in GCCN's multi-operator marketplace as an independent contractor, not an employee, partner, joint venturer, or agent of Network for employment purposes. Operator controls its own vessel, crew, safety decisions, and how charter services are performed, subject to law and marketplace rules.")
    pdf.h3("2. Non-exclusive")
    pdf.body("This Agreement is non-exclusive. Operator may book guests outside GCCN. Network may list other operators. No territory or volume guarantee.")
    pdf.h3("3. Marketplace fee & payouts")
    pdf.body("For bookings completed through GCCN (or Network-approved GCS listings), Network's marketplace fee is approximately twelve percent (12%) of the listed trip price paid by the guest (or such other rate stated on a Trip Listing Addendum). Operator keeps the remainder (approximately eighty-eight percent (88%)), subject to refunds, chargebacks, taxes Network is required to collect/remit (if any), and disclosed payment-processor fees. Payouts follow Network's payout schedule after trip completion. Operator is responsible for its own taxes; Network may issue Form 1099 (or successor) as required.")
    pdf.h3("4. Bookings, deposits & guest funds")
    pdf.body("Guests book through Network's systems. Deposits are typically collected via Stripe (or Network's then-current processor). Default deposit percentage is set on each Trip Listing Addendum (often about 30% unless otherwise stated). Operator will honor confirmed bookings and Network's published cancel/weather rules for that listing.")
    pdf.h3("5. Operator duties")
    pdf.body("Operator will: (a) maintain all licenses, USCG credentials, and vessel documentation required for the offered trip; (b) maintain insurance meeting Network's then-current COI requirements; (c) provide accurate listing info; (d) treat guests professionally; (e) not make prohibited marketing claims (including guaranteed catch or false scarcity); (f) promptly update Network if credentials, insurance, or vessel status change.")
    pdf.h3("6. Network duties")
    pdf.body("Network will: (a) display approved listings; (b) process guest payments per published flow; (c) remit Operator's share per payout rules; (d) provide reasonable booking notices and guest contact info needed to run the trip.")
    pdf.h3("7. Safety & authority")
    pdf.body("Operator (or Operator's master) has final authority on whether to sail for weather/safety. Network's Green-Yellow-Red weather framework guides guest communications and refunds; it does not override Operator's safety judgment or law.")
    pdf.h3("8. Liability allocation")
    pdf.body("Mutual allocation of risk, indemnities, guest waivers, limitation of liability, and insurance additional-insured / waiver-of-subrogation requirements shall be as set forth in Network terms provided with Network countersignature.")
    pdf.h3("9. Term & exit")
    pdf.body("Starts on Effective Date. Either party may end participation with written notice of ________ days (confirmed by Network), provided confirmed bookings are honored or mutually rebooked/refunded under the Addendum. Network may suspend listings immediately for safety, credential, insurance, fraud, or guest-harm concerns.")
    pdf.h3("10. Entire dock packet")
    pdf.body("This participation form, each Trip Listing Addendum, and the Compliance Checklist acknowledgment form the lean dock packet. More detailed Master Terms (if any) control if later adopted and both parties sign.")
    pdf.sig_block("Operator")
    pdf.ln(4)
    pdf.blank_line("Phone / email", 100)

    # Form 02
    pdf.add_page()
    pdf.h1("02  Trip Listing Addendum")
    pdf.muted("Signature private trip — attach to Participation form for one listed trip.")
    pdf.blank_line("Addendum date")
    pdf.blank_line("Operator", 100)
    pdf.blank_line("Vessel", 100)
    pdf.blank_line("Listing ID (if any)", 70)
    pdf.body("Brand surface:  [ ] GCCN only    [ ] Also eligible for GCS cross-list (optional)")
    pdf.h3("A. Trip summary")
    pdf.blank_line("Trip name / title", 110)
    pdf.body("Trip type: [ ] Private fishing  [ ] Yacht / cruise  [ ] Spearfishing  [ ] Sunset / celebration  [ ] Other: ________")
    pdf.blank_line("Home port / meet point", 100)
    pdf.blank_line("Duration (hours)")
    pdf.blank_line("Max guests")
    pdf.blank_line("What's included", 110)
    pdf.blank_line("What's not included", 110)
    pdf.blank_line("Season / blackouts", 100)
    pdf.h3("B. Price & fee")
    pdf.blank_line("Listed trip price (USD)", 60)
    pdf.blank_line("Network fee %  (default ~12)", 40)
    pdf.body("Taxes / resort fees:  [ ] included in listed price    [ ] added at checkout as disclosed: ________")
    pdf.h3("C. Deposit & balance (Stripe)")
    pdf.blank_line("Deposit % at booking (~30)", 40)
    pdf.body("Balance due:  [ ] ____ days before departure    [ ] at check-in    [ ] other: ________")
    pdf.body("Balance method:  [ ] Stripe link    [ ] Network collects    [ ] Other Network-approved process")
    pdf.h3("D. Cancellation by guest")
    pdf.body("More than ____ days before: ____ % refund")
    pdf.body("____ to ____ days before: ____ % refund")
    pdf.body("Fewer than ____ days / no-show: ____ % refund")
    pdf.h3("E. Weather — Green / Yellow / Red")
    pdf.body("Operator safety judgment always controls whether to leave the dock.")
    pdf.body("GREEN — Expected to run; standard cancel table.")
    pdf.body("YELLOW — Marginal; options: [ ] full rebook within ____ days  [ ] partial credit  [ ] other: ____")
    pdf.body("RED — Unsafe; [ ] full refund for that date  [ ] free rebook within ____ days  [ ] guest choice: ____")
    pdf.h3("F-H. Operator cancel · Marketing · Compliance tether")
    pdf.body("If Operator cancels other than Red weather/safety, guest receives full refund and/or Network may rebook another operator. Listing copy will not promise guaranteed catch, illegal takes, or false scarcity. Operator re-affirms Compliance Checklist items remain true as of Addendum date.")
    pdf.sig_block("Operator")

    # Form 03
    pdf.add_page()
    pdf.h1("03  Compliance Checklist")
    pdf.muted("Operational acknowledgment — not a USCG inspection, insurance binder, or legal clearance. Network review follows; no auto clear-to-list.")
    pdf.blank_line("Operator", 100)
    pdf.blank_line("Vessel", 100)
    pdf.blank_line("Checklist date")
    pdf.h3("1. Operator / master credentials")
    pdf.body("[ ] USCG credential appropriate to vessel/route/guests (OUPV / Master)   ID ______  Exp ______")
    pdf.body("[ ] TWIC / other required ID (if applicable)   ID ______  Exp ______")
    pdf.body("[ ] Drug-testing program participation (if required)")
    pdf.body("[ ] State / local charter or business licenses as applicable")
    pdf.h3("2. Vessel documentation & safety")
    pdf.body("[ ] Documentation or state registration matching vessel")
    pdf.body("[ ] Passenger capacity consistent with listing")
    pdf.body("[ ] Required safety gear affirmed by Operator (PFDs, fire, comms) — Network does not certify seaworthiness")
    pdf.body("[ ] Hailing port / marking consistent with docs")
    pdf.h3("3. Certificate of Insurance (COI)")
    pdf.body("[ ] P&I / liability meeting Network's then-current minimums   Carrier/policy ______  Exp ______")
    pdf.body("[ ] Network named as additional insured when Network requires")
    pdf.body("[ ] Hull / other covers Operator chooses (or N/A)")
    pdf.body("[ ] COI copy ready for Network")
    pdf.blank_line("Broker liability minimum (if known)", 70)
    pdf.h3("4. Guest paperwork readiness")
    pdf.body("[ ] Counsel-approved guest waiver process for this trip type is ready (or noted not yet — do not invent)")
    pdf.body("[ ] Emergency contact / headcount process")
    pdf.body("[ ] Spearfishing / GCS extras if applicable (or N/A)")
    pdf.h3("5. Acknowledgments")
    pdf.body("[ ] Network may suspend listings if credentials or insurance lapse, or if a safety/fraud concern arises.")
    pdf.body("[ ] Operator will notify Network before the next booked departure if any item above changes or expires.")
    pdf.body("[ ] This checklist is marketplace participation hygiene — not legal clearance by Network.")
    pdf.sig_block("Operator")
    pdf.ln(3)
    pdf.muted("After submit: status = Submitted / Under review. Network reviewer completes countersignature separately.")

    for out in OUTS:
        pdf.output(str(out))
        print("wrote", out)

if __name__ == "__main__":
    build()
