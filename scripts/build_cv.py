from pathlib import Path

from weasyprint import HTML


ROOT = Path(__file__).resolve().parents[1]
CVS = (
    ("cv.html", "CV_Warre_Snaet.pdf"),
    ("cv-variants/csharp/cv.html", "cv-variants/csharp/CV_Warre_Snaet_CSharp.pdf"),
)


def main() -> None:
    for source_name, output_name in CVS:
        source = ROOT / source_name
        output = ROOT / output_name
        HTML(filename=str(source), base_url=str(source.parent)).write_pdf(str(output))
        print(f"Wrote {output}")


if __name__ == "__main__":
    main()
