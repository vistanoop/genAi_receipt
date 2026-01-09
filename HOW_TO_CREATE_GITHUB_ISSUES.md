# How to Create GitHub Issues from SECURITY_ISSUES.md

This guide explains how to create individual GitHub Issues from the documented security and functionality issues in `SECURITY_ISSUES.md`.

## Issue Reporting Format

Each GitHub Issue must include:
- ● **Description**: Clear explanation of the issue
- ○ **Steps to reproduce**: Detailed steps to replicate the issue
- ○ **Observed impact**: Security, functionality, or performance implications
- ○ **Supporting evidence**: Code snippets, file references, or screenshots

## Creating Issues

### Step 1: Navigate to GitHub Issues
1. Go to: https://github.com/vistanoop/genAi_receipt/issues
2. Click "New Issue"

### Step 2: Copy Issue Content
Each issue in `SECURITY_ISSUES.md` is formatted ready for GitHub. For each issue:

1. Copy the issue title (e.g., "Issue 1: Hardcoded Default Secret Key in Configuration")
2. Copy all content under that issue including:
   - Description
   - Steps to Reproduce
   - Observed Impact
   - Supporting Evidence

### Step 3: Create the GitHub Issue

**Title Format:**
```
[SECURITY] Hardcoded Default Secret Key in Configuration
```
or
```
[BUG] In-Memory Data Storage Without Persistence
```

**Body Template:**
```markdown
## Description
[Copy from SECURITY_ISSUES.md]

## Steps to Reproduce
[Copy from SECURITY_ISSUES.md]

## Observed Impact
[Copy from SECURITY_ISSUES.md]

## Supporting Evidence
[Copy from SECURITY_ISSUES.md]
```

### Step 4: Add Labels
Recommended labels based on issue severity:

**Critical Security Issues (Issues 1-5):**
- `security`
- `critical`
- `vulnerability`

**High Priority Security Issues (Issues 6-10):**
- `security`
- `high priority`
- `vulnerability`

**Medium Priority Issues (Issues 11-15):**
- `security` or `enhancement`
- `medium priority`

**Data Validation Issues (Issues 16-19):**
- `bug`
- `data validation`

**Technical Debt (Issue 20):**
- `technical debt`
- `maintenance`

## Quick Reference: All 20 Issues

### Critical Security Issues
1. **[SECURITY] Hardcoded Default Secret Key in Configuration**
2. **[SECURITY] CORS Configuration Allows All Origins**
3. **[SECURITY] JWT Token Stored in localStorage (XSS Vulnerability)**
4. **[SECURITY] No HTTPS Enforcement in Production Configuration**
5. **[SECURITY] SQL Injection Vulnerability in Bank API Transaction Filters**

### High Priority Security Issues
6. **[SECURITY] No Rate Limiting on Authentication Endpoints**
7. **[SECURITY] Weak Password Policy**
8. **[SECURITY] Predictable Account Number Generation**
9. **[SECURITY] Sensitive Information in Error Responses**
10. **[SECURITY] Missing Error Message Sanitization**

### Medium Priority Issues
11. **[BUG] In-Memory Data Storage Without Persistence**
12. **[SECURITY] Demo User Setup Endpoint Restricted but Insecure**
13. **[SECURITY] No Request Size Limits**
14. **[BUG] No JWT Token Expiration Validation Client-Side**
15. **[BUG] Bank API Database Connection Not Using Connection Pooling Best Practices**

### Data Validation Issues
16. **[BUG] Insufficient Input Validation on Amount Fields**
17. **[BUG] Unvalidated Date Inputs**
18. **[BUG] Missing Input Length Limits**
19. **[BUG] Expense Category Not Validated Against Allowed Values**

### Technical Debt
20. **[TECH DEBT] Deprecated datetime.utcnow() Usage**

## Example: Creating Issue #1

**Title:**
```
[SECURITY] Hardcoded Default Secret Key in Configuration
```

**Body:**
```markdown
## Description
The application uses a hardcoded default SECRET_KEY in `vaultguard-backend/config.py` when the environment variable is not set. This secret key is used for JWT token generation and authentication, making it a critical security vulnerability.

## Steps to Reproduce
1. Navigate to `vaultguard-backend/config.py`
2. Observe line 19: `SECRET_KEY = os.getenv("SECRET_KEY", "vaultguard-super-secret-key-change-in-production-2024")`
3. If no `.env` file exists or `SECRET_KEY` is not set, the default value is used
4. Start the application without setting `SECRET_KEY` environment variable
5. The application will use the hardcoded secret key for JWT signing

## Observed Impact
- **Critical Security Risk**: Anyone with knowledge of this default key can forge valid JWT tokens
- **Authentication Bypass**: Attackers can generate tokens for any user account
- **Session Hijacking**: All JWT tokens can be validated with the known secret
- **Data Breach Risk**: Unauthorized access to all user financial data
- **Production Vulnerability**: If deployed to production without changing the key, the entire system is compromised

## Supporting Evidence
**File**: `vaultguard-backend/config.py` (Line 19)
```python
SECRET_KEY = os.getenv("SECRET_KEY", "vaultguard-super-secret-key-change-in-production-2024")
```

**File**: `vaultguard-backend/auth.py` (Lines 186-187)
```python
encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
return encoded_jwt
```
```

**Labels:**
- `security`
- `critical`
- `vulnerability`

**Assignees:** (Optional)
Assign to relevant team members

**Projects:** (Optional)
Add to security or sprint project boards

## Automation Tip

To create all issues at once, you can use GitHub CLI:

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Create an issue (example for Issue #1)
gh issue create \
  --title "[SECURITY] Hardcoded Default Secret Key in Configuration" \
  --body-file issue1.md \
  --label "security,critical,vulnerability"
```

## Important Notes

1. **DO NOT fix these issues** - only document them as GitHub Issues
2. Each issue should be a separate GitHub Issue
3. Include all sections: Description, Steps to Reproduce, Observed Impact, Supporting Evidence
4. Use appropriate labels for prioritization
5. Reference the `SECURITY_ISSUES.md` file in issues if needed
6. Consider adding screenshots or video evidence where applicable (optional but recommended per requirement)

## Verification

After creating all issues, verify:
- [ ] All 20 issues are created
- [ ] Each issue has proper labels
- [ ] Each issue follows the required format
- [ ] Supporting evidence is included
- [ ] Issues are properly categorized by severity

## Need Help?

Refer to:
- `SECURITY_ISSUES.md` - Complete issue documentation
- GitHub Issues documentation: https://docs.github.com/en/issues
- GitHub Labels documentation: https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work
