from selenium import webdriver
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

# Queries List**
queries = [
      {
         "query": "snickers",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Snickers Bars 4 x 41.7g",
              "Morrisons": "Snickers Caramel, Nougat, Peanuts & Milk Chocolate Snack Bars Multipack 4 x 41.7g"

         }
      },
       {
          "query": "palmolive handwash",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Palmolive Naturals Milk & Honey Handwash",
              "Morrisons": "Palmolive Naturals Milk & Honey Handwash 300ml"

          }
      },
       {
          "query": "Nescafe Gold Blend Instant Coffee",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Nescafe Gold Blend Instant Coffee",
              "Morrisons": "Nescafe Gold Blend Instant Coffee 200g"

          }
      },
       {
          "query": "Twinings 80 English Breakfast tea bags",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Twinings English Breakfast 80 Plant-Based Tea Bags",
              "Morrisons": "Twinings Breakfast Tea 80 Bags 200g"

          }
      },
       {
          "query": "Schweppes Tonic Water",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Schweppes Tonic Water 12 x 150ml",
              "Morrisons": "Schweppes Tonic Water 12 x 150ml"

          }
     },
       {
          "query": "Monster Energy Drink Pipeline Punch",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Monster Energy Drink Pipeline Punch 4 x 500ml",
              "Morrisons": "Monster Energy Drink Pipeline Punch 4 x 500ml"

          }
      },
       {
          "query": "Innocent Smoothie Strawberries & Bananas",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Innocent Strawberry & Banana Smoothie",
              "Morrisons": "Innocent Strawberries & Bananas Smoothie 750ml"

          }
      },
       {
          "query": "Dr Pepper",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Dr Pepper 18 x 330ml",
              "Morrisons": "Dr Pepper Cans 18 x 330ml"

          }
      },
       {
          "query": "Galaxy Ripple Milk Chocolate",
          "target_names": {  
              "Asda": "Galaxy Ripple Chocolate Bars Multipack 4 x 30g",
              "Morrisons": "Galaxy Ripple 4 x 30g"

          }
      },
       {
          "query": "Milky Way Bag",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Milky Way Magic Stars Milk Chocolate Bites Pouch Bag 100g",
              "Morrisons": "Milky Way Magic Stars Milk Chocolate Bites Pouch Bag 100g"

          }
      },
       {
         "query": "Celebrations 350g",
         "target_names": {  # ✅ Separate target names for each store
             "Asda": "Celebrations Celebrations Easter Mix 350g",
             "Morrisons": "Celebrations Sharing Easter Mix Pouch   350g"

          }
      },
       {
          "query": "Nivea Sensitive Shower Gel",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Nivea Sensitive Shower Gel",
              "Morrisons": "NIVEA MEN Sensitive Shower Gel 400ml"

          }
      },
       {
         "query": "Dove Deeply Nourishing Bodywash",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Dove Advanced Care Body Wash Deeply Nourishing 225 ml",
              "Morrisons": "Deeply Nourishing Advanced Body Wash Shower Gel  225ml 225ml"

          }
      },
       {
          "query": "Imperial Leather Soap",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Imperial Leather Original Bar Soap 4 x 90g",
              "Morrisons": "Imperial Leather Bar Soap Original 4 x 90g"

          }
      },
  
       {
          "query": "Nescafe Gold Blend Smooth Instant Coffee",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Nescafe Gold Blend Instant Coffee",
              "Morrisons": "Nescafe Gold Blend Smooth Coffee 200g"

          }
      },
       {
          "query": "Nescafe Gold Blend Espresso Instant Coffee",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Nescafe Espresso 95g",
              "Morrisons": "Nescafe Gold Blend Espresso Coffee 95g"

          }
      },
       {
          "query": "Fever Tree Premium Indian Tonic Water",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Fever-Tree Premium Indian Tonic Water",
              "Morrisons": "Fever-Tree Premium Indian Tonic Water 500ml"

         }
      },
       {
          "query": "Schweppes Tonic Water",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Schweppes Indian Tonic Water 1L",
              "Morrisons": "Schweppes Tonic Water 1L"

          }
      },
   
       {
          "query": "Lucozade Energy Original",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Lucozade Energy Drink Original 900ml",
              "Morrisons": "Lucozade Energy Drink Original 900ml"

          }
      },
      {
          "query": "Tropicana Pure Tropical Fruit Juice",
         "target_names": {  # ✅ Separate target names for each store
              "Asda": "Tropicana Pure Tropical Fruit Juice 850ml",
              "Morrisons": "Tropicana Pure Tropical Fruit Juice 850ml"

          } 
      },
       {
          "query": "Tropicana Pure Orange & Mango Fruit Juice",
          "target_names": {  # ✅ Separate target names for each store
                 "Asda": "Tropicana Pure Orange & Mango Fruit Juice 850ml",
                 "Morrisons": "Tropicana Pure Orange & Mango Fruit Juice 850ml"

          }
      },
       {
          "query": "Tropicana Pure Smooth Orange Fruit Juice",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Tropicana Pure Smooth Orange Fruit Juice 900ml",
              "Morrisons": "Tropicana Pure Smooth Orange Fruit Juice 900ml"

          }
      },
       {
         "query": "Coca-Cola Original Taste Cans 24 x 330ml",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Coca-Cola Original Taste 24 x 330ml",
              "Morrisons": "Coca-Cola Original Taste Cans   24 x 330ml 24 x 330ml"

          }
      },
       {
          "query": "Palmolive Body Wash",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Palmolive Naturals Milk & Honey Shower Gel and Body Wash 500ml",
              "Morrisons": "Palmolive Naturals Milk and Honey Shower Gel 500ml"

          }
      },
       {
          "query": "Original Source Mint & Tea Tree Shower Gel",
          "target_names": {  # ✅ Separate target names for each store
             "Asda": "Original Source Mint & Tea Tree Vegan Shower Gel 500ml",
              "Morrisons": "Original Source Mint & Tea Tree Shower Gel 500ml"

          }
      },
       {
          "query": "Lynx Africa Bodywash",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Lynx Africa Shower Gel The G.O.A.T. Of Fragrance 225ml",
              "Morrisons": "Lynx Africa Bodywash 225ml"

          }
      },
       {
          "query": "Lynx Africa Shower Gel",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Lynx Shower Gel XXL Africa The G.O.A.T. Of Fragrance 500ml",
              "Morrisons": "Lynx Africa Shower Gel 500ml"

          }
      },
       {
          "query": "Starbucks Doubleshot Espresso Iced Coffee",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Starbucks Doubleshot Espresso Iced Coffee 200ml",
              "Morrisons": "Starbucks Doubleshot Espresso Iced Coffee 200ml"

          }
      },
       {
          "query": "Capri Sun Orange",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Capri-Sun Orange Juice Drink 330ml",
              "Morrisons": "Capri-Sun Orange 330ml"

          }
     },
       {
          "query": "Twinings Strong English Breakfast 80 Tea Bags",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Twinings Strong English Breakfast 80 Tea Bags 80pk",
              "Morrisons": "Twinings English Strong Breakfast Tea, 80 Tea Bags"

          }
      },
       {
         "query": "Volvic Touch of Fruit Strawberry Still",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Volvic Touch of Fruit Strawberry Flavoured Water 1.5L",
              "Morrisons": "Volvic Touch of Fruit Strawberry Natural Flavoured Water 1.5L"

          }
      },
       {
          "query": "Lipton Ice Tea Lemon",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Lipton Lemon Ice Tea",
              "Morrisons": "Lipton Ice Tea Lemon 1.25L"

          }
      },
       {
          "query": "Sprite",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Sprite 2L",
              "Morrisons": "Sprite 2L"

          }
      },
       {
          "query": "Fanta",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Fanta Orange 2L",
              "Morrisons": "Fanta Orange 2L"

          }
      },
       {
          "query": "Kinder Bueno",
         "target_names": {  # ✅ Separate target names for each store
             "Asda": "Kinder Bueno Hazelnuts & Milk Chocolate Bars Multipack 4x 4x43g",
              "Morrisons": "Kinder Bueno Milk Chocolate & Hazelnuts Bars Multipack 4 x 43g"

          }
      },
       {
          "query": "Bounty Ice Cream",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Bounty Chocolate & Coconut Ice Cream Bars 4pk",
              "Morrisons": "Bounty Ice Cream"
         }
      },
       {
          "query": "Maltesers Easter Milk Chocolate Mini Bunnies Bag",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Maltesers Chocolate Mini Bunnies 58g",
              "Morrisons": "Maltesers Easter Milk Chocolate Mini Bunnies Bag   58g 58g"

          }
      },
       {
          "query": "Starburst Original",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Starburst Minis Original Sweets Pouch Bag",
              "Morrisons": "Starburst Original Fruits"

          }
      },
       {
          "query": "Skittles Fruit Vegan Chewy Sweets",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Skittles Vegan Chewy Sweets Fruit Flavoured Pouch Bag 136g",
              "Morrisons": "Skittles Chewies Vegan Sweets Fruit Flavoured Pouch Bag"

          }
      },
       {
          "query": "Toblerone Box",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Toblerone Truffles Chocolate Box 180g",
              "Morrisons": "Toblerone Truffles Chocolate Gifting Box 180g"

          }
      },
       {
         "query": "Activia Strawberry Yoghurt",
          "target_names": {  # ✅ Separate target names for each store
            "Asda": "Activia Strawberry Yoghurt 4x115g",
              "Morrisons": "Activia Strawberry Yogurt 4 x 115g"

          } 
      },
       {
          "query": "Yorkshire Tea",
          "target_names": {  # ✅ Separate target names for each store
             "Asda": "Taylors of Harrogate Yorkshire Tea 80 Tea Bags 80pk",
              "Morrisons": "Yorkshire Tea Bags 80s 250g"

          }
      },
       {
          "query": "Nescafe Gold Blend Alta Rica Instant Coffee ",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Nescafe Alta Rica 95g",
              "Morrisons": "Nescafe Gold Alta Rica Instant Coffee 95g"

          }
      },
       {
          "query": "Ribena",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Ribena No Added Sugar Strawberry Juice Drink Cartons 6x250ml",
              "Morrisons": "Ribena Strawberry 6 x 250ml"

          }
      },
       {
          "query": "Monster Energy Drink Mango Loco",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Monster Energy Drink Mango Loco 4 x 500ml",
              "Morrisons": "Monster Energy Drink Mango Loco 4 x 500ml"

          }
      },
       {
          "query": "Ribena",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Ribena No Added Sugar Blackcurrant Juice Drink Cartons 6x250ml",
              "Morrisons": "Ribena No Added Sugar Blackcurrant Juice Drink 6 X 250Ml 6 x 250ml"

         }
      },
       {
          "query": "Innocent Smoothie Mangoes Passion Fruits & Apples",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Innocent Mango & Passion Fruit Smoothie 750ml",
              "Morrisons": "Innocent Mangoes Passion Fruits & Apples Smoothie"

          }
      },
       {
          "query": "Lindt Excellence Dark",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Lindt Excellence Intense Dark 90% Cocoa Chocolate Bar 100g",
              "Morrisons": "Lindt Excellence 90% Dark Supreme Chocolate Bar"

         }
      },
       {
          "query": "Quality Street",
          "target_names": {  # ✅ Separate target names for each store
              "Asda": "Quality Street Assorted Chocolate Box",
              "Morrisons": "Quality Street Chocolate Box 220g"

          }
      }
]

# ✅ **Website Configurations**
WEBSITES = [
     {
         "source_name": "Asda",
         "url": "https://groceries.asda.com/search/{query}",
         "product_container": "li.co-item.co-item--rest-in-shelf",
         "price_selector": "strong.co-product__price",
         "name_selector": "a.co-product__anchor",
         "hidden_label_selector": "span.co-product__hidden-label", 
         "extra_info_selector": "span.co-product__volume.co-item__volume" 
    },
    {
        "source_name": "Morrisons",
        "url": "https://groceries.morrisons.com/search?q={query}",
        "product_container": "div.product-card-container",
        "price_selector": "span[data-test='fop-price']",
        "name_selector": "h3._text_16wi0_1._text--m_16wi0_23",  # ✅ Main name
        "hidden_label_selector": None,  # ✅ No hidden label in Morrisons
        "extra_info_selector": "span._text_16wi0_1._text--m_16wi0_23.sc-1sjeki5-0.asqfi"  # Extra details like "4 x 41.7g"
    }
]




def scrape_website(driver, query, target_names, website):
    """Scrapes a single product from a website."""
    try:
        url = website["url"].format(query=query)
        print(f"🔍 Scraping: {target_names[website['source_name']]} from {website['source_name']} ({url})")

        driver.get(url)
        time.sleep(3)  # Wait for the page to load
         # ✅ **Run dynamic scrolling to load all products**
        
     

        soup = BeautifulSoup(driver.page_source, "html.parser")

        # Locate product tiles dynamically
        products = soup.select(website["product_container"])

        if not products:
            print(f"❌ No products found for {target_names[website['source_name']]} on {website['source_name']}.")
            return

        for product in products:
          
            # Extract main product name
            name_element = product.select_one(website["name_selector"])
            main_name = name_element.get_text(strip=True) if name_element else "N/A"

            # ✅ Extract additional details (if available)
            extra_info = ""
            if website["extra_info_selector"]:
                extra_info_element = product.select_one(website["extra_info_selector"])
                extra_info = extra_info_element.get_text(strip=True) if extra_info_element else ""

            # ✅ Combine full product name
            full_name = f"{main_name} {extra_info}".strip()
           
            

            # ✅ Extract product price and remove hidden labels
            price_element = product.select_one(website["price_selector"])
            if price_element:
                # Remove Hidden Labels (if present)
                if website["hidden_label_selector"]:
                    for hidden_label in price_element.select(website["hidden_label_selector"]):
                        hidden_label.extract()  
                
                price = price_element.get_text(strip=True)
            else:
                price = "N/A"

            # ✅ **Match using Separate Target Name per Store**
            expected_name = target_names[website["source_name"]]
            if expected_name.lower() in full_name.lower():
                print(f"✅ Found match on {website['source_name']}: {full_name} - {price}")

                # Save to MongoDB
                product_data = {
                    "product_name": full_name,
                    "source": website["source_name"],
                    "price": price,
                    "updated_at": datetime.utcnow().strftime("%d-%m-%y"),
                }
                result = collection.insert_one(product_data)
                print(f"📌 Inserted into MongoDB: {result.inserted_id}")
                break  # Stop after finding the correct product
        else:
            print(f"❌ No exact match found for {expected_name} on {website['source_name']}")

    except Exception as e:
        print(f"🚨 Error scraping {expected_name} from {website['source_name']}: {e}")


if __name__ == "__main__":
    # Set up Selenium WebDriver (Single session for efficiency)
    driver = webdriver.Edge()  # Ensure Edge WebDriver is installed and in PATH

    for website in WEBSITES:  # Loop through each website
        for product in queries:  # Loop through each product query
            scrape_website(driver, product["query"], product["target_names"], website)

    # Close the WebDriver
    driver.quit()
    print("✅ Scraping complete!")
