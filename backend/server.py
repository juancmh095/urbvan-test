# -*- coding: utf-8 -*-

from datetime import datetime
from flask import jsonify, g, Flask, request, send_from_directory, current_app
from flask_cors import CORS
import bcrypt
from random import SystemRandom
import os
from werkzeug.utils import secure_filename

import config

# Middlewares
import middlewares.mysqlpooler as pool

app = Flask(__name__)
CORS(app)

# Ultimo en ejecutarse
app.wsgi_app = pool.middleware(app.wsgi_app)
# Primero en ejecutarse





@app.route("/employees/list", methods=['GET'])  
def employees():
    payload = []
    cur = request.environ['con']
    try:
        cur().execute("SELECT * FROM employee")
        payload = cur.data
    except Exception as err:
        print(err)
    finally:
        return jsonify(payload)

@app.route("/employees/add", methods=['POST'])  
def employee_add():
    payload = {'error': True, 'msg': 'err_employees_unknown'}
    cur = request.environ['con']
    try:
        data = request.json
        cur().execute("INSERT INTO `employee` (`name`,`lastname`,`dni`) VALUES (%s,%s,%s)",
                          (data['name'],data['lastname'],data['dni']))
        cur.con.commit()


        payload['error'] = False
        payload['msg'] = 'Agregado correctamente'
    
    except Exception as err:
        print(err)
    finally:
        return jsonify(payload)

@app.route("/employees", methods=['PUT'])  
def employee_update():
    payload = {'error': True, 'msg': 'err_employees_unknown'}
    cur = request.environ['con']
    try:
        data = request.json
        cur().execute("UPDATE `employee` SET name=%s, lastname=%s, dni=%s WHERE id=%s", (data['name'],data['lastname'],data['dni'],data['id']))
        cur.con.commit()
        

        payload['error'] = False
        payload['msg'] = 'Actualizado correctamente'

    except Exception as err:
        print(err)
    finally:
        return jsonify(payload)

@app.route("/employees/<id>", methods=['DELETE'])  
def employee_delete(id):
    payload = {'error': True, 'msg': 'err_employees_unknown'}
    cur = request.environ['con']
    try:
        cur().execute("DELETE FROM `employee` WHERE id={}".format(id))
        cur.con.commit()
        payload['error'] = False
        payload['msg'] = 'Eliminado correctamente'
    except Exception as err:
        print(err)
    finally:
        return jsonify(payload)




if __name__ == '__main__':
    app.run(**config.server)
