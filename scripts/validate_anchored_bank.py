import json,re
from pathlib import Path
p=Path('/home/ubuntu/ic32/client/src/data/knowledgeCheckData.json')
data=json.loads(p.read_text())
issues=[]
anchors={}
for q in data['questions']:
    normalised=[]
    for index,o in enumerate(q.get('options',[])):
        normalised.append({'letter': chr(65+index), 'text': o} if isinstance(o,str) else o)
    letters=[o.get('letter') for o in normalised]
    if len(letters)!=len(set(letters)): issues.append((q['id'],'duplicate option letters',letters))
    if any(re.search(r'\b(?:Answer|RASPUNS|Explanation):',o.get('text',''),re.I) for o in normalised): issues.append((q['id'],'contaminated option text',''))
    expected=q.get('correctAnswers') or ([q.get('correctAnswer')] if q.get('correctAnswer') else [])
    if not expected: issues.append((q['id'],'missing answer key',''))
    if q.get('explanationAnchor',{}).get('anchor') not in {'WHY','WHAT','WHERE','FLOW','SEE','IMPROVE'}: issues.append((q['id'],'invalid anchor',''))
    anchors[q.get('explanationAnchor',{}).get('anchor')]=anchors.get(q.get('explanationAnchor',{}).get('anchor'),0)+1
print(json.dumps({'total':len(data['questions']),'answerable':data['answerableQuestions'],'issues':len(issues),'anchor_distribution':anchors},indent=2))
for issue in issues[:30]: print('ISSUE',issue)
raise SystemExit(1 if issues else 0)
