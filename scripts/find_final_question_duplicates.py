import json, unicodedata, re
from difflib import SequenceMatcher
from pathlib import Path

def norm(s):
 s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower(); s=re.sub(r'[^a-z0-9]+',' ',s)
 stop={'the','a','an','of','to','in','is','are','what','which','following','does','do','for','and','on','with','how','can','should','select','all','that','apply','the'}
 return ' '.join(x for x in s.split() if x not in stop)
qs=json.loads(Path('client/src/data/knowledgeCheckData.json').read_text())['questions']
pairs=[]
for i in range(len(qs)):
 for j in range(i+1,len(qs)):
  a,b=qs[i],qs[j]; na,nb=norm(a['question']),norm(b['question'])
  score=SequenceMatcher(None,na,nb).ratio()
  if score>=.62 and a.get('sourceType')!=b.get('sourceType'):
   pairs.append((score,i,j))
for score,i,j in sorted(pairs,reverse=True)[:100]:
 a,b=qs[i],qs[j]
 print(f'{score:.3f}\t{a.get("sourceType")}\t{b.get("sourceType")}\n  A {a["question"]}\n  B {b["question"]}\n')
print('pairs',len(pairs))
