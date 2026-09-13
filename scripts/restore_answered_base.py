import json
from pathlib import Path
backup=Path('/home/ubuntu/ic32/scripts/knowledgeCheckData.generated.backup.json')
out=Path('/home/ubuntu/ic32/scripts/knowledgeCheckData.base.json')
data=json.loads(backup.read_text())
base=[q for q in data['questions'] if not q.get('id','').startswith('kc-bank-')]
if len(base)!=224:
    raise SystemExit(f'Expected 224 original questions, found {len(base)}')
data['questions']=base
data['totalQuestions']=len(base)
data['answerableQuestions']=sum(bool(q.get('correctAnswer') or q.get('correctAnswers')) for q in base)
data['questionsWithoutSuppliedAnswerKey']=sum(not (q.get('correctAnswer') or q.get('correctAnswers')) for q in base)
out.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print({'base_questions':len(base),'answerable':data['answerableQuestions'],'without_key':data['questionsWithoutSuppliedAnswerKey']})
