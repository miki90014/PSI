docker build --no-cache --platform=linux/amd64 -t dockermaniac01/backend-cinema-image:latest .



IMAGE_NAME="dockermaniac01/backend-cinema-image"
TAG_DATE=$(date +%Y%m%d%H%M%S)

docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:latest
docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${TAG_DATE}

docker push ${IMAGE_NAME}:latest
docker push ${IMAGE_NAME}:${TAG_DATE}

echo "Newest image ${IMAGE_NAME}:${TAG_DATE}"
echo "Image has been pushed to DockerHub registry"