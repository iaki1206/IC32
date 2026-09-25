import json
from pathlib import Path

BANK = Path(__file__).resolve().parents[1] / "client/src/data/knowledgeCheckData.json"

# These are deliberately limited to confirmed spelling/encoding defects. The supplied
# ISA/IEC 62443 PDF questions are left byte-for-byte untouched.
REPLACEMENTS = {
    "Manaqement": "Management",
    "Shot form": "Short form",
    "authentification": "authentication",
    "1â€“4": "1–4",
    "Leve l (SL-T)": "Level (SL-T)",
    "Leve (SL-T)": "Level (SL-T)",
    "MAIN goal": "main goal",
    "The  Industrial": "The Industrial",
    "\u00a0": " ",
}


def clean(value: str) -> str:
    for old, new in REPLACEMENTS.items():
        value = value.replace(old, new)
    return value


data = json.loads(BANK.read_text(encoding="utf-8"))
changed = []
for question in data["questions"]:
    if question.get("source", "").startswith("ISA/IEC 62443 PDF"):
        continue
    fields = ["question", "explanation"]
    for field in fields:
        if isinstance(question.get(field), str):
            before = question[field]
            question[field] = clean(before)
            if before != question[field]: changed.append((question["id"], field))
    for option in question.get("options", []):
        if isinstance(option, dict) and isinstance(option.get("text"), str):
            before = option["text"]
            option["text"] = clean(before)
            if before != option["text"]: changed.append((question["id"], "option"))

BANK.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Changed {len(changed)} non-PDF text fields across {len(set(q for q, _ in changed))} questions.")
print("PDF questions modified: 0")
