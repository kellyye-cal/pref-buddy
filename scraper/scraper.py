import requests
from bs4 import BeautifulSoup
import re
import mysql.connector

cnx = mysql.connector.connect(user='root', password='', host='localhost', database='pref-buddy', port=3306)
cursor = cnx.cursor()

def extract_ids(judge_data):
    get_ids = (
        """
        SELECT id FROM users WHERE tab_id = %(tab_id)s
        """
    )

    ids = []

    try:
        for judge in judge_data:
            cursor.execute(get_ids, judge)
            result = cursor.fetchone()
            if result:
                ids.append(result[0])
    except mysql.connector.Error as err:
        cnx.rollback()

    return ids

def scrape_judges(url):

    # url = "https://www.tabroom.com/index/tourn/judges.mhtml?category_id=82525&tourn_id=31084"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    table = soup.find('table', id='judgelist')
    rows = table.find_all('tr')

    judge_info = []

    for row in rows:
        cols = list(row.find_all('td'))

        if len(cols):
            f_name = cols[1].text.strip()
            l_name = cols[2].text.strip()
            affiliation = cols[3].text.strip().replace("\n", "").replace("\t", "").replace("1", "")
            paradigm_link = cols[1].select_one('a').get('href')

            # extract the tabroom id
            # '/index/paradigm.mhtml?judge_person_id=90885'
            tab_id = re.search("judge_person_id=(\d+)", paradigm_link).group(1)

            # judge_info.append([f_name, l_name, affiliation, paradigm_link])
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
        INSERT INTO users (f_name, l_name, affiliation, tab_id, judge)
        VALUES (%(f_name)s, %(l_name)s, %(affiliation)s, %(tab_id)s, 1)
        """
    )

    try:
        cursor.executemany(sql, judge_info)
        cnx.commit()
    except mysql.connector.Error as err:
        cnx.rollback()

    return

def save_judges_to_ranks(judge_data, ranker_id):
    # first have to extract id in users table based on tab_id in judge_data
    # then insert into ranks table

    insert_ids = (
        """
        INSERT INTO ranks (judge_id, ranker_id)
        VALUES (%s, %s)
        """
    )

    try:
        ids = extract_ids(judge_data)
        
        for id in ids:
            cursor.execute(insert_ids, (id, ranker_id))
            cnx.commit()

    except mysql.connector.Error as err:
        cnx.rollback()

    return

def save_judge_to_tourn(judge_data, t_id):

    sql = (
        """
        INSERT into judging_at (user_id, tournament_id)
        VALUES(%s, %s)
        """
    )

    try:
        ids = extract_ids(judge_data)
        for id in ids:
            cursor.execute(sql, (id, t_id))
            cnx.commit()
    except mysql.connector.Error as err:
        cnx.rollback()
    return

if __name__ == '__main__':
    data = scrape_judges("https://www.tabroom.com/index/tourn/judges.mhtml?category_id=82525&tourn_id=31084")
    save_judges_to_users(data)
    save_judges_to_ranks(data, 0)
    save_judge_to_tourn(data, 2)

    # have to save info to judge_info, judging_at