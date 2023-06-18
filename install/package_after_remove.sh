#!/bin/bash

if [ "$(systemctl is-active daed)" == 'active' ]; then
    systemctl stop daed.service
    echo "stopping daed service because daed has been removed."
fi

systemctl daemon-reload
