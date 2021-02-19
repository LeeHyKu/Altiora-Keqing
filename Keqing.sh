#!/usr/bin/bash
JMP () {
  echo "START"
  npm start
  if [ $? -eq 1 ]; then
    echo "RESTART"
    JMP
  else
    echo "EXIT"
  fi
}
JMP