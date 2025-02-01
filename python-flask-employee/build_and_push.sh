docker build --no-cache --platform=linux/amd64 -t dockermaniac01/backend-cinema-image:latest \
    --build-arg GIT_USER=mxro01 \
    --build-arg GIT_REPO=devops9-cicd \
    --secret id=github_token,src=token \
    .


