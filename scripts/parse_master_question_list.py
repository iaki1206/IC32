from __future__ import annotations
import json, re
from pathlib import Path

src = Path('/home/ubuntu/upload/pasted_content.txt')
out = Path('/home/ubuntu/ic32/scripts/master_questions_raw.json')
text = src.read_text(encoding='utf-8')
parts = re.split(r'(?m)^INTREBAREA\s+(\d+)\s*$', text)
records=[]
for i in range(1, len(parts), 2):
    number=int(parts[i]); body=parts[i+1]
    body=re.split(r'(?m)^VANZATOR:', body)[0]
    answer_match=re.search(r'\b(?:RASPUNS|Answer)\s*:\s*([A-H](?:\s*,\s*[A-H])*)', body, re.I)
    answer=answer_match.group(1).replace(' ','').upper() if answer_match else None
    option_body=re.split(r'\b(?:RASPUNS|Answer)\s*:', body, maxsplit=1, flags=re.I)[0]
    option_matches=list(re.finditer(r'(?m)(?:^|\s)[•·]?\s*([A-H])\.\s+(.+?)(?=\s+[A-H]\.\s+|\n\s*[A-H]\.\s+|$)', option_body, re.S))
    options=[]; seen=set()
    for m in option_matches:
        letter=m.group(1).upper()
        val=re.sub(r'\s+',' ',m.group(2)).strip(' \t\r\n•')
        if letter in seen or not val: continue
        seen.add(letter); options.append({'letter':letter,'text':val})
    first_option=min([m.start() for m in option_matches], default=len(option_body))
    question=re.sub(r'\s+',' ',option_body[:first_option]).strip(' \t\r\n•')
    expl=None
    em=re.search(r'\bExplanation:\s*(.*?)(?=\n\s*INTREBAREA\s+\d+|\n\s*VANZATOR:|\Z)', body, re.S|re.I)
    if em:
        expl=re.sub(r'\s+',' ',em.group(1)).strip(' \t\r\n•')
        expl=re.split(r'\s+RASPUNS\s*:', expl, maxsplit=1, flags=re.I)[0].strip()
    records.append({'source_number':number,'question':question,'options':options,'answer':answer,'source_explanation':expl,'raw':body.strip()})
out.write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'records':len(records),'with_answer':sum(bool(r['answer']) for r in records),'without_answer':sum(not r['answer'] for r in records),'total_options':sum(len(r['options']) for r in records)},indent=2))
for r in records:
    if not r['answer'] or len(r['options'])<2 or len(r['question'])<20:
        print('SUSPICIOUS', r['source_number'], r['answer'], len(r['options']), r['question'][:160])
print(out)
