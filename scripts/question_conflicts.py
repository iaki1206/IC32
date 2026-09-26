import json, re
from collections import defaultdict

def norm(s):
    s=str(s).lower().replace('’',"'")
    s=re.sub(r'\s+',' ',s)
    s=re.sub(r'[^a-z0-9 ]+','',s)
    return s.strip()

def answer(q):
    return q.get('correctAnswers') or q.get('correctAnswer')

d=json.load(open('client/src/data/knowledgeCheckData.json'))
g=defaultdict(list)
for i,q in enumerate(d['questions']): g[norm(q['question'])].append((i,q))
for key,items in g.items():
    if len(items)>1:
        print('\n=== GROUP',len(items),'===')
        for i,q in items:
            print(i,q['id'],'source=',q.get('source'),'answer=',answer(q),'type=',q.get('questionType'))
            print(' Q:',q['question'])
            print(' options:',[(o.get('letter'),o.get('text')) if isinstance(o,dict) else o for o in q['options']])
            print(' explanation:',q.get('explanation','')[:220])
