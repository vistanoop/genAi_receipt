import asyncio
import httpx
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import analysis, academy, notifications, fraud
from app.config.settings import settings

async def ping_self():
    url = settings.RENDER_EXTERNAL_URL
    if not url:
        print("Keep-alive: RENDER_EXTERNAL_URL not set, skipping ping task.")
        return
    
    if not url.startswith(('http://', 'https://')):
        url = f"https://{url}"
    
    print(f"Keep-alive: Starting ping task for {url}")
    async with httpx.AsyncClient() as client:
        while True:
            try:
                await asyncio.sleep(60) 
                response = await client.get(url)
                print(f"Keep-alive: Pinged {url}, status: {response.status_code}")
            except Exception as e:
                print(f"Keep-alive: Ping failed: {e}")


            await asyncio.sleep(14 * 60)

@asynccontextmanager
async def lifespan(app: FastAPI):

    ping_task = asyncio.create_task(ping_self())
    yield

    ping_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    debug=settings.DEBUG,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.ALLOWED_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix=f"{settings.API_V1_STR}", tags=["analysis"])
app.include_router(academy.router, prefix=f"{settings.API_V1_STR}/academy", tags=["academy"])
app.include_router(fraud.router, prefix=f"{settings.API_V1_STR}/fraud", tags=["fraud"])
app.include_router(notifications.router, prefix=f"{settings.API_V1_STR}/notifications", tags=["notifications"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to FundingSense Backend API",
        "version": "1.0.0",
        "status": "healthy",
    }
