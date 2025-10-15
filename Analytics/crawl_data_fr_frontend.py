import time
import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument('--window-size=1920,1080')

driver = webdriver.Chrome(options=chrome_options)
driver.get('http://localhost:5173/')
time.sleep(2)

try:
    all_rows = []
    headers = []
    while True:
        table = driver.find_element(By.TAG_NAME, 'table')
        ths = table.find_elements(By.TAG_NAME, 'th')

        # Get headers once
        if not headers:
            # Only first 8 columns, ignore action column at last index
            headers = [th.text for th in ths[:8]]

        rows = table.find_elements(By.TAG_NAME, 'tr')[1:]
        for row in rows:
            tds = row.find_elements(By.TAG_NAME, 'td')
            cells = [td.text.replace('\n', ' ').strip() for td in tds[:-1]]  # Exclude last data column
            if any(cells):
                all_rows.append(cells)

        next_btn = driver.find_element(By.CSS_SELECTOR, '.ant-pagination-next')
        if 'ant-pagination-disabled' in next_btn.get_attribute('class'):
            break
        next_btn.click()
        time.sleep(1.2)

    # after can not click next button (no more data in table tag)
    with open('data/students_crawled.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, lineterminator='\n')
        writer.writerow(headers)
        writer.writerows(all_rows)
    print(f"Exported {len(all_rows)} students to students_crawled.csv")

except Exception as e:
    print('No table found or error:', e)
finally:
    driver.quit()
