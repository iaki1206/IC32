import json, re, hashlib
from pathlib import Path
from collections import defaultdict, Counter

ROOT=Path(__file__).resolve().parents[1]
files=['knowledgeCheckData.json','comprehensiveQuizData.json','quizData.json']

def norm(s):
    s=str(s).lower().replace('’',"'")
    s=re.sub(r'\s+',' ',s)
    s=re.sub(r'[^a-z0-9 ]+','',s)
    return s.strip()

def walk_questions(obj, path=''):
    if isinstance(obj, dict):
        if 'question' in obj or 'prompt' in obj:
            yield obj, path
        for k,v in obj.items(): yield from walk_questions(v, f'{path}.{k}')
    elif isinstance(obj,list):
        for i,v in enumerate(obj): yield from walk_questions(v, f'{path}[{i}]')

records=[]
for fn in files:
    p=ROOT/'client/src/data'/fn
    d=json.loads(p.read_text())
    for q,path in walk_questions(d):
        text=q.get('question',q.get('prompt',''))
        opts=q.get('options',[])
        ans=q.get('answers',q.get('correctAnswers',q.get('correctAnswer')))
        records.append({'file':fn,'path':path,'id':q.get('id'),'text':text,'norm':norm(text),'options':opts,'answers':ans,'anchor':q.get('anchor'),'explanation':q.get('explanation','')})

by=defaultdict(list)
for r in records: by[r['norm']].append(r)
exact=[v for v in by.values() if len(v)>1]
print('TOTAL QUESTION OBJECTS',len(records))
print('EXACT DUPLICATE GROUPS',len(exact),'OBJECTS IN GROUPS',sum(map(len,exact)))
for group in exact[:200]:
    print('\nDUP',len(group), group[0]['norm'][:160])
    for r in group: print(' ',r['file'],r['path'],r['id'],r['answers'])

# near duplicates by token Jaccard, only long prompts
items=[r for r in records if len(r['norm'])>40]
near=[]
for i,a in enumerate(items):
    sa=set(a['norm'].split())
    for b in items[i+1:]:
        if a['norm']==b['norm']: continue
        sb=set(b['norm'].split())
        j=len(sa&sb)/max(1,len(sa|sb))
        if j>=.82: near.append((j,a,b))
print('\nNEAR DUPLICATE PAIRS',len(near))
for j,a,b in sorted(near,key=lambda x:x[0],reverse=True)[:200]: print(f'{j:.2f}\t{a["file"]}:{a["id"]}\t{b["file"]}:{b["id"]}\t{a["text"][:130]}')

# malformed answer references
print('\nANSWER VALIDITY')
for r in records:
    opts=r['options']; ans=r['answers']
    if not opts: continue
    bad=[]
    if isinstance(ans,list): bad=[x for x in ans if not isinstance(x,int) or x<0 or x>=len(opts)]
    elif isinstance(ans,int): bad=[] if 0<=ans<len(opts) else [ans]
    elif isinstance(ans,str):
        if len(ans)==1 and ans.isalpha(): bad=[] if ord(ans.lower())-97 < len(opts) else [ans]
        else: bad=[ans]
    else: bad=[ans]
    if bad: print(r['file'],r['id'],bad,'options',len(opts))

# summaries per file
print('\nBY FILE')
for fn in files:
    rr=[r for r in records if r['file']==fn]
    print(fn,len(rr),'with answers',sum(r['answers'] is not None for r in rr),'with anchors',sum(bool(r['anchor']) for r in rr))
