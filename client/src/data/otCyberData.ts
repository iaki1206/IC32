export type LearningBlock = {
  title: string;
  body?: string;
  bullets?: string[];
  code?: string[];
  table?: { headers: string[]; rows: string[][] };
  warning?: string;
  interactive?: "standards" | "securityLevels" | "lifecycle" | "patchCycle" | "osi";
};

export type LearningModule = {
  id: string;
  step: number;
  anchor: string;
  title: string;
  subtitle: string;
  colour: string;
  remember: string;
  connectsTo: string[];
  blocks: LearningBlock[];
  sourceImages: string[];
};

export const learningPath = [
  { key: "WHY", label: "Why do we protect?", moduleId: "foundations" },
  { key: "WHAT", label: "What does the standard require?", moduleId: "iec62443" },
  { key: "WHERE", label: "Where do we place controls?", moduleId: "zones" },
  { key: "FLOW", label: "How does data flow?", moduleId: "protocols" },
  { key: "SEE", label: "How do we observe?", moduleId: "monitoring" },
  { key: "TEST", label: "How do we validate safely?", moduleId: "discovery" },
  { key: "IMPROVE", label: "How do we improve?", moduleId: "playbooks" },
];

export const modules: LearningModule[] = [
  {
    id: "foundations",
    step: 1,
    anchor: "WHY",
    title: "OT/ICS Fundamentals",
    subtitle: "Assets create value; vulnerabilities and threats create risk.",
    colour: "cyan",
    remember: "A-V-T-R: Asset → Vulnerability → Threat → Risk. In OT, the effect can be physical, not only digital.",
    connectsTo: ["iec62443", "zones", "monitoring"],
    sourceImages: ["/ot-assets/iec62443-concepts.jpeg", "/ot-assets/iec62443-overview.webp"],
    blocks: [
      {
        title: "Key definitions",
        bullets: [
          "Asset: any valuable resource that needs protecting.",
          "Vulnerability: a weakness or design flaw in a system or component.",
          "Threat: a potential danger that can exploit a vulnerability.",
          "Risk: the expectation of loss; in practice, probability and consequence are analysed.",
        ],
      },
      {
        title: "Why OT is different",
        body: "Attacks no longer only aim to steal data. They can stop factories, power grids and critical services. A PLC compromised via the network can receive modified process parameters, causing production stoppage and equipment damage.",
        bullets: [
          "We protect people, equipment and the environment.",
          "Process reliability and availability are primary objectives.",
          "Impact can be physical, not just digital.",
          "Security must be integrated across the entire life cycle of industrial assets.",
        ],
      },
      {
        title: "Covered sectors",
        bullets: ["Factories", "Power utilities", "Water treatment", "Oil & Gas", "Transport", "All industrial systems"],
      },
    ],
  },
  {
    id: "iec62443",
    step: 2,
    anchor: "WHAT",
    title: "IEC 62443 on a single map",
    subtitle: "Standard, foundational requirements, security and maturity levels.",
    colour: "blue",
    remember: "4 parts, 7 FR, SL 0–4, three SL perspectives: target, capability and achieved.",
    connectsTo: ["foundations", "zones", "playbooks"],
    sourceImages: ["/ot-assets/iec62443-concepts.jpeg", "/ot-assets/iec62443-overview.webp"],
    blocks: [
      {
        title: "ISA/IEC 62443 series overview",
        interactive: "standards",
        body: "The series is easiest to remember as five colour-coded families: general concepts, policies and procedures, system requirements, component requirements, profiles, and evaluation methods.",
      },
      {
        title: "What is IEC 62443?",
        body: "IEC 62443 is a family of international standards for cyber security in Industrial Automation and Control Systems (IACS). It provides a framework for protecting OT industrial systems against cyber threats.",
      },
      {
        title: "Standard structure",
        table: {
          headers: ["Part", "Focus", "Content"],
          rows: [
            ["Part 1 — General", "Concepts and models", "Terminology"],
            ["Part 2 — Policies & Procedures", "Governance", "Risk management; security programme requirements"],
            ["Part 3 — System", "System", "Technical security requirements; Security Levels SL1–SL4"],
            ["Part 4 — Component", "Products and vendors", "Secure product development; vendor requirements"],
          ],
        },
      },
      {
        title: "The 7 Foundational Requirements",
        table: {
          headers: ["FR", "Name", "Code"],
          rows: [
            ["FR1", "Identification & Authentication Control", "IAC"],
            ["FR2", "Use Control", "UC"],
            ["FR3", "System Integrity", "SI"],
            ["FR4", "Data Confidentiality", "DC"],
            ["FR5", "Restricted Data Flow", "RDF"],
            ["FR6", "Timely Response to Events", "TRE"],
            ["FR7", "Resource Availability", "RA"],
          ],
        },
      },
      {
        title: "Security Levels — interactive review",
        interactive: "securityLevels",
      },
      {
        title: "Security Levels",
        table: {
          headers: ["Level", "Protection"],
          rows: [
            ["SL0", "No special security requirements"],
            ["SL1", "Protection against accidental faults"],
            ["SL2", "Intentional attacks using simple means, limited resources and general knowledge"],
            ["SL3", "Intentional attacks using sophisticated means, moderate resources and IACS-specific knowledge"],
            ["SL4", "Intentional attacks using sophisticated means, extensive resources and IACS-specific knowledge"],
          ],
        },
      },
      {
        title: "SL-T, SL-C and SL-A",
        bullets: [
          "SL-T — Target Security Level: the target set through system-level risk assessment.",
          "SL-C — Capability Security Level: the level the system or component can provide when integrated and configured correctly.",
          "SL-A — Achieved Security Level: the level actually achieved in implementation.",
        ],
      },
      {
        title: "Maturity Levels",
        table: {
          headers: ["Level", "Description"],
          rows: [
            ["ML1 — Initial / Ad-hoc", "No formal process or documentation; reactive approach"],
            ["ML2 — Managed", "Basic process and informal, project-specific documentation"],
            ["ML3 — Defined", "Standardised and documented organisational process"],
            ["ML4 — Practised & Improved", "Established, documented and continuously improved process"],
          ],
        },
      },
      {
        title: "Defence in Depth",
        bullets: ["Physical Security", "Identity & Access", "Perimeter", "Network", "Compute", "Application", "Data"],
      },
      {
        title: "Practical lessons",
        bullets: [
          "Know and inventory industrial assets.",
          "Segment OT networks from IT.",
          "Apply controls appropriate to the level of risk.",
          "Monitor and detect unusual activity.",
          "Integrate security into new projects and upgrades.",
        ],
      },
    ],
  },
  {
    id: "zones",
    step: 3,
    anchor: "WHERE",
    title: "Zones, conduits and the Purdue architecture",
    subtitle: "Group assets, control flows and limit the impact of incidents.",
    colour: "emerald",
    remember: "ZONE = who shares the same requirements. CONDUIT = how two zones communicate. DMZ = the buffer between IT and OT.",
    connectsTo: ["iec62443", "protocols", "monitoring"],
    sourceImages: ["/ot-assets/zones-conduits.webp", "/ot-assets/attack-architecture.webp"],
    blocks: [
      {
        title: "What is a zone?",
        body: "A zone is a logical or physical grouping of assets that share common security requirements, determined by function, criticality and risk level.",
        bullets: [
          "Assets in a zone share a common level of trust.",
          "Security controls are applied at the zone boundary.",
          "Examples: PLC zone, HMI zone, Engineering Workstation zone.",
        ],
      },
      {
        title: "What is a conduit?",
        body: "A conduit is the communication path between two zones. It defines how data flows and what controls protect that path.",
        bullets: [
          "Any connection between zones should pass through a conduit.",
          "Conduits control, monitor and restrict traffic.",
          "Examples: firewall rules, VPN tunnel, DMZ connection, communication over a secured protocol.",
        ],
      },
      {
        title: "Industrial zone chain",
        table: {
          headers: ["Level / zone", "Representative assets"],
          rows: [
            ["Level 4/5 — Enterprise", "Router, switch, wireless AP, VPN, web/mail/cloud, enterprise workstation, IDAM"],
            ["Level 3.5 — OT DMZ", "VPN, update server, file server, jump host, historian mirror"],
            ["Level 3 — Operations & Control", "OT domain controller, engineering workstation, data historian, control centre, hypervisor"],
            ["Level 2 — Control", "Operator HMI, DCS control server, SCADA control server"],
            ["Level 1 — Process", "Modem and switch; data gateways; field controllers; PLC; RTU; IED/protection relays; local HMI; Transient Cyber Asset; serial-to-Ethernet gateway"],
            ["Level 0 — Equipment Under Control", "Safety shut-off valves, sensors, actuators, circuit breakers"],
          ],
        },
      },
      {
        title: "Flows and separations to remember",
        bullets: [
          "Firewall between Enterprise and OT DMZ.",
          "Firewall between OT DMZ and Operations & Control.",
          "DCS Control Server communicates to Data Gateway and Field Controllers.",
          "SCADA Control Server communicates to RTU and PLC.",
          "Process Safety Zone includes Safety Engineering Workstation, Safety Controller and safety shut-off valves at Level 0.",
          "Local Process includes Operator HMI and DCS Control Server; Remote Process includes TCA, RTU, serial-to-Ethernet gateway, Local HMI, PLC and IED/protection relays.",
          "Transient Cyber Assets must be treated as assets with special risk.",
          "Level 3 can include a central control centre and an OT Hypervisor; Level 3.5 can include a Jump Host and Data Historian Mirror.",
        ],
      },
      {
        title: "Benefits",
        bullets: [
          "Limits the impact of an incident.",
          "Improves visibility and traffic control.",
          "Supports risk assessment and compliance.",
          "Consolidates segmentation and defence in depth.",
        ],
      },
    ],
  },
  {
    id: "protocols",
    step: 4,
    anchor: "FLOW",
    title: "OT networking and protocols",
    subtitle: "From IPv4 addressing to OSI layers and industrial protocols.",
    colour: "violet",
    remember: "Not all OT protocols reach IP. Some critical flows live directly at L2.",
    connectsTo: ["zones", "monitoring", "discovery"],
    sourceImages: ["/ot-assets/osi-ot-protocols.webp", "/ot-assets/ip-classes.webp"],
    blocks: [
      {
        title: "IPv4 classes — historical reference",
        body: "IPv4 addresses are 32 bits. Classful addressing has been replaced in practice by CIDR, but classes remain useful for fundamentals.",
        table: {
          headers: ["Class", "Initial bits", "First octet", "Default mask", "Division"],
          rows: [
            ["A", "0", "1–126 (0 and 127 reserved)", "255.0.0.0 (/8)", "Network 8 bits / Host 24 bits"],
            ["B", "10", "128–191", "255.255.0.0 (/16)", "Network 16 bits / Host 16 bits"],
            ["C", "110", "192–223", "255.255.255.0 (/24)", "Network 24 bits / Host 8 bits"],
            ["D", "1110", "224–239", "N/A", "Multicast Group ID 28 bits"],
            ["E", "1111", "240–255", "N/A", "Experimental / reserved 28 bits"],
          ],
        },
      },
      {
        title: "Classful capacity",
        table: {
          headers: ["Class", "Number of networks", "Hosts/network"],
          rows: [
            ["A", "126", "16,777,214 (2²⁴ − 2)"],
            ["B", "16,384", "65,534 (2¹⁶ − 2)"],
            ["C", "2,097,152", "254 (2⁸ − 2)"],
          ],
        },
      },
      {
        title: "Special addresses and reserved ranges",
        bullets: [
          "0.0.0.0 — This Network; range 0.0.0.0–0.255.255.255.",
          "127.0.0.1 — Loopback; range 127.0.0.0–127.255.255.255.",
          "255.255.255.255 — Broadcast.",
          "224.0.0.0–239.255.255.255 — Multicast.",
          "240.0.0.0–255.255.255.255 — Experimental.",
        ],
      },
      {
        title: "OSI model: interactive encapsulation lab",
        interactive: "osi",
      },
      {
        title: "OSI model: IT vs OT",
        table: {
          headers: ["Layer", "IT — examples", "OT / industrial — examples"],
          rows: [
            ["7 Application", "HTTP/S, DNS, SNMP, SSH, SMTP/IMAP/POP3, NTP", "Modbus TCP/RTU, DNP3, IEC 60870-5-101/104, IEC 61850 MMS, OPC UA, EtherNet/IP, S7comm, MQTT"],
            ["6 Presentation", "TLS/SSL, JSON/XML, ASN.1 BER, ASCII/Unicode", "MMS ASN.1/BER; OPC UA Binary/XML/JSON encoding"],
            ["5 Session", "RPC, named pipes, NetBIOS, SMB", "MMS/OSI Session, OPC UA Session, EtherNet/IP RegisterSession; Modbus and DNP3 are sessionless"],
            ["4 Transport", "TCP, UDP", "TCP/UDP; DNP3 pseudo-transport; COTP/ISO-on-TCP RFC 1006 for S7comm and MMS"],
            ["3 Network", "IPv4/IPv6, ICMP, IGMP, IP", "IEC-104, Modbus TCP, DNP3/IP, EtherNet/IP, OPC UA, MQTT"],
            ["2 Data Link", "Ethernet 802.3, VLAN 802.1Q, PPP, Wi-Fi", "GOOSE 0x88B8, Sampled Values 0x88BA, PROFINET RT/IRT, EtherCAT 0x88A4, DLR, PTP 0x88F7, MRP/PRP/HSR"],
            ["1 Physical", "Copper, fibre, Wi-Fi, RS-232, PoE", "Industrial Ethernet, RS-232/485, fibre, 4–20 mA, HART FSK, 10BASE-T1L, WirelessHART/ISA100.11a"],
          ],
        },
      },
      {
        title: "Serial / fieldbus protocols",
        bullets: [
          "Modbus RTU — L1 / L2 / L7.",
          "PROFIBUS DP (FDL) — L2.",
          "HART over 4–20 mA — L1 / L2 / L7.",
          "DeviceNet / CAN — L1 / L2 / L7.",
          "BACnet/IP — L3 / L4 / L7.",
        ],
      },
      {
        title: "Key idea",
        warning: "GOOSE, Sampled Values, PROFINET RT/IRT and EtherCAT communicate directly over Ethernet L2, bypassing IP/TCP. They cannot be routed or inspected by IP-only tools and are not protected by L3 firewalls. TLS is often specified at L6, but practically operates over L4/L5; DNP3 uses a three-tier EPA model; OPC UA's internal layers do not map perfectly onto OSI.",
      },
    ],
  },
  {
    id: "monitoring",
    step: 5,
    anchor: "SEE",
    title: "Passive monitoring with Wireshark",
    subtitle: "Discover assets, follow protocols and look for anomalies without active scanning.",
    colour: "amber",
    remember: "Observe passively first: MAC/IP → conversations → protocol → anomaly.",
    connectsTo: ["protocols", "zones", "discovery"],
    sourceImages: ["/ot-assets/wireshark-ot.webp"],
    blocks: [
      {
        title: "Network Discovery",
        code: [
          "Broadcast traffic  → eth.dst == ff:ff:ff:ff:ff:ff",
          "ARP responses      → arp.opcode == 2",
          "DHCP Discover/Req  → bootp.option.type == 53",
          "MAC addresses      → !(eth.addr in {00:00:00:00:00:00})",
          "IP range           → ip.addr >= 192.168.0.0 and ip.addr <= 192.168.255.255",
        ],
      },
      {
        title: "General filters",
        code: [
          "Follow stream      → tcp.stream eq <stream number>",
          "Filter by IP       → ip.addr == <IP>",
          "Filter by MAC      → eth.addr == <MAC>",
          "Conversations/port → tcp.port == <port>",
        ],
      },
      {
        title: "Suspicious activity",
        code: [
          "Port scanning → tcp.flags.syn == 1 && tcp.flags.ack == 0",
          "Uncommon ports → tcp.dstport < 1 || (tcp.dstport > 1024 && tcp.dstport != 502 && tcp.dstport != 44818)",
          "High-order ports → tcp.dstport > 1024",
          "Modbus on non-standard port → modbus && tcp.port != 502",
          "Malformed packets → tcp.analysis.flags && (tcp.len == 0 || ip.len < 20)",
          "Long TCP sessions → tcp.analysis.bytes_in_flight > 10000",
          "Internet-bound OT → !(ip.dst >= 10.0.0.0 && ip.dst <= 10.255.255.255) && !(ip.dst >= 172.16.0.0 && ip.dst <= 172.31.255.255) && !(ip.dst >= 192.168.0.0 && ip.dst <= 192.168.255.255)",
        ],
      },
      {
        title: "Modbus",
        code: [
          "All Modbus → modbus",
          "TCP 502 → tcp.port == 502",
          "Write single coil → modbus.func_code == 5",
          "Write multiple registers → modbus.func_code == 16",
          "Device identification → modbus.func_code == 43",
        ],
      },
      {
        title: "Other OT/ICS protocols",
        code: [
          "S7 → tcp.port == 102 / s7comm",
          "DNP3 → tcp.port == 20000 / dnp3",
          "EtherNet/IP → tcp.port == 44818 / etherip",
          "PROFINET → eth.type == 0x8892",
          "BACnet/IP → udp.port == 47808 / bacnet",
        ],
      },
      {
        title: "Captures for the lab",
        bullets: ["github.com/ITI/ICS-Security-Tools", "github.com/automayt/ICS-pcap"],
        warning: "Analyse traffic only with authorisation. In production prefer existing captures, TAP or SPAN/port mirroring, without generating active traffic.",
      },
    ],
  },
  {
    id: "discovery",
    step: 6,
    anchor: "TEST",
    title: "Nmap for OT lab",
    subtitle: "Inventory and validation commands, organised by impact.",
    colour: "rose",
    remember: "Authorisation → test window → low rate → explicit targets → monitoring → safe stop.",
    connectsTo: ["protocols", "monitoring", "playbooks"],
    sourceImages: ["/ot-assets/nmap-ot.webp", "/ot-assets/nmap-commands.webp"],
    blocks: [
      {
        title: "Rule zero",
        warning: "Never scan without authorisation and do not perform active scans in production. The examples are for labs, cyber ranges or approved test environments.",
      },
      {
        title: "Low-impact discovery",
        code: [
          "ARP local → nmap -sn -PR 192.168.1.0/24",
          "Ping discovery → nmap -sn 192.168.1.0/24",
          "ICMP Echo → nmap -sn -PE 192.168.1.0/24",
          "No DNS → nmap -n -sn 192.168.1.0/24",
          "Broadcast listener → nmap -sP 192.168.0.0/16 --script broadcast-listener",
          "Host online/no port scan → nmap -sn 192.168.1.1",
          "No ping → nmap -Pn 192.168.1.1",
        ],
      },
      {
        title: "Targets and ports",
        code: [
          "Single host → nmap 192.168.1.1",
          "Multiple hosts → nmap 192.168.1.1 192.168.1.2",
          "Range → nmap 192.168.1.1-10",
          "Subnet → nmap 192.168.1.0/24",
          "Selected ports → nmap -p 22,80,443 192.168.1.1",
          "Default UDP ports → nmap -sU 192.168.1.1",
          "UDP 53 → nmap -sU -p 53 192.168.1.1",
          "All TCP ports → nmap 192.168.1.1 -p-",
          "Top 10 → nmap 192.168.1.0/24 --top-ports 10",
          "Modbus TCP instances → nmap 192.168.1.0/24 -p 502",
          "Top 1000 → nmap --top-ports 1000 192.168.1.1",
          "Exclude target → nmap 192.168.1.0/24 --exclude 192.168.1.10",
          "Targets file → nmap -iL targets.txt",
          "IPv6 → nmap -6 2605:f0d0:1005:51::4",
        ],
      },
      {
        title: "Detection and troubleshooting",
        code: [
          "OS detection → nmap -O 192.168.1.1",
          "Service/version → nmap -sV 192.168.1.1",
          "Aggressive → nmap -A 192.168.1.1",
          "Debug → nmap -d 192.168.1.1 (or -dd)",
          "Interface → nmap -e eth0 192.168.1.1",
          "Packet trace → nmap -p 80 -d --packet-trace 192.168.1.1",
        ],
        warning: "Options -A, -O, -sV and NSE can significantly increase operational risk. Use them only in an approved test environment.",
      },
      {
        title: "Rate control",
        code: [
          "Delay → nmap 192.168.1.1 --scan-delay 5s",
          "One packet at a time → nmap 192.168.1.1 --max-parallelism 1",
          "Timing normal → nmap 192.168.1.1 -T3",
          "Minimum rate → nmap --min-rate 1000 192.168.1.1",
          "Timing templates → -T0 Paranoid; -T1 Sneaky; -T2 Polite; -T3 Normal; -T4 Aggressive; -T5 Insane",
        ],
      },
      {
        title: "NSE for OT protocols",
        code: [
          "Modbus → nmap 192.168.1.1 -p 502 --script modbus-discover",
          "EtherNet/IP → nmap 192.168.1.1 -p 44818 --script enip-info",
          "Siemens S7 → nmap 192.168.1.1 -p 102 --script s7-info",
          "DNP3 → nmap 192.168.1.1 -p 20000 --script dnp3-info",
          "Specific NSE → nmap --script=<nse-script> 192.168.1.1",
          "List NSE → ls /usr/share/nmap/scripts",
        ],
      },
      {
        title: "Export and resume",
        code: [
          "Normal text → -oN",
          "XML → nmap -oX output.xml 192.168.1.1",
          "Grepable → -oG",
          "Resume → nmap --resume out.txt",
        ],
      },
      {
        title: "High-risk techniques — lab only",
        code: [
          "Decoy → nmap -D <decoy-IP> 192.168.1.1",
          "Fragmentation → nmap -f 192.168.1.1",
        ],
        warning: "Detection-avoidance techniques are not suitable for normal OT inventory and can trigger or disrupt controls. They are kept only for educational lab reference.",
      },
      {
        title: "Common OT/ICS ports",
        table: {
          headers: ["Protocol", "Port", "Protocol", "Port"],
          rows: [
            ["Modbus TCP", "TCP 502", "Siemens S7", "TCP 102"],
            ["DNP3", "TCP 20000", "EtherNet/IP", "TCP/UDP 44818"],
            ["BACnet", "UDP 47808", "OPC UA", "TCP 4840"],
            ["MQTT", "TCP 1883", "MQTT TLS", "TCP 8883"],
            ["MQTT-SN", "UDP 1884", "HART-IP", "TCP 5094"],
            ["Tridium", "TCP 1911", "PCWorx", "TCP 1962"],
            ["Red Lion", "TCP 789", "ProConOS", "TCP 20547"],
            ["GE-SRTP", "TCP 18245", "MELSEC-Q", "TCP 5007"],
            ["Omron FINS", "TCP/UDP 9600", "—", "—"],
          ],
        },
      },
      {
        title: "Free targets for practice",
        bullets: ["github.com/zakharb/labshock", "github.com/mushorg/conpot"],
      },
    ],
  },
  {
    id: "playbooks",
    step: 7,
    anchor: "IMPROVE",
    title: "20 AI prompts for OT/ICS",
    subtitle: "A starter library for plans, exercises, architectures and professional development.",
    colour: "indigo",
    remember: "Replace [industry], provide verified context and treat AI output as a draft that must be validated by an OT specialist.",
    connectsTo: ["foundations", "iec62443", "discovery"],
    sourceImages: ["/ot-assets/ai-prompts.webp"],
    blocks: [
      {
        title: "IACS Automation Solution Lifecycle — eight phases",
        interactive: "lifecycle",
        body: "Security is continuous across specification, design, implementation, verification and validation, operation, maintenance and decommissioning.",
      },
      {
        title: "IACS patching — a controlled cycle",
        interactive: "patchCycle",
        body: "Patch management is a risk-based operational loop: gather information, monitor and evaluate, test, deploy, then verify and report.",
      },
    ],
  },
];

export const aiPrompts = [
  { id: 1, title: "Asset Management", goal: "Build an asset register sample template", prompt: "Generate an asset inventory template for an ICS network in a [industry] facility, including fields like asset type, IP, MAC address, firmware version, and vendor.", links: ["WHY", "WHERE"] },
  { id: 2, title: "Vulnerability Management", goal: "Create an OT vulnerability management plan", prompt: "Design a practical patch and vulnerability management workflow for a [industry] plant that includes OT risk-based prioritisation and the Now, Next, Never approach.", links: ["WHY", "IMPROVE"] },
  { id: 3, title: "Secure Network Architecture", goal: "Design a secure OT network architecture from the start", prompt: "Draw a high-level secure network architecture diagram for a [industry] facility, including IT, DMZ, and OT zones with firewalls, unidirectional gateways and data diodes.", links: ["WHERE", "FLOW"] },
  { id: 4, title: "Backup & Recovery", goal: "Build a backup and recovery plan for your OT network", prompt: "Write a backup and recovery strategy for PLCs and HMIs in a large [industry] plant, including storage types, validation processes and testing procedures.", links: ["WHAT", "IMPROVE"] },
  { id: 5, title: "Incident Response Planning", goal: "Create an incident response plan from scratch", prompt: "Write a complete OT/ICS-specific incident response plan for a mid-sized [industry] plant, including roles, escalation paths, and communication protocols.", links: ["SEE", "IMPROVE"] },
  { id: 6, title: "Security Awareness Training", goal: "Design a cybersecurity awareness session", prompt: "Develop a 1-hour awareness training outline for control engineers on how to avoid common OT cybersecurity mistakes. Include real world examples from [industry].", links: ["WHY", "IMPROVE"] },
  { id: 7, title: "Compliance & Governance", goal: "Apply complex settings practically", prompt: "Break down ISA/IEC 62443-3-3 requirements in plain language and provide an example implementation for a [industry] control room; use only information in the public domain.", links: ["WHAT", "WHERE"] },
  { id: 8, title: "Tabletop Exercises", goal: "Design a realistic tabletop exercise", prompt: "Generate a tabletop exercise for an OT cybersecurity incident in a [industry] plant based on a realistic example which has occurred at another facility in the same industry.", links: ["WHY", "IMPROVE"] },
  { id: 9, title: "Risk Assessment", goal: "Identify potential risks in an ICS/OT environment", prompt: "Act as an OT cybersecurity consultant. Create a list of the top 10 cybersecurity risks for a [industry] plant using SCADA systems, including likelihood and impact.", links: ["WHY", "WHAT"] },
  { id: 10, title: "Threat Intelligence", goal: "Understand threats against your OT network", prompt: "Summarise the TTPs (Tactics, Techniques, and Procedures) used by attackers in past ICS/OT-related attacks, and map them to the MITRE ATT&CK for ICS matrix for [industry].", links: ["WHY", "SEE"] },
  { id: 11, title: "Network Security Monitoring", goal: "Improve network monitoring", prompt: "List the top 10 log sources in an OT network that would help detect early signs of a cyber attack in [industry]. Provide a list of tips & tricks on implementation and configuration.", links: ["SEE", "FLOW"] },
  { id: 12, title: "Secure Remote Access", goal: "Secure remote access", prompt: "What are the recommended security controls for enabling vendor remote access to a PLC in a [industry] facility? List challenges and fixes with SRA seen at other similar facilities.", links: ["WHERE", "WHAT"] },
  { id: 13, title: "Threat Hunting", goal: "Create threat-hunting rules", prompt: "Write example detection rules for an OT network that alert on suspicious Modbus TCP function codes such as write coil or force listen-only mode. Provide example responses.", links: ["SEE", "FLOW"] },
  { id: 14, title: "Honeypots for Incident Detection", goal: "Build an OT honeypot to detect attackers", prompt: "Help me design a Modbus honeypot for an OT lab that logs all activity, maps IPs to geolocation, and mimics a real-world PLC interface. Ensure it provides realistic data to attackers.", links: ["TEST", "SEE"] },
  { id: 15, title: "Physical Security", goal: "Secure OT assets from physical access", prompt: "List the top physical security controls that should be implemented to protect critical OT systems in a [industry] facility. Include real world examples that have occurred.", links: ["WHY", "WHAT"] },
  { id: 16, title: "Awareness for Executives", goal: "Communicate with leadership", prompt: "Write a 5-slide executive briefing explaining why investing in ICS cybersecurity is critical to operational continuity and safety in [industry]. Provide additional suggestions.", links: ["WHY", "IMPROVE"] },
  { id: 17, title: "Metrics", goal: "Measure cybersecurity success", prompt: "Generate a list of meaningful KPIs and metrics to measure the maturity of an ICS/OT cybersecurity programme over time in the [industry] industry. Provide realistic examples of each.", links: ["WHAT", "IMPROVE"] },
  { id: 18, title: "Threat Modelling", goal: "Create a threat model for your industry", prompt: "Perform a threat model using various methodologies for a [industry] control system connected via wireless telemetry. Make additional suggestions to assist.", links: ["WHY", "WHERE"] },
  { id: 19, title: "Career Development", goal: "Plan your OT/ICS cybersecurity journey", prompt: "Act as a mentor. What skills, certifications, and hands-on labs should someone focus on during their first year trying to break into ICS/OT cybersecurity?", links: ["IMPROVE"] },
  { id: 20, title: "Penetration Testing", goal: "Learn how to perform security testing safely", prompt: "What are the top OT-specific tools and techniques to enumerate PLCs, HMIs, and RTUs safely within an ICS/OT network? Authorisation must be received before any testing.", links: ["TEST", "FLOW"] },
];

export const quickChecks = [
  { question: "What groups assets that share common security requirements?", answer: "A zone", options: ["A conduit", "A zone", "A port", "An OSI layer"] },
  { question: "What controls communication between two zones?", answer: "A conduit", options: ["A conduit", "A PLC", "SL-A", "CIDR"] },
  { question: "What does SL-T represent?", answer: "The target level resulting from risk assessment", options: ["The achieved level", "Vendor maturity", "The target level resulting from risk assessment", "Lack of security"] },
  { question: "Which FR addresses Restricted Data Flow?", answer: "FR5", options: ["FR2", "FR3", "FR5", "FR7"] },
  { question: "Where is OT DMZ located in the extended Purdue model?", answer: "Level 3.5", options: ["Level 0", "Level 2", "Level 3.5", "Level 5"] },
  { question: "Which tools are most suitable first for passive observation?", answer: "Wireshark and SPAN/TAP captures", options: ["Scan -A", "Wireshark and SPAN/TAP captures", "Nmap fragmentation", "Funnel"] },
  { question: "On which port is Modbus TCP usually associated?", answer: "TCP 502", options: ["TCP 102", "TCP 502", "UDP 47808", "TCP 20000"] },
];
