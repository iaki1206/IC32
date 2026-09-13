import json

with open('client/src/data/knowledgeCheckData.json', encoding='utf-8') as handle:
    questions = json.load(handle)['questions']
for q in questions:
    source = q.get('source', '')
    if 'IC32 PDF noteset' in source and 'Knowledge Check' in source:
        print(json.dumps({
            'id': q.get('id'),
            'number': q.get('number'),
            'chapter': q.get('chapter'),
            'source': source,
            'correctAnswer': q.get('correctAnswer'),
            'answerStatus': q.get('answerStatus'),
        }, ensure_ascii=False))
