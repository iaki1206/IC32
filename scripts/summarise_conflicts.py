import json,re
from collections import defaultdict
def norm(s): return re.sub(r'[^a-z0-9 ]+','',re.sub(r'\s+',' ',s.lower())).strip()
def ans(q): return q.get('correctAnswers') or q.get('correctAnswer')
d=json.load(open('client/src/data/knowledgeCheckData.json')); g=defaultdict(list)
for i,q in enumerate(d['questions']):g[norm(q['question'])].append((i,q))
for k,items in g.items():
 if len(items)>1:
  vals={str(ans(q)) for _,q in items}
  if len(vals)>1:
   print('\nQ:',k)
   for i,q in items: print(i,q['id'],'source=',q.get('sourceType'), 'ans=',ans(q),'exp=',q.get('explanation','')[:100])
print('\nSAFE REMOVALS')
for k,items in g.items():
 if len(items)>1:
  pdf=[(i,q) for i,q in items if q['id'].startswith('pdf-')]
  if pdf:
   for i,q in items:
    if not q['id'].startswith('pdf-'): print(q['id'],'duplicateOf',pdf[0][1]['id'])
  else:
   for i,q in items[1:]: print(q['id'],'duplicateOf',items[0][1]['id'])
