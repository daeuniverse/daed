#!/bin/bash

systemctl daemon-reload

if [ "$(systemctl is-active daed)" == 'active' ]; then
    systemctl restart daed.service
    echo "Restart daed service, it might take a while."
fi
