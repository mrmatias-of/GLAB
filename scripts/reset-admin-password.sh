#!/bin/bash

# Script para resetar senha do admin no Supabase
# Usa a API de Admin do Supabase

SUPABASE_PROJECT_ID="eglftcvmpapvnucbxwci"
SUPABASE_URL="https://${SUPABASE_PROJECT_ID}.supabase.co"
SUPABASE_ADMIN_KEY="$SUPABASE_ADMIN_KEY"  # Lê da env var

EMAIL="admin@glabcursos.com.br"
NEW_PASSWORD="E7OJiZmQfsuFqzx7"

# Faz o request para resetar a senha
curl -X POST "${SUPABASE_URL}/auth/v1/admin/users" \
  -H "Authorization: Bearer ${SUPABASE_ADMIN_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"${NEW_PASSWORD}\",
    \"email_confirm\": true
  }"

echo ""
echo "✅ Senha do admin resetada!"
echo "Email: ${EMAIL}"
echo "Nova Senha: ${NEW_PASSWORD}"
