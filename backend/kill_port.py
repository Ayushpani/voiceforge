import subprocess
import time
import re

def get_pids(port):
    try:
        output = subprocess.check_output(f"netstat -ano | findstr :{port}", shell=True).decode()
        pids = set()
        for line in output.splitlines():
            parts = line.strip().split()
            if len(parts) > 4:
                pids.add(parts[-1])
        return list(pids)
    except subprocess.CalledProcessError:
        return []

def kill_pid(pid):
    try:
        subprocess.check_call(f"taskkill /F /PID {pid}", shell=True)
        print(f"Killed {pid}")
    except:
        pass

port = 8000
for i in range(5):
    pids = get_pids(port)
    if not pids:
        print("Port clean")
        break
    for pid in pids:
        kill_pid(pid)
    time.sleep(1)
