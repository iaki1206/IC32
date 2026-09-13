import json
from pathlib import Path
final=json.loads(Path('client/src/data/knowledgeCheckData.json').read_text())['questions']
pdf=json.loads(Path('/home/ubuntu/isa_iec_62443_questions.json').read_text())
source={x['source_number']:x for x in pdf}
issues=[]; checked=0
for q in final:
 if q.get('sourceType')!='isa_iec_62443_pdf': continue
 checked+=1
 n=int(q['source'].rsplit(' ',1)[-1])
 p=source[n]
 if q['question']!=p['question']: issues.append((n,'question'))
 if q['options']!=p['options']: issues.append((n,'options'))
 if q.get('correctAnswers',[])!=p['answer']: issues.append((n,'answer'))
 if q.get('explanation','')!=p.get('source_explanation',''): issues.append((n,'explanation'))
print(json.dumps({'pdf_entries_checked':checked,'fidelity_issues':issues,'issue_count':len(issues)},ensure_ascii=False,indent=2))
raise SystemExit(1 if issues else 0)
