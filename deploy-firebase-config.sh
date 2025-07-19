#!/bin/bash
# Script to deploy Firebase rules and indexes

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}===== Firebase Configuration Deployment Helper =====${NC}"
echo -e "${GREEN}This script will help you deploy your Firebase rules and indexes.${NC}"
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
echo -e "\n${YELLOW}Step 3:${NC} Enter your Firebase project ID (device-streaming-6189b98b):"
read -p "> " PROJECT_ID

# Set default value if empty
if [ -z "$PROJECT_ID" ]; then
    PROJECT_ID="device-streaming-6189b98b"
    echo "Using default project ID: $PROJECT_ID"
fi

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

# Info about fixing the index error
echo -e "\n${YELLOW}======================${NC}"
echo -e "${YELLOW}INDEX INFORMATION${NC}"
echo -e "${YELLOW}======================${NC}"
echo -e "The error you're seeing is due to a missing composite index in Firestore."
echo -e "You have two options to fix this:"
echo -e "1. Deploy the indexes automatically with this script"
echo -e "2. Create them manually using the URL in the error message:"
echo -e "   ${GREEN}https://console.firebase.google.com/v1/r/project/device-streaming-6189b98b/firestore/indexes${NC}"
echo -e "\nUsing this script is recommended for convenience."
echo -e "\n${YELLOW}Would you like to deploy the indexes now? (y/n)${NC}"
read -p "> " DEPLOY_INDEXES

# Deploy indexes if user chooses to
if [[ $DEPLOY_INDEXES == "y" || $DEPLOY_INDEXES == "Y" ]]; then
    echo -e "\n${YELLOW}Step 5a:${NC} Deploying Firestore indexes..."
    firebase deploy --only firestore:indexes
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to deploy indexes.${NC}"
        echo -e "You can still create them manually using the URL in the error message."
    else
        echo -e "${GREEN}Indexes deployed successfully!${NC}"
    fi
else
    echo -e "\n${YELLOW}Skipping index deployment.${NC}"
    echo -e "Remember to create the indexes manually using the URL in the error message."
fi

# Ask about deploying rules
echo -e "\n${YELLOW}Would you like to deploy the Firestore rules now? (y/n)${NC}"
read -p "> " DEPLOY_RULES

# Deploy rules if user chooses to
if [[ $DEPLOY_RULES == "y" || $DEPLOY_RULES == "Y" ]]; then
    echo -e "\n${YELLOW}Step 5b:${NC} Deploying Firestore rules..."
    
    # Check if the rules file exists
    if [ ! -f "firebase-rules.txt" ]; then
        echo -e "${RED}Rules file not found.${NC}"
        exit 1
    fi
    
    # Copy rules from the text file to firebase.rules.json
    echo "{" > firestore.rules
    echo "  \"rules\": {" >> firestore.rules
    tail -n +2 firebase-rules.txt >> firestore.rules
    echo "  }" >> firestore.rules
    echo "}" >> firestore.rules
    
    # Deploy the rules
    firebase deploy --only firestore:rules
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to deploy rules.${NC}"
    else
        echo -e "${GREEN}Rules deployed successfully!${NC}"
    fi
    
    # Clean up
    rm firestore.rules
else
    echo -e "\n${YELLOW}Skipping rules deployment.${NC}"
fi

echo -e "\n${GREEN}Configuration deployment complete!${NC}"
echo -e "${YELLOW}IMPORTANT:${NC} The current universal rule allows FULL READ/WRITE ACCESS to your Firestore database."
echo -e "This is fine for development but NOT SECURE for production."
echo -e "Before going to production, modify your rules in firebase-rules.txt by:"
echo -e "1. Removing or commenting out the universal rule"
echo -e "2. Running this script again to deploy the more restrictive rules"

exit 0 