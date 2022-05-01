
from mysql.connector.cursor import MySQLCursor
from mysql.connector import Error, pooling
from mysql.connector.pooling import MySQLConnectionPool, PooledMySQLConnection

import time
import atexit


# Custom imports
import config


sqlConnecting = False
pool_connection = None

pooling.CNX_POOL_MAXSIZE = config.mysql["pool_size"]

def createCon():
    global sqlConnecting
    global pool_connection
    if sqlConnecting == False:
        sqlConnecting = True
        
        if pool_connection != None:
            pool_connection._remove_connections()
            print('\033[94mMySql:\033[33m', 'Waiting\033[94m for remaining transactions to end (10 sec)', '\033[0m')
            time.sleep(10)
            
            
        t = time.time()
        print('\033[94mMySql:\033[33m', 'Pool starting',config.mysql['pool_size'],'connections at', config.mysql['host'],'\033[0m')
        
        pool_connection = pooling.MySQLConnectionPool(
            pool_name="pool",
            pool_reset_session = True,
            **config.mysql
        )
        print('\033[94mMySql:\033[33m', 'Pool started in', time.time() -t ,'s\033[94m', pool_connection, '\033[0m')

        sqlConnecting = False
    return


class MysqlConn(object):
    #cur: MySQLCursor = None
    #con: PooledMySQLConnection = None
    cur = None
    con = None
    __data = None
   # __statement: str = None
    __statement = None

    def __init__(self):
        getCon = False
        global pool_connection
        global sqlConnecting

        while not getCon:
            if not sqlConnecting:
                try:
                    if not pool_connection == None:
                        self.con = pool_connection.get_connection()
                        self.cur = self.con.cursor()
                        getCon = True
                    else:
                        createCon()
                except Error as e:
                    print('\033[94mMySql:\033[33m', e, '033[0m')
                    createCon()
            if not getCon:
                print('sleeping?')
                time.sleep(0.25)
            


    def __call__(self, *args):
        return self.cur

    def close(self):
        try:
            if self.con.is_connected():
                self.con.close()
                self.cur.close()
        except Exception as error:
            print('Error on getting con', error)

    def get_data(self):
        if self.__data is None or self.cur.statement != self.__statement:
            self.__statement = self.cur.statement
            tdata = self.cur.fetchall()
            self.__data = [{self.cur.description[index][0]:column for index,
                            column in enumerate(value)} for value in tdata]
        return self.__data

    data = property(get_data)

    def fetchall(self):
        return self.cur.fetchall()


class middleware(object):
    def __init__(self, app):
        createCon()
        self.app = app

    def __call__(self, environ, start_response):        
        environ['con'] = MysqlConn()

        return self.app(environ, start_response)


def purgeConnection():
    if pool_connection:
        print('\033[94mMySql:\033[33m', 'Pool stopping\033[94m', pool_connection, '\033[0m')
        pool_connection._remove_connections()

atexit.register(purgeConnection)