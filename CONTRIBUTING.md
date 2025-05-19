# Contributing to Greenplum Sizer

Thank you for considering contributing to Greenplum Sizer! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests and ensure your code works
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to your branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

## Development Setup

### Backend (Python/FastAPI)

```bash
cd backend
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Run with Docker
docker-compose up
```

### Frontend (React/TypeScript)

```bash
cd frontend
# Install dependencies
npm install
# Start development server
npm run dev
```

## Pull Request Process

1. Update the README.md or documentation with details of changes if applicable
2. The PR should work properly and pass all checks
3. PRs need to be approved by at least one maintainer

## Coding Standards

### Backend
- Follow PEP 8 style guide
- Write docstrings for functions and classes
- Include type hints

### Frontend
- Follow ESLint configuration
- Use TypeScript types appropriately
- Follow React best practices

## Testing

- Add tests for new features
- Ensure all tests pass before submitting PR

## Questions?

Feel free to open an issue if you have any questions about contributing. 