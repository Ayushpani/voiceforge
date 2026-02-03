
import numpy as np
import scipy.io.wavfile as wav
import requests
import json
import time

# 1. Create dummy audio file (silence/noise)
sample_rate = 24000
duration = 30.1 # seconds
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
# Generate a simple sine wave (440 Hz)
audio = 0.5 * np.sin(2 * np.pi * 440 * t)
# Convert to int16 PCM
audio_int16 = (audio * 32767).astype(np.int16)

wav.write("test_input.wav", sample_rate, audio_int16)
print("Created test_input.wav")

# 2. Upload audio
url = "http://localhost:8000"
files = {'file': open('test_input.wav', 'rb')}
print("Uploading audio...")
try:
    resp = requests.post(f"{url}/api/audio/upload", files=files, timeout=30)
    print(f"Upload status: {resp.status_code}")
    print(f"Upload response: {resp.text}")
    
    if resp.status_code != 200:
        exit(1)
        
    audio_data = resp.json()
    audio_id = audio_data['id']
    print(f"Got audio_id: {audio_id}")
    
    # 3. Clone voice
    print("Cloning voice...")
    clone_data = {
        "audio_id": audio_id,
        "name": "Test Voice",
        "tags": ["test"]
    }
    
    start_time = time.time()
    resp = requests.post(f"{url}/api/voice/clone", json=clone_data, timeout=120)
    end_time = time.time()
    
    print(f"Clone status: {resp.status_code}")
    print(f"Clone time: {end_time - start_time:.2f}s")
    print(f"Clone response: {resp.text}")
    
except Exception as e:
    print(f"Error: {e}")
