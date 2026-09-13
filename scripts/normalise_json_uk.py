import json
import re
from pathlib import Path

DATA_DIR = Path("client/src/data")
FILES = sorted(DATA_DIR.glob("*.json"))

# Ordered longest/specific first. Applied to JSON string values only.
REPLACEMENTS = [
    (r"\bUnauthorized\b", "Unauthorised"),
    (r"\bunauthorized\b", "unauthorised"),
    (r"\bAuthorization\b", "Authorisation"),
    (r"\bauthorization\b", "authorisation"),
    (r"\bAuthorized\b", "Authorised"),
    (r"\bauthorized\b", "authorised"),
    (r"\bOrganizations\b", "Organisations"),
    (r"\borganizations\b", "organisations"),
    (r"\bOrganization\b", "Organisation"),
    (r"\borganization\b", "organisation"),
    (r"\bOrganizational\b", "Organisational"),
    (r"\borganizational\b", "organisational"),
    (r"\bOrganizing\b", "Organising"),
    (r"\borganizing\b", "organising"),
    (r"\bOrganized\b", "Organised"),
    (r"\borganized\b", "organised"),
    (r"\bOrganize\b", "Organise"),
    (r"\borganize\b", "organise"),
    (r"\bAnalyzing\b", "Analysing"),
    (r"\banalyzing\b", "analysing"),
    (r"\bAnalyzed\b", "Analysed"),
    (r"\banalyzed\b", "analysed"),
    (r"\bAnalyze\b", "Analyse"),
    (r"\banalyze\b", "analyse"),
    (r"\bBehavioral\b", "Behavioural"),
    (r"\bbehavioral\b", "behavioural"),
    (r"\bBehaviors\b", "Behaviours"),
    (r"\bbehaviors\b", "behaviours"),
    (r"\bBehavior\b", "Behaviour"),
    (r"\bbehavior\b", "behaviour"),
    (r"\bCenters\b", "Centres"),
    (r"\bcenters\b", "centres"),
    (r"\bCentered\b", "Centred"),
    (r"\bcentered\b", "centred"),
    (r"\bCenter\b", "Centre"),
    (r"\bcenter\b", "centre"),
    (r"\bDefense\b", "Defence"),
    (r"\bdefense\b", "defence"),
    (r"\bPrioritization\b", "Prioritisation"),
    (r"\bprioritization\b", "prioritisation"),
    (r"\bPrioritized\b", "Prioritised"),
    (r"\bprioritized\b", "prioritised"),
    (r"\bPrioritize\b", "Prioritise"),
    (r"\bprioritize\b", "prioritise"),
    (r"\bModeling\b", "Modelling"),
    (r"\bmodeling\b", "modelling"),
    (r"\bUtilization\b", "Utilisation"),
    (r"\butilization\b", "utilisation"),
    (r"\bUtilize\b", "Utilise"),
    (r"\butilize\b", "utilise"),
    (r"\bFiber\b", "Fibre"),
    (r"\bfiber\b", "fibre"),
    (r"\bStandardized\b", "Standardised"),
    (r"\bstandardized\b", "standardised"),
    (r"\bCentralized\b", "Centralised"),
    (r"\bcentralized\b", "centralised"),
    (r"\bRecognized\b", "Recognised"),
    (r"\brecognized\b", "recognised"),
    (r"\bSummarize\b", "Summarise"),
    (r"\bsummarize\b", "summarise"),
    (r"\bCustomized\b", "Customised"),
    (r"\bcustomized\b", "customised"),
    (r"\bCustomize\b", "Customise"),
    (r"\bcustomize\b", "customise"),
    (r"\bOptimized\b", "Optimised"),
    (r"\boptimized\b", "optimised"),
    (r"\bOptimizes\b", "Optimises"),
    (r"\boptimizes\b", "optimises"),
    (r"\bOptimizing\b", "Optimising"),
    (r"\boptimizing\b", "optimising"),
    (r"\bOptimization\b", "Optimisation"),
    (r"\boptimization\b", "optimisation"),
    (r"\bOptimize\b", "Optimise"),
    (r"\boptimize\b", "optimise"),
    (r"\bRecognizes\b", "Recognises"),
    (r"\brecognizes\b", "recognises"),
    (r"\bRecognizing\b", "Recognising"),
    (r"\brecognizing\b", "recognising"),
    (r"\bRecognize\b", "Recognise"),
    (r"\brecognize\b", "recognise"),
    (r"\bStandardization\b", "Standardisation"),
    (r"\bstandardization\b", "standardisation"),
    (r"\bStandardize\b", "Standardise"),
    (r"\bstandardize\b", "standardise"),
    (r"\bCategorizing\b", "Categorising"),
    (r"\bcategorizing\b", "categorising"),
    (r"\bCustomizing\b", "Customising"),
    (r"\bcustomizing\b", "customising"),
    (r"\bCustomization\b", "Customisation"),
    (r"\bcustomization\b", "customisation"),
    (r"\bCustomizes\b", "Customises"),
    (r"\bcustomizes\b", "customises"),
    (r"\bDemilitarized\b", "Demilitarised"),
    (r"\bdemilitarized\b", "demilitarised"),
    (r"\bPrioritizes\b", "Prioritises"),
    (r"\bprioritizes\b", "prioritises"),
    (r"\bPrioritizing\b", "Prioritising"),
    (r"\bprioritizing\b", "prioritising"),
    (r"\bCharacterized\b", "Characterised"),
    (r"\bcharacterized\b", "characterised"),
    (r"\bContextualize\b", "Contextualise"),
    (r"\bcontextualize\b", "contextualise"),
    (r"\bEmphasized\b", "Emphasised"),
    (r"\bemphasized\b", "emphasised"),
    (r"\bMinimized\b", "Minimised"),
    (r"\bminimized\b", "minimised"),
    (r"\bOrganizes\b", "Organises"),
    (r"\borganizes\b", "organises"),
    (r"\bRandomized\b", "Randomised"),
    (r"\brandomized\b", "randomised"),
    (r"\bUtilized\b", "Utilised"),
    (r"\butilized\b", "utilised"),
    (r"\bProgrammemable\b", "Programmable"),
    (r"\bprogrammemable\b", "programmable"),
    (r"\bCatalog\b", "Catalogue"),
    (r"\bcatalog\b", "catalogue"),
    (r"\bsecurity programs\b", "security programmes"),
    (r"\bsecurity program\b", "security programme"),
    (r"\bSecurity Programs\b", "Security Programmes"),
    (r"\bSecurity Program\b", "Security Programme"),
    (r"\bprogram requirements\b", "programme requirements"),
    (r"\bProgram Requirements\b", "Programme Requirements"),
]

counts: dict[str, int] = {}

def normalise_string(value: str) -> str:
    result = value
    for pattern, replacement in REPLACEMENTS:
        result, count = re.subn(pattern, replacement, result)
        if count:
            counts[f"{pattern} -> {replacement}"] = counts.get(f"{pattern} -> {replacement}", 0) + count
    return result

def transform(value):
    if isinstance(value, str):
        return normalise_string(value)
    if isinstance(value, list):
        return [transform(item) for item in value]
    if isinstance(value, dict):
        return {key: transform(item) for key, item in value.items()}
    return value

for path in FILES:
    with path.open(encoding="utf-8") as handle:
        data = json.load(handle)
    transformed = transform(data)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(transformed, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    print(f"normalised {path}")

print("\nReplacement counts:")
for key, value in sorted(counts.items()):
    print(f"{value:4d}  {key}")
