# Deploying AI Kickstarts App to OpenShift

This directory contains the OpenShift configuration files needed to deploy the AI Kickstarts application.

## Prerequisites

1. OpenShift CLI (`oc`) installed
2. Access to an OpenShift cluster
3. GitHub Personal Access Token with required permissions
4. OpenShift project/namespace created

## Deployment Steps

1. Login to your OpenShift cluster:
   ```bash
   oc login --token=<your-token> --server=<your-cluster-url>
   ```

2. Create a new project (if not exists):
   ```bash
   oc new-project ai-kickstarts
   ```

3. Create the GitHub token secret:
   ```bash
   # Replace <your-github-token> with your actual GitHub token
   oc create secret generic github-token \
     --from-literal=token=<your-github-token>
   ```

4. Create the OpenShift resources:
   ```bash
   # Apply all OpenShift configurations
   oc apply -f deploy/openshift/
   ```

5. Start the build:
   ```bash
   oc start-build ai-kickstarts-app
   ```

6. Monitor the deployment:
   ```bash
   # Watch the build progress
   oc get builds -w

   # Watch the pods
   oc get pods -w

   # Check the deployment status
   oc get deployment ai-kickstarts-app
   ```

7. Get the application URL:
   ```bash
   oc get route ai-kickstarts-app
   ```

## Configuration

The deployment uses the following environment variables that can be customized:

- `IMAGE_REGISTRY`: Your OpenShift registry (default: image-registry.openshift-image-registry.svc:5000)
- `IMAGE_NAMESPACE`: Your OpenShift project name
- `IMAGE_TAG`: Image tag (default: latest)
- `GIT_REPO_URL`: Your Git repository URL
- `GIT_REF`: Git branch or tag to build from
- `GITHUB_WEBHOOK_SECRET`: Secret for GitHub webhook (if using webhook triggers)

## Maintenance

### Updating the Application

1. Push changes to your Git repository
2. The build will automatically trigger if webhooks are configured
3. Or manually trigger a new build:
   ```bash
   oc start-build ai-kickstarts-app
   ```

### Scaling

To scale the application:
```bash
oc scale deployment ai-kickstarts-app --replicas=<number>
```

### Logs

View application logs:
```bash
oc logs -f deployment/ai-kickstarts-app
```

### Troubleshooting

1. Check build logs:
   ```bash
   oc logs -f build/ai-kickstarts-app-<build-number>
   ```

2. Check pod status:
   ```bash
   oc describe pod <pod-name>
   ```

3. Check deployment status:
   ```bash
   oc describe deployment ai-kickstarts-app
   ```

## Security Notes

- The GitHub token is stored as a Kubernetes secret
- The application is exposed via HTTPS with edge termination
- Resource limits are set to prevent resource exhaustion
- Readiness and liveness probes are configured for health checking