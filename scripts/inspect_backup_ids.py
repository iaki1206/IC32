import json
from collections import Counter
from pathlib import Path
p=Path('/home/ubuntu/ic32/scripts/knowledgeCheckData.generated.backup.json')
data=json.loads(p.read_text())
qs=data['questions']
print('total',len(qs))
print('id_prefixes',Counter((q.get('id','').split('-')[0]+'-'+q.get('id','').split('-')[1]) if '-' in q.get('id','') else q.get('id') for q in qs))
print('with_key',sum(bool(q.get('correctAnswer') or q.get('correctAnswers')) for q in qs))
print('without_key',sum(not (q.get('correctAnswer') or q.get('correctAnswers')) for q in qs))
print('first_missing')
for q in qs:
    if not (q.get('correctAnswer') or q.get('correctAnswers')):
        print(q.get('id'),q.get('number'),q.get('question','')[:120])
        if q.get('number',0)>60: break
