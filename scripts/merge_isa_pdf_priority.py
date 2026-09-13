from __future__ import annotations
import json, re, unicodedata
from pathlib import Path
from difflib import SequenceMatcher

ROOT=Path('/home/ubuntu/ic32')
current_path=ROOT/'client/src/data/knowledgeCheckData.json'
pdf_path=Path('/home/ubuntu/isa_iec_62443_questions.json')
out_path=current_path
report_path=ROOT/'scripts/isa_pdf_merge_report.json'


def norm(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    s=s.replace('following','following')
    s=re.sub(r'[^a-z0-9]+',' ',s)
    stop={'the','a','an','of','to','in','is','are','what','which','following','does','do','for','and','on','with','how','can','should','select','all','that','apply'}
    return ' '.join(w for w in s.split() if w not in stop)

def sim(a,b):
    na,nb=norm(a),norm(b)
    if not na or not nb: return 0.0
    seq=SequenceMatcher(None,na,nb).ratio()
    sa,sb=set(na.split()),set(nb.split())
    jac=len(sa&sb)/max(1,len(sa|sb))
    return max(seq,jac)

def anchor_for(q):
    s=norm(q)
    rules=[
      ('FLOW','OSI, networking and industrial protocols',['osi','modbus','profibus','tcp','udp','protocol','ethernet','layer','vpn','ip address','physical address','bacnet','opc ua','scada']),
      ('IMPROVE','Lifecycle, patch management and secure development',['patch','firmware','maintain','maintenance','decommission','secure product','product development','third party','bom','software component','change management','lifecycle','supplier']),
      ('WHAT','ISA/IEC 62443, CSMS, Foundational Requirements and Security Levels',['62443','isa/iec','isa 99','foundational requirement','security level','sl t','sl c','sl a','csms','standard','nis2','nist','iso 27001','isasecure','cace','cacs','security programme','security policy','firewall']),
      ('WHERE','Zones, conduits, Purdue architecture and boundary controls',['zone','conduit','purdue','dmz','firewall','segmentation','gateway','data diode','reference model','asset model','network architecture']),
      ('SEE','Monitoring, detection and incident response',['intrusion detection','ids','monitor','monitoring','incident','forensic','malware','attack','threat','vulnerability','cybercrime','response']),
      ('WHY','OT/ICS fundamentals, risk and people',['risk','asset','control system','iacs','ics','scada','safety','awareness','training','human','vulnerability','consequence','supply chain','confidentiality','integrity','availability']),
    ]
    for anchor,label,terms in rules:
        if any(t in s for t in terms):
            return {'anchor':anchor,'label':label,'reason':{'WHY':'Review the fundamentals and risk context before memorising the answer.','WHAT':'Review the standard, requirement, security-level or governance explanation that defines this answer.','WHERE':'Review the architecture, zones, conduits or boundary-control explanation that places this answer in context.','FLOW':'Review the OSI, networking or industrial-protocol explanation that shows how this answer works.','SEE':'Review the monitoring, detection or response explanation that explains this answer.','IMPROVE':'Review the lifecycle, patching or secure-development explanation that supports this answer.'}[anchor],'href':f'/?tab=ot&anchor={anchor.lower()}'}
    return {'anchor':'WHY','label':'OT/ICS fundamentals, risk and people','reason':'Review the fundamentals and risk context before memorising the answer.','href':'/?tab=ot&anchor=why'}

def option_text(options, letters):
    amap={o.get('letter'):o.get('text','') for o in options}
    return '; '.join(f'{x}: {amap.get(x, "")}' for x in letters)

current=json.loads(current_path.read_text())
old=current.get('questions',[])
pdf=json.loads(pdf_path.read_text())
# For every PDF item, find likely prior duplicates. PDF wins and old duplicate is removed.
matched_old=set(); added_pdf=[]; candidates=[]
for idx,p in enumerate(pdf,1):
    scores=sorted(((sim(p['question'],o.get('question','')),j,o) for j,o in enumerate(old)), reverse=True, key=lambda x:x[0])
    best=scores[0] if scores else (0,-1,{})
    # Treat clear semantic reformulations as duplicates even when wording differs.
    semantic_duplicate = ('patch' in norm(p['question']) and 'patch' in norm(best[2].get('question','')) and 'iacs' in norm(p['question']) and 'iacs' in norm(best[2].get('question','')))
    if best[0] >= 0.78 or semantic_duplicate:
        matched_old.add(best[1])
    else:
        # Even below threshold, exact normalised substring is redundant.
        pn=norm(p['question'])
        exact=[(j,o) for j,o in enumerate(old) if pn and (pn in norm(o.get('question','')) or norm(o.get('question','')) in pn)]
        if exact:
            best=(0.99,exact[0][0],exact[0][1]); matched_old.add(best[1])
        else:
            added_pdf.append(p)
    candidates.append({'pdf_number':p['source_number'],'best_score':round(best[0],4),'matched_old_id':best[2].get('id') if best[2] else None,'matched_old_question':best[2].get('question') if best[2] else None,'action':'replace_existing' if best[1] in matched_old else 'add_pdf'})
# Retain current questions not superseded by a PDF duplicate.
retained=[q for j,q in enumerate(old) if j not in matched_old]
# Construct PDF questions exactly from parsed source text; only metadata is added.
# Convert every PDF item into an app record. The PDF is authoritative and none of its 227 questions is removed.
pdf_raw_to_add=list(pdf)
pdf_questions=[]
for p in pdf_raw_to_add:
    ans=p.get('answer',[])
    q={'id':f"pdf-isa-62443-{p['source_number']:03d}",'number':0,'source':f"ISA/IEC 62443 PDF — Question {p['source_number']}",'question':p['question'],'options':p['options'],'correctAnswer':ans[0] if len(ans)==1 else None,'correctAnswers':ans if len(ans)>1 else ([ans[0]] if ans else []),'questionType':'multiple-answer' if len(ans)>1 else 'multiple-choice','explanation':p.get('source_explanation',''),'difficulty':'mixed','sourceType':'isa_iec_62443_pdf','sourceReferences':['ISA-ISA-IEC-62443.pdf',f"PDF Question {p['source_number']}",p.get('category','')],'answerStatus':'pdf_supplied','validationNote':'Text, options, key and explanation preserved from the supplied PDF; no wording normalisation applied.','topic':p.get('category','ISA/IEC 62443'),'explanationAnchor':anchor_for(p['question'])}
    pdf_questions.append(q)
allq=retained+pdf_questions
for i,q in enumerate(allq,1): q['number']=i; q.setdefault('explanationAnchor',anchor_for(q.get('question','')))
current['title']='Consolidated Knowledge Checks with Explanation Anchors — ISA/IEC 62443 PDF Priority'
current['description']='A deduplicated IC32 question bank. Where the supplied ISA/IEC 62443 PDF overlaps earlier questions, the PDF version is retained without wording distortion. After answering, each keyed response links to the relevant OT/ICS learning anchor.'
current['totalQuestions']=len(allq)
current['answerableQuestions']=sum(bool(q.get('correctAnswer') or q.get('correctAnswers')) for q in allq)
current['questionsWithoutSuppliedAnswerKey']=sum(not (q.get('correctAnswer') or q.get('correctAnswers')) for q in allq)
current['questions']=allq
out_path.write_text(json.dumps(current,ensure_ascii=False,indent=2)+'\n')
report={'existing_before':len(old),'pdf_questions':len(pdf),'old_replaced_by_pdf':len(matched_old),'pdf_questions_preserved':len(pdf_questions),'old_questions_retained_nonredundant':len(retained),'total_after':len(allq),'near_threshold':sorted([x for x in candidates if 0.68<=x['best_score']<0.78],key=lambda x:x['best_score'],reverse=True)[:100]}
report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:report[k] for k in ['existing_before','pdf_questions','old_replaced_by_pdf','pdf_questions_preserved','old_questions_retained_nonredundant','total_after']},indent=2))
