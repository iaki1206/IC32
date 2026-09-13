from __future__ import annotations
import json,re,unicodedata
from pathlib import Path
from difflib import SequenceMatcher

ROOT=Path('/home/ubuntu/ic32')
existing_path=ROOT/'scripts/knowledgeCheckData.base.json'
new_path=ROOT/'scripts/master_questions_raw.json'
out_path=ROOT/'client/src/data/knowledgeCheckData.json'
report_path=ROOT/'scripts/anchored_bank_report.json'

def norm(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    s=re.sub(r'[^a-z0-9]+',' ',s)
    stop={'the','a','an','of','to','in','is','are','what','which','following','does','do','for','and','on','with','how','can','should'}
    return ' '.join(w for w in s.split() if w not in stop)

def anchor_for(q):
    s=norm(q)
    rules=[
      ('FLOW','OSI, networking and industrial protocols', ['osi','modbus','profibus','tcp','udp','protocol','ethernet','layer','vpn','ip address','physical address','profibus','bacnet','opc ua','scada']),
      ('IMPROVE','Lifecycle, patch management and secure development', ['patch','firmware','maintain','maintenance','decommission','secure product','product development','third-party','bom','software component','change management','lifecycle','supplier']),
      ('WHAT','ISA/IEC 62443, CSMS, Foundational Requirements and Security Levels', ['62443','isa/iec','isa 99','foundational requirement','security level','sl-t','sl-c','sl-a','csms','standard','nis2','nist','iso 27001','isasecure','cace','cacs','security programme','security policy']),
      ('WHERE','Zones, conduits, Purdue architecture and boundary controls', ['zone','conduit','purdue','dmz','firewall','segmentation','gateway','data diode','reference model','asset model','network architecture']),
      ('SEE','Monitoring, detection and incident response', ['intrusion detection','ids','monitor','monitoring','incident','forensic','malware','attack','threat','vulnerability','cybercrime','response']),
      ('WHY','OT/ICS fundamentals, risk and people', ['risk','asset','control system','iacs','ics','scada','safety','awareness','training','human','vulnerability','consequence','supply chain','confidentiality','integrity','availability']),
    ]
    for anchor,label,terms in rules:
        if any(t in s for t in terms): return anchor,label
    return 'WHY','OT/ICS fundamentals, risk and people'

def anchor_obj(q):
    anchor,label=anchor_for(q)
    reason={
      'WHY':'Review the fundamentals and risk context before memorising the answer.',
      'WHAT':'Review the standard, requirement, security-level or governance explanation that defines this answer.',
      'WHERE':'Review the architecture, zones, conduits or boundary-control explanation that places this answer in context.',
      'FLOW':'Review the OSI, networking or industrial-protocol explanation that shows how this answer works.',
      'SEE':'Review the monitoring, detection or response explanation that explains this answer.',
      'IMPROVE':'Review the lifecycle, patching or secure-development explanation that supports this answer.',
    }[anchor]
    return {'anchor':anchor,'label':label,'reason':reason,'href':f'/?tab=ot&anchor={anchor.lower()}'}

def answer_text(options, answers):
    amap={o['letter']:o['text'] for o in options}
    return '; '.join(f'{a}: {amap.get(a, "")}' for a in answers)

existing=json.loads(existing_path.read_text())
new=json.loads(new_path.read_text())
rows=existing['questions']
# Attach anchors to existing items.
for q in rows:
    q.setdefault('explanationAnchor',anchor_obj(q['question']))
    if not q.get('explanation'):
        letters=[q.get('correctAnswer')] if q.get('correctAnswer') else []
        q['explanation']='The keyed answer is supported by the linked course section. Review the anchor before attempting the question again.'
        q['explanation'] += (' Correct option: '+answer_text(q.get('options',[]),letters)+'.') if letters else ''
# Add only genuinely new questions. 0.75 is the deduplication threshold.
added=[]; excluded=[]
for n in new:
    best=max(((SequenceMatcher(None,norm(n['question']),norm(e.get('question',''))).ratio(),e) for e in rows+added), key=lambda item: item[0])
    if best[0] >= 0.75:
        excluded.append({'source_number':n['source_number'],'score':round(best[0],3),'matched_id':best[1].get('id'),'question':n['question']})
        continue
    opts=n['options']
    ans=(n.get('answer') or '').split(',')
    ans=[x for x in ans if x]
    qid=f"kc-bank-{n['source_number']:03d}"
    q={'id':qid,'number':len(rows)+len(added)+1,'source':f"External question bank — supplied list item {n['source_number']}",'question':n['question'],'options':opts,'correctAnswer':ans[0] if len(ans)==1 else None,'correctAnswers':ans if len(ans)>1 else [ans[0]] if ans else [],'questionType':'multiple-answer' if len(ans)>1 else 'multiple-choice','explanation':n.get('source_explanation') or f"The supplied key identifies {answer_text(opts,ans)}. Use the linked course anchor to review the concept before relying on this answer.",'difficulty':'mixed','sourceType':'external_question_bank','sourceReferences':['pasted_content.txt',f"Master list item {n['source_number']}"],'answerStatus':'supplied_unvalidated','validationNote':'Third-party supplied key; verify against the official course material before an examination.','topic':'IC32 / ISA/IEC 62443','explanationAnchor':anchor_obj(n['question'])}
    added.append(q)
allq=rows+added
existing['title']='Consolidated Knowledge Checks with Explanation Anchors'
existing['description']='A deduplicated IC32 question bank. After answering, each keyed response links to the exact OT/ICS learning anchor that explains the concept. External supplied keys are labelled for verification.'
existing['language']='British English'
existing['totalQuestions']=len(allq)
existing['answerableQuestions']=sum(bool(q.get('correctAnswer') or q.get('correctAnswers')) for q in allq)
existing['questionsWithoutSuppliedAnswerKey']=sum(not (q.get('correctAnswer') or q.get('correctAnswers')) for q in allq)
existing['questions']=allq
out_path.write_text(json.dumps(existing,ensure_ascii=False,indent=2)+'\n')
report={'existing_before':len(rows),'new_source':len(new),'added':len(added),'excluded_as_redundant':len(excluded),'total_after':len(allq),'excluded':excluded}
report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:report[k] for k in ['existing_before','new_source','added','excluded_as_redundant','total_after']},indent=2))
