import json
from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'client/src/data/knowledgeCheckData.json'
data = json.loads(path.read_text())

remove_ids = {
    'excel-116', 'excel-122', 'excel-142', 'excel-151', 'excel-168',
    'excel-178', 'excel-199', 'excel-202', 'excel-204', 'pasted3-214',
    'kc-bank-031',
}

corrections = {
    'pdf-isa-62443-036': {
        'correctAnswers': ['C'],
        'correctAnswer': 'C',
        'explanation': 'The important difference tested here is that IACS cybersecurity must address safety issues. IACS security also considers availability and integrity, but safety is a defining operational concern that must be included alongside cybersecurity requirements.',
    },
    'pdf-isa-62443-087': {
        'correctAnswers': ['C'],
        'correctAnswer': 'C',
        'explanation': 'The “Addressing Risk” CSMS category consists of four element groups: risk analysis and management; security policy, organisation and awareness; selected security countermeasures; and personnel security. Therefore the correct answer is 4.',
    },
    'pdf-isa-62443-210': {
        'correctAnswers': ['A'],
        'correctAnswer': 'A',
        'explanation': 'ISA/IEC 62443-4-1 provides a framework for a consistent and repeatable secure product development lifecycle. One primary goal is therefore an aligned development process; documentation supports that process but is not the best answer to this question.',
    },
}

original = data['questions']
kept = [q for q in original if q.get('id') not in remove_ids]
for q in kept:
    if q.get('id') in corrections:
        q.update(corrections[q['id']])

assert len(original) == 366, len(original)
assert len(kept) == 355, len(kept)
assert sum(q.get('id','').startswith('pdf-') for q in kept) == 227
assert not any(q.get('id') in remove_ids for q in kept)
assert all(q.get('id') in {x.get('id') for x in kept} for q in original if q.get('id','').startswith('pdf-'))

data['questions'] = kept
data['totalQuestions'] = len(kept)
data['answerableQuestions'] = sum(bool(q.get('correctAnswers') or q.get('correctAnswer')) for q in kept)
data['questionsWithoutSuppliedAnswerKey'] = sum(not bool(q.get('correctAnswers') or q.get('correctAnswer')) for q in kept)
path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
print(f'original={len(original)} kept={len(kept)} removed={len(original)-len(kept)} pdf_preserved=227')
print('corrected=' + ','.join(corrections))
