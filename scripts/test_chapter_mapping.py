import json
import re
from collections import Counter, defaultdict

with open('/home/cris/IC32/client/src/data/knowledgeCheckData.json') as f:
    raw = json.load(f)

questions = raw['questions']

SECTIONS = {
    1: 'Section 1 — Introduction to Control Systems Security',
    2: 'Section 2 — Awareness & Training',
    3: 'Section 3 — ISA/IEC 62443 Series',
    4: 'Section 4 — ISA/IEC 62443 Models & Security Levels',
    5: 'Section 5 — Introduction to IACS Lifecycle',
    6: 'Section 6 — Security Requirements for IACS Asset Owners',
    7: 'Section 7 — Evolving Security Standards, Practices & Regulations',
    8: 'Section 8 — Network Security Basics',
    9: 'Section 9 — Industrial Protocols',
    10: 'Section 10 — Introduction to Patch Management',
    11: 'Section 11 — Introduction to Security Risk Assessment for System Design',
    12: 'Section 12 — Security Programme Requirements for IACS Service Providers',
    13: 'Section 13 — Developing Secure Products & Systems',
    14: 'Section 14 — Security Profiles for ISA 62443',
    15: 'Section 15 — IACS Security Profile Scheme'
}

def determine_section(q):
    # If already set to Section 1-15, keep it
    ch = str(q.get('chapter', '') or '')
    m = re.match(r'Section\s+(\d+)', ch)
    if m:
        sec_num = int(m.group(1))
        if sec_num in SECTIONS:
            return sec_num
    
    # Check text, topic, explanation, options
    topic = q.get('topic') or ''
    text = (q.get('question', '') + ' ' + q.get('explanation', '')).lower()
    q_lower = q.get('question', '').lower()
    topic_lower = topic.lower()
    
    # 1. Direct topic match
    if 'industrial protocols' in topic_lower or 'modbus' in text or 'profinet' in text or 'opc ua' in text or 'dnp3' in text or 'bacnet' in text or 'ethernet/ip' in text:
        return 9
    
    if 'patch management' in topic_lower or '62443-2-3' in text or 'patching' in text or 'iut' in text or 'compatibility test' in text:
        return 10
        
    if 'service provider' in text or '62443-2-4' in text or 'integration service' in text or 'maintenance service provider' in text:
        return 12
        
    if 'secure product' in text or '62443-4-1' in text or '62443-4-2' in text or 'sdlc' in text or 'component security' in text or 'embedded device' in text:
        return 13
        
    if 'security profile' in topic_lower or '62443-5' in text or 'profile scheme' in text or 'isasecure' in text or 'protection scheme' in text or 'spr' in text:
        if 'scheme' in text or 'conformance' in text or 'isasecure' in text:
            return 15
        return 14

    if 'awareness' in topic_lower or 'awareness' in q_lower or 'training' in q_lower:
        return 2

    if 'risk assessment' in topic_lower or '62443-3-2' in text or 'threat-risk' in text or 'risk assessment' in text or 'risk equation' in text or 'pha' in text or 'hazop' in text or 'consequence' in text and 'likelihood' in text:
        return 11
        
    if 'zones' in topic_lower or 'conduit' in text or 'reference model' in text or 'purdue' in text or 'security level' in topic_lower or 'sl-t' in text or 'sl-a' in text or 'sl-c' in text or 'fr 1' in text or 'fr 2' in text or 'fr 3' in text or 'fr 4' in text or 'fr 5' in text or 'fr 6' in text or 'fr 7' in text or 'foundational requirement' in text:
        if 'sl-t' in text or 'lifecycle' in text or 'lifecycle phase' in text:
            return 5
        return 4

    if 'network security' in topic_lower or 'firewall' in text or 'osi' in text or 'dmz' in text or 'vpn' in text or 'vlan' in text or 'switch' in text or 'router' in text:
        return 8

    if 'asset owner' in text or '62443-2-1' in text or 'csms' in text or 'security program' in text or 'policies and procedures' in topic_lower or 'governance' in topic_lower:
        return 6
        
    if 'standards' in topic_lower or 'regulations' in topic_lower or 'nist' in text or 'nerc cip' in text or 'gdpr' in text or 'iso 27001' in text:
        return 7

    if '62443 series' in text or 'overview' in topic_lower or 'isa/iec 62443' in topic_lower or '1-1' in text or 'tier' in text:
        return 3

    if 'it vs' in text or 'it and iacs' in text or 'stuxnet' in text or 'shamoon' in text or 'malware' in text or 'ransomware' in text or 'consequences' in text or 'safety' in text:
        return 1

    # Fallback by anchor
    anchor = (q.get('explanationAnchor') or {}).get('anchor', '')
    if anchor == 'FLOW':
        return 9
    elif anchor == 'WHERE':
        return 4
    elif anchor == 'IMPROVE':
        return 10
    elif anchor == 'WHAT':
        return 3
    elif anchor == 'WHY':
        return 1
    elif anchor == 'SEE':
        return 8

    return 1

mapped = Counter()
for q in questions:
    sec = determine_section(q)
    mapped[sec] += 1

print("Mapping results across 15 sections:")
for i in range(1, 16):
    print(f"  {SECTIONS[i]}: {mapped[i]} questions")

