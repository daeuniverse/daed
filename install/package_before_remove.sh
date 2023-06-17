#!/bin/bash

if [ "$(systemctl is-active daed)" == 'active' ]; then
    systemctl stop daed.service
    echo "stopped daed service, daed will be removed."
fi
