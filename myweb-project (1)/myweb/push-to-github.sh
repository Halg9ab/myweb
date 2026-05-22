#!/bin/bash
# ============================================================
# MyWeb OS - GitHub Push Script
# Run this script after cloning/extracting the project
# ============================================================

set -e

REPO_NAME="my-web"
echo ""
echo "🚀 MyWeb OS - GitHub Repository Setup"
echo "======================================"
echo ""

# Ask for GitHub token
read -p "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_USERNAME" ]; then
  echo "❌ Token and username are required."
  exit 1
fi

echo ""
echo "📦 Creating GitHub repository '$REPO_NAME'..."

# Create the repo via API
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -X POST https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"MyWeb OS — Personal Productivity & Finance Dashboard\",
    \"private\": false,
    \"auto_init\": false
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -1)

if [ "$HTTP_CODE" = "201" ]; then
  echo "✅ Repository created successfully!"
elif [ "$HTTP_CODE" = "422" ]; then
  echo "ℹ️  Repository already exists, proceeding with push..."
else
  echo "⚠️  Unexpected response ($HTTP_CODE): $BODY"
fi

# Configure git and push
cd "$(dirname "$0")"

git config user.email "${GITHUB_USERNAME}@users.noreply.github.com"
git config user.name "$GITHUB_USERNAME"

# Remove existing remote if present
git remote remove origin 2>/dev/null || true

# Add new remote with token auth
git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo ""
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main --force

echo ""
echo "✅ Success! Your project is live at:"
echo "   https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""
echo "🌐 To deploy to GitHub Pages, run:"
echo "   npm install -g serve && npm run build && serve -s build"
echo ""
