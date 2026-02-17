#!/bin/bash

# Execute Templates Seed Migration
# This script runs the SQL migration to seed the 6 initial templates

echo "🚀 Running Templates Seed Migration..."
echo ""

# Check if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "⚠️  Environment variables not set. Loading from .env.local..."
  
  if [ -f .env.local ]; then
    # Extract Supabase URL
    export SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")
    export SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")
  else
    echo "❌ .env.local not found!"
    echo "Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables"
    exit 1
  fi
fi

# Extract project ref from URL (e.g., https://abc123.supabase.co -> abc123)
PROJECT_REF=$(echo $SUPABASE_URL | sed -n 's/.*https:\/\/\([^.]*\).*/\1/p')

echo "📋 Project: $PROJECT_REF"
echo ""

# Read the SQL file
SQL_FILE="supabase/migrations/20260104_seed_initial_templates.sql"

if [ ! -f "$SQL_FILE" ]; then
  echo "❌ SQL file not found: $SQL_FILE"
  exit 1
fi

echo "📄 Executing SQL from: $SQL_FILE"
echo ""

# Execute via Supabase API
# Note: This uses the REST API to execute raw SQL
# For production, you should use `supabase db push` or run via Supabase Dashboard

echo "⚠️  MANUAL EXECUTION REQUIRED"
echo ""
echo "Please execute the SQL migration manually via one of these methods:"
echo ""
echo "Option 1: Supabase Dashboard"
echo "  1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql"
echo "  2. Open file: $SQL_FILE"
echo "  3. Copy and paste the SQL"
echo "  4. Click 'Run'"
echo ""
echo "Option 2: psql (if you have direct database access)"
echo "  psql \$DATABASE_URL -f $SQL_FILE"
echo ""
echo "Option 3: Supabase CLI (if linked)"
echo "  npx supabase db push"
echo ""

# Show first few lines of the SQL file
echo "📋 SQL Preview (first 20 lines):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
head -n 20 "$SQL_FILE"
echo "..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Script completed - awaiting manual SQL execution"
