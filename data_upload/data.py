import pandas as pd
import mysql.connector

import sys
import json

def setup_connection():
    return mysql.connector.connect(user='root', password='', host='localhost', database='pref-buddy', port=3306)

def get_users_df(cursor):
    cursor.execute("SELECT f_name, l_name, id FROM users")
    users = cursor.fetchall()

    users_df = pd.DataFrame(users,columns=['f_name', 'l_name', 'id'])
    return users_df

def clean_prefs(prefs):
    map_ratings = {'S': 6, 'X': 6}
    prefs['rating'] = prefs['rating'].replace(map_ratings)
    return prefs

def import_prefs(cnx, cursor, file, u_id):
    prefs = pd.read_csv(file)
    prefs = clean_prefs(prefs)
    users = get_users_df(cursor)

    merged = pd.merge(left=prefs, right=users, how='left', left_on=['first', 'last'], right_on=['f_name', 'l_name'])
    merged.dropna(axis=0, inplace=True)
    merged = merged[['id', 'rating']]
    merged.rename({'id': 'judge_id'}, axis=1, inplace=True)

    ranker_id = [u_id for _ in range(len(merged))]
    merged['ranker_id'] = ranker_id

    insert_sql = ("""
    INSERT into ranks (rating, judge_id, ranker_id)
    VALUES (%(rating)s, %(judge_id)s, %(ranker_id)s)
    ON DUPLICATE KEY UPDATE
    rating = VALUES(rating)
    """)
    
    for i in range(len(merged)):
        try:
            row = merged.iloc[i].to_dict()
            cursor.execute(insert_sql, row)
            cnx.commit()
        except mysql.connector.Error as err:
            cnx.rollback()
            sys.stderr.write(f"Error: {str(e)}\n")
            sys.stderr.flush()
            sys.exit(1)

    sys.stdout.write(json.dumps({"status": "success", "message": "Success"}))
    sys.stdout.flush()
            

if __name__ == '__main__':
    cnx = setup_connection()
    cursor = cnx.cursor()

    import_prefs(cnx, cursor, 'alta_prefs.csv', 0)
