#!/usr/bin/env python3
"""Build print PDF from GCCN dock packet markdown (01-04 + cover). DRAFT watermark via footer."""
from pathlib import Path
from fpdf import FPDF

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "GCCN_Dock_Operator_Packet_PRINT.pdf"

def ascii_safe(s: str) -> str:
    return (
        s.replace("\u2014", "-")
        .replace("\u2013", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2022", "-")
        .replace("\u00b7", "-")
        .replace("\u2252", "~")
        .replace("\u2248", "~")
        .replace("\u2265", ">=")
        .replace("\u2610", "[ ]")
        .replace("\u2713", "[x]")
        .replace("\u2192", "->")
        .replace("—", "-")
        .replace("–", "-")
        .replace("•", "-")
        .replace("·", "-")
        .replace("“", '"')
        .replace("”", '"')
        .replace("‘", "'")
        .replace("’", "'")
        .replace("☐", "[ ]")
        .replace("✓", "[x]")
        .replace("≈", "~")
        .replace("≥", ">=")
        .replace("→", "->")
    )

SOURCES = [
    ROOT / "00-DOCK-PACKET-README.md",
    ROOT / "01-operator-ic-participation-agreement.md",
    ROOT / "02-trip-listing-addendum.md",
    ROOT / "03-compliance-checklist.md",
    ROOT / "04-do-not-sign-on-first-handshake.md",
]

class DockPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(80, 80, 80)
        self.cell(0, 6, ascii_safe("GCCN Operator Dock Packet  |  DRAFT - Owner + Counsel Review  |  Not Legal Advice"), align="C")
        self.ln(4)
        self.set_draw_color(180, 180, 180)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-14)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 5, ascii_safe(f"DRAFT template - retain licensed counsel. Page {self.page_no()}/{{nb}}"), align="C")

def clean_line(line: str) -> str:
    s = line.replace("\t", "    ")
    # strip simple markdown markers for print
    for a, b in [
        ("**", ""),
        ("__", ""),
        ("`", ""),
        ("|", " | "),
    ]:
        s = s.replace(a, b)
    # collapse multi-space from table pipes
    while "  |  |" in s:
        s = s.replace("  |  |", " |")
    return s.rstrip()

def is_heading(line: str) -> tuple[bool, int, str]:
    if line.startswith("# "):
        return True, 1, line[2:].strip()
    if line.startswith("## "):
        return True, 2, line[3:].strip()
    if line.startswith("### "):
        return True, 3, line[4:].strip()
    return False, 0, ""

def render_file(pdf: DockPDF, path: Path):
    text = path.read_text(encoding="utf-8")
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=18)
    for raw in text.splitlines():
        line = raw.rstrip()
        if not line.strip():
            pdf.ln(3)
            continue
        if line.strip().startswith("---"):
            pdf.ln(2)
            y = pdf.get_y()
            pdf.set_draw_color(200, 200, 200)
            pdf.line(10, y, 200, y)
            pdf.ln(4)
            continue
        heading, level, title = is_heading(line)
        if heading:
            title = ascii_safe(clean_line(title))
            if level == 1:
                pdf.set_font("Helvetica", "B", 14)
                pdf.set_text_color(20, 20, 20)
                pdf.multi_cell(0, 7, title)
                pdf.ln(2)
            elif level == 2:
                pdf.set_font("Helvetica", "B", 12)
                pdf.set_text_color(30, 30, 30)
                pdf.multi_cell(0, 6, title)
                pdf.ln(1)
            else:
                pdf.set_font("Helvetica", "B", 10)
                pdf.set_text_color(40, 40, 40)
                pdf.multi_cell(0, 5, title)
                pdf.ln(1)
            continue
        body = ascii_safe(clean_line(line))
        # unicode dashes / arrows that Helvetica may miss
        body = (
            body.replace("—", "-")
            .replace("–", "-")
            .replace("✓", "[x]")
            .replace("☐", "[ ]")
            .replace("·", "-")
            .replace("“", '"')
            .replace("”", '"')
            .replace("‘", "'")
            .replace("’", "'")
            .replace("≈", "~")
            .replace("≥", ">=")
            .replace("→", "->")
        )
        if body.lstrip().startswith("|") and set(body.replace("|", "").replace("-", "").replace(" ", "")) == set():
            continue  # markdown table separator
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(30, 30, 30)
        pdf.multi_cell(0, 4.5, body)

def main():
    pdf = DockPDF(format="Letter")
    pdf.alias_nb_pages()
    pdf.set_margins(10, 16, 10)
    for src in SOURCES:
        if not src.exists():
            raise SystemExit(f"missing {src}")
        render_file(pdf, src)
    pdf.output(str(OUT))
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")

if __name__ == "__main__":
    main()
