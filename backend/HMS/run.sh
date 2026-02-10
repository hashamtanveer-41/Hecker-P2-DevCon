#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RESET='\033[0m' # No Color
readonly GREEN RED YELLOW CYAN PURPLE RESET

set -e

CLEAR=true

while getopts ":nc" opt; do
    case "$opt" in
    c)
        CLEAR=false
        ;;
    *)
        echo "Usage: $0 [-nc = dont clear [DEFAULT: true]]"
        exit 1
        ;;
    esac
done

if [ "$CLEAR" = true ]; then
    clear
    clear
    clear
    echo -e "${RED}Clearing the screen...${RESET}"
fi

echo -e "${CYAN}Starting local server at localhost:8000${RESET}"

python manage.py runserver
