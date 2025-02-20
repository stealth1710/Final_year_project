from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import time
from datetime import datetime

# Load environment variables
load_dotenv()

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "Products"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db["scraped_prices"]  # Collection to store scraped data

# List of queries (Multiple products to scrape)
queries = [
    {"query": "snickers", "target_name": "Snickers"},
    {"query": "kitkat", "target_name": "KitKat 2 Finger Original"},
    {"query": "twix", "target_name": "Twix"},
    {"query": "coca cola", "target_name": "Coca-Cola Zero Sugar 2l"},
]

# List of websites to scrape from
WEBSITES = [
    {
        "source_name": "Aldi",
        "url": "https://groceries.aldi.co.uk/en-GB/Search?keywords={query}",
        "price_selector": ".h4 > span",
        "name_selector": "a[data-qa='search-product-title']",
    }
]


def scrape_website(driver, query, target_name, website):
    """Scrapes a single product from a website."""
    try:
        url = website["url"].format(query=query)
        print(f"🔍 Scraping: {target_name} from {website['source_name']} ({url})")

        driver.get(url)
        time.sleep(5)  # Wait for the page to load

        soup = BeautifulSoup(driver.page_source, "html.parser")

        # Locate product tiles
        products = soup.find_all("div", class_="product-tile")

        if not products:
            print(f"❌ No product tiles found for {target_name} on {website['source_name']}.")
            return

        for product in products:
            # Extract product name
            name_element = product.select_one(website["name_selector"])
            name = name_element.get_text(strip=True) if name_element else "N/A"

            # Extract product price
            price_element = product.select_one(website["price_selector"])
            price = price_element.get_text(strip=True) if price_element else "N/A"

            # Check if the product name matches the target name
            if target_name.lower() in name.lower():
                print(f"✅ Found match on {website['source_name']}: {name} - {price}")

                # Save to MongoDB
                product_data = {
                    "product_name": name,
                    "source": website["source_name"],
                    "price": price,
                    "updated_at": datetime.utcnow().strftime("%d-%m-%y"),
                }
                result = collection.insert_one(product_data)
                print(f"📌 Inserted into MongoDB: {result.inserted_id}")
                break  # Stop after finding the first matching product
        else:
            print(f"❌ No exact match found for {target_name} on {website['source_name']}")

    except Exception as e:
        print(f"🚨 Error scraping {target_name} from {website['source_name']}: {e}")


if __name__ == "__main__":
    # Set up Selenium WebDriver (Single session for efficiency)
    driver = webdriver.Edge()  #  Edge WebDriver 

    for website in WEBSITES:  # Loop through each website
        for product in queries:  # Loop through each product query
            scrape_website(driver, product["query"], product["target_name"], website)

    # Close the WebDriver
    driver.quit()
    print("✅ Scraping complete!")
