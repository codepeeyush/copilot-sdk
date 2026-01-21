#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Packages to publish
PACKAGES=("copilot-sdk" "llm-sdk")

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  📦 YourGPT SDK Publish Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Check npm login
echo -e "${YELLOW}[1/6] Checking npm authentication...${NC}"
NPM_USER=$(npm whoami 2>/dev/null)
if [ -z "$NPM_USER" ]; then
  echo -e "${RED}❌ Not logged in to npm. Run: npm login${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Logged in as: $NPM_USER${NC}"
echo ""

# Step 2: Check for uncommitted changes
echo -e "${YELLOW}[2/6] Checking git status...${NC}"
if [[ -n $(git status --porcelain) ]]; then
  echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
  git status --short
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}✓ Working directory clean${NC}"
fi
echo ""

# Step 3: Install dependencies
echo -e "${YELLOW}[3/6] Installing dependencies...${NC}"
pnpm install --frozen-lockfile 2>/dev/null || pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 4: Build packages
echo -e "${YELLOW}[4/6] Building packages...${NC}"
for pkg in "${PACKAGES[@]}"; do
  echo -e "  Building @yourgpt/$pkg..."
  pnpm --filter "@yourgpt/$pkg" build > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed for @yourgpt/$pkg${NC}"
    exit 1
  fi
  echo -e "${GREEN}  ✓ @yourgpt/$pkg built${NC}"
done
echo ""

# Step 5: Show what will be published
echo -e "${YELLOW}[5/6] Packages to publish:${NC}"
echo ""
for pkg in "${PACKAGES[@]}"; do
  PKG_VERSION=$(node -p "require('./packages/$pkg/package.json').version")
  PKG_NAME=$(node -p "require('./packages/$pkg/package.json').name")
  echo -e "  ${BLUE}$PKG_NAME${NC}@${GREEN}$PKG_VERSION${NC}"

  # Check if version already exists
  PUBLISHED=$(npm view "$PKG_NAME@$PKG_VERSION" version 2>/dev/null)
  if [ "$PUBLISHED" == "$PKG_VERSION" ]; then
    echo -e "    ${YELLOW}⚠️  Version $PKG_VERSION already published${NC}"
  fi
done
echo ""

# Step 6: Confirm and publish
echo -e "${YELLOW}[6/6] Ready to publish${NC}"
read -p "Publish these packages? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}Aborted.${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}Publishing...${NC}"
echo ""

# Publish each package
for pkg in "${PACKAGES[@]}"; do
  PKG_NAME=$(node -p "require('./packages/$pkg/package.json').name")
  PKG_VERSION=$(node -p "require('./packages/$pkg/package.json').version")

  echo -e "  Publishing $PKG_NAME@$PKG_VERSION..."

  # Use pnpm publish to handle workspace: protocol
  pnpm --filter "@yourgpt/$pkg" publish --access public --no-git-checks 2>&1 | grep -E "(notice|error|\+|published)"

  if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo -e "${GREEN}  ✓ $PKG_NAME@$PKG_VERSION published${NC}"
  else
    echo -e "${RED}  ❌ Failed to publish $PKG_NAME${NC}"
    exit 1
  fi
done

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ All packages published successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BLUE}npm:${NC} https://www.npmjs.com/org/yourgpt"
echo ""
