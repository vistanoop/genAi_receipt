# Project Issues Report

This document contains all identified issues in the FundingSense project. Each issue should be reported via GitHub Issues with the following details:

---

## Issue #1: Insecure CORS Configuration (Security - Critical)

### Description
The backend application has an overly permissive CORS (Cross-Origin Resource Sharing) configuration that allows requests from any origin (`ALLOWED_ORIGINS = "*"`). This creates a significant security vulnerability allowing any website to make requests to the API.

### Steps to Reproduce
1. Navigate to `backend/app/config/settings.py`
2. Observe line 16: `ALLOWED_ORIGINS: str = "*"`
3. Check `backend/app/main.py` line 48 where this is used in CORS middleware
4. Any malicious website can make authenticated requests to your API

### Observed Impact
- **Security Risk**: Malicious websites can make cross-origin requests to the API
- **Data Exposure**: Potential for CSRF attacks and unauthorized data access
- **Compliance Issues**: Violates security best practices and may fail security audits

### Supporting Evidence
**File**: `backend/app/config/settings.py` (Line 16)
```python
ALLOWED_ORIGINS: str = "*"
```

**File**: `backend/app/main.py` (Lines 46-52)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.ALLOWED_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Issue #2: Missing Dependency Version Pinning (Reliability - High)

### Description
The `requirements.txt` file uses flexible version specifications (>=) instead of pinned versions. This can lead to breaking changes when dependencies are updated, making builds unreliable and non-reproducible.

### Steps to Reproduce
1. Open `backend/requirements.txt`
2. Notice all dependencies use `>=` version specifiers (e.g., `fastapi>=0.116.1`)
3. Run `pip install -r requirements.txt` at different times may result in different versions being installed
4. This can cause compatibility issues and unexpected behavior

### Observed Impact
- **Build Inconsistency**: Different environments may have different package versions
- **Breaking Changes**: Automatic updates may introduce incompatible changes
- **Debugging Difficulty**: Hard to reproduce issues across different deployments
- **Security Risks**: Vulnerable versions might be installed without awareness

### Supporting Evidence
**File**: `backend/requirements.txt`
```
fastapi>=0.116.1
uvicorn>=0.34.0
pydantic>=2.11.0
pydantic-settings>=2.10.1
python-dotenv>=1.1.1
google-generativeai>=0.8.5
google-genai>=0.1.0
chromadb>=0.5.0
```
All 13 dependencies lack exact version pinning (should use `==` not `>=`).

---

## Issue #3: Missing Test Suite (Code Quality - High)

### Description
The project completely lacks automated tests. There are no unit tests, integration tests, or end-to-end tests for either backend or frontend code. This makes it impossible to verify code correctness and prevent regressions.

### Steps to Reproduce
1. Search for test files: `find . -name "*test*.py" -o -name "*.test.ts*"`
2. Result: No test files found
3. Check `package.json` for test scripts - only has `lint` but no `test` command
4. Backend has no `pytest` or similar testing framework in requirements.txt

### Observed Impact
- **Quality Assurance**: No automated way to verify functionality
- **Regression Risk**: Changes may break existing features without detection
- **Confidence**: Difficult to refactor or modify code safely
- **CI/CD**: Cannot implement automated testing pipelines
- **Maintenance**: Higher risk of introducing bugs during development

### Supporting Evidence
**Search Results**:
```bash
$ find . -name "*test*.py" -o -name "*.test.ts*"
# No results
```

**Backend**: No testing framework in `requirements.txt`
**Frontend**: `package.json` has no test dependencies (jest, vitest, etc.)

---

## Issue #4: Missing LICENSE File (Legal - High)

### Description
The repository does not include a LICENSE file, making the legal status of the code unclear. Without an explicit license, the code is under default copyright law and cannot be legally used, modified, or distributed by others.

### Steps to Reproduce
1. List files in repository root: `ls -la | grep -i license`
2. Result: No LICENSE file found
3. Check README.md for license information - none mentioned
4. This makes the project's usage terms unclear

### Observed Impact
- **Legal Uncertainty**: Users don't know if they can legally use the software
- **Adoption Barrier**: Organizations may avoid using unlicensed software
- **Contribution Issues**: Contributors unclear on terms of their contributions
- **Open Source Status**: Cannot be considered truly open source without a license
- **Commercial Risk**: Potential legal issues if code is used commercially

### Supporting Evidence
```bash
$ ls -la | grep -i license
# No results - LICENSE file is missing
```

---

## Issue #5: Hardcoded Debug Mode Enabled (Security - Medium)

### Description
The application has debug mode permanently enabled in the code (`DEBUG: bool = True`) rather than being configurable via environment variables. This can expose sensitive information in production environments.

### Steps to Reproduce
1. Open `backend/app/config/settings.py`
2. See line 8: `DEBUG: bool = True`
3. Open `backend/app/main.py` line 42: `debug=settings.DEBUG`
4. Debug mode is always enabled, even in production deployments

### Observed Impact
- **Information Disclosure**: Debug mode can expose stack traces and sensitive data
- **Security Risk**: Attackers can gain insights into application internals
- **Performance**: Debug mode typically has performance overhead
- **Best Practices**: Production deployments should never run in debug mode

### Supporting Evidence
**File**: `backend/app/config/settings.py` (Line 8)
```python
DEBUG: bool = True
```

**File**: `backend/app/main.py` (Line 42)
```python
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    debug=settings.DEBUG,  # Always True
    lifespan=lifespan
)
```

---

## Issue #6: SQL Injection Risk via String Formatting (Security - Critical)

### Description
The storage layer uses SQL queries with potential injection risks. While using parameterized queries in some places, there's inconsistent usage and potential vulnerabilities in database operations.

### Steps to Reproduce
1. Open `backend/app/core/storage.py`
2. Review SQL query construction methods
3. Some queries use parameterized statements correctly
4. Verify all user inputs are properly sanitized before database operations

### Observed Impact
- **SQL Injection**: Potential for database manipulation or data theft
- **Data Loss**: Attackers could delete or modify database contents
- **Authentication Bypass**: Could potentially bypass security checks
- **Compliance**: Fails security requirements like OWASP Top 10

### Supporting Evidence
**File**: `backend/app/core/storage.py`
The code uses both safe parameterized queries and potential unsafe patterns. All database queries need security review.

```python
cursor.execute(
    "SELECT data FROM analyses WHERE user_id = ?", (user_id,)
)  # Safe - uses parameterized query
```

However, the codebase should be audited to ensure ALL queries follow this pattern consistently.

---

## Issue #7: Missing Input Validation and Sanitization (Security - High)

### Description
The application lacks comprehensive input validation and sanitization. API endpoints accept user input without proper validation beyond basic Pydantic schema validation, potentially allowing malicious input to be processed.

### Steps to Reproduce
1. Review API endpoint handlers in `backend/app/api/endpoints/`
2. Check for input sanitization in `analysis.py`, `fraud.py`, `academy.py`
3. Observe minimal validation beyond type checking
4. No sanitization of user-provided names, descriptions, or search queries

### Observed Impact
- **XSS Attacks**: Malicious scripts could be stored and executed
- **Injection Attacks**: Potential for various injection vulnerabilities
- **Data Integrity**: Invalid data could corrupt the system
- **Security**: User input directly used in API calls and database queries

### Supporting Evidence
**File**: `backend/app/api/endpoints/analysis.py` (Lines 16-50)
The `analyze_funding_fit` function accepts user input with minimal validation:
```python
async def analyze_funding_fit(
    request: AnalysisRequest,
    # Request data used directly without sanitization
):
```

The startup_name, description, and other fields are used without sanitization before being:
- Stored in database
- Passed to AI models
- Included in fraud checks

---

## Issue #8: Overly Permissive ESLint Configuration (Code Quality - Medium)

### Description
The frontend ESLint configuration disables important rules like `@typescript-eslint/no-unused-vars`, which can lead to code quality issues and make debugging more difficult.

### Steps to Reproduce
1. Open `frontend/eslint.config.js`
2. See line 23: `"@typescript-eslint/no-unused-vars": "off"`
3. This allows unused variables and imports to accumulate in the codebase
4. Can lead to confusion and larger bundle sizes

### Observed Impact
- **Code Quality**: Unused code accumulates without warnings
- **Bundle Size**: Dead code may be included in production builds
- **Maintainability**: Harder to identify what code is actually used
- **Confusion**: Developers unsure which variables/imports are necessary

### Supporting Evidence
**File**: `frontend/eslint.config.js` (Lines 20-24)
```javascript
rules: {
  ...reactHooks.configs.recommended.rules,
  "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  "@typescript-eslint/no-unused-vars": "off",  // Should be "warn" or "error"
},
```

---

## Issue #9: dangerouslySetInnerHTML Usage (Security - Medium)

### Description
The frontend uses React's `dangerouslySetInnerHTML` which can introduce XSS (Cross-Site Scripting) vulnerabilities if not handled carefully. This bypasses React's built-in XSS protection.

### Steps to Reproduce
1. Open `frontend/src/components/ui/chart.tsx`
2. Find usage of `dangerouslySetInnerHTML`
3. Verify if the content being rendered is properly sanitized
4. Check if this pattern is used elsewhere in the codebase

### Observed Impact
- **XSS Vulnerability**: Potential for executing malicious scripts
- **Security Risk**: If user input reaches this code, it could be exploited
- **Data Theft**: Attackers could steal user session data or credentials
- **Reputation**: Security breach could damage trust in the application

### Supporting Evidence
**File**: `frontend/src/components/ui/chart.tsx`
```typescript
dangerouslySetInnerHTML={{
  // Usage requires security review
}}
```

---

## Issue #10: Missing Security Headers in Nginx Configuration (Security - Medium)

### Description
The Nginx configuration for the frontend lacks essential security headers like Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, and others that protect against common web vulnerabilities.

### Steps to Reproduce
1. Open `frontend/nginx.conf`
2. Notice the absence of security headers
3. The configuration only has basic routing and buffer settings
4. Compare with security best practices for Nginx

### Observed Impact
- **Clickjacking**: No X-Frame-Options protection
- **MIME Sniffing**: No X-Content-Type-Options header
- **XSS Attacks**: No Content-Security-Policy
- **SSL Issues**: Missing security headers for HTTPS
- **Compliance**: Fails security header best practices

### Supporting Evidence
**File**: `frontend/nginx.conf**
```nginx
server {
    listen 80;
    server_name localhost;
    
    large_client_header_buffers 4 16k;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Missing critical headers like:
- `add_header X-Frame-Options "SAMEORIGIN";`
- `add_header X-Content-Type-Options "nosniff";`
- `add_header X-XSS-Protection "1; mode=block";`
- `add_header Content-Security-Policy "...";`

---

## Issue #11: Hardcoded Fallback URLs (Configuration - Low)

### Description
The frontend has a hardcoded fallback API URL (`http://localhost:8000/api/v1`) in the code instead of failing gracefully when the environment variable is not set.

### Steps to Reproduce
1. Open `frontend/src/services/api.ts`
2. See line 2-3: `const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"`
3. Missing environment variable will silently use localhost
4. This could cause production issues

### Observed Impact
- **Production Issues**: Wrong API URL if environment variable missing
- **Debugging Difficulty**: Silent failures hard to diagnose
- **Configuration Errors**: Masked configuration problems
- **Best Practices**: Should fail fast if required config is missing

### Supporting Evidence
**File**: `frontend/src/services/api.ts` (Lines 2-3)
```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
```

---

## Issue #12: Missing Rate Limiting (Security - Medium)

### Description
The API endpoints do not implement rate limiting, making the application vulnerable to abuse, DDoS attacks, and excessive API usage that could exhaust third-party API quotas (Google Gemini, YouTube API).

### Steps to Reproduce
1. Review `backend/app/main.py` - no rate limiting middleware
2. Check API endpoints in `backend/app/api/endpoints/` - no rate limiting decorators
3. Test making multiple rapid requests to `/api/v1/analyze`
4. No restrictions on request frequency per user/IP

### Observed Impact
- **API Abuse**: Users can make unlimited requests
- **Cost Overruns**: Excessive calls to paid Google APIs
- **DDoS Vulnerability**: Service can be overwhelmed
- **Quota Exhaustion**: Third-party API limits can be quickly reached
- **Performance**: System can be degraded by abusive users

### Supporting Evidence
**File**: `backend/app/main.py`
No rate limiting middleware configured. Missing common rate limiting solutions like:
- SlowApi
- FastAPI-limiter
- Custom rate limiting middleware

**File**: `backend/app/api/endpoints/analysis.py`
```python
@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_funding_fit(
    request: AnalysisRequest,
    # No rate limiting decorator
):
```

---

## Issue #13: Insecure Docker Configuration - Reload Flag in Production (Configuration - Medium)

### Description
The backend Dockerfile uses the `--reload` flag in the CMD instruction, which is a development feature that should never be used in production. This causes unnecessary file system polling and potential security issues.

### Steps to Reproduce
1. Open `backend/Dockerfile`
2. See line 23: `CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]`
3. The `--reload` flag is for development only
4. Production containers should not use this flag

### Observed Impact
- **Performance**: Unnecessary file watching overhead
- **Stability**: Auto-reload can cause unexpected restarts
- **Security**: File system monitoring in production is unnecessary
- **Best Practices**: Violates production deployment standards

### Supporting Evidence
**File**: `backend/Dockerfile` (Line 23)
```dockerfile
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

Should be:
```dockerfile
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Issue #14: Missing Health Check Endpoints (Monitoring - Medium)

### Description
While there is a basic root endpoint, the application lacks proper health check and readiness endpoints for monitoring, load balancers, and orchestration systems (Kubernetes, Docker Swarm).

### Steps to Reproduce
1. Review `backend/app/main.py` - only has a basic `/` endpoint
2. No `/health`, `/ready`, or `/live` endpoints
3. No deep health checks for database, external APIs, or ChromaDB
4. Docker Compose has no health checks configured

### Observed Impact
- **Monitoring**: Cannot properly monitor application health
- **Load Balancing**: Load balancers cannot route traffic effectively
- **Orchestration**: Kubernetes/Docker can't determine if app is ready
- **Debugging**: Difficult to diagnose deployment issues
- **Reliability**: Cannot implement proper health-based routing

### Supporting Evidence
**File**: `backend/app/main.py` (Lines 59-65)
Only basic endpoint:
```python
@app.get("/")
async def root():
    return {
        "message": "Welcome to FundingSense Backend API",
        "version": "1.0.0",
        "status": "healthy",
    }
```

**File**: `infra/docker-compose.yml`
No health checks defined for services.

---

## Issue #15: Missing API Documentation (Documentation - Medium)

### Description
While FastAPI auto-generates OpenAPI documentation, there's no comprehensive API documentation, usage examples, or endpoint descriptions in the codebase. The README mentions endpoints but doesn't provide details on request/response formats.

### Steps to Reproduce
1. Check `backend/README.md` - lists endpoints but no details
2. Review API endpoint files - no docstrings on route handlers
3. No Postman collection or API examples provided
4. No documentation on authentication requirements

### Observed Impact
- **Usability**: Developers struggle to understand how to use the API
- **Integration**: Third parties can't easily integrate with the API
- **Maintenance**: Team members need to read code to understand behavior
- **Onboarding**: New developers have steep learning curve

### Supporting Evidence
**File**: `backend/README.md` (Lines 17-21)
Minimal endpoint listing:
```markdown
## 📡 API Endpoints
- `POST /api/v1/analyze`: Triggers the full RAG pipeline
- `POST /api/v1/translate`: Dynamic AI-powered text localization
- `GET /api/v1/history`: Retrieves analysis history
- `GET /api/v1/stats`: Returns aggregated intelligence metrics
```

No details on:
- Request body schemas
- Response formats
- Error codes
- Authentication
- Example usage

---

## Issue #16: Environment Variables Not Validated on Startup (Configuration - Medium)

### Description
The application uses optional environment variables (`Optional[str] = None`) for critical services like GOOGLE_API_KEY without validating their presence on startup. This leads to runtime failures instead of fast startup failures.

### Steps to Reproduce
1. Open `backend/app/config/settings.py`
2. See lines 12-13: `GOOGLE_API_KEY: Optional[str] = None`
3. Start application without setting required environment variables
4. Application starts successfully but fails during first API call
5. No validation that required keys are present

### Observed Impact
- **Runtime Failures**: Application fails when handling requests
- **Poor UX**: Users see errors instead of startup failures
- **Debugging**: Harder to diagnose configuration issues
- **Operations**: Deployments appear successful but are broken
- **Best Practices**: Should fail fast on missing critical config

### Supporting Evidence
**File**: `backend/app/config/settings.py` (Lines 12-20)
```python
GOOGLE_API_KEY: Optional[str] = None
YOUTUBE_API_KEY: Optional[str] = None
ENABLE_VECTOR_DB: bool = True

ALLOWED_ORIGINS: str = "*"

SUPABASE_URL: Optional[str] = None
SUPABASE_KEY: Optional[str] = None
RENDER_EXTERNAL_URL: Optional[str] = None
```

All critical API keys are optional, with no startup validation.

---

## Issue #17: Lack of Logging Strategy (Observability - Medium)

### Description
The application uses print statements for logging instead of a proper logging framework like Python's `logging` module. This makes it impossible to control log levels, format logs consistently, or integrate with logging aggregation services.

### Steps to Reproduce
1. Search for logging: `grep -r "print(" backend/app/ --include="*.py"`
2. Find multiple print statements used for logging
3. No logging configuration file
4. No structured logging or log levels

### Observed Impact
- **Production Issues**: Cannot control log verbosity in production
- **Debugging**: Difficult to filter and search logs
- **Monitoring**: Cannot integrate with log aggregation tools (ELK, Splunk)
- **Performance**: Print statements can't be disabled in production
- **Compliance**: May not meet audit logging requirements

### Supporting Evidence
Examples of print-based logging found:
- `backend/app/api/endpoints/analysis.py`: `print(f"[*] Running fraud check...")`
- `backend/app/main.py`: `print(f"Keep-alive: Starting ping task...")`
- `backend/app/rag/retriever.py`: `print(f"[*] [DEBUG] Generative response...")`

No proper logging configuration using Python's `logging` module.

---

## Issue #18: Missing .dockerignore Files (Build Efficiency - Low)

### Description
The Dockerfiles do not have corresponding `.dockerignore` files, which means unnecessary files (like .git, node_modules, __pycache__, etc.) may be copied into Docker images, increasing build time and image size.

### Steps to Reproduce
1. Check for `.dockerignore` in `backend/` directory: `ls -la backend/.dockerignore`
2. Check for `.dockerignore` in `frontend/` directory: `ls -la frontend/.dockerignore`
3. Both files are missing
4. Docker COPY commands will include all files

### Observed Impact
- **Build Performance**: Slower Docker builds
- **Image Size**: Larger Docker images with unnecessary files
- **Security**: Potentially copying sensitive files into images
- **Best Practices**: Violates Docker optimization standards

### Supporting Evidence
```bash
$ ls -la backend/.dockerignore
# File does not exist

$ ls -la frontend/.dockerignore
# File does not exist
```

Both Dockerfiles use `COPY . .` without exclusion files.

---

## Issue #19: No Database Migration Strategy (Data Management - Medium)

### Description
The application uses SQLite with schema initialization in code but has no migration strategy. Schema changes require manual intervention and could cause data loss or corruption during updates.

### Steps to Reproduce
1. Review `backend/app/core/storage.py`
2. Schema is created with `CREATE TABLE IF NOT EXISTS`
3. No migration framework (Alembic, etc.)
4. Schema changes would require manual database updates

### Observed Impact
- **Data Loss Risk**: Schema changes could corrupt data
- **Deployment Issues**: Updates may fail if schema changes needed
- **Rollback Problems**: Cannot easily revert schema changes
- **Team Coordination**: Multiple developers may have schema conflicts

### Supporting Evidence
**File**: `backend/app/core/storage.py` (Lines 40-55)
```python
cursor.execute("""
    CREATE TABLE IF NOT EXISTS analyses (
        analysis_id TEXT PRIMARY KEY,
        user_id TEXT,
        created_at TEXT,
        data TEXT
    )
""")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        message_json TEXT
    )
""")
```

No migration framework or version tracking.

---

## Issue #20: Frontend Uses HTTP Instead of HTTPS in Default Configuration (Security - Medium)

### Description
The Nginx configuration and Docker setup use HTTP (port 80) without HTTPS configuration. This means data, including potentially sensitive API keys and user data, is transmitted unencrypted.

### Steps to Reproduce
1. Open `frontend/nginx.conf` - listens on port 80 only
2. Check `infra/docker-compose.yml` - maps to port 80
3. No SSL/TLS configuration
4. All traffic is unencrypted HTTP

### Observed Impact
- **Data Interception**: Credentials and data sent in cleartext
- **Man-in-the-Middle**: Vulnerable to MITM attacks
- **Compliance**: Violates security standards (PCI-DSS, GDPR)
- **Trust**: Modern browsers warn users about insecure sites
- **SEO**: Google penalizes non-HTTPS sites

### Supporting Evidence
**File**: `frontend/nginx.conf` (Lines 1-14)
```nginx
server {
    listen 80;  # No HTTPS
    server_name localhost;
    # No SSL configuration
    # No redirect to HTTPS
}
```

**File**: `infra/docker-compose.yml` (Lines 20-21)
```yaml
ports:
  - "5173:80"  # Only HTTP exposed
```

---

## Summary

**Critical Issues (3)**: #1 (CORS), #6 (SQL Injection Risk), #7 (Input Validation)
**High Priority (4)**: #2 (Dependency Pinning), #3 (No Tests), #4 (No License), #7 (Input Validation)
**Medium Priority (11)**: #5, #8, #9, #10, #12, #13, #14, #15, #16, #17, #19, #20
**Low Priority (2)**: #11, #18

All issues should be reported to GitHub Issues with the format provided above. Each issue includes a clear description, reproduction steps, observed impact, and supporting evidence as required.
