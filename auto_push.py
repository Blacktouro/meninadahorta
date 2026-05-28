#!/usr/bin/env python3

import os
import subprocess
from datetime import datetime

# ==========================================
# CONFIG
# ==========================================

PROJECT_DIR = "/home/andre/websites-feitos/meninadahorta"

# ==========================================
# FUNÇÃO
# ==========================================

def run_command(command):
    print(f"\n🚀 Executando: {command}\n")

    result = subprocess.run(
        command,
        shell=True,
        cwd=PROJECT_DIR
    )

    if result.returncode != 0:
        print(f"❌ Erro ao executar: {command}")
        exit(1)

# ==========================================
# MENSAGEM AUTOMÁTICA
# ==========================================

timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
commit_message = f"auto deploy {timestamp}"

# ==========================================
# EXECUÇÃO
# ==========================================

print("\n===================================")
print("🚀 AUTO DEPLOY MENINA DA HORTA")
print("===================================\n")

# Verificar alterações
status = subprocess.check_output(
    "git status --porcelain",
    shell=True,
    cwd=PROJECT_DIR
).decode().strip()

if not status:
    print("✅ Nenhuma alteração encontrada.")
    exit(0)

# Git add
run_command("git add .")

# Git commit
run_command(f'git commit -m "{commit_message}"')

# Git push
run_command("git push")

print("\n===================================")
print("✅ PUSH ENVIADO COM SUCESSO")
print("🔥 Jenkins vai fazer deploy automático")
print("===================================\n")
