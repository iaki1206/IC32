import json
import re
from bs4 import BeautifulSoup
import pypdf

# 1. Parse Udemy Alpha Practice Exam (90 questions)
html_path = '/home/cris/Desktop/Course_ IEC 62443 Risk Assessment Specialist Practice Exams _ Udemy.html'
with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

q_panes = soup.find_all('div', class_=re.compile(r'result-pane--question-result-pane-wrapper'))

domain_to_module = {
    'Risk Assessment': 'risk',
    'Vulnerability Assessment': 'discovery',
    'Secure Architecture': 'zones',
    'Zone and Conduit Requirements': 'zones',
    'General Concepts and Definitions': 'security-levels',
    'IACS Cybersecurity Lifecycle': 'lifecycle',
    'Threat Management': 'risk',
    'Cybersecurity Documentation': 'chemical-safety',
    'Asset Management': 'discovery',
    'Network Security': 'zones',
    'Regulations and standards (ISA/IEC 62443 Framework)': 'lifecycle'
}

domain_to_anchor = {
    'Risk Assessment': 'ic33-risk',
    'Vulnerability Assessment': 'ic33-discovery',
    'Secure Architecture': 'ic33-zones',
    'Zone and Conduit Requirements': 'ic33-zones',
    'General Concepts and Definitions': 'ic33-security-levels',
    'IACS Cybersecurity Lifecycle': 'ic33-lifecycle',
    'Threat Management': 'ic33-risk',
    'Cybersecurity Documentation': 'ic33-sds',
    'Asset Management': 'ic33-discovery',
    'Network Security': 'ic33-zones',
    'Regulations and standards (ISA/IEC 62443 Framework)': 'ic33-lifecycle'
}

all_questions = []

for idx, pane in enumerate(q_panes):
    prompt_el = pane.find(id='question-prompt')
    if not prompt_el:
        continue
    prompt = prompt_el.get_text(strip=True)
    
    ans_panes = pane.find_all('div', class_=re.compile(r'result-pane--answer-result-pane'))
    options = []
    correct_indices = []
    
    for o_idx, ans_pane in enumerate(ans_panes):
        text_el = ans_pane.find(id='answer-text')
        ans_text = text_el.get_text(strip=True) if text_el else ans_pane.get_text(strip=True)
        is_correct = bool(ans_pane.find('div', class_=re.compile(r'answer-result-pane--answer-correct'))) or 'Your answer is correct' in ans_pane.text or 'Correct answer' in ans_pane.text
        options.append(ans_text)
        if is_correct:
            correct_indices.append(o_idx)
            
    exp_el = pane.find(id='overall-explanation')
    explanation = exp_el.get_text(strip=True) if exp_el else ''
    
    domain_el = pane.find('div', class_=re.compile(r'domain-pane--domain-pane'))
    domain = 'Risk Assessment'
    if domain_el:
        domain_text = domain_el.find_all('div')
        if len(domain_text) > 1:
            domain = domain_text[1].get_text(strip=True)
            
    module = domain_to_module.get(domain, 'risk')
    anchor = domain_to_anchor.get(domain, 'ic33-risk')
    
    all_questions.append({
        'id': f'ic33-udemy-alpha-{idx+1:03d}',
        'number': idx + 1,
        'module': module,
        'domain': domain,
        'source': 'Udemy Practice Test 1: Alpha',
        'prompt': prompt,
        'options': options,
        'answers': correct_indices,
        'explanation': explanation,
        'anchor': anchor,
        'questionSet': 1
    })

print(f"Loaded {len(all_questions)} questions for Set 1 from Udemy Alpha.")

output_file = '/home/cris/IC32/client/src/data/ic33QuestionsData.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump({
        'title': 'IC33 — Cybersecurity Risk Assessment Specialist Question Bank',
        'totalQuestions': len(all_questions),
        'questions': all_questions
    }, f, indent=2, ensure_ascii=False)

print(f"Saved to {output_file}")
