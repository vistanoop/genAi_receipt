# Project Issues and Problems

This document lists all the issues, problems, and areas for improvement identified in the AgriScoreX project. These issues have been identified but **NOT corrected** as per requirements.

---

## Table of Contents
1. [Critical Security Issues](#critical-security-issues)
2. [Configuration and Environment Issues](#configuration-and-environment-issues)
3. [Code Quality and Best Practices](#code-quality-and-best-practices)
4. [Missing Documentation](#missing-documentation)
5. [Dependency and Version Management](#dependency-and-version-management)
6. [Testing Infrastructure](#testing-infrastructure)
7. [Error Handling and Validation](#error-handling-and-validation)
8. [Build and Deployment Issues](#build-and-deployment-issues)
9. [Architecture and Design Issues](#architecture-and-design-issues)
10. [Data Management Issues](#data-management-issues)

---

## Critical Security Issues

### 1. CORS Configuration Too Permissive
**Location**: `server/main.py` (lines 18-23)
**Severity**: HIGH
- CORS is set to `allow_origins=["*"]` which allows any domain to access the API
- This exposes the API to Cross-Site Request Forgery (CSRF) attacks
- Should be restricted to specific allowed origins only
- `allow_credentials=True` combined with wildcard origins is a security risk

### 2. Environment Variables Committed to Repository
**Location**: `client/.env`
**Severity**: MEDIUM
- The `.env` file contains API URL configuration and is committed to version control
- While it only contains public URLs currently, this is a bad practice
- May lead to accidental exposure of secrets in the future
- Should be in `.gitignore` with a `.env.example` template instead

### 3. No API Authentication or Rate Limiting (Server-Side)
**Location**: `server/main.py`
**Severity**: HIGH
- The `/assess` endpoint has no authentication mechanism
- No server-side rate limiting implemented
- Only client-side rate limiting exists (easily bypassed)
- API can be abused by any client making unlimited requests
- Could lead to resource exhaustion or abuse

### 4. Hardcoded Sensitive Data
**Location**: `server/context/farmer_db.py`
**Severity**: MEDIUM
- Farmer database with personal information (names, IDs, credit history) is hardcoded
- Should be stored in a proper database with encryption
- No data protection or privacy measures in place

### 5. Model File Security
**Location**: `server/model/model.pkl`
**Severity**: MEDIUM
- Pickle files can execute arbitrary code when loaded
- No validation or signature verification of the model file
- Could be exploited if an attacker replaces the model file
- Consider using safer serialization formats (joblib, ONNX)

### 6. No Input Sanitization for Text Fields
**Location**: `server/main.py`, `client/src/components/dashboard.tsx`
**Severity**: MEDIUM
- While there is regex validation for farmer_id, other text inputs are not sanitized
- Potential for injection attacks if data is logged or stored
- Location string is only title-cased, not properly validated

---

## Configuration and Environment Issues

### 7. Missing .gitignore Files
**Location**: Root directory, `server/` directory
**Severity**: MEDIUM
- No `.gitignore` at project root
- Python cache files (`__pycache__`) are being tracked by git
- No `.gitignore` in server directory
- Build artifacts and cache files pollute the repository

### 8. Incorrect Directory Structure in README
**Location**: `README.md` (lines 50, 57)
**Severity**: MEDIUM
- README instructions reference `src/client` and `src/server`
- Actual structure is `client` and `server` (no `src` parent directory)
- Users following the README will encounter errors

### 9. Missing Environment Configuration Documentation
**Location**: Project-wide
**Severity**: LOW
- No `.env.example` file for either client or server
- No documentation of required environment variables
- No guidance on local vs production configuration

### 10. Empty package-lock.json at Root
**Location**: `/package-lock.json`
**Severity**: LOW
- Root level has a package-lock.json with no packages
- Suggests attempted monorepo setup that wasn't completed
- Could confuse dependency management

### 11. Missing Python Virtual Environment Setup
**Location**: Documentation
**Severity**: MEDIUM
- README doesn't mention creating a virtual environment
- No `requirements-dev.txt` for development dependencies
- Could lead to global Python package pollution

---

## Code Quality and Best Practices

### 12. Commented-Out Error Handling
**Location**: `server/main.py` (lines 31, 147)
**Severity**: MEDIUM
- Error messages are commented out with `# print()`
- Makes debugging difficult in production
- Should use proper logging framework instead

### 13. No Logging Framework
**Location**: `server/main.py` and all Python files
**Severity**: MEDIUM
- Application uses print statements (mostly commented out)
- No structured logging
- No log levels (DEBUG, INFO, WARNING, ERROR)
- Difficult to troubleshoot production issues

### 14. Hardcoded Magic Numbers
**Location**: `server/model/decision_engine.py` (lines 6-8)
**Severity**: LOW
- Risk thresholds are hardcoded: 0.30, 0.55, 0.85
- Should be configurable via environment or config file
- Makes it hard to tune without code changes

### 15. Hardcoded Season Value
**Location**: `server/main.py` (line 73)
**Severity**: MEDIUM
- Current season is hardcoded to "kharif"
- Should be determined dynamically based on current date
- Leads to incorrect risk assessment during other seasons

### 16. Inconsistent Naming Conventions
**Location**: Multiple files
**Severity**: LOW
- Mix of snake_case and camelCase in some areas
- `loan_amount` vs `loanAmount` in different contexts
- Python files use snake_case (correct) but some inconsistencies in data structures

### 17. No Type Hints in Python Functions
**Location**: Most Python files
**Severity**: LOW
- Only some functions have type hints
- `decision_engine.py` has minimal type information
- Makes code harder to maintain and understand
- Missing return type annotations

### 18. Duplicate Code in Preprocessing
**Location**: `server/utils/encoders.py`, `server/model/train_model.py`
**Severity**: LOW
- Feature lists may get out of sync
- Risk of training/inference mismatch if not careful

### 19. No Code Comments for Complex Logic
**Location**: `server/data/generate_data.py` (lines 27-52)
**Severity**: LOW
- Risk calculation logic is complex but undocumented
- Hard to understand the business logic without reading code carefully

### 20. Missing Input Validation in Backend
**Location**: `server/main.py`
**Severity**: MEDIUM
- While Pydantic validates types, there's no range validation
- No check for negative land_size_acres
- No validation of reasonable loan amounts
- Most validation only happens on frontend (can be bypassed)

---

## Missing Documentation

### 21. No API Documentation Beyond Auto-Generated
**Location**: Project root
**Severity**: MEDIUM
- Only FastAPI auto-generated docs available
- No README section explaining API usage
- No examples of request/response formats
- No error code documentation

### 22. No Architecture Documentation
**Location**: Project root
**Severity**: MEDIUM
- No architecture diagrams
- No explanation of system design
- No documentation of ML model approach
- No explanation of risk calculation methodology

### 23. No Contributing Guidelines
**Location**: Project root
**Severity**: LOW
- No CONTRIBUTING.md file
- No code style guidelines documented
- No pull request template
- No issue templates

### 24. No License File
**Location**: Project root
**Severity**: HIGH
- No LICENSE or LICENSE.md file
- Unclear if project is open source
- Legal ambiguity for users and contributors
- Cannot be legally used or modified without license

### 25. Missing Code of Conduct
**Location**: Project root
**Severity**: LOW
- No CODE_OF_CONDUCT.md
- No community guidelines

### 26. No Changelog
**Location**: Project root
**Severity**: LOW
- No CHANGELOG.md tracking version history
- Difficult to track what changed between versions

### 27. Missing Development Setup Guide
**Location**: README.md
**Severity**: MEDIUM
- No explanation of project structure
- No guidance on running tests
- No development workflow documentation
- No explanation of how to train the model

### 28. No Inline Documentation
**Location**: Multiple files
**Severity**: LOW
- Most Python files lack docstrings
- No module-level documentation
- Functions missing parameter and return documentation

---

## Dependency and Version Management

### 29. No Version Pinning in requirements.txt
**Location**: `server/requirements.txt`
**Severity**: HIGH
- All dependencies are unpinned (e.g., `pandas` instead of `pandas==1.5.3`)
- Could lead to breaking changes when dependencies update
- Not reproducible builds
- Different environments may have different versions

### 30. Missing Python Version Specification
**Location**: Project root
**Severity**: MEDIUM
- No `.python-version` or `pyproject.toml` specifying Python version
- README doesn't mention required Python version
- Could lead to compatibility issues

### 31. Outdated or Potentially Vulnerable Dependencies
**Location**: `server/requirements.txt`, `client/package.json`
**Severity**: HIGH
- Dependencies versions not specified, so can't verify if vulnerable
- No automated dependency scanning
- No Dependabot or similar tool configured

### 32. Missing Development Dependencies
**Location**: `server/`
**Severity**: MEDIUM
- No `requirements-dev.txt` for development tools
- No mention of linting tools (pylint, flake8, black)
- No type checking tools (mypy)

### 33. Client Has ESLint But Can't Run It
**Location**: `client/package.json`
**Severity**: MEDIUM
- ESLint is in package.json scripts but not installed in node_modules
- Running `npm run lint` fails with "eslint: not found"
- Suggests incomplete setup or node_modules not committed (correct) but setup not documented

---

## Testing Infrastructure

### 34. No Unit Tests
**Location**: Entire project
**Severity**: HIGH
- No test files found (`test_*.py`, `*_test.py`)
- No testing framework configured (pytest, unittest)
- No test coverage measurement
- Critical business logic is untested

### 35. No Integration Tests
**Location**: Entire project
**Severity**: HIGH
- No tests for API endpoints
- No tests for model prediction pipeline
- No tests for data preprocessing

### 36. No Frontend Tests
**Location**: `client/`
**Severity**: MEDIUM
- No React component tests
- No testing library configured (Jest, React Testing Library)
- No E2E tests (Playwright, Cypress)

### 37. No CI/CD Pipeline
**Location**: `.github/workflows/`
**Severity**: MEDIUM
- No GitHub Actions workflows
- No automated testing on pull requests
- No automated deployment
- No quality gates

### 38. No Test Data
**Location**: `server/`
**Severity**: MEDIUM
- No test fixtures or sample data for testing
- Would need to rely on generated data for testing

---

## Error Handling and Validation

### 39. Generic Error Handling
**Location**: `server/main.py` (lines 27-34)
**Severity**: MEDIUM
- Catches all exceptions with generic `Exception`
- Doesn't differentiate between different error types
- Engine/booster set to `None` on error but may cause runtime errors later

### 40. Poor Error Messages
**Location**: `server/main.py` (line 61)
**Severity**: LOW
- Error messages could be more user-friendly
- "Location not supported" doesn't suggest valid alternatives
- No error codes for programmatic handling

### 41. No Validation Error Details
**Location**: `server/main.py`
**Severity**: LOW
- Pydantic validation errors return generic 422 status
- No custom error formatting for better user experience

### 42. Missing Null/None Checks
**Location**: `client/src/components/Report.tsx` (line 14)
**Severity**: MEDIUM
- While there's a check for `!data`, component could be more defensive
- Individual fields aren't validated before use
- Could crash if API returns unexpected structure

### 43. No Timeout Configuration
**Location**: `client/src/components/dashboard.tsx`
**Severity**: LOW
- API calls have no timeout configured
- Could hang indefinitely if backend is slow
- No loading state timeout

---

## Build and Deployment Issues

### 44. No Docker Configuration
**Location**: Project root
**Severity**: MEDIUM
- No Dockerfile for server
- No Dockerfile for client
- No docker-compose.yml for local development
- Makes deployment inconsistent across environments

### 45. No Health Check Endpoint Monitoring
**Location**: `server/main.py`
**Severity**: LOW
- Health check endpoint exists but doesn't verify dependencies
- Doesn't check if model is loaded
- Doesn't check database connectivity (when using real DB)

### 46. Build Instructions Incomplete
**Location**: `README.md`
**Severity**: MEDIUM
- No mention of building the client for production
- No guidance on server deployment
- No environment-specific configuration guidance

### 47. No Production Configuration
**Location**: `server/main.py`
**Severity**: MEDIUM
- No differentiation between development and production settings
- Debug settings might be enabled in production
- No production-ready WSGI server configuration documented

### 48. Missing Static File Serving Configuration
**Location**: `server/`
**Severity**: LOW
- If serving frontend from backend, no configuration present
- No guidance on serving built static files

---

## Architecture and Design Issues

### 49. Tight Coupling Between Components
**Location**: `server/main.py`
**Severity**: MEDIUM
- Main file directly imports and initializes all components
- Hard to test individual components
- Difficult to swap implementations

### 50. No Dependency Injection
**Location**: `server/main.py`
**Severity**: LOW
- Components are instantiated globally
- Makes testing difficult
- Hard to provide mock implementations

### 51. Business Logic in Route Handler
**Location**: `server/main.py` (lines 47-150)
**Severity**: MEDIUM
- `/assess` endpoint contains extensive business logic
- Should be extracted to service layer
- Violates single responsibility principle

### 52. No Database Abstraction Layer
**Location**: `server/context/farmer_db.py`
**Severity**: MEDIUM
- Direct dictionary access
- When moving to real database, will require extensive refactoring
- No repository pattern

### 53. Mixed Concerns in Decision Engine
**Location**: `server/model/decision_engine.py`
**Severity**: LOW
- Combines model prediction with business rules
- Threshold logic could be separate
- Makes it harder to change decision rules

### 54. Hardcoded File Paths
**Location**: Multiple files
**Severity**: MEDIUM
- Paths like `"model/model.pkl"`, `"data/farmers_train.csv"` are hardcoded
- Will break if file structure changes
- Should use Path objects or environment variables

### 55. No Caching Strategy
**Location**: `server/main.py`
**Severity**: LOW
- Model loaded on every request (actually on startup, but no caching of predictions)
- Region data, farmer data could be cached
- No Redis or similar caching layer

### 56. Missing API Versioning
**Location**: `server/main.py`
**Severity**: MEDIUM
- API endpoints have no versioning (e.g., `/v1/assess`)
- Breaking changes would affect all clients
- No backwards compatibility strategy

---

## Data Management Issues

### 57. Training Data Committed to Repository
**Location**: `server/data/farmers_train.csv`
**Severity**: MEDIUM
- 436KB CSV file committed to git
- Makes repository unnecessarily large
- Should be stored externally (S3, database, etc.)
- Git is not designed for large data files

### 58. Model File Committed to Repository
**Location**: `server/model/model.pkl`
**Severity**: MEDIUM
- Binary model file (3.2KB) in git
- Should be versioned separately (DVC, MLflow, etc.)
- No model versioning or tracking strategy
- Can't compare different model versions easily

### 59. No Data Validation on Training Data
**Location**: `server/data/generate_data.py`
**Severity**: LOW
- Generated data isn't validated
- Could create invalid training examples
- No schema validation

### 60. Synthetic Data Not Representative
**Location**: `server/data/generate_data.py`
**Severity**: MEDIUM
- Uses completely random data generation
- May not reflect real-world distributions
- Risk scoring logic is simplistic
- Could lead to poor model performance on real data

### 61. No Data Privacy Measures
**Location**: `server/context/farmer_db.py`
**Severity**: HIGH
- Personal information stored in plain text
- No encryption at rest
- No data anonymization
- Violates data protection best practices (GDPR, etc.)

### 62. Limited Location Support
**Location**: `server/context/region_profiles.py`
**Severity**: LOW
- Only 10 cities supported
- No fallback or similar region matching
- Limits usability for broader geography

### 63. Missing Data Backup Strategy
**Location**: Project-wide
**Severity**: MEDIUM
- No backup strategy documented
- No database backup procedures
- Could lead to data loss

### 64. No Data Migration Strategy
**Location**: Project-wide
**Severity**: LOW
- No database migration tools (Alembic, etc.)
- Will be problematic when moving from hardcoded data to real database
- No schema versioning

---

## Performance Issues

### 65. SHAP Explainer Performance
**Location**: `server/booster/credit_booster.py`
**Severity**: MEDIUM
- KernelExplainer is slow for online inference
- Each suggestion calculation requires SHAP computation
- Could cause timeout issues with high traffic
- Should consider TreeExplainer or caching

### 66. No Response Compression
**Location**: `server/main.py`
**Severity**: LOW
- No gzip compression configured
- Larger response payloads than necessary
- Could improve load times

### 67. No Database Connection Pooling
**Location**: Future concern
**Severity**: MEDIUM
- When migrating to real database, will need connection pooling
- Not documented or planned for

### 68. Synchronous API Design
**Location**: `server/main.py`
**Severity**: LOW
- All operations are synchronous
- Could benefit from async/await for I/O operations
- May not scale well under high load

---

## Monitoring and Observability Issues

### 69. No Application Monitoring
**Location**: Project-wide
**Severity**: HIGH
- No APM (Application Performance Monitoring) tool
- No error tracking (Sentry, Rollbar, etc.)
- Can't track application health in production
- No alerts for failures

### 70. No Metrics Collection
**Location**: Project-wide
**Severity**: MEDIUM
- No business metrics tracking
- Can't measure approval rates, average risk scores, etc.
- No model performance monitoring
- No drift detection

### 71. No Request/Response Logging
**Location**: `server/main.py`
**Severity**: MEDIUM
- No logging of API requests
- Can't audit or trace user actions
- Difficult to debug production issues

### 72. No Model Performance Tracking
**Location**: `server/model/`
**Severity**: HIGH
- No tracking of model predictions vs actual outcomes
- No feedback loop for model improvement
- Can't detect model degradation
- No A/B testing capability

---

## Frontend-Specific Issues

### 73. API URL in Frontend Code
**Location**: `client/.env`
**Severity**: LOW
- While in .env, should use build-time environment variables properly
- Different builds needed for different environments

### 74. No Error Boundary
**Location**: `client/src/`
**Severity**: MEDIUM
- No React Error Boundary component
- Entire app could crash from a single component error
- Poor user experience on errors

### 75. No Loading States for Data
**Location**: `client/src/components/Report.tsx`
**Severity**: LOW
- Report page doesn't show loading state
- Depends entirely on React Router state
- Could show stale data

### 76. Hardcoded UI Text
**Location**: Multiple components
**Severity**: LOW
- No internationalization (i18n) support
- All text hardcoded in English
- Difficult to support multiple languages

### 77. No Form State Management
**Location**: `client/src/components/dashboard.tsx`
**Severity**: LOW
- Complex form state managed manually
- Could benefit from form library (React Hook Form, Formik)
- Error handling is manual

### 78. Missing Accessibility Features
**Location**: `client/src/components/`
**Severity**: MEDIUM
- No ARIA labels
- No keyboard navigation considerations
- May not be screen reader friendly
- No focus management

### 79. No Progressive Web App Features
**Location**: `client/`
**Severity**: LOW
- No service worker
- No offline support
- No installability
- Could improve mobile experience

### 80. Console Errors Not Handled
**Location**: `client/src/`
**Severity**: LOW
- No global error handler for console errors
- Development errors might leak to production

---

## Miscellaneous Issues

### 81. Inconsistent Code Formatting
**Location**: Project-wide
**Severity**: LOW
- No formatter configured (Prettier for JS/TS, Black for Python)
- Inconsistent spacing and line lengths
- Mix of quote styles in some files

### 82. No Pre-commit Hooks
**Location**: `.git/hooks/`
**Severity**: LOW
- No pre-commit hooks to enforce code quality
- No automatic formatting on commit
- No lint checks before commit

### 83. Repository Name Mismatch
**Location**: Repository metadata
**Severity**: LOW
- Repository name is `genAi_receipt` but project is about credit decisioning
- Name suggests receipt processing, not loan assessment
- Could confuse new contributors

### 84. Incomplete Git History
**Location**: Git log
**Severity**: LOW
- Only 2 commits in history (shallow clone or squashed)
- No meaningful commit messages
- Can't track evolution of the project

### 85. No Security Policy
**Location**: `SECURITY.md`
**Severity**: MEDIUM
- No SECURITY.md file
- No vulnerability reporting guidelines
- No security contact information

### 86. Missing Deployment Documentation
**Location**: README.md
**Severity**: MEDIUM
- No instructions for deploying to Render
- No instructions for deploying to Vercel
- Users can't replicate the deployment

### 87. No Rollback Strategy
**Location**: Documentation
**Severity**: MEDIUM
- No documented rollback procedure
- If deployment fails, unclear how to revert
- Could lead to extended downtime

### 88. No Feature Flags
**Location**: Project-wide
**Severity**: LOW
- No feature flag system
- Can't gradually roll out new features
- Can't quickly disable problematic features

### 89. No Rate Limiting Headers
**Location**: `server/main.py`
**Severity**: LOW
- No X-RateLimit-* headers
- Clients don't know their rate limit status
- Can't implement intelligent retry logic

### 90. Missing Browser Compatibility Info
**Location**: README.md
**Severity**: LOW
- No documentation of supported browsers
- No polyfills or compatibility layer mentioned
- Users don't know if their browser is supported

---

## Summary Statistics

- **Total Issues Found**: 90
- **Critical Security Issues**: 6
- **High Severity Issues**: 8
- **Medium Severity Issues**: 37
- **Low Severity Issues**: 39

## Priority Recommendations

If these issues were to be addressed, the recommended priority order would be:

1. **Immediate (Security)**:
   - Fix CORS configuration
   - Implement API authentication
   - Remove committed secrets/sensitive data
   - Pin dependency versions

2. **High Priority (Stability)**:
   - Add comprehensive testing
   - Implement proper error handling and logging
   - Add missing documentation (README fixes, API docs)
   - Add proper .gitignore files

3. **Medium Priority (Quality)**:
   - Set up CI/CD pipeline
   - Add monitoring and observability
   - Implement proper data management
   - Separate business logic from routes

4. **Low Priority (Nice-to-have)**:
   - Add code formatting tools
   - Improve frontend accessibility
   - Add internationalization
   - Implement caching strategies

---

**Note**: This document is for informational purposes only. None of these issues have been corrected in the codebase.
