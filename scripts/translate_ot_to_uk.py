from pathlib import Path
from openai import OpenAI

client = OpenAI()
files = [
    Path("client/src/data/otCyberData.ts"),
    Path("client/src/components/OTCyberHub.tsx"),
]

system_prompt = """You are a meticulous software localisation editor. Return the complete source file only, with no Markdown fences or commentary. Preserve TypeScript/TSX syntax, imports, exports, identifiers, object keys, CSS/Tailwind classes, URLs, commands, protocol names, code snippets, file paths, and application logic exactly. Translate every Romanian user-facing string and comment into natural British English. Standardise user-facing prose to British English spelling (for example authorised, organisation, organised, prioritisation, modelling, behaviour, centre, fibre, defence, programme) unless a quoted standard title, command, URL, code identifier, brand name, or source wording must remain unchanged. Keep ISA/IEC 62443 terminology technically precise. Do not remove, summarise, reorder, or add educational content."""

for path in files:
    source = path.read_text(encoding="utf-8")
    response = client.chat.completions.create(
        model="gpt-5-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Translate this complete file to British English:\n\n{source}"},
        ],
        max_completion_tokens=30000,
    )
    translated = response.choices[0].message.content or ""
    translated = translated.strip()
    if translated.startswith("```"):
        translated = translated.split("\n", 1)[1]
        if translated.endswith("```"):
            translated = translated[:-3]
        translated = translated.strip()
    if len(translated) < len(source) * 0.70:
        raise RuntimeError(f"Translation output for {path} is unexpectedly short")
    backup = path.with_suffix(path.suffix + ".pre-uk")
    backup.write_text(source, encoding="utf-8")
    path.write_text(translated + "\n", encoding="utf-8")
    print(f"translated {path}: {len(source)} -> {len(translated)} characters")
