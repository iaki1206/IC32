from __future__ import annotations
import json,re,unicodedata
from difflib import SequenceMatcher
from pathlib import Path

def norm(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    s=re.sub(r'[^a-z0-9]+',' ',s)
    stop={'the','a','an','of','to','in','is','are','what','which','following','does','do','for','and','on','with','how','can','should'}
    return ' '.join(w for w in s.split() if w not in stop)

new=json.loads(Path('/home/ubuntu/ic32/scripts/master_questions_raw.json').read_text())
existing=json.loads(Path('/home/ubuntu/ic32/client/src/data/knowledgeCheckData.json').read_text())['questions']
rows=[]
for n in new:
    best=None
    for e in existing:
        score=SequenceMatcher(None,norm(n['question']),norm(e.get('question',''))).ratio()
        if best is None or score>best[0]: best=(score,e)
    rows.append({'source_number':n['source_number'],'question':n['question'],'best_score':round(best[0],3),'best_id':best[1].get('id'),'best_question':best[1].get('question')})
rows.sort(key=lambda x:x['best_score'],reverse=True)
Path('/home/ubuntu/ic32/scripts/question_overlap_report.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print('new',len(new),'existing',len(existing))
for threshold in [0.85,0.75,0.65]: print('>=',threshold,sum(r['best_score']>=threshold for r in rows))
print('\nTOP OVERLAPS')
for r in rows[:40]: print(f"{r['best_score']:.3f} NEW {r['source_number']}: {r['question'][:110]} | EXISTING: {r['best_question'][:110]}")
