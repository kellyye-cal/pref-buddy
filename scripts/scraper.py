import sys
import os
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime
import json
import logging
import html2text
from dotenv import load_dotenv

import utils

load_dotenv()

USERNAME = os.getenv("TABROOM_USERNAME")
PASSWORD = os.getenv("TABROOM_PASSWORD")

# cnx = mysql.connector.connect(user='root', password='', host='localhost', database='pref-buddy', port=3306)


logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='scraper.log',
    filemode='w'
)

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


            tab_id = int(re.search(r"judge_person_id=(\d+)", paradigm_link).group(1))

            data = {
                'f_name': f_name,
                'l_name': l_name,
                'affiliation': affiliation,
                'paradigm_link': paradigm_link,
                'tab_id': tab_id
            }

            judge_info.append(data)

    return judge_info

def scrape_tourn(t_url, judges_url):
    # Scraping from webpage linked by URL
    response = requests.get(t_url)
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
        'j_url': judges_url,
        'link': url,
        'name': name,
        'start_date': start_date,
        'end_date': end_date
    }

    return tournament

    
def scrape_tourn_api(url, user_id):
    """URL input should be list of judges for the tournament"""
    if not url:
        sys.stderr.write(json.dumps({"error": "URL is requirfed"}), 400)
        sys.stderr.flush()
        return
    
    if not user_id:
        sys.stderr.write(json.dumps({"error": "User ID is required"}), 400)
        sys.stderr.flush()
        return

    cnx = utils.get_connection()
    cursor = cnx.cursor()

    
    tourn_id = re.search(r"tourn_id=(\d+)", url).group(1)
    tourn_url = "https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=" + tourn_id

    try:
        # Scrape tournament then save to tournaments table
        tournament = scrape_tourn(tourn_url, url)
        utils.save_tourn(tournament)

        # Scrape judge information for the given tournament
        judges = scrape_judges(url)

        utils.save_judges_to_users(judges)
        utils.save_judges_to_ranks(judges, user_id)
        utils.save_judge_to_tourn(judges, tourn_id)
        utils.save_to_judge_info(judges)
        utils.save_to_attending(user_id, tourn_id)

        result = {
            "status": "success",
            "message": f"Scraped tournament data",
            "data": {"tourn_id": tourn_id}
        }

        return result

    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}\n")
        sys.stderr.flush()
        cursor.close()
        cnx.close()
        return {"status": "error", "message": str(e)}
        
        logging.error("Error in scrape_tourn: {e}")
    finally:
        utils.close_connection(cnx, cursor)

def scrape_paradigm(id):
    should_scrape = utils.check_scrape_paradigm(id)

    if (not should_scrape):
        result = {
            "status": "success",
            "message": f"No need to scrape, recently updated",
            "data": {"paradigm": utils.get_paradigm(id)}
        }

        return result

    login_url = "https://www.tabroom.com/user/login/login_save.mhtml"
    login_payload = {
        "username": USERNAME,
        "password": PASSWORD
    }

    session = requests.Session()
    
    try:
        login_res = session.post(login_url, data=login_payload, headers=headers, allow_redirects=True)


        if login_res.status_code != 200:
            logging.error("Can't log into Tabroom with given credentials")
            sys.stderr.write(f"Error: Can't log into Tabroom with given credentials \n")
            sys.stderr.flush()
            return
    

        response = session.get(url, headers=headers)


        if response.status_code != 200:
            sys.stderr.write(f"Error: Failed to get judge page \n")
            sys.stderr.flush()
            return

        soup = BeautifulSoup(response.text, 'html.parser')

        text_maker = html2text.HTML2Text()
        text_maker.body_width = 0
        text_maker.ignore_links = False
        text_maker.single_line_break = False

        paradigm_html = soup.find_all('div', class_="paradigm")
        paradigm = utils.get_paradigm(id)[0]

        if len(paradigm_html) > 1:
            paradigm = text_maker.handle(str(paradigm_html[1])).strip()
            
        utils.save_paradigm(id, paradigm)

        result = {
            "status": "success",
            "message": f"Scraped paradigm",
            "data": {"paradigm": paradigm}
        }

        return result
        
    except Exception as e:
        logging.error(e)
        sys.stderr.write(f"Error \n")
        sys.stderr.flush()
        return
    

def update_tournament(t_id, j_url):
    logging.debug("Called update tournament")
    utils.update_tourn_timestamp(t_id)
    utils.update_judge_list(t_id, j_url)

    sys.stdout.write(json.dumps({"status": "success", "message": "Success"}))
    sys.stdout.flush()
    return

if __name__ == '__main__':    
    scrape_type = sys.argv[1]

    if scrape_type == "tournament":
        url = sys.argv[2]
        user_id = sys.argv[3]
        result = scrape_tourn_api(url, user_id)

        sys.stdout.write(json.dumps(result) + "\n")
        sys.stdout.flush()

    elif scrape_type == "paradigm":
        id = sys.argv[2]
        result = scrape_paradigm(id)

        sys.stdout.write(json.dumps(result) + "\n")
        sys.stdout.flush()

    # elif scrape_type == "all":
    #     scrape_all()
    elif scrape_type == "update_judge_list":
        t_id = sys.argv[2]
        j_url = sys.argv[3]
        try:
            update_tournament(t_id, j_url)
        except Exception as e:
            sys.stderr.write(f"Error: {str(e)}\n")
            sys.stderr.flush()
            sys.exit(1)

        sys.stdout.write(json.dumps({"status": "success", "message": "Success"}))
        sys.stdout.flush()