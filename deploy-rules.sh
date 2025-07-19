#!/bin/bash
# Script to help deploy Firebase rules

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}===== Firebase Rules Deployment Helper =====${NC}"
echo -e "${GREEN}This script will help you deploy your Firebase rules.${NC}"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}Firebase CLI is not installed.${NC}"
    echo -e "Please install it by running: ${YELLOW}npm install -g firebase-tools${NC}"
    exit 1
fi

# Check if user is logged in
echo -e "${YELLOW}Step 1:${NC} Checking if you're logged in to Firebase..."
firebase login:list &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}You're not logged in to Firebase.${NC}"
    echo -e "Please log in by running: ${YELLOW}firebase login${NC}"
    exit 1
else
    echo -e "${GREEN}You're logged in to Firebase.${NC}"
fi

# List projects
echo -e "\n${YELLOW}Step 2:${NC} Available Firebase projects:"
firebase projects:list

# Ask for project ID
echo -e "\n${YELLOW}Step 3:${NC} Enter your Firebase project ID from the list above:"
read -p "> " PROJECT_ID

# Verify project ID
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}No project ID provided.${NC}"
    exit 1
fi

# Set the project
echo -e "\n${YELLOW}Step 4:${NC} Setting the active project to $PROJECT_ID..."
firebase use $PROJECT_ID
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to set the project.${NC}"
    exit 1
fi

# Deploy rules
echo -e "\n${YELLOW}Step 5:${NC} Deploying Firestore rules from firebase-rules.txt..."
echo -e "${GREEN}This will deploy the rules in firebase-rules.txt to your Firebase project.${NC}"
echo -e "Press Enter to continue or Ctrl+C to cancel..."
read

# Run the deployment
firebase deploy --only firestore:rules

echo -e "\n${GREEN}Deployment complete!${NC}"
echo -e "${YELLOW}IMPORTANT:${NC} The current rules allow full read/write access for development."
echo -e "Remember to update the rules before going to production by:"
echo -e "1. Removing the universal rule in firebase-rules.txt"
echo -e "2. Running this script again to deploy the more restrictive rules"
echo -e "\nThank you for using the Firebase Rules Deployment Helper!"

exit 0 