import requests

url = "https://store.epicgames.com/graphql"
query = """
query searchStoreQuery($keywords: String, $count: Int, $country: String!, $locale: String) {
  Catalog {
    searchStore(keywords: $keywords, count: $count, country: $country, locale: $locale) {
      elements {
        title
        id
        keyImages {
          type
          url
        }
      }
    }
  }
}
"""
variables = {"keywords": "GTA", "count": 2, "country": "US", "locale": "en-US"}
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json={'query': query, 'variables': variables}, headers=headers)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
