aws configure set region us-east-1

aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_MCTKMA7l1 \
  --username network_admin \
  --password TempPassword123! \
  --permanent

aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_MCTKMA7l1 \
  --username cinema_admin \
  --password TempPassword123! \
  --permanent

aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_MCTKMA7l1 \
  --username employee \
  --password TempPassword123! \
  --permanent

aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_MCTKMA7l1 \
  --username customer \
  --password TempPassword123! \
  --permanent