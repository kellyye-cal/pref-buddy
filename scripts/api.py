import utils
import scraper

import mysql.connector
import json

import csv
import sys
import os

import time

# def setup_connection():
#     return mysql.connector.connect(
#         host=os.getenv("DB_HOST"),
#         user=os.getenv("DB_USER"),
#         password=os.getenv("DB_PASS"),
#         database=os.getenv("DB_NAME"),
#         port=os.getenv("DB_PORT")
#     )
    # return mysql.connector.connect(user='root', password='', host='localhost', database='pref-buddy', port=3306)

# def close_connection(cnx, cursor):
#     cnx.close()
#     cursor.close()
#     return

def export_prefs_csv(cursor, t_id, u_id, filepath):
    # TODO: Fetch pref data by tournament ID and user ID
    prefs = utils.get_prefs(t_id, u_id)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Name", "Rating"])
        writer.writerows(prefs)
    
    sys.stdout.write(json.dumps({"status": "success", "filename": filepath}))
    sys.stdout.flush()

if __name__ == '__main__':
    func_type = sys.argv[1]

    if func_type == "pref_csv":
        cnx = utils.get_connection()
        cursor = cnx.cursor()

        t_id = sys.argv[2]
        u_id = sys.argv[3]
        filepath = sys.argv[4]
        
        export_prefs_csv(cursor, t_id, u_id, filepath)

        utils.close_connection(cnx, cursor)

