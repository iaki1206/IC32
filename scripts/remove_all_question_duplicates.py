import json
import re
from collections import defaultdict
from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'client/src/data/knowledgeCheckData.json'
data = json.loads(path.read_text())

def normalise(question: str) -> str:
    question = str(question).lower().replace('’', "'")
    question = re.sub(r'\s+', ' ', question)
    question = re.sub(r'[^a-z0-9 ]+', '', question)
    return question.strip()

seen = set()
kept = []
removed = []
for question in data['questions']:
    key = normalise(question.get('question', ''))
    if key in seen:
        removed.append(question['id'])
        continue
    seen.add(key)
    kept.append(question)

assert len(removed) == 21, len(removed)
assert len(kept) == 334, len(kept)
assert sum(q.get('id', '').startswith('pdf-') for q in kept) == 206
assert len({normalise(q.get('question', '')) for q in kept}) == len(kept)

data['questions'] = kept
data['totalQuestions'] = len(kept)
data['answerableQuestions'] = sum(bool(q.get('correctAnswers') or q.get('correctAnswer')) for q in kept)
data['questionsWithoutSuppliedAnswerKey'] = sum(not bool(q.get('correctAnswers') or q.get('correctAnswer')) for q in kept)
path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
print(f'removed={len(removed)} kept={len(kept)} pdf_remaining={sum(q.get("id", "").startswith("pdf-") for q in kept)}')
print('removed_ids=' + ','.join(removed))
