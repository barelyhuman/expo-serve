#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PROJECT_DIR="${SCRIPT_DIR}/.."
APP_NAME=$(node -p -e "require('${PROJECT_DIR}/package.json').name")

EXPO_PLIST="ios/${APP_NAME}/Supporting/Expo.plist"
RESULT=$(/usr/libexec/PlistBuddy -c "SET EXUpdatesURL $1" ${PROJECT_DIR}/${EXPO_PLIST} 2>&1)
if [ $? -eq 0 ]; then
  echo "Updated EXUpdatesURL in ${EXPO_PLIST} to $1"
else
  echo "Error occurred: ${RESULT}"
fi

ANDROID_MANIFEST="android/app/src/main/AndroidManifest.xml"
RESULT=$(sed -i '' 's/expo.modules.updates.EXPO_UPDATE_URL" android:value=".*"/expo.modules.updates.EXPO_UPDATE_URL" android:value="'$1'"/' ${PROJECT_DIR}/${ANDROID_MANIFEST} 2>&1)
if [ $? -eq 0 ]; then
  echo "Updated EXPO_UPDATE_URL in $ANDROID_MANIFEST to $1"
else
  echo "Error occurred: ${RESULT}"
fi
