import json
import re
from pathlib import Path

path = Path('client/src/data/knowledgeCheckData.json')
with path.open(encoding='utf-8') as handle:
    data = json.load(handle)

answer_key = {
    1: ['A', 'C', 'B', 'A', 'C'],
    2: ['D', 'B', 'D', 'C', 'A'],
    3: ['C', 'D', 'B', 'A', 'C'],
    4: ['C', 'D', 'B', 'A', 'A'],
    5: ['B', 'C', 'A', 'D', 'C'],
    6: ['B', 'D', 'D', 'A', 'C'],
    7: ['A', 'B', 'B', 'A', 'D', 'C'],
    8: ['C', 'B', 'A', 'C', 'A', 'D'],
    9: ['D', 'B', 'C', 'B', 'D'],
    10: ['D', 'C', 'D', 'A'],
    11: ['C', 'A', 'C', 'A', 'B'],
    12: ['B', 'D', 'C', 'C', 'D'],
    13: ['D', 'A', 'C', 'D', 'A'],
    14: ['C', 'D', 'A', 'B', 'D'],
    15: ['C', 'D', 'B', 'A', 'B'],
}

updated = []
for question in data['questions']:
    source = str(question.get('source') or '')
    chapter = str(question.get('chapter') or '')
    if 'IC32 PDF noteset' not in source or 'Knowledge Check' not in source:
        continue
    section_match = re.search(r'Section\s+(\d+)', chapter)
    check_match = re.search(r'Knowledge Check\s+(\d+)', source)
    if not section_match or not check_match:
        continue
    section = int(section_match.group(1))
    check = int(check_match.group(1))
    if section not in answer_key or check > len(answer_key[section]):
        continue
    answer = answer_key[section][check - 1]
    if question.get('correctAnswer') != answer:
        question['correctAnswer'] = answer
        question['answerStatus'] = 'official_answer_key_ic32_v6.0.1'
        question['explanation'] = (
            f"Official IC32 v6.0.1 answer key: Section {section}, "
            f"Knowledge Check {check} — option {answer}."
        )
        updated.append((question.get('id'), section, check, answer))

with path.open('w', encoding='utf-8') as handle:
    json.dump(data, handle, ensure_ascii=False, indent=2)
    handle.write('\n')

print(f'updated={len(updated)}')
for item in updated:
    print(item)
