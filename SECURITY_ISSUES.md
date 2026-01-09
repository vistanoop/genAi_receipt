# Security and Functionality Issues Report

This document contains identified issues in the VaultGuard application. Each issue follows the reporting format:
- Description
- Steps to reproduce
- Observed impact
- Supporting evidence

---

## Issue 1: Hardcoded Default Secret Key in Configuration

### Description
The application uses a hardcoded default SECRET_KEY in `vaultguard-backend/config.py` when the environment variable is not set. This secret key is used for JWT token generation and authentication, making it a critical security vulnerability.

### Steps to Reproduce
1. Navigate to `vaultguard-backend/config.py`
2. Observe line 19: `SECRET_KEY = os.getenv("SECRET_KEY", "vaultguard-super-secret-key-change-in-production-2024")`
3. If no `.env` file exists or `SECRET_KEY` is not set, the default value is used
4. Start the application without setting `SECRET_KEY` environment variable
5. The application will use the hardcoded secret key for JWT signing

### Observed Impact
- **Critical Security Risk**: Anyone with knowledge of this default key can forge valid JWT tokens
- **Authentication Bypass**: Attackers can generate tokens for any user account
- **Session Hijacking**: All JWT tokens can be validated with the known secret
- **Data Breach Risk**: Unauthorized access to all user financial data
- **Production Vulnerability**: If deployed to production without changing the key, the entire system is compromised

### Supporting Evidence
**File**: `vaultguard-backend/config.py` (Line 19)
```python
SECRET_KEY = os.getenv("SECRET_KEY", "vaultguard-super-secret-key-change-in-production-2024")
```

**File**: `vaultguard-backend/auth.py` (Lines 186-187)
```python
encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
return encoded_jwt
```

---

## Issue 2: CORS Configuration Allows All Origins

### Description
The backend API has CORS (Cross-Origin Resource Sharing) configured to allow requests from any origin (`allow_origins=["*"]`), which creates a significant security vulnerability for cross-site request forgery (CSRF) and unauthorized API access.

### Steps to Reproduce
1. Open `vaultguard-backend/main.py`
2. Navigate to lines 43-49
3. Observe the CORS middleware configuration with `allow_origins=["*"]`
4. Deploy the application
5. Any website from any domain can make authenticated requests to the API if they obtain a user's token

### Observed Impact
- **Cross-Site Request Forgery (CSRF)**: Malicious websites can make requests on behalf of authenticated users
- **Token Theft Risk**: XSS attacks on other sites can be leveraged to steal tokens and make requests
- **Unauthorized API Access**: No origin restrictions mean any website can interact with the API
- **Data Exposure**: User financial data can be accessed from malicious third-party sites
- **Credential Harvesting**: Attackers can create phishing sites that use the real API

### Supporting Evidence
**File**: `vaultguard-backend/main.py` (Lines 43-49)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Issue 3: JWT Token Stored in localStorage (XSS Vulnerability)

### Description
The authentication token is stored in browser localStorage, which is accessible to any JavaScript code running on the page. This makes the application vulnerable to Cross-Site Scripting (XSS) attacks that can steal authentication tokens.

### Steps to Reproduce
1. Open `vaultguard-frontend/src/contexts/AuthContext.tsx`
2. Observe line 84: `localStorage.setItem('vaultguard_token', authToken)`
3. Open browser DevTools Console on the application
4. Execute: `localStorage.getItem('vaultguard_token')`
5. The JWT token is immediately visible and accessible
6. Any XSS vulnerability in the application or third-party scripts can read this token

### Observed Impact
- **XSS Token Theft**: Any XSS vulnerability allows attackers to steal tokens
- **Session Persistence After Logout**: Tokens remain in localStorage even if browser crashes
- **No HttpOnly Protection**: Unlike cookies, localStorage has no built-in XSS protection
- **Third-Party Script Risk**: Any compromised third-party script can access the token
- **Account Takeover**: Stolen tokens can be used to fully impersonate users

### Supporting Evidence
**File**: `vaultguard-frontend/src/contexts/AuthContext.tsx` (Line 84)
```typescript
localStorage.setItem('vaultguard_token', authToken);
```

**File**: `vaultguard-frontend/src/lib/api.ts` (Line 10)
```typescript
const token = localStorage.getItem('vaultguard_token');
```

---

## Issue 4: No Rate Limiting on Authentication Endpoints

### Description
The authentication endpoints (`/api/auth/login` and `/api/auth/register`) have no rate limiting implemented, allowing unlimited login attempts and account creation requests. This enables brute force attacks and account enumeration.

### Steps to Reproduce
1. Review `vaultguard-backend/main.py` authentication endpoints (lines 117-198)
2. Note the absence of rate limiting middleware or decorators
3. Start the application
4. Write a script to make repeated POST requests to `/api/auth/login`
5. Observe that unlimited attempts are allowed without any throttling or delays

### Observed Impact
- **Brute Force Attacks**: Attackers can attempt unlimited password combinations
- **Account Enumeration**: Can determine which email addresses have accounts by response differences
- **Denial of Service (DoS)**: Excessive requests can overwhelm the server
- **Credential Stuffing**: Stolen credentials from other breaches can be tested en masse
- **Resource Exhaustion**: CPU-intensive bcrypt operations can be triggered repeatedly
- **Account Creation Spam**: Unlimited registration allows creation of fake accounts

### Observed Impact
- **Authentication Bypass Vulnerability**: Attackers can conduct brute force attacks
- **Account Enumeration**: Email addresses can be discovered through timing attacks
- **DoS Risk**: Server resources can be exhausted with repeated bcrypt operations
- **No Account Lockout**: Failed login attempts don't trigger any protective measures

### Supporting Evidence
**File**: `vaultguard-backend/main.py` (Lines 117-131)
```python
@app.post("/api/auth/login", response_model=Token)
async def login(user_login: UserLogin):
    """Authenticate user and return JWT token"""
    user = authenticate_user(user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # No rate limiting implemented
```

---

## Issue 5: Weak Password Policy

### Description
The application only enforces a minimum password length of 6 characters with no complexity requirements. This weak password policy makes user accounts vulnerable to dictionary attacks and brute force attempts.

### Steps to Reproduce
1. Open `vaultguard-backend/main.py`
2. Navigate to lines 152-156 in the registration endpoint
3. Note that only password length >= 6 is checked
4. Start the application and navigate to the registration page
5. Successfully register with password "123456" or "password"
6. No complexity requirements are enforced (no uppercase, numbers, special characters)

### Observed Impact
- **Weak Account Security**: Users can create easily guessable passwords
- **Dictionary Attack Success**: Common passwords like "password", "123456" are allowed
- **Brute Force Vulnerability**: Short passwords increase success rate of attacks
- **Credential Stuffing Risk**: Common passwords from data breaches will work
- **No Password History**: Users can reuse passwords indefinitely
- **Financial Data at Risk**: Weak passwords protect sensitive financial information

### Supporting Evidence
**File**: `vaultguard-backend/main.py` (Lines 152-156)
```python
# Validate password length
if len(user_register.password) < 6:
    raise HTTPException(
        status_code=400,
        detail="Password must be at least 6 characters long"
    )
```

---

## Issue 6: Predictable Account Number Generation

### Description
Account numbers are generated using a simple random number generator without cryptographic security. The generation uses Python's `random.randint()` which is predictable and not suitable for security-sensitive operations like account number generation.

### Steps to Reproduce
1. Open `vaultguard-backend/auth.py`
2. Review the `generate_account_number()` function at line 63-65
3. Note the use of `random.randint(0, 9)` for each digit
4. The `random` module uses a Mersenne Twister PRNG which is predictable
5. An attacker who observes several generated account numbers can predict future ones
6. Register multiple accounts and observe the generated account numbers

### Observed Impact
- **Account Number Prediction**: Attackers may predict valid account numbers
- **Unauthorized Access Risk**: Predictable account numbers can be enumerated
- **Weak Account Security**: Non-cryptographic randomness for financial identifiers
- **Account Enumeration**: Systematic guessing of account numbers becomes feasible
- **Data Breach Amplification**: Predictable patterns increase breach impact

### Supporting Evidence
**File**: `vaultguard-backend/auth.py` (Lines 63-65)
```python
def generate_account_number() -> str:
    """Generate a random 10-digit account number (use generate_unique_account_number for uniqueness check)"""
    return ''.join([str(random.randint(0, 9)) for _ in range(10)])
```

**File**: `vaultguard-backend/main.py` (Line 168)
```python
initial_balance = random.randint(10000, 50000)
```

---

## Issue 7: In-Memory Data Storage Without Persistence

### Description
Critical application data including user accounts (`_users_db` in auth.py), expenses (`expenses_db` in main.py), and budget settings are stored in memory without any persistence mechanism. This means all data is lost when the application restarts.

### Steps to Reproduce
1. Review `vaultguard-backend/auth.py` lines 123-132
2. Observe the in-memory dictionary `_users_db`
3. Review `vaultguard-backend/main.py` lines 112-113
4. Observe in-memory storage for expenses and budget settings
5. Start the application and register a new user
6. Add expenses and configure budget settings
7. Restart the backend container or application
8. Try to login with the registered account - user no longer exists
9. All expenses and settings are lost

### Observed Impact
- **Data Loss**: All user accounts except demo user are lost on restart
- **Poor User Experience**: Users lose their financial data unexpectedly
- **No Data Recovery**: No mechanism to restore lost data
- **Scalability Issues**: Cannot scale horizontally with in-memory storage
- **Testing Difficulties**: Each test run requires recreating all data
- **Production Risk**: Deployments or crashes cause total data loss

### Supporting Evidence
**File**: `vaultguard-backend/auth.py` (Lines 122-132)
```python
# In-memory user database (for demo purposes)
# In production, this would be a real database
_users_db = {
    DEMO_USER_EMAIL: UserInDB(
        email=DEMO_USER_EMAIL,
        name=USER_NAME,
        account_number=DEFAULT_ACCOUNT_NUMBER,
        ifsc_code=DEFAULT_IFSC_CODE,
        hashed_password=_DEMO_PASSWORD_HASH,
        disabled=False
    )
}
```

**File**: `vaultguard-backend/main.py` (Lines 112-113)
```python
# In-memory storage for expenses (in production, use a database)
expenses_db: Dict[str, Expense] = {}
budget_settings = BudgetSettings(monthly_budget=50000, fixed_bills=12000)
```

---

## Issue 8: Insufficient Input Validation on Amount Fields

### Description
While some endpoints have basic positive number validation using Pydantic's `Field(..., gt=0)`, there's no maximum limit validation on amount fields. This allows users to input unrealistically large numbers that could cause integer overflow, display issues, or computational problems in ML models.

### Steps to Reproduce
1. Open `vaultguard-backend/main.py`
2. Review the `ExpenseCreate` model (lines 74-78)
3. Note that while `gt=0` is specified, there's no maximum limit
4. Start the application and login
5. Make a POST request to `/api/expenses` with amount: `999999999999999`
6. The request is accepted without validation
7. Make a POST request with amount: `1e308` (near float max)
8. Observe potential overflow or calculation issues

### Observed Impact
- **Data Integrity Issues**: Unrealistic financial values corrupt analytics
- **ML Model Degradation**: Extreme outliers affect prediction accuracy
- **Display Problems**: Very large numbers may break UI formatting
- **Calculation Errors**: Float precision issues with extreme values
- **Database Issues**: Potential overflow in numeric columns
- **Business Logic Failures**: Budget calculations become meaningless

### Supporting Evidence
**File**: `vaultguard-backend/main.py` (Lines 74-78, 81-84)
```python
class ExpenseCreate(BaseModel):
    name: str
    amount: float = Field(..., gt=0, description="Amount must be a positive number")
    category: str
    date: str

class IncomeCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Amount must be a positive number")
    description: str
    date: str
```

---

## Issue 9: No HTTPS Enforcement in Production Configuration

### Description
The application configuration does not enforce HTTPS connections, and the default URLs in environment variables use HTTP protocol. This means sensitive financial data, including authentication tokens and transactions, can be transmitted in plaintext over the network.

### Steps to Reproduce
1. Review `docker-compose.yml` and observe the exposed ports configuration
2. Check `vaultguard-backend/config.py` - no HTTPS enforcement
3. Review `vaultguard-frontend/src/lib/api.ts` line 6
4. Default API URL is `http://localhost:8080`
5. Deploy the application using the provided docker-compose
6. Access the application via `http://localhost:5173`
7. All communication between browser and server is unencrypted
8. Use browser DevTools Network tab to observe plaintext HTTP requests
9. Authentication tokens, passwords, and financial data are visible in plaintext

### Observed Impact
- **Credential Theft**: Login credentials sent in plaintext can be intercepted
- **Token Exposure**: JWT tokens transmitted over HTTP can be stolen
- **Man-in-the-Middle Attacks**: All API communications vulnerable to interception
- **Financial Data Exposure**: Transaction details visible to network eavesdroppers
- **Session Hijacking**: Tokens can be captured and replayed by attackers
- **Compliance Violations**: Unencrypted financial data violates security standards

### Supporting Evidence
**File**: `vaultguard-frontend/src/lib/api.ts` (Line 6)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
```

**File**: `vaultguard-frontend/src/contexts/AuthContext.tsx` (Line 21)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
```

**File**: `docker-compose.yml` (Lines 49-50, 64-65)
```yaml
# Backend exposed on HTTP
ports:
  - "8080:8080"

# Frontend exposed on HTTP  
ports:
  - "5173:5173"
```

---

## Issue 10: SQL Injection Vulnerability in Bank API Transaction Filters

### Description
The Bank API transaction filtering endpoint constructs SQL queries using string interpolation instead of parameterized queries for the filter logic. While base parameters are properly parameterized, the filter type is directly interpolated into the WHERE clause, creating potential SQL injection vectors.

### Steps to Reproduce
1. Open `bank-api/server.js`
2. Navigate to lines 48-73 (transaction filter endpoint)
3. Note that filter parameters are added to the query string dynamically
4. While value parameters use `$n` placeholders, the filter logic structure could be manipulated
5. Make a request to `/gettransaction/{acc}/{ifsc}/{malicious_filter}`
6. The filter parameter is used to build SQL query structure

### Observed Impact
- **Potential SQL Injection**: Malicious filter values could manipulate queries
- **Data Exposure Risk**: Unauthorized access to transaction data
- **Database Compromise**: Potential to execute arbitrary SQL commands
- **Data Manipulation**: Possible to modify or delete transaction records
- **Authentication Bypass**: Could access other users' transactions

### Supporting Evidence
**File**: `bank-api/server.js` (Lines 48-73)
```javascript
app.get('/gettransaction/:acc/:ifsc/:filter', async (req, res) => {
    const { acc, ifsc, filter } = req.params;
    const { value } = req.query;

    let query = 'SELECT * FROM transactions WHERE (sender_account = $1 OR receiver_account = $1)';
    let params = [acc];

    if (filter === 'date' && value) {
        params.push(value);
        query += ` AND timestamp::date = $${params.length}`;
    } else if (filter === 'amount' && value) {
        params.push(value);
        query += ` AND amount >= $${params.length}`;
    } else if (filter === 'time' && value) {
        params.push(value);
        query += ` AND timestamp::time >= $${params.length}`;
    }
```

---

## Issue 11: Demo User Setup Endpoint Restricted but Insecure

### Description
The demo user setup endpoint at `/api/user/setup` only checks if the account number matches the default demo account, but this check happens after authentication. Since account numbers can be predictable (Issue #6), and the endpoint only validates the account number, it may be exploited if an attacker can guess or enumerate the demo account number.

### Steps to Reproduce
1. Review `vaultguard-backend/main.py` lines 245-257
2. Note the endpoint only checks `current_user.account_number != DEFAULT_ACCOUNT_NUMBER`
3. The `DEFAULT_ACCOUNT_NUMBER` is "1234567890" (from config.py)
4. This is a highly predictable value that could be known to attackers
5. If an attacker can authenticate as a user with this account number, they can trigger the setup
6. The setup deletes and recreates the user with 200 transactions

### Observed Impact
- **Data Destruction**: Endpoint deletes existing user and recreates it
- **Account Takeover Vector**: Could be used to reset a compromised account
- **Privilege Escalation**: Unintended users might trigger demo setup
- **Data Loss Risk**: Legitimate data is deleted during setup
- **Poor Access Control**: Only checks account number, not user roles/permissions

### Supporting Evidence
**File**: `vaultguard-backend/main.py` (Lines 245-257)
```python
@app.post("/api/user/setup")
async def setup_user(current_user: User = Depends(get_current_active_user)):
    """Setup demo user with 200 transactions and 1000 rupees balance"""
    try:
        # Only allow demo user to setup demo data
        if current_user.account_number != DEFAULT_ACCOUNT_NUMBER:
            raise HTTPException(status_code=403, detail="Demo setup only available for demo account")
        result = await setup_demo_user()
        return result
```

**File**: `vaultguard-backend/config.py` (Line 10)
```python
DEFAULT_ACCOUNT_NUMBER = os.getenv("DEFAULT_ACCOUNT_NUMBER", "1234567890")
```

---

## Issue 12: Missing Error Message Sanitization

### Description
Error messages throughout the application often expose internal system details, including database errors, file paths, and stack traces. This information disclosure helps attackers understand the system architecture and identify potential vulnerabilities.

### Steps to Reproduce
1. Review error handling in `vaultguard-backend/main.py`
2. Notice error messages include raw exception text (e.g., line 242, 257, 318, etc.)
3. Start the application
4. Make an invalid API request that triggers a database error
5. Observe detailed error messages in the response
6. Example: POST to `/api/expenses` with malformed data
7. Error response includes: `"Failed to add expense: {detailed_database_error}"`

### Observed Impact
- **Information Disclosure**: Internal error details exposed to users
- **Attack Surface Mapping**: Errors reveal system architecture and dependencies
- **Database Schema Leakage**: SQL errors may expose table and column names
- **Path Disclosure**: File system paths may be revealed
- **Version Information**: Error messages may indicate software versions
- **Security through Obscurity Loss**: Attackers gain knowledge for targeted attacks

### Supporting Evidence
**File**: `vaultguard-backend/main.py` (Multiple locations)
```python
# Line 242
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to fetch user profile: {str(e)}")

# Line 257
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to setup user: {str(e)}")

# Line 318
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to fetch expenses: {str(e)}")

# Line 351
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Failed to add expense: {str(e)}")
```

---

## Issue 13: No Request Size Limits

### Description
The application does not implement request size limits on API endpoints. This allows attackers to send extremely large payloads that could exhaust server memory, cause denial of service, or overflow buffers.

### Steps to Reproduce
1. Review `vaultguard-backend/main.py` - no middleware for request size limiting
2. Review `bank-api/server.js` line 4-5 - `express.json()` without size limit
3. Start the application
4. Create a POST request to `/api/expenses` with an extremely large JSON payload
5. Include a name field with 10MB of text data
6. Send the request and observe server behavior
7. Memory usage increases significantly
8. Server may become unresponsive or crash

### Observed Impact
- **Denial of Service (DoS)**: Large requests exhaust server resources
- **Memory Exhaustion**: Parsing huge JSON payloads consumes RAM
- **Server Crashes**: Out-of-memory errors bring down the application
- **Network Bandwidth Waste**: Large requests consume bandwidth
- **Application Performance**: Legitimate requests are delayed
- **Cost Increases**: Cloud hosting costs rise due to resource consumption

### Supporting Evidence
**File**: `bank-api/server.js` (Lines 4-5)
```javascript
const app = express();
app.use(express.json()); // No size limit specified
```

**File**: `vaultguard-backend/main.py` (No request size middleware)
```python
app = FastAPI(
    title="VaultGuard API",
    description="Backend API for VaultGuard - Financial Goal Management for Freelancers",
    version="1.0.0"
)
# No request size limiting middleware configured
```

---

## Issue 14: Unvalidated Date Inputs

### Description
Date fields in expense and income creation accept string inputs without proper format validation or range checking. Users can submit invalid dates, future dates, or dates far in the past, which can corrupt analytics and ML predictions.

### Steps to Reproduce
1. Review `vaultguard-backend/main.py` ExpenseCreate and IncomeCreate models
2. Note that date field is just `str` type without validation
3. Start the application and login
4. POST to `/api/expenses` with date: "9999-12-31"
5. Request succeeds with date far in the future
6. POST with date: "invalid-date-format"
7. May cause errors downstream when parsing
8. POST with date: "1900-01-01"
9. Historical analytics become distorted

### Observed Impact
- **Data Integrity Issues**: Invalid dates corrupt financial records
- **ML Model Confusion**: Future dates skew predictions
- **Analytics Errors**: Charts and graphs show incorrect timelines
- **Business Logic Failures**: Date-based calculations produce wrong results
- **Sorting Issues**: Invalid dates break chronological ordering
- **Report Generation Errors**: Date parsing failures in reports

### Supporting Evidence
**File**: `vaultguard-backend/main.py` (Lines 74-78, 81-84)
```python
class ExpenseCreate(BaseModel):
    name: str
    amount: float = Field(..., gt=0, description="Amount must be a positive number")
    category: str
    date: str  # No date format or range validation

class IncomeCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Amount must be a positive number")
    description: str
    date: str  # No date format or range validation
```

---

## Issue 15: Missing Input Length Limits

### Description
String input fields (name, description, category) have no maximum length validation. This allows users to submit extremely long strings that can cause database issues, display problems, or be used in DoS attacks.

### Steps to Reproduce
1. Review `vaultguard-backend/main.py` data models
2. Note absence of `max_length` constraints on string fields
3. Start the application and login
4. POST to `/api/expenses` with name field containing 1 million characters
5. Request is processed without validation
6. Database may store the entire string or truncate it silently
7. UI attempts to display the extremely long name
8. Page rendering becomes slow or breaks

### Observed Impact
- **Database Bloat**: Large text fields consume excessive storage
- **UI Breaking**: Long strings break page layouts
- **Performance Issues**: Processing large strings is slow
- **Memory Consumption**: Large text in memory affects performance
- **DoS Potential**: Repeatedly submitting large strings exhausts resources
- **CSV Export Issues**: Reports with huge text fields fail to generate

### Supporting Evidence
**File**: `vaultguard-backend/main.py` (Lines 74-78, 81-84)
```python
class ExpenseCreate(BaseModel):
    name: str  # No max length validation
    amount: float = Field(..., gt=0, description="Amount must be a positive number")
    category: str  # No max length validation
    date: str

class IncomeCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Amount must be a positive number")
    description: str  # No max length validation
    date: str
```

---

## Issue 16: Expense Category Not Validated Against Allowed Values

### Description
The expense category field accepts any string value, but the application logic expects only "regular", "irregular", or "daily". Invalid categories can break analytics, charts, and category summary endpoints.

### Steps to Reproduce
1. Review `vaultguard-backend/main.py` ExpenseCreate model (line 77)
2. Note that category is `str` type without enum validation
3. Start the application and login
4. POST to `/api/expenses` with category: "invalid_category"
5. Request succeeds and expense is created
6. GET `/api/analytics/category-summary`
7. Invalid category is not included in the totals
8. Analytics are incomplete and misleading

### Observed Impact
- **Data Inconsistency**: Invalid categories break categorization
- **Analytics Errors**: Category summaries miss invalid entries
- **Chart Failures**: Visualizations don't account for invalid data
- **Business Logic Issues**: Budget calculations ignore invalid categories
- **Reporting Gaps**: Financial reports incomplete
- **User Confusion**: Expenses appear to be lost

### Supporting Evidence
**File**: `vaultguard-backend/main.py` (Lines 74-78)
```python
class ExpenseCreate(BaseModel):
    name: str
    amount: float = Field(..., gt=0, description="Amount must be a positive number")
    category: str  # Should be Literal["regular", "irregular", "daily"]
    date: str
```

**File**: `vaultguard-backend/main.py` (Lines 550-557) - Only these categories are counted
```python
totals = {"regular": 0, "irregular": 0, "daily": 0}
counts = {"regular": 0, "irregular": 0, "daily": 0}

for exp in expenses:
    if exp.category in totals:  # Invalid categories ignored
        totals[exp.category] += exp.amount
        counts[exp.category] += 1
```

---

## Issue 17: No JWT Token Expiration Validation Client-Side

### Description
While JWT tokens have an expiration claim set server-side (24 hours), the frontend doesn't proactively check token expiration before making requests. This leads to unnecessary failed requests and poor user experience when tokens expire during active sessions.

### Steps to Reproduce
1. Review `vaultguard-frontend/src/contexts/AuthContext.tsx`
2. Note absence of token expiration checking
3. Review `vaultguard-frontend/src/lib/api.ts`
4. No expiration validation before requests
5. Login to the application
6. Wait 24 hours (or modify token exp claim to expire soon)
7. Try to perform any action
8. Request fails with 401 Unauthorized
9. User is not automatically logged out or warned
10. Subsequent requests continue to fail until manual logout/login

### Observed Impact
- **Poor User Experience**: Requests fail without warning
- **Confusion**: Users don't understand why app suddenly stops working
- **Data Loss**: In-progress work lost when token expires
- **Multiple Failed Requests**: Each API call fails before user realizes token expired
- **Security Token Exposure**: Expired tokens remain in localStorage
- **No Graceful Degradation**: No warning before expiration

### Supporting Evidence
**File**: `vaultguard-backend/config.py` (Line 21)
```python
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours
```

**File**: `vaultguard-backend/auth.py` (Lines 178-187)
```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

**File**: `vaultguard-frontend/src/lib/api.ts` (Lines 9-18)
```typescript
// No token expiration checking
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('vaultguard_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}
```

---

## Issue 18: Sensitive Information in Error Responses

### Description
The authentication endpoints return different error messages for "user not found" vs "incorrect password" scenarios. This information leak allows attackers to enumerate valid email addresses in the system.

### Steps to Reproduce
1. Review `vaultguard-backend/main.py` lines 120-126
2. Login endpoint returns generic "Incorrect email or password"
3. But review `vaultguard-backend/main.py` lines 144-149 (registration)
4. Registration returns specific "Email already registered"
5. Start the application
6. POST to `/api/auth/register` with existing email: "rahul.sharma@email.com"
7. Response: "Email already registered" - confirms account exists
8. POST with non-existent email
9. Registration succeeds or different error - confirms account doesn't exist
10. Attacker now knows which emails have accounts

### Observed Impact
- **Account Enumeration**: Attackers can discover valid user emails
- **Targeted Phishing**: Known emails can be targeted with phishing
- **Privacy Violation**: User account existence should not be revealed
- **Brute Force Aid**: Attackers know which accounts to target
- **GDPR Concerns**: Revealing account existence may violate privacy laws
- **Social Engineering**: Valid emails used for social engineering attacks

### Supporting Evidence
**File**: `vaultguard-backend/main.py` (Lines 143-149)
```python
@app.post("/api/auth/register", response_model=Token)
async def register(user_register: UserRegister):
    """Register a new user and return JWT token"""
    # Check if user already exists
    existing_user = get_user(user_register.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"  # Reveals account existence
        )
```

---

## Issue 19: Deprecated `datetime.utcnow()` Usage

### Description
The codebase uses `datetime.utcnow()` which is deprecated in Python 3.12+ and scheduled for removal in Python 3.15. This creates a technical debt issue and future compatibility problems. The recommended approach is to use `datetime.now(timezone.utc)` instead.

### Steps to Reproduce
1. Review `vaultguard-backend/auth.py` lines 182-184
2. Note usage of `datetime.utcnow()`
3. Check Python documentation: `datetime.utcnow()` is deprecated since Python 3.12
4. Run the application with Python 3.12+
5. Check for deprecation warnings in logs
6. Application will break when Python 3.15 removes this method

### Observed Impact
- **Future Compatibility Issue**: Code will break in Python 3.15+
- **Technical Debt**: Requires future refactoring
- **Deprecation Warnings**: Logs polluted with warnings in Python 3.12+
- **Maintenance Burden**: Need to update before Python version upgrade
- **Timezone Issues**: utcnow() returns naive datetime which can cause bugs
- **Testing Problems**: Deprecated features complicate testing

### Supporting Evidence
**File**: `vaultguard-backend/auth.py` (Lines 178-187)
```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta  # Deprecated
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)  # Deprecated
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

---

## Issue 20: Bank API Database Connection Not Using Connection Pooling Best Practices

### Description
The Bank API creates a connection pool but doesn't configure important parameters like connection timeout, maximum connections, or idle timeout. This can lead to connection leaks, exhausted connections, and poor performance under load.

### Steps to Reproduce
1. Review `bank-api/server.js` lines 8-14
2. Note the Pool creation with minimal configuration
3. No max connection limit set
4. No connection timeout configured
5. No idle timeout set
6. Start the application under load
7. Make hundreds of concurrent requests
8. Connections may not be released properly
9. Connection pool can be exhausted

### Observed Impact
- **Connection Leaks**: Unreleased connections accumulate
- **Connection Exhaustion**: Pool runs out of available connections
- **Database Overload**: Too many connections to PostgreSQL
- **Performance Degradation**: Slow response times under load
- **Application Crashes**: Out of connections errors
- **Database Crashes**: PostgreSQL connection limit reached

### Supporting Evidence
**File**: `bank-api/server.js` (Lines 8-14)
```javascript
const pool = new Pool({
    user: process.env.DB_USER || 'bank_user',
    host: process.env.DB_HOST || 'bank-db',
    database: process.env.DB_NAME || 'bank_db',
    password: process.env.DB_PASSWORD || 'bank_password',
    port: 5432,
    // Missing: max, connectionTimeoutMillis, idleTimeoutMillis
});
```

---

## Summary

This report documents 20 distinct security and functionality issues identified in the VaultGuard application:

**Critical Security Issues (Immediate Action Required):**
1. Hardcoded default secret key
2. CORS allowing all origins
3. JWT tokens stored in localStorage (XSS vulnerability)
4. No HTTPS enforcement
5. SQL injection potential in Bank API

**High Priority Security Issues:**
6. No rate limiting on authentication
7. Weak password policy (6 char minimum)
8. Predictable account number generation
9. Account enumeration via error messages
10. Missing error message sanitization

**Medium Priority Issues:**
11. In-memory data storage without persistence
12. Demo setup endpoint access control
13. No request size limits
14. Missing JWT expiration handling client-side
15. Database connection pool configuration

**Data Validation Issues:**
16. Insufficient input validation on amounts
17. Unvalidated date inputs
18. Missing input length limits
19. Category field not validated against enum

**Technical Debt:**
20. Deprecated `datetime.utcnow()` usage

All issues require documentation in GitHub Issues with the format provided in this document.
