#!/bin/sh -xe

ENVIRONMENT=$1
AWS_REGION=ap-south-1  # Default AWS region for most operations

case $ENVIRONMENT in
  "stg")
    SECRET_ARN=arn:aws:secretsmanager:$AWS_REGION:294339195387:secret:uw-dev-C4ni7r
    CLUSTER=uw-nonprod
    ECR_URL=294339195387.dkr.ecr.ap-south-1.amazonaws.com
    DEPLOYMENT_FILE=deployment-stg.yaml
    TAG=stg
    ;;
  "prod")
    SECRET_ARN=arn:aws:secretsmanager:$AWS_REGION:294339195387:secret:uw-prod-4LA8es
    CLUSTER=uw-prod
    ECR_URL=294339195387.dkr.ecr.ap-south-1.amazonaws.com
    DEPLOYMENT_FILE=deployment-prod.yaml
    TAG=prod
    ;;
  "prod-dr")
    AWS_REGION=ap-southeast-1  # Set AWS region specifically for prod-dr
    SECRET_ARN=arn:aws:secretsmanager:ap-southeast-1:294339195387:secret:uw-prod-RMBuTZ
    CLUSTER=uw-prod
    ECR_URL=294339195387.dkr.ecr.ap-southeast-1.amazonaws.com
    DEPLOYMENT_FILE=deployment-prod.yaml
    TAG=prod
    ;;
  *)
esac

IMAGE_TAG="$ECR_URL/uw-dashboard-frontend-$TAG"

get_secrets () {
    aws secretsmanager get-secret-value --secret-id $SECRET_ARN --region $AWS_REGION > secrets.json
}

docker_build () {
    git config --global submodule.recurse true
    git submodule add -f -b main git@github.com:Umwelt-Peopletech-Solutions-Inc/umwelt-library.git umwelt-library
    DOCKER_BUILDKIT=1 docker build -t $IMAGE_TAG:${BUILD_NUMBER} . --no-cache
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin "294339195387.dkr.ecr.${AWS_REGION}.amazonaws.com"
    docker push $IMAGE_TAG:${BUILD_NUMBER}
    aws eks --region $AWS_REGION update-kubeconfig --name $CLUSTER
    sed -i "s/<VERSION>/${BUILD_NUMBER}/g" $DEPLOYMENT_FILE
    sed -i "s/<region>/${AWS_REGION}/g" $DEPLOYMENT_FILE
    kubectl apply -f $DEPLOYMENT_FILE
}

cleanup () {
    rm -rf build
}

get_secrets
docker_build
cleanup