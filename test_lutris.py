import requests

try:
    response = requests.get("https://lutris.net/api/games?search=GTA", headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })
    print("Status Code:", response.status_code)
    data = response.json()
    print("Keys:", data.keys() if isinstance(data, dict) else "Not a dict")
    if isinstance(data, dict) and "results" in data:
        print("Results length:", len(data["results"]))
        if len(data["results"]) > 0:
            print("First item keys:", data["results"][0].keys())
            print("First item preview:", data["results"][0])
except Exception as e:
    print("Error:", e)
