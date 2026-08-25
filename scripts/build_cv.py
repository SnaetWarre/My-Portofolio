from html import escape
import json
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
JOB_APPLICATIONS = (
    ("sopra-steria", "CV_Warre_Snaet_Sopra_Steria.pdf", "Motivatiebrief_Warre_Snaet_Sopra_Steria.pdf"),
    ("faktion", "CV_Warre_Snaet_Faktion.pdf", "Motivatiebrief_Warre_Snaet_Faktion.pdf"),
    ("remecare", "CV_Warre_Snaet_Remecare.pdf", "Motivatiebrief_Warre_Snaet_Remecare.pdf"),
    ("biztory", "CV_Warre_Snaet_Biztory.pdf", "Motivatiebrief_Warre_Snaet_Biztory.pdf"),
    ("build-more", "CV_Warre_Snaet_Build_More.pdf", "Motivatiebrief_Warre_Snaet_Build_More.pdf"),
    ("accenture", "CV_Warre_Snaet_Accenture.pdf", "Motivatiebrief_Warre_Snaet_Accenture.pdf"),
    (
        "accenture-infrastructure-ai",
        "CV_Warre_Snaet_Accenture_Infrastructure_AI.pdf",
        "Motivatiebrief_Warre_Snaet_Accenture_Infrastructure_AI.pdf",
    ),
    ("bdo", "CV_Warre_Snaet_BDO.pdf", "Motivatiebrief_Warre_Snaet_BDO.pdf"),
    ("dotocean", "CV_Warre_Snaet_DotOcean.pdf", "Cover_Letter_Warre_Snaet_DotOcean.pdf"),
    ("ml6", "CV_Warre_Snaet_ML6.pdf", "Cover_Letter_Warre_Snaet_ML6.pdf"),
)
CV_ONLY_APPLICATIONS = (
    ("pwc", "CV_Warre_Snaet_PwC.pdf"),
)


def plain_text_letter_html(
    source: Path,
    title: str = "Motivatiebrief Warre Snaet",
    language: str = "nl",
) -> str:
    paragraphs = []
    for paragraph in source.read_text(encoding="utf-8").strip().split("\n\n"):
        formatted = escape(paragraph).replace("\n", "<br>")
        paragraphs.append(f"<p>{formatted}</p>")

    return f"""<!doctype html>
<html lang="{escape(language)}">
  <head>
    <meta charset="UTF-8">
    <title>{escape(title)}</title>
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


def job_cv_html(data: dict, pdf_name: str) -> str:
    cv_language = data.get("cv_language", "en")
    if cv_language == "nl":
        labels = {
            "document_title": "CV voor",
            "description": "CV van Warre Snaet voor de functie",
            "download": "Download pdf",
            "profile": "Profiel",
            "experience": "Technische ervaring",
            "internship_title": "AI- en software-engineering stagiair",
            "internship_organisation": "2Ai IPCA · Barcelos, Portugal",
            "internship_date": "feb–jun 2026",
            "apolloon_title": "Software engineer · Betaald klantproject",
            "apolloon_organisation": "Apolloon 24-uursloopsysteem · België",
            "projects": "Geselecteerde projecten",
            "education": "Opleiding",
            "degree": "Professionele bachelor Multimedia & Creative Technologies",
            "track": "Traject AI Engineering · Howest",
            "education_date": "sep 2023–jun 2026",
            "distinction": "Met onderscheiding afgestudeerd",
            "skills": "Vaardigheden",
            "languages": "Talen",
            "language_list": "Nederlands (moedertaal) · Engels (C1) · Frans (B1–B2)",
            "additional": "Rijbewijs B · Horecawerk sinds 2021",
        }
    else:
        labels = {
            "document_title": "CV for",
            "description": "CV of Warre Snaet for the",
            "download": "Download PDF",
            "profile": "Profile",
            "experience": "Technical experience",
            "internship_title": "AI & Software Engineering Intern",
            "internship_organisation": "2Ai IPCA · Barcelos, Portugal",
            "internship_date": "Feb–Jun 2026",
            "apolloon_title": "Software Engineer · Paid Client Project",
            "apolloon_organisation": "Apolloon 24-Hour Run System · Belgium",
            "projects": "Selected projects",
            "education": "Education",
            "degree": "Professional Bachelor in Multimedia & Creative Technologies",
            "track": "AI Engineering track · Howest",
            "education_date": "Sep 2023–Jun 2026",
            "distinction": "Graduated with distinction",
            "skills": "Skills",
            "languages": "Languages",
            "language_list": "Dutch (native) · English (C1) · French (B1–B2)",
            "additional": "Driving licence B · Hospitality work since 2021",
        }

    internship_items = "".join(
        f"<li>{escape(item)}</li>" for item in data["internship_bullets"]
    )
    apolloon_items = "".join(
        f"<li>{escape(item)}</li>" for item in data["apolloon_bullets"]
    )
    projects = "".join(
        f"""
            <article class="compact-entry">
              <h3><a href="{escape(project["url"], quote=True)}">{escape(project["title"])}</a></h3>
              <p>{escape(project["description"])}</p>
            </article>"""
        for project in data["projects"]
    )
    skills = "".join(
        f"""
            <div class="skill-group">
              <h3>{escape(group["title"])}</h3>
              <p>{escape(group["text"])}</p>
            </div>"""
        for group in data["skills"]
    )

    return f"""<!doctype html>
<html lang="{escape(cv_language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Warre Snaet | {labels["document_title"]} {escape(data["company"])}</title>
    <meta name="description" content="{labels["description"]} {escape(data["target_role"], quote=True)}." />
    <meta name="author" content="Warre Snaet" />
    <meta name="robots" content="noindex, follow" />
    <link rel="stylesheet" href="../../cv.css" />
    <link rel="icon" type="image/svg+xml" href="../../public/favicon.svg" />
  </head>
  <body>
    <div class="screen-toolbar" aria-label="CV actions">
      <a href="https://snaetwarre.github.io/My-Portofolio/">← Portfolio</a>
      <a href="{escape(pdf_name, quote=True)}" download>{labels["download"]}</a>
    </div>

    <main class="resume" id="resume">
      <header class="resume-header">
        <div>
          <h1>Warre Snaet</h1>
          <p class="role">{escape(data["headline"])}</p>
        </div>
        <address class="contact-list">
          <span>Vilvoorde, Belgium</span>
          <a href="tel:+32474829493">+32 474 82 94 93</a>
          <a href="mailto:warresnaet@icloud.com">warresnaet@icloud.com</a>
          <a href="https://snaetwarre.github.io/My-Portofolio/">snaetwarre.github.io/My-Portofolio</a>
          <a href="https://github.com/SnaetWarre">github.com/SnaetWarre</a>
          <a href="https://www.linkedin.com/in/warre-snaet-272354370/">linkedin.com/in/warre-snaet-272354370</a>
        </address>
      </header>

      <section class="summary" aria-labelledby="profile-heading">
        <h2 id="profile-heading">{labels["profile"]}</h2>
        <p>{escape(data["summary"])}</p>
      </section>

      <div class="resume-grid">
        <div class="main-column">
          <section aria-labelledby="experience-heading">
            <h2 id="experience-heading">{labels["experience"]}</h2>

            <article class="entry">
              <div class="entry-heading">
                <div>
                  <h3>{labels["internship_title"]}</h3>
                  <p class="organisation">{labels["internship_organisation"]}</p>
                </div>
                <p class="date">{labels["internship_date"]}</p>
              </div>
              <ul>{internship_items}</ul>
            </article>

            <article class="entry">
              <div class="entry-heading">
                <div>
                  <h3>{labels["apolloon_title"]}</h3>
                  <p class="organisation">{labels["apolloon_organisation"]}</p>
                </div>
                <p class="date">2026</p>
              </div>
              <ul>{apolloon_items}</ul>
            </article>
          </section>

          <section aria-labelledby="projects-heading">
            <h2 id="projects-heading">{labels["projects"]}</h2>
            {projects.lstrip()}
          </section>
        </div>

        <aside class="side-column" aria-label="Education and skills">
          <section aria-labelledby="education-heading">
            <h2 id="education-heading">{labels["education"]}</h2>
            <h3>{labels["degree"]}</h3>
            <p class="organisation">{labels["track"]}</p>
            <p class="date side-date">{labels["education_date"]}</p>
            <p><strong>{labels["distinction"]}</strong></p>
            <p class="small">{escape(data["education_note"])}</p>
          </section>

          <section aria-labelledby="skills-heading">
            <h2 id="skills-heading">{labels["skills"]}</h2>
            {skills.lstrip()}
          </section>

          <section aria-labelledby="languages-heading">
            <h2 id="languages-heading">{labels["languages"]}</h2>
            <p>{escape(data.get("languages", labels["language_list"]))}</p>
            <p class="small">{escape(data.get("additional", labels["additional"]))}</p>
          </section>
        </aside>
      </div>
    </main>
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
        HTML(
            string=plain_text_letter_html(
                source,
                title="Motivatiebrief Warre Snaet voor Mantyx",
            ),
            base_url=str(source.parent),
        ).write_pdf(str(output))
        print(f"Wrote {output}")

    for slug, cv_pdf_name, letter_pdf_name in JOB_APPLICATIONS:
        folder = ROOT / "cv-variants" / slug
        data = json.loads((folder / "cv-data.json").read_text(encoding="utf-8"))

        cv_html = job_cv_html(data, cv_pdf_name)
        cv_html_path = folder / "cv.html"
        cv_html_path.write_text(cv_html, encoding="utf-8")
        cv_output = folder / cv_pdf_name
        HTML(string=cv_html, base_url=str(folder)).write_pdf(str(cv_output))
        print(f"Wrote {cv_html_path}")
        print(f"Wrote {cv_output}")

        letter_source = folder / "motivatiebrief.txt"
        letter_output = folder / letter_pdf_name
        HTML(
            string=plain_text_letter_html(
                letter_source,
                title=(
                    f"Cover Letter by Warre Snaet for {data['company']}"
                    if data["letter_language"] == "en"
                    else f"Motivatiebrief Warre Snaet voor {data['company']}"
                ),
                language=data["letter_language"],
            ),
            base_url=str(folder),
        ).write_pdf(str(letter_output))
        print(f"Wrote {letter_output}")

    for slug, cv_pdf_name in CV_ONLY_APPLICATIONS:
        folder = ROOT / "cv-variants" / slug
        data = json.loads((folder / "cv-data.json").read_text(encoding="utf-8"))

        cv_html = job_cv_html(data, cv_pdf_name)
        cv_html_path = folder / "cv.html"
        cv_html_path.write_text(cv_html, encoding="utf-8")
        cv_output = folder / cv_pdf_name
        HTML(string=cv_html, base_url=str(folder)).write_pdf(str(cv_output))
        print(f"Wrote {cv_html_path}")
        print(f"Wrote {cv_output}")


if __name__ == "__main__":
    main()
