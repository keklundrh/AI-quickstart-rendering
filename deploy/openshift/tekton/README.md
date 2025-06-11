# Tekton Pipeline for AI-Kickstarts Application

This directory contains Tekton pipeline resources for building and deploying the AI-Kickstarts application on OpenShift.

## Prerequisites

1. OpenShift cluster with Tekton installed
2. OpenShift CLI (`oc`) installed and configured
3. Access to the OpenShift registry
4. The following Tekton tasks installed in your cluster:
   - `git-clone`
   - `buildah`
   - `deploy-using-kubectl`

## Pipeline Components

1. `pipeline.yaml`: Defines the main pipeline with three tasks:
   - `fetch-repository`: Clones the git repository
   - `build-and-push`: Builds and pushes the container image
   - `deploy`: Deploys the application using kubectl

2. `pipeline-run.yaml`: Defines how to run the pipeline with specific parameters

3. `service-account.yaml`: Creates a ServiceAccount with necessary permissions to run the pipeline

## Installation

1. Install the required Tekton tasks:
```bash
oc apply -f https://raw.githubusercontent.com/tektoncd/catalog/main/task/git-clone/0.9/git-clone.yaml
oc apply -f https://raw.githubusercontent.com/tektoncd/catalog/main/task/buildah/0.6/buildah.yaml
oc apply -f https://raw.githubusercontent.com/tektoncd/catalog/main/task/kubectl/0.2/kubectl.yaml
```

2. Create the pipeline resources:
```bash
oc apply -f service-account.yaml
oc apply -f pipeline.yaml
```

3. Run the pipeline:
```bash
oc apply -f pipeline-run.yaml
```

## Monitoring the Pipeline

To monitor the pipeline execution:

```bash
# Watch the pipeline run
oc get pipelinerun ai-kickstarts-pipeline-run -w

# View the pipeline run logs
tkn pipelinerun logs ai-kickstarts-pipeline-run -f
```

## Customizing the Pipeline

You can customize the pipeline by modifying the parameters in `pipeline-run.yaml`:

- `git-url`: The URL of your git repository
- `git-revision`: The branch or commit to build
- `image-name`: The name of the image to build
- `image-tag`: The tag for the image

## Troubleshooting

1. If the pipeline fails, check the logs:
```bash
tkn pipelinerun logs ai-kickstarts-pipeline-run
```

2. Verify the ServiceAccount has the correct permissions:
```bash
oc get rolebinding ai-kickstarts-pipeline-rolebinding
```

3. Check if the required Tekton tasks are installed:
```bash
oc get task git-clone buildah kubectl
```