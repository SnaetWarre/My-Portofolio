from html import escape
from pathlib import Path

from weasyprint import HTML


ROOT = Path(__file__).resolve().parents[1]
CVS = (
    ("cv.html", "CV_Warre_Snaet.pdf"),
    ("cv-variants/ats/cv.html", "CV_Warre_Snaet_ATS.pdf"),
    ("cv-variants/csharp/cv.html", "cv-variants/csharp/CV_Warre_Snaet_CSharp.pdf"),
    (
        "cv-variants/telenet-genai/cv.html",
        "cv-variants/telenet-genai/CV_Warre_Snaet_Telenet_Cloud_Engineer_GenAI.pdf",
    ),
    (
        "cv-variants/mantyx/cv.html",
        "cv-variants/mantyx/CV_Warre_Snaet_Mantyx.pdf",
    ),
)
MOTIVATION_LETTERS = (
    (
        "cv-variants/mantyx/motivatiebrief.txt",
        "cv-variants/mantyx/Motivatiebrief_Warre_Snaet_Mantyx.pdf",
    ),
)


def plain_text_letter_html(source: Path) -> str:
    paragraphs = []
    for paragraph in source.read_text(encoding="utf-8").strip().split("\n\n"):
        formatted = escape(paragraph).replace("\n", "<br>")
        paragraphs.append(f"<p>{formatted}</p>")

    return f"""<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8">
    <title>Motivatiebrief Warre Snaet voor Mantyx</title>
    <style>
      @page {{ size: A4; margin: 25mm; }}
      html {{
        color: #111;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 11pt;
        line-height: 1.55;
      }}
      body {{ margin: 0; }}
      p {{ margin: 0 0 1em; }}
      p:first-child {{ margin-bottom: 1.5em; }}
    </style>
  </head>
  <body>
    {''.join(paragraphs)}
  </body>
</html>"""


def main() -> None:
    for source_name, output_name in CVS:
        source = ROOT / source_name
        output = ROOT / output_name
        HTML(filename=str(source), base_url=str(source.parent)).write_pdf(str(output))
        print(f"Wrote {output}")

    for source_name, output_name in MOTIVATION_LETTERS:
        source = ROOT / source_name
        output = ROOT / output_name
        HTML(string=plain_text_letter_html(source), base_url=str(source.parent)).write_pdf(
            str(output)
        )
        print(f"Wrote {output}")


if __name__ == "__main__":
    main()
