from pathlib import Path
from openai import OpenAI

client = OpenAI()
files = [Path("OT_ICS_CONTENT_MAP.md"), Path("OT_HUB_VALIDATION.md")]

system_prompt = """You are a meticulous technical translator. Return the complete Markdown document only, without code fences or commentary. Translate all Romanian prose into natural British English. Preserve headings, tables, inline code, commands, file paths, URLs, product names, technical identifiers, and Markdown structure. Standardise ordinary prose to British English spelling. Do not add, remove, summarise, or reorder content."""

for path in files:
    source = path.read_text(encoding="utf-8")
    response = client.chat.completions.create(
        model="gpt-5-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Translate this document to British English:\n\n{source}"},
        ],
        max_completion_tokens=12000,
    )
    translated = (response.choices[0].message.content or "").strip()
    if translated.startswith("```"):
        translated = translated.split("\n", 1)[1]
        if translated.endswith("```"):
            translated = translated[:-3]
        translated = translated.strip()
    if len(translated) < len(source) * 0.65:
        raise RuntimeError(f"Translation output for {path} is unexpectedly short")
    path.write_text(translated + "\n", encoding="utf-8")
    print(f"translated {path}: {len(source)} -> {len(translated)} characters")
