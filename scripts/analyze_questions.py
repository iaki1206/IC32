import json
from collections import Counter

with open('client/src/data/knowledgeCheckData.json', encoding='utf-8') as handle:
    data = json.load(handle)
questions = data['questions']
print('total', len(questions))
print('with_key', sum(bool(q.get('correctAnswer')) for q in questions))
print('without_key', sum(not q.get('correctAnswer') for q in questions))
print('sources')
for source, count in Counter(q.get('source', '') for q in questions).most_common():
    with_key = sum(bool(q.get('correctAnswer')) for q in questions if q.get('source', '') == source)
    print(f'{source}\t{count}\twith_key={with_key}')
print('chapters')
for chapter, count in Counter(str(q.get('chapter', '')) for q in questions).most_common():
    with_key = sum(bool(q.get('correctAnswer')) for q in questions if str(q.get('chapter', '')) == chapter)
    print(f'{chapter}\t{count}\twith_key={with_key}')
