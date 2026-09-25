import json
from collections import defaultdict, Counter
from pathlib import Path

path=Path('/home/ubuntu/work/IC32/client/src/data/knowledgeCheckData.json')
data=json.loads(path.read_text())
questions=data['questions']
groups=defaultdict(list)
for q in questions:
    groups[(q.get('source','Unknown'), q.get('topic','General IACS cybersecurity'))].append(q)
for group in groups.values():
    group.sort(key=lambda q: (q.get('id',''), q.get('question','')))

total=Counter(); by_source=defaultdict(Counter)
# Assign each question to the currently lighter set, prioritising source balance, then total balance.
for (source, topic), group in sorted(groups.items(), key=lambda item: (-len(item[1]), item[0])):
    for q in group:
        candidates=[]
        for set_no in (1,2):
            candidates.append((by_source[source][set_no], total[set_no], set_no))
        _, _, set_no=min(candidates)
        q['questionSet']=set_no
        total[set_no]+=1; by_source[source][set_no]+=1
if abs(total[1]-total[2])>1:
    raise RuntimeError(f'unbalanced sets: {total}')
data['questionSets']={'1':total[1],'2':total[2]}
data['lastUpdated']='2026-09-25'
path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('sets',dict(total),'total',len(questions),'groups',len(groups))
for source in sorted(by_source): print(source,dict(by_source[source]))
