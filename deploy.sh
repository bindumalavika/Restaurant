#!/bin/bash

# Create S3 bucket (ignore error if it already exists)
aws s3 mb s3://fpdf-lambda-layer-bucket --region us-east-1 || true

# Upload Lambda layer zip to S3
aws s3 cp infrastructure/lambda-layer/python.zip s3://fpdf-lambda-layer-bucket/python.zip

# Get dynamic AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Deploy CloudFormation stack using dynamic account ID for LabRole
aws cloudformation deploy \
  --template-file infrastructure/restaurant-ordering-IAC.yaml \
  --stack-name restaurant-ordering-stack \
  --capabilities CAPABILITY_NAMED_IAM \
  --role-arn arn:aws:iam::${ACCOUNT_ID}:role/LabRole

# --- Deletion Commands ---

# Delete CloudFormation stack
# aws cloudformation delete-stack --stack-name restaurant-ordering-stack

# Delete S3 buckets (must be emptied before deletion)
# aws s3 rm s3://fpdf-lambda-layer-bucket --recursive
# aws s3 rb s3://fpdf-lambda-layer-bucket
# aws s3 rm s3://restaurant-order-bills --recursive
# aws s3 rb s3://restaurant-order-bills
