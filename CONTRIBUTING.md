# Contributing to LawGenie AI

Thanks for your interest in contributing.
This guide explains how to set up, propose changes, and submit pull requests.

## Development Setup

1. Fork and clone the repository.
2. Create a new branch from `main`.
3. Set up Backend and Frontend environments as documented in `README.md`.

## Branch and Commit Guidelines

- Use descriptive branch names, for example: `feature/chat-history-ui` or `fix/search-null-check`.
- Keep commits focused and atomic.
- Write clear commit messages in imperative form.

Examples:

- `feat: add training endpoint validation`
- `fix: handle missing token in chat history`
- `docs: update backend setup instructions`

## Coding Guidelines

- Follow existing project structure and naming conventions.
- Prefer small, readable functions.
- Avoid unrelated refactors in feature/fix pull requests.
- Keep secrets and credentials out of source control.

## Testing and Validation

Before opening a pull request:

1. Start backend and verify no startup errors.
2. Run frontend lint checks.
3. Validate affected user flows manually (chat, search, train where relevant).

Suggested commands:

```bash
# Backend
cd Backend
uvicorn main:app --reload

# Frontend
cd Frontend
npm run lint
npm run build
```

## Pull Request Checklist

- The change is scoped and documented.
- Any new environment variables are documented.
- README or related docs are updated if behavior changed.
- Screenshots or sample API responses are provided for UI/API changes.

## Reporting Issues

When filing a bug report, include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Error logs or screenshots
- Environment details (OS, Python, Node versions)

## Security Issues

Please do not open public issues for security vulnerabilities.
Follow the reporting process in `SECURITY.md`.
