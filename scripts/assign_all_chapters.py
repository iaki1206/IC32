import json
import re
from collections import Counter

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
    # If already explicitly set to Section 1-15, preserve it
    ch = str(q.get('chapter', '') or '')
    m = re.match(r'Section\s+(\d+)', ch)
    if m:
        sec_num = int(m.group(1))
        if sec_num in SECTIONS:
            return sec_num

    topic = (q.get('topic') or '').lower()
    text = (q.get('question', '') + ' ' + q.get('explanation', '')).lower()
    q_lower = q.get('question', '').lower()

    # Specific standard identifiers first
    if '62443-2-3' in text or 'patch management' in topic or 'patching' in text or 'software patch' in text or 'patch qualification' in text:
        return 10
    if '62443-2-4' in text or 'service provider' in text or 'integration service provider' in text or 'maintenance service provider' in text:
        return 12
    if '62443-4-1' in text or '62443-4-2' in text or 'secure product' in text or 'sdlc' in text or 'component security' in text or 'embedded device' in text:
        return 13
    if '62443-3-2' in text or 'risk assessment' in topic or 'risk analysis' in text or 'risk assessment' in text or 'risk equation' in text or 'threat-risk' in text or 'pha' in text or 'hazop' in text:
        return 11
    if '62443-2-1' in text or 'asset owner' in text or 'csms' in text or 'cybersecurity management system' in text or 'security program' in text:
        return 6
    if '62443-1-5' in text or 'isasecure' in text or 'profile scheme' in text or 'security protection scheme' in text or 'spr' in text:
        return 15
    if 'security profile' in text or '62443-5' in text:
        return 14

    # Industrial Protocols
    if 'industrial protocols' in topic or any(proto in text for proto in ['modbus', 'profinet', 'opc ua', 'opc da', 'dnp3', 'bacnet', 'ethernet/ip', 'profibus', 'fieldbus', 'hart protocol', 'ethercat']):
        return 9

    # Awareness & Social Engineering
    if 'awareness' in topic or 'awareness' in text or 'phishing' in text or 'social engineering' in text or 'human weakness' in text or 'personnel training' in text:
        return 2

    # Lifecycle & SL lifecycle
    if 'iacs lifecycle' in topic or 'security lifecycle' in topic or 'sl-t' in text or 'sl-a' in text or 'sl-c' in text or 'maintain phase' in text or 'assess phase' in text or 'develop & implement phase' in text:
        return 5

    # Zones, Conduits, Purdue & Reference Model, SL & FR
    if 'zones' in topic or 'conduit' in text or 'purdue' in text or 'reference model' in text or 'security level' in text or 'foundational requirement' in text or any(f'fr{i}' in text or f'fr {i}' in text for i in range(1, 8)):
        return 4

    # Network Security Basics
    if 'network security' in topic or any(net in text for net in ['firewall', 'osi layer', 'osi model', 'dmz', 'vpn', 'router', 'switch', 'vlan', 'man-in-the-middle', 'denial of service', 'dos attack', 'eavesdropping', 'packet inspection']):
        return 8

    # Standards & Regulations
    if 'standards' in topic or 'regulations' in topic or any(std in text for std in ['nerc cip', 'nist', 'gdpr', 'hipaa', 'iec 61508', 'iec 61511', 'iso 27001', 'evolving security']):
        return 7

    # Series Overview
    if 'isa/iec 62443 series' in text or '62443 overview' in topic or 'general group' in text or '1-1' in text or 'master glossary' in text or 'tier' in text:
        return 3

    # Section 1: Intro, Consequences, IT vs IACS, Malware trends
    if any(m in text for m in ['stuxnet', 'shamoon', 'industroyer', 'triton', 'it and iacs', 'it vs iacs', 'safety and availability', 'cots', 'air gap', 'consequences', 'cybercrime']):
        return 1

    # Anchor fallback
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

def main():
    json_path = '/home/cris/IC32/client/src/data/knowledgeCheckData.json'
    with open(json_path) as f:
        data = json.load(f)

    questions = data['questions']
    updated_count = 0

    for q in questions:
        sec_num = determine_section(q)
        sec_title = SECTIONS[sec_num]
        if q.get('chapter') != sec_title:
            q['chapter'] = sec_title
            updated_count += 1

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Successfully mapped all {len(questions)} questions!")
    print(f"Updated {updated_count} questions with exact standard chapter strings.")

    # Validation
    ch_counts = Counter(q['chapter'] for q in questions)
    for i in range(1, 16):
        title = SECTIONS[i]
        print(f"  {title}: {ch_counts[title]} questions")

if __name__ == '__main__':
    main()
