#!/usr/bin/env bash
cd /home/ec2-user/chronowiz-backend/
aws s3 cp s3://chronowiz-dev-backend-admin/.env .
npm install
npm install pm2 -g