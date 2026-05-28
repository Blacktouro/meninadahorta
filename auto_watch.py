#!/usr/bin/env python3

import os
import time
import subprocess
from datetime import datetime

PROJECT_DIR = "/home/andre/websites-feitos/meninadahorta"

IGNORE = [
    ".git",
    "node_modules",
    "__pycache__",
    "dist"
]

print("👀 A observar alterações...")

def run(cmd):
    subprocess.run(cmd, shell=True, cwd=PROJECT_DIR)

while True:

    result = subprocess.run(
        f'inotifywait -r -e modify,create,delete {PROJECT_DIR}',
        shell=True,
        capture_output=True,
        text=True
    )

    output = result.stdout

    if any(x in output for x in IGNORE):
        continue

    print(f"\n⚡ Alteração detectada:\n{output}")

    time.sleep(2)

    status = subprocess.check_output(
        "git status --porcelain",
        shell=True,
        cwd=PROJECT_DIR
    ).decode().strip()

    if not status:
        continue

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    run("git add .")
    run(f'git commit -m "auto update {timestamp}"')
    run("git push")

    print("✅ Deploy automático enviado")
