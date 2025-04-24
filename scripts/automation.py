import mysql.connector
import scraper
import utils
import schedule
import time
import logging

import sys
import os
import requests
import json

from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='automation.log',
    filemode='w'
)


def setup_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        database=os.getenv("DB_NAME"),
        port=os.getenv("DB_PORT")
    )
    # return mysql.connector.connect(user='root', password='', host='localhost', database='pref-buddy', port=3306)

### Function for daily scraping of judges from upcoming tournaments.
def daily_judge_scrape():
    logging("Scraped judges today.")

    # cnx = setup_connection()
    # cursor = cnx.cursor()

    upcoming = scraper.get_upcoming_tournaments()

    for t in upcoming:
        utils.update_tourn_timestamp(t[0])
        utils.update_judge_list(t[0], t[1])

    return



### Automation schedule
schedule.every().day.at("08:00").do(daily_judge_scrape)

while True:
    schedule.run_pending()
    time.sleep(60)