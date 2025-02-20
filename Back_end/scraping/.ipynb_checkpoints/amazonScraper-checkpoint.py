import pandas as pd
from selenium import webdriver
from bs4 import BeautifulSoup
import time
from tabulate import tabulate

# Set up Edge WebDriver
driver = webdriver.Edge()

# Amazon UK URL for Data Engineering Books
url = "https://www.amazon.co.uk/s?k=data+engineering+books&rh=n%3A266239%2Cp_72%3A184315031"

# Open Amazon in Edge
driver.get(url)
time.sleep(5)  # Allow page to load completely

# Get the page source and parse with BeautifulSoup
soup = BeautifulSoup(driver.page_source, "html.parser")

# Locate the main search results container
search_results = soup.select("div.sg-col-inner")

books = []
INVALID_AUTHOR_KEYWORDS = ["Paperback", "Hardcover", "Audiobook", "Kindle Edition", "Board book", "Mass Market Paperback"]

# Loop through each search result item
for item in search_results:
    # Extract book name
    name_element = item.select_one("h2.a-size-medium.a-color-base.a-text-normal")
    book_name = name_element.get_text(strip=True) if name_element else "N/A"

    # Extract author name
    author_element = item.select_one("a.a-size-base.a-link-normal.s-underline-text.s-underline-link-text.s-link-style")
    author_name = author_element.get_text(strip=True) if author_element else "N/A"

    # Ignore books where the author field contains "Paperback", "Hardcover", etc.
    if any(keyword in author_name for keyword in INVALID_AUTHOR_KEYWORDS):
        continue  # Skip this book entry

    # Extract price
    price_element = item.select_one("span.a-offscreen")
    book_price = price_element.get_text(strip=True) if price_element else "N/A"

    # Extract year of publication
    year_element = item.select_one("span.a-size-base.a-color-secondary.a-text-normal")
    year_of_publication = year_element.get_text(strip=True) if year_element else "N/A"

    # Extract rating
    rating_element = item.select_one("span.a-icon-alt")
    rating = rating_element.get_text(strip=True) if rating_element else "N/A"

    # Store only valid books (ensuring at least title & price exist)
    if book_name != "N/A" and book_price.startswith("£"):
        books.append({
            "Title": book_name,
            "Author": author_name,
            "Price": book_price,
            "Year": year_of_publication,
            "Rating": rating
        })

# Convert to Pandas DataFrame
df = pd.DataFrame(books)

# Display the DataFrame as a formatted table using tabulate
print(tabulate(df, headers="keys", tablefmt="grid"))

# Save to CSV file
csv_filename = "amazon_Data_Engineering_books.csv"
df.to_csv(csv_filename, index=False)
print(f"\n✅ Data saved to {csv_filename}")

# Close WebDriver
driver.quit()
