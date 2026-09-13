import json
from pathlib import Path
rows=json.loads(Path('/home/ubuntu/ic32/scripts/question_overlap_report.json').read_text())
summary={}
for threshold in (1.0,0.95,0.85,0.75,0.65): summary[str(threshold)]=sum(r['best_score']>=threshold for r in rows)
Path('/home/ubuntu/ic32/scripts/overlap_summary.json').write_text(json.dumps(summary,indent=2))
with open('/home/ubuntu/ic32/scripts/overlap_candidates.md','w') as f:
    f.write('# Overlap candidates\n\n')
    for r in sorted(rows,key=lambda x:(-x['best_score'],x['source_number'])):
        if r['best_score']<0.85:
            f.write(f"- New {r['source_number']} ({r['best_score']:.3f}): {r['question']}\n  - Existing: {r['best_question']}\n")
print(json.dumps(summary,indent=2))
