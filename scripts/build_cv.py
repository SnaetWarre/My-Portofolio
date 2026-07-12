from pathlib import Path

from weasyprint import HTML


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "cv.html"
OUTPUT = ROOT / "CV_Warre_Snaet.pdf"


def main() -> None:
    HTML(filename=str(SOURCE), base_url=str(ROOT)).write_pdf(str(OUTPUT))
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
