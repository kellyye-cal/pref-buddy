import mysql.connector
import logging
from datetime import datetime, timedelta
import os

import scraper


# cnx = mysql.connector.connect(user='root', password='', host='localhost', database='pref-buddy', port=3306)
cnx = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        database=os.getenv("DB_NAME"),
        port=os.getenv("DB_PORT")
    )
cursor = cnx.cursor()

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='utils.log',
    filemode='w'
)


def extract_ids(judge_data):
    """
        Gets the IDs saved in the users table for each judge in judge_data

        Parameters: a list of judges

        Returns: list of ids
    """

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


def save_judges_to_users(judge_info):
    """
        Saves judge data to the users table.

        Parameters: a list of judge information, each element in the list
        is a JSON with the judge's f_name, l_name, affiliation, id

        Returns: nothing
    """
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
    """
        Given some judge data and a user's id, creates an entry into the ranks table

        Parameters: judge data and a user id

        Returns: nothing
    """
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
    """
    Takes note of a judge attending a tournament in the database

    Parameters: judge data, id of the tournament they are attending

    Returns: nothing
    """

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
    """
        Given a judge, saves their information to the judge_info table

        Parameters: data on judges

        Returns: nothing
    """

    # TODO: ADD SUPPORT FOR MULTIPLE AFFILIATIONS

    sql = (
        """
        INSERT IGNORE INTO judge_info (id)
        VALUES (%s)
        """
    )

    try:
        for judge in judge_data:
            scraper.scrape_paradigm(int(judge["tab_id"]))
            cursor.execute(sql, (int(judge["tab_id"]),)) 
            cnx.commit()   
    except mysql.connector.Error as err:
        cnx.rollback()
        
    return


def save_tourn(tournament):
    """
    Given data on a tournament, save it the tournaments table

    Parameters: tournament data (id, link, name, start date, end date, link to judges page)

    Returns: nothing
    """

    sql = (
        """
        INSERT INTO tournaments (id, link, name, start_date, end_date, j_url, last_updated)
        VALUES (%(id)s, %(link)s, %(name)s, %(start_date)s, %(end_date)s, %(j_url)s, %(last_updated)s)
        ON DUPLICATE KEY UPDATE
            link = VALUES(link),
            j_url = VALUES(j_url),
            name = VALUES(name),
            start_date = VALUES(start_date),
            end_date = VALUES(end_date),
            last_updated = VALUES(last_updated)
        """
    )

    tournament['last_updated'] = datetime.now()

    try:
        cursor.execute(sql, tournament) 
        cnx.commit()           
    except mysql.connector.Error as err:
        logging.error(err)
        cnx.rollback()
        
    return


def save_to_attending(u_id, t_id):
    """
    Makes record of a user (debater) attending a tournament
    by creating an entry in the attending table

    Parameters: user id and tournament id

    Returns: nothing
    """

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


def save_paradigm(id, paradigm):
    """
    Given a paradigm for a judge, save it to the judge_info table

    Paramaters:
        id: id of the judge (int)
        paradigm: the judge's paradigm (text)

    Returns: nothing
    """

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



def get_upcoming_tournaments():
    """
    Get a list of upcoming tournaments recorded in the database.

    Returns: a list of tournament's (id, j_url)
    """

    sql = "SELECT id, j_url FROM tournaments WHERE CURRENT_DATE < end_date"

    cursor.execute(sql)
    upcoming = cursor.fetchall()

    return upcoming



def get_num_judges(t_id):
    """
    For a tournament, gets the number of judges tracked attending it in the database

    Parameters:
        t_id: the id of the tournament (int)

    Returns: an integer, the number of judges at tournament with t_id

    """


    sql = "SELECT COUNT(*) FROM judging_at WHERE tournament_id = %s"

    cursor.execute(sql, (t_id, ))
    num_judges = cursor.fetchone()

    return num_judges


def update_judge_list(t_id, t_url):
    """
    Given a tournament, update the judge list in the MySQL
    database if new judges have been added to the tournament.

    Parameters:
        t_id: id of the tournament to update (id)
        t_url: link to the judges list of a tournament

    Returns: nothing
    """


    scraped_judges = scraper.scrape_judges(t_url)
    num_judges = len(scraped_judges)

    num_in_db = get_num_judges(t_id)

    if num_judges != num_in_db:
        save_judges_to_users(scraped_judges)
        save_judge_to_tourn(scraped_judges, t_id)
        save_to_judge_info(scraped_judges)

    return

def update_tourn_timestamp(t_id):
    sql = "UPDATE tournaments SET last_updated = (%s) WHERE id = (%s)"

    try:
        cursor.execute(sql, (datetime.now(), t_id))
        cnx.commit()

    except mysql.connector.Error as err:
        logging.error(err)
        cnx.rollback()

def get_paradigm_ts(id):
    sql = "SELECT updated FROM judge_info WHERE id = (%s)"
    cursor.execute(sql, (id,))
    last_updated = cursor.fetchone()

    return last_updated

def get_paradigm(id):
    sql = "SELECT paradigm FROM judge_info WHERE id = (%s)"
    cursor.execute(sql, (id,))
    paradigm = cursor.fetchone()

    return paradigm

def check_scrape_paradigm(id):
    last_updated = get_paradigm_ts(id)
    week_ago = datetime.now() - timedelta(weeks=1)

    if (last_updated):
        if (last_updated[0] < week_ago):
            return True
        else:
            return False

    return True

def get_prefs(t_id, u_id):
    sql = ("""
       SELECT CONCAT(u.f_name, ' ', u.l_name) AS name, rating
        FROM users as u
        INNER JOIN
        (SELECT r.judge_id, r.rating
        FROM ranks AS r
        INNER JOIN judging_at as j ON r.judge_id = j.user_id
        WHERE j.tournament_id = %s AND r.ranker_id = %s) AS prefs on prefs.judge_id = u.id;
    """)

    cursor.execute(sql, (t_id, u_id))
    prefs = cursor.fetchall()

    return prefs

