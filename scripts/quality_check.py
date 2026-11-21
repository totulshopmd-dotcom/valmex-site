#!/usr/bin/env python3
"""Static quality gate for the VALMEX GitHub Pages repository."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
ERRORS = []
WARNINGS = []
HTML_FILES = sorted(ROOT.rglob("*.html"))
JS_FILES = sorted(ROOT.rglob("*.js"))

REQUIRED = [
    "index.html",
    "Crm/admin.html",
    "Crm/dashboard.html",
    "Crm/chat.html",
    "Crm/angajati.html",
    "Crm/calculator-live.html",
    "chat-widget.js",
    "cms/content.json",
    "supabase/functions/valmex-chat-api/index.ts",
    "supabase/functions/valmex-chat-api/calculation-engine.js",
]

def fail(message):
    ERRORS.append(message)

class References(HTMLParser):
    def __init__(self, file):
        super().__init__(convert_charrefs=True)
        self.file = file
        self.refs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("src", "href", "poster", "action"):
            value = attrs.get(key)
            if value:
                self.refs.append((key, value))
        srcset = attrs.get("srcset", "")
        for item in srcset.split(","):
            candidate = item.strip().split(" ")[0] if item.strip() else ""
            if candidate:
                self.refs.append(("srcset", candidate))

def resolve_local(source, raw):
    value = raw.strip()
    if not value or value.startswith(("#", "//", "{")):
        return None
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        return None
    path = parsed.path
    if not path:
        return None
    if path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = source.parent / path
    target = target.resolve()
    try:
        target.relative_to(ROOT.resolve())
    except ValueError:
        return None
    if target.is_dir():
        target = target / "index.html"
    return target

print("VALMEX QUALITY CHECK")
print(f"Repository root: {ROOT}")
print(f"HTML files: {len(HTML_FILES)} | JavaScript files: {len(JS_FILES)}")

for required in REQUIRED:
    if not (ROOT / required).is_file():
        fail(f"Required file missing: {required}")

for html_file in HTML_FILES:
    parser = References(html_file)
    try:
        parser.feed(html_file.read_text(encoding="utf-8"))
        parser.close()
    except Exception as exc:
        fail(f"HTML parse failed: {html_file.relative_to(ROOT)}: {exc}")
        continue
    for attr, raw in parser.refs:
        target = resolve_local(html_file, raw)
        if target is None:
            continue
        if not target.exists():
            fail(f"Broken local {attr}: {html_file.relative_to(ROOT)} -> {raw}")

content_json = ROOT / "cms/content.json"
if content_json.exists():
    try:
        json.loads(content_json.read_text(encoding="utf-8"))
        print("PASS: cms/content.json is valid JSON")
    except Exception as exc:
        fail(f"Invalid cms/content.json: {exc}")

if JS_FILES:
    for js_file in JS_FILES:
        result = subprocess.run(
            ["node", "--check", str(js_file)],
            text=True, capture_output=True
        )
        if result.returncode:
            detail = (result.stderr or result.stdout).strip().splitlines()
            fail(f"JavaScript syntax error: {js_file.relative_to(ROOT)}: " +
                 (detail[-1] if detail else "node --check failed"))
    if not any("JavaScript syntax error" in e for e in ERRORS):
        print(f"PASS: JavaScript syntax ({len(JS_FILES)} files)")

if ERRORS:
    print("\nFAILED CHECKS:")
    for error in ERRORS:
        print(f"::error::{error}")
    print(f"\nRESULT: FAILED ({len(ERRORS)} errors)")
    sys.exit(1)

print(f"PASS: local references in {len(HTML_FILES)} HTML files")
print("PASS: required VALMEX application files exist")
print("\nRESULT: PASSED")
