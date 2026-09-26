import json
from collections import Counter
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "client/src/data/knowledgeCheckData.json"
data = json.loads(path.read_text(encoding="utf-8"))
questions = data["questions"]

# The original ISA/IEC PDF supplied 227 questions. After the global duplicate audit,
# 206 unique PDF questions remain; all of those must stay together in Set 1.
pdf_questions = [
    q for q in questions
    if q.get("source", "").startswith("ISA/IEC 62443 PDF — Question")
]
other_questions = [q for q in questions if q not in pdf_questions]
target_set_one = (len(questions) + 1) // 2
needed_from_other_sources = target_set_one - len(pdf_questions)
if needed_from_other_sources < 0:
    raise RuntimeError("The unique PDF questions exceed the balanced Set 1 target")

# Prefer questions that were previously in Set 2, then use a stable source/id order.
# This adds the requested material from the former Set 2 without duplicates.
set_one_fill = sorted(
    other_questions,
    key=lambda q: (
        0 if q.get("questionSet") == 2 else 1,
        q.get("source", ""),
        q.get("id", ""),
    ),
)[:needed_from_other_sources]
set_one_ids = {q["id"] for q in pdf_questions + set_one_fill}

for q in questions:
    q["questionSet"] = 1 if q["id"] in set_one_ids else 2

counts = Counter(q["questionSet"] for q in questions)
if counts[1] != target_set_one or counts[2] != len(questions) - target_set_one:
    raise RuntimeError(f"unexpected set counts: {counts}")
if any(q.get("questionSet") != 1 for q in pdf_questions):
    raise RuntimeError("A unique ISA/IEC PDF question was not assigned to Set 1")

data["questionSets"] = {"1": counts[1], "2": counts[2]}
data["lastUpdated"] = "2026-09-26"
path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"unique PDF questions in Set 1: {len(pdf_questions)}")
print(f"additional questions moved from former Set 2/other sources: {needed_from_other_sources}")
print(f"sets: Set 1={counts[1]}, Set 2={counts[2]}")
print("PDF questions assigned to Set 2:", sum(q.get("questionSet") == 2 for q in pdf_questions))
