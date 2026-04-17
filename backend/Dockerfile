FROM python:3.12-slim

WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install system dependencies
RUN apt-get update && apt-get install -y gcc build-essential python3-dev && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

EXPOSE 8000

# Start in development mode with reload
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
