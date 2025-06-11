# Project Metadata Guide

This guide explains how to add metadata to your AI Kickstart project to improve its discoverability and categorization.

## Metadata File

Each project should include a `kickstart.json` file in its root directory. This file contains important metadata about your project that helps users find and understand it.

### Basic Structure

```json
{
  "title": "Your Project Title",
  "description": "A detailed description of your project",
  "categories": ["AI", "Machine Learning", "OpenShift"],
  "tags": ["custom-tag-1", "custom-tag-2"]
}
```

### Required Fields

- `title`: A human-readable title for your project
- `description`: A detailed description of what your project does
- `categories`: An array of categories your project belongs to

### Optional Fields

- `tags`: Custom tags for your project
- `difficulty`: One of "beginner", "intermediate", or "advanced"
- `estimatedTime`: Estimated time to complete the project
- `prerequisites`: List of prerequisites
- `maintainers`: List of project maintainers
- `version`: Project version
- `lastUpdated`: Last update date
- `license`: Project license
- `documentation`: Links to documentation

## Categories

Use the following standard categories when possible:

### AI/ML Categories
- AI
- Machine Learning
- Computer Vision
- Natural Language Processing
- Deep Learning
- Data Science

### Technology Categories
- OpenShift
- Kubernetes
- Python
- TensorFlow
- PyTorch
- Scikit-learn
- Jupyter

### Application Types
- REST API
- Web Application
- CLI Tool

### Process Categories
- Data Processing
- Model Training
- Model Serving
- Model Deployment

## Best Practices

1. **Be Specific**: Choose categories that accurately describe your project
2. **Don't Overcategorize**: Use 3-5 categories that best represent your project
3. **Use Standard Categories**: Stick to the standard categories when possible
4. **Keep Updated**: Update the metadata when your project changes
5. **Be Descriptive**: Write clear, concise descriptions

## Example

Here's an example of a well-structured metadata file:

```json
{
  "title": "Image Classification with TensorFlow",
  "description": "A ready-to-run example of image classification using TensorFlow and OpenShift",
  "categories": [
    "AI",
    "Computer Vision",
    "TensorFlow",
    "OpenShift",
    "Model Training"
  ],
  "tags": ["image-classification", "transfer-learning"],
  "difficulty": "intermediate",
  "estimatedTime": "2 hours",
  "prerequisites": [
    "OpenShift cluster",
    "Python 3.8+",
    "Basic knowledge of machine learning"
  ]
}
```

## Validation

The metadata file will be validated when your project is indexed. Make sure to:

1. Use valid JSON syntax
2. Include all required fields
3. Use standard categories when possible
4. Keep descriptions clear and concise

## Need Help?

If you need help with your metadata file or have suggestions for new categories, please open an issue in the repository.