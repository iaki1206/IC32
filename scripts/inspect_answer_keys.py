import json
from pathlib import Path
rows=json.loads(Path('/home/ubuntu/ic32/scripts/master_questions_raw.json').read_text())
for r in rows:
    if ',' in (r.get('answer') or '') or len(r.get('options',[]))<4:
        print(r['source_number'],r['answer'],len(r['options']),r['question'])
