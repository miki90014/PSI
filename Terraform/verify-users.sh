aws configure set region us-east-1

aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_6k8ZaqikQ \
  --username network_admin \
  --password TempPassword123! \
  --permanent

aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_6k8ZaqikQ \
  --username cinema_admin \
  --password TempPassword123! \
  --permanent

aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_6k8ZaqikQ \
  --username employee \
  --password TempPassword123! \
  --permanent

aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_6k8ZaqikQ \
  --username customer \
  --password TempPassword123! \
  --permanent