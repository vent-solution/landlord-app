#!/bin/bash

cd /var/www/html/landlord-app

ls -la

cp -arp build/. . && rm -rf build 

systemctl reload nginx