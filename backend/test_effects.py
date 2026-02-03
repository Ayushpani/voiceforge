
import requests
import json
import time

url = "http://localhost:8000"

def generate_with_effects(speed, pitch):
    print(f"\nGenerating with Speed={speed}, Pitch={pitch}...")
    data = {
        "text": "Hello world, testing audio effects.",
        "speed": speed,
        "pitch": pitch
    }
    
    start = time.time()
    resp = requests.post(f"{url}/api/generate", json=data, timeout=60)
    end = time.time()
    
    if resp.status_code == 200:
        res = resp.json()
        print(f"Success! Duration: {res['duration_seconds']:.2f}s")
        print(f"Time taken: {end - start:.2f}s")
        return res
    else:
        print(f"Failed: {resp.text}")
        return None

# Monitor duration scaling
# Normal
r1 = generate_with_effects(1.0, 0.0)
if r1:
    dur1 = r1['duration_seconds']
    
    # Fast (should be shorter)
    r2 = generate_with_effects(1.5, 0.0)
    if r2:
        dur2 = r2['duration_seconds']
        expected = dur1 / 1.5
        print(f"Expected ~{expected:.2f}s, Got {dur2:.2f}s")
        
    # Pitch shift (duration should be same)
    r3 = generate_with_effects(1.0, 5.0)
    if r3:
        dur3 = r3['duration_seconds']
        print(f"Expected ~{dur1:.2f}s, Got {dur3:.2f}s")
