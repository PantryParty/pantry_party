#!/usr/bin/env bash

JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home \
  ANDROID_SDK_ROOT=/Users/brianmalinconico/Library/Android/sdk \
  ANDROID_HOME=~/Library/Android/sdk tns debug android $@
