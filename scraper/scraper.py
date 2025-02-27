import sys
import os
import requests
from bs4 import BeautifulSoup
import re
import mysql.connector
from datetime import datetime
import json
import logging
import html2text
from dotenv import load_dotenv

load_dotenv()
USERNAME = os.getenv("TABROOM_USERNAME")
PASSWORD = os.getenv("TABROOM_PASSWORD")

cnx = mysql.connector.connect(user='root', password='', host='localhost', database='pref-buddy', port=3306)
cursor = cnx.cursor()

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='scraper.log',
    filemode='w'
)

def extract_ids(judge_data):
    get_ids = (
        """
        SELECT id FROM users WHERE id = %(tab_id)s
        """
    )

    ids = []

    try:
        for judge in judge_data:
            cursor.execute(get_ids, judge)
            result = cursor.fetchone()
            if result:
                ids.append(int(result[0]))
    except mysql.connector.Error as err:
        cnx.rollback()

    return ids


def scrape_judges(url):
    """
        Scrapes judge data from the list of judges at a tournmane given a Tabroom link.

        Parameters: link to the judges page for a given tournament

        Returns: a list of dictionaries, where each dictionary
        in the list corresponds to a judge attending a given tournament.
        The dictionary keys are f_name, l_name, affiliation, paradigm_link, and tab_id.
    """

    response = requests.get(url)

    soup = BeautifulSoup(response.text, 'html.parser')

    table = soup.find('table')
    rows = table.find_all('tr')
    headers = table.find_all('th')
    col_i = {}

    for i, header in enumerate(headers):
        header_text = header.text.strip().lower()

        if 'first' in header_text:
            col_i['f_name'] = i
        elif 'last' in header_text:
            col_i['l_name'] = i
        elif 'institution' in header_text:
            col_i['institution'] = i

    judge_info = []

    for row in rows:
        cols = list(row.find_all('td'))

        if len(cols):
            if (cols[0].find('a') is None):
                continue

            f_name = cols[col_i['f_name']].text.strip()
            l_name = cols[col_i['l_name']].text.strip()
            affiliation = cols[col_i['institution']].text.strip().replace("\n", "").replace("\t", "").replace("1", "")
            paradigm_link = cols[0].find('a').get('href')


            tab_id = int(re.search("judge_person_id=(\d+)", paradigm_link).group(1))

            data = {
                'f_name': f_name,
                'l_name': l_name,
                'affiliation': affiliation,
                'paradigm_link': paradigm_link,
                'tab_id': tab_id
            }

            judge_info.append(data)

    return judge_info

def save_judges_to_users(judge_info):
    # takes in a list of judge data, each element in the list is JSON
    sql = (
        """
        INSERT INTO users (f_name, l_name, affiliation, id, judge)
        VALUES (%(f_name)s, %(l_name)s, %(affiliation)s, %(tab_id)s, 1)
        ON DUPLICATE KEY UPDATE 
        f_name = VALUES(f_name),
        l_name = VALUES(l_name),
        affiliation = VALUES(affiliation),
        judge = 1
        """
    )

    try:
        cursor.executemany(sql, judge_info)
        cnx.commit()
    except mysql.connector.Error as err:
        cnx.rollback()
        logging.error(err)

    return

def save_judges_to_ranks(judge_data, ranker_id):
    # first have to extract id in users table based on tab_id in judge_data
    # then insert into ranks table

    insert_ids = (
        """
        INSERT IGNORE INTO ranks (judge_id, ranker_id)
        VALUES (%s, %s)
        """
    )

    try:
        ids = extract_ids(judge_data)
        
        for id in ids:
            cursor.execute(insert_ids, (id, ranker_id))
            cnx.commit()

    except mysql.connector.Error as err:
        logging.error(err)
        cnx.rollback()

    return

def save_judge_to_tourn(judge_data, t_id):
    sql = (
        """
        INSERT IGNORE into judging_at (user_id, tournament_id)
        VALUES(%s, %s)
        """
    )

    try:
        ids = extract_ids(judge_data)
        for id in ids:
            cursor.execute(sql, (id, t_id))
            cnx.commit()
    except mysql.connector.Error as err:
        logging.error(err)
        cnx.rollback()
    return

def save_to_judge_info(judge_data):
    # TODO: ADD SUPPORT FOR MULTIPLE AFFILIATIONS

    sql = (
        """
        INSERT IGNORE INTO judge_info (id)
        VALUES (%s)
        """
    )

    try:
        for judge in judge_data:
            scrape_paradigm(int(judge["tab_id"]))
            cursor.execute(sql, (int(judge["tab_id"]),)) 
            cnx.commit()   
    except mysql.connector.Error as err:
        cnx.rollback()
        
    return


def scrape_tourn(url):
    # Scraping from webpage linked by URL
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extracting name and tournament dates
    name = soup.find('h2').text.strip()
    sidenote_div = soup.find_all("div", class_="sidenote")[1]
    start_end = sidenote_div.find_all("div")[0].find_all("span")[1].text.strip()

    # Extracting month, date, and year from returned date strng
    dates = re.findall(r"([A-Za-z]{3}) (\d{1,2})", start_end)
    year = re.search(r"\d{4}", start_end).group(0)

    # Converting to datetime format
    start_date = datetime.strptime(dates[0][0] + " " + dates[0][1] + " " + year, "%b %d %Y").strftime("%Y-%m-%d")
    end_date = datetime.strptime(dates[1][0] + " " + dates[1][1] + " " + year, "%b %d %Y").strftime("%Y-%m-%d")
    
    # Extract tournament ID from URL
    tourn_id = int(re.search(r"tourn_id=(\d+)", url).group(1))
    
    tournament = {
        'id': tourn_id,
        'link': url,
        'name': name,
        'start_date': start_date,
        'end_date': end_date
    }

    return tournament

def save_tourn(tournament):
    sql = (
        """
        INSERT INTO tournaments (id, link, name, start_date, end_date)
        VALUES (%(id)s, %(link)s, %(name)s, %(start_date)s, %(end_date)s)
        ON DUPLICATE KEY UPDATE
            link = VALUES(link),
            name = VALUES(name),
            start_date = VALUES(start_date),
            end_date = VALUES(end_date)
        """
    )

    try:
        cursor.execute(sql, tournament) 
        cnx.commit()           
    except mysql.connector.Error as err:
        logging.error(err)
        cnx.rollback()
        
    return

def save_to_attending(u_id, t_id):
    sql = ("""
    INSERT IGNORE INTO attending (user_id, tournament_id)
    VALUES (%s, %s)
    """)

    try:
        cursor.execute(sql, (u_id, t_id))
        cnx.commit()
    except mysql.connector.Error as err:
        cnx.rollback()

    return
    
def scrape_tourn_api(url, user_id):
    """URL input should be list of judges for the tournament"""
    if not url:
        return json.dumps({"error": "URL is required"}), 400
    if not user_id:
        return json.dumps({"error": "User ID is required"}), 400
    
    tourn_id = re.search(r"tourn_id=(\d+)", url).group(1)
    tourn_url = "https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=" + tourn_id

    try:
        # Scrape tournament then save to tournaments table
        tournament = scrape_tourn(tourn_url)
        save_tourn(tournament)

        # Scrape judge information for the given tournament
        judges = scrape_judges(url)

        save_judges_to_users(judges)
        save_judges_to_ranks(judges, user_id)
        logging.debug(tourn_id)
        save_judge_to_tourn(judges, tourn_id)
        save_to_judge_info(judges)
        logging.debug(tourn_id)
        save_to_attending(user_id, tourn_id)

        result = {
            "status": "success",
            "message": f"Scraped tournament data from {url} for user {user_id}",
            "data": {"tourn_id": tourn_id}
        }

        sys.stdout.write(json.dumps(result) + "\n")
        sys.stdout.flush()

    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}\n")
        sys.stderr.flush()
        sys.exit(1)
        
        logging.error("Error in scrape_tourn: {e}")

def save_paradigm(id, paradigm):
    sql = ("""
    INSERT INTO judge_info (id, paradigm, updated)
    VALUES (%(id)s, %(paradigm)s, %(updated)s)
    ON DUPLICATE KEY UPDATE
        paradigm = VALUES(paradigm),
        updated = VALUES(updated)
    """)
    
    try:
        cursor.execute(sql, {'id': id, 'paradigm': paradigm, 'updated': datetime.now()})
        cnx.commit()
    except mysql.connector.Error as err:
        logging.error(err)
        cnx.rollback()

    return

def scrape_paradigm(id):
    login_url = "https://www.tabroom.com/user/login/login_save.mhtml"
    login_payload = {
        "username": USERNAME,
        "password": PASSWORD
    }

    session = requests.Session()

    url = "https://www.tabroom.com/index/paradigm.mhtml?judge_person_id=" + str(id)

    try:
        login_res = session.post(login_url, data=login_payload)
        if login_res.status_code != 200:
            logging.error("Can't log into Tabroom with given credentials")
            sys.stderr.write(f"Error: Can't log into Tabroom with given credentials \n")
            sys.stderr.flush()
            sys.exit(1)
        
        response = session.get(url)
        if response.status_code != 200:
            sys.stderr.write(f"Error: Failed to get judge page \n")
            sys.stderr.flush()
            sys.exit(1)

        soup = BeautifulSoup(response.text, 'html.parser')

        text_maker = html2text.HTML2Text()
        text_maker.body_width = 0
        text_maker.ignore_links = False
        text_maker.single_line_break = False

        paradigm_html = soup.find_all('div', class_="paradigm")
        paradigm = "No paradigm found."

        if len(paradigm_html) > 1:
            paradigm = text_maker.handle(str(paradigm_html[1])).strip()
            
        save_paradigm(id, paradigm)
        sys.stdout.write(json.dumps(paradigm))
        sys.stdout.flush()
        
    except Exception as e:
        sys.stderr.write(f"Error \n")
        sys.stderr.flush()
        sys.exit(1)
    
    return

def scrape_all():
    cnx = mysql.connector.connect(user='root', password='', host='localhost', database='pref-buddy', port=3306)
    cursor = cnx.cursor()

    get_ids = (
        """
        SELECT id FROM judge_info
        """
    )

    ids = []

    try:
        cursor.execute(get_ids)
        ids = cursor.fetchall()
    except mysql.connector.Error as err:
        logging.error(err)

    login_url = "https://www.tabroom.com/user/login/login_save.mhtml"
    login_payload = {
        "username": USERNAME,
        "password": PASSWORD
    }

    session = requests.Session()
    login_res = session.post(login_url, data=login_payload)
    if login_res.status_code != 200:
        logging.error("Can't log into Tabroom with given credentials")
        sys.stderr.write(f"Error: Can't log into Tabroom with given credentials \n")
        sys.stderr.flush()
        sys.exit(1)

    text_maker = html2text.HTML2Text()
    text_maker.body_width = 0
    text_maker.ignore_links = False
    text_maker.single_line_break = False

    logging.debug("TOTAL RECORDS: ", str(len(ids)))

    save_sql = (
        """
        INSERT INTO judge_info (id, paradigm, updated)
        VALUES (%(id)s, %(paradigm)s, %(updated)s)
        ON DUPLICATE KEY UPDATE
            paradigm = VALUES(paradigm),
            updated = VALUES(updated)
        """
    )

    for id in ids:
        url = "https://www.tabroom.com/index/paradigm.mhtml?judge_person_id=" + str(id[0])
        response = session.get(url)

        soup = BeautifulSoup(response.text, 'html.parser')

        paradigm_html = soup.find_all('div', class_="paradigm")
        paradigm = "No paradigm found."

        if len(paradigm_html) > 1:
            paradigm = text_maker.handle(str(paradigm_html[1])).strip()

        p = {'id': id[0], 'paradigm': paradigm, 'updated': datetime.now()}
    
        try:
            cursor.execute(save_sql, p)
            cnx.commit()
        except mysql.connector.Error as err:
            logging.error(err)
            cnx.rollback()
    
    cursor.close()
    cnx.close()

    return

if __name__ == '__main__':    
    scrape_type = sys.argv[1]

    if scrape_type == "tournament":
        url = sys.argv[2]
        user_id = sys.argv[3]
        scrape_tourn_api(url, user_id)
    elif scrape_type == "paradigm":
        url = sys.argv[2]
        scrape_paradigm(url)
    elif scrape_type == "all":
        scrape_all()

    # scrape_tourn_api("https://www.tabroom.com/index/tourn/judges.mhtml?category_id=92129&tourn_id=34410", 0)
    # save_to_attending(0, 34410)