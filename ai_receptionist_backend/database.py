import mysql.connector

def get_connection():
    connection = mysql.connector.connect(
        host = "127.0.0.1",
        port = 3306,
        user = "root",
        password = "nishu1503",
        database = "receptionist_db"
    )
    return connection
