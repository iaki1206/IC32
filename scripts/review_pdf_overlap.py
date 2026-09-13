import json
from pathlib import Path
r=json.loads(Path('scripts/isa_pdf_merge_report.json').read_text())
pdf=json.loads(Path('/home/ubuntu/isa_iec_62443_questions.json').read_text())
cur=json.loads(Path('client/src/data/knowledgeCheckData.pre_isa_pdf_backup.json').read_text())['questions']
by={x['source_number']:x for x in pdf}
byid={x.get('id'):x for x in cur}
for x in r['near_threshold']:
    p=by[x['pdf_number']]; o=byid.get(x['matched_old_id'],{})
    print('\nPDF',x['pdf_number'],x['best_score'],x['action'])
    print('PDF:',p['question'])
    print('OLD:',o.get('question'))
