
from huggingface_hub import login
import os

try:
    # Use environment variable or prompt user
    token = os.environ.get("HF_TOKEN") or input("Enter your HuggingFace token: ")
    login(token=token)
    print("Logged in successfully to HuggingFace!")
except Exception as e:
    print(f"Login failed: {e}")
    exit(1)
