from flask import Flask, request, jsonify, session
import sqlite3
from datetime import datetime
from functools import wraps
import os
from flask_cors import CORS
import utils

app = Flask(__name__)
CORS(app)
secret_key = os.urandom(24)
app.secret_key = secret_key
DATABASE = 'database/hotel.db'
session={}

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def role_required(roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session or session['role'] not in roles:
                return jsonify({
                    "status": "error",
                    "code": "UNAUTHORIZED",
                    "message": "Accesso non autorizzato"
                }), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

#API LOGIN (OK)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        (username, password)
    ).fetchone()
    conn.close()

    if user:
        session['user_id'] = user['id']
        session['username'] = user['username']
        session['role'] = user['role']
        return jsonify({
            "status": "success",
            "message": "Login effettuato con successo",
            "data": {
                "id": user['id'],
                "username": user['username'],
                "role": user['role'],
                "full_name": user['full_name'],
                "email": user['email'],
                "phone": user['phone']
            },
        }), 200
    else:
        return jsonify({
            "status": "error",
            "code": "INVALID_CREDENTIALS",
            "message": "Username o password errati"
        }), 401
        
@app.route('/api/logout', methods=['POST'])
def logout():
    """
    Effettua il logout dell'utente
    """
    session.clear()
    return jsonify({
        "status": "success",
        "message": "Logout effettuato con successo"
    })

@app.route("/api/register", methods=["POST"])
def register_user():
    """
    Registra un nuovo utente e assegna i ruoli

    :param db_path: percorso del database SQLite
    :param username: nome utente
    :param password: password in chiaro (verrà hashata)
    :param email: email dell'utente
    :param roles: lista di ruoli da assegnare (es. ['user', 'admin'])
    :return: ID del nuovo utente o None in caso di errore
    """
    data= request.get_json()
    if data is None:
        return utils.error_response("Dati non validi o mancanti")  
    if not data.get("username") or not data.get("password") or not data.get("email"):
        return utils.error_response("Username, password ed email sono richiesti")
    
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")
    full_name = data.get("full_name")
    email = data.get("email")
    phone = data.get("phone")
    hotel_id = data.get("hotel_id")
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Verifica se l'username è già in uso   
        existing_user = cursor.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        ).fetchone()
        if existing_user:
            return utils.error_response(message="Username già in uso") 

        existing_email = cursor.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        ).fetchone()
        if existing_email:
            return utils.error_response(message="Email già in uso")       
        
        if role in ['admin', 'guest']:
            cursor.execute(
                "INSERT INTO users (username, password, role, full_name, email, phone) VALUES (?, ?, ?, ?, ?, ?)",
                (username, password, role, full_name, email, phone)
            )
        else:
            
            if not hotel_id:
                return utils.error_response(message="Hotel ID richiesto per reception")
            cursor.execute(
                "INSERT INTO users (username, password, role, full_name, email, phone, hotel_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (username, password, role, full_name, email, phone, hotel_id)
            )

        conn.commit()
        return utils.success_response(data={"user_id": data}, message="Registrazione avvenuta con successo")
    except (sqlite3.IntegrityError, ValueError) as e:
        if conn:
            conn.rollback()
        print(f"Errore registrazione: {e}")
        return utils.error_response(message="Registrazione fallita")
    finally:
        if conn:
            conn.close()

@app.route('/api/get_hotels', methods=['GET'])
def get_hotels():
    conn = get_db_connection()
    try:
        hotels = conn.execute('SELECT * FROM hotels').fetchall()
        return jsonify({
            "status": "success",
            "data": {
                "hotels": [dict(hotel) for hotel in hotels],
                "count": len(hotels)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Errore recupero hotel: {str(e)}"
        }), 500

@app.route('/api/remove_hotel/<int:hotel_id>', methods=['DELETE'])
@role_required(['admin'])
def remove_hotel(hotel_id):
    if not hotel_id:
        return jsonify({
            "status": "error",
            "code": "HOTEL_ID Required",
            "message": "ID hotel mancante"
        }), 400

    conn = get_db_connection()
    try:
        hotel = conn.execute('SELECT * FROM hotels WHERE id = ?', (hotel_id,)).fetchone()
        if not hotel:
            return jsonify({
                "status": "error",
                "code": "HOTEL NOT FOUND",
                "message": "Hotel da rimuovere, non trovato"
            }), 404
        
        conn.execute('DELETE FROM hotels WHERE id = ?', (hotel_id,))
        conn.commit()
        
        return jsonify({
            "status": "success",
            "message": f"Hotel {hotel_id} eliminato con successo"
        }), 200
    except sqlite3.Error as e:
        return jsonify({
            "status": "error",
            "code": "DATABASE_ERROR",
            "message": f"Errore nel database: {str(e)}"
        }), 500

@app.route('/api/create_hotel', methods=['POST'])
@role_required(['admin'])
def create_hotel():
    """
    Crea un hotel di esempio per testare le funzionalità
    """
    data= request.get_json()
    if data is None:
        return utils.error_response("Dati non validi o mancanti") 
    
    name= data.get('name', 'Hotel Test')
    address= data.get('address', 'Via Roma 1')
    city= data.get('city', 'Roma')
    latitude= data.get('latitude', 41.9028)
    longitude= data.get('longitude', 12.4964)
    description= data.get('description', 'Hotel di test per il progetto')
    conn = get_db_connection()
    try:
        # Verifica se l'hotel esiste già
        existing_hotel = conn.execute(
            'SELECT * FROM hotels WHERE name = ? AND address = ? AND city = ?',
            (name, address, city)
        ).fetchone()
        if existing_hotel:
            return jsonify({
                "status": "error",
                "code": "DUPLICATE_HOTEL",
                "message": "Hotel già esistente"
            }), 409
        
        conn.execute('''
        INSERT INTO hotels (name, address, city, latitude, longitude, description)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (name, address, city, latitude, longitude, description))
        conn.commit()
        return jsonify({
            "status": "success",
            "message": "Hotel creato con successo"
        }), 201
    except sqlite3.IntegrityError as e:
        return jsonify({
            "status": "error",
            "message": f"Errore creazione hotel: {str(e)}"
        }), 409
    finally:
        conn.close()
        

@app.route('/api/get_rooms', methods=['GET'])
@role_required(['admin', 'reception'])
def get_rooms():
    """
    Ottiene tutte le stanze
    """
    
    conn= get_db_connection()
    try:
        rooms= conn.execute('''
        SELECT r.*, h.name as hotel_name, h.city as hotel_city, h.address as hotel_address
        FROM rooms r
        JOIN hotels h ON r.hotel_id = h.id
        ''').fetchall()
        
        return utils.success_response(data=[dict(room) for room in rooms], message="Stanze recuperate con successo")
    except Exception as e:
        return utils.error_response(f"Errore recupero stanze: {str(e)}")
    finally:
        conn.close()

#AGGIUNGI STANZA (OK)
@app.route('/api/add_rooms', methods=['POST'])
@role_required(['admin'])
def add_room():
    data = request.get_json()
    print(data)
    required_fields = ['room_number', 'room_type',
                       'capacity', 'price_per_night', 'hotel_id']

    if not all(field in data for field in required_fields):
        return jsonify({
            "status": "error",
            "code": "MISSING_FIELDS",
            "message": f"Campi obbligatori mancanti: {', '.join(required_fields)}"
        }), 400

    conn = get_db_connection()
    try:
        conn.execute('''
        INSERT INTO rooms (room_number, room_type, capacity, price_per_night, hotel_id, description)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['room_number'],
            data['room_type'],
            data['capacity'],
            data['price_per_night'],
            data['hotel_id'],
            data.get('description', '')
        ))
        conn.commit()
        return jsonify({
            "status": "success",
            "message": "Stanza aggiunta con successo"
        }), 201
    except sqlite3.IntegrityError as e:
        return jsonify({
            "status": "error",
            "code": "DUPLICATE_ROOM",
            "message": f"Numero stanza già esistente {e}"
        }), 409
    finally:
        conn.close()

#RIMUOVI STANZA (OK)
@app.route('/api/rooms/<int:room_id>', methods=['DELETE'])
@role_required(['admin'])
def delete_room(room_id):
    conn = get_db_connection()
    try:
        result = conn.execute('DELETE FROM rooms WHERE id = ?', (room_id,))
        conn.commit()
        if result.rowcount == 0:
            return jsonify({
                "status": "error",
                "code": "ROOM_NOT_FOUND",
                "message": "Stanza non trovata"
            }), 404
        return jsonify({"status": "success", "message": "Stanza eliminata"})
    finally:
        conn.close()

@app.route('/api/delete_rooms', methods=['DELETE'])
@role_required(['admin'])
def delete_room_by_details():
    room_number = request.args.get('room_number')
    nome_hotel = request.args.get('nome_hotel')

    if not room_number or not nome_hotel:
        return jsonify({
            "status": "error",
            "code": "MISSING_PARAMETERS",
            "message": "Sono richiesti sia room_number che nome_hotel"
        }), 400

    conn = get_db_connection()
    try:
        # Prima verifichiamo l'esistenza della stanza
        room_check = conn.execute(
            'SELECT id FROM rooms WHERE room_number = ? AND hotel_id = (SELECT id FROM hotels WHERE name = ?)',
            (room_number, nome_hotel)
        ).fetchone()

        if not room_check:
            return jsonify({
                "status": "error",
                "code": "ROOM_NOT_FOUND",
                "message": "Stanza non trovata nell'hotel specificato"
            }), 404

        # Se esiste, procediamo con l'eliminazione
        result = conn.execute(
            'DELETE FROM rooms WHERE room_number = ? AND hotel_id = (SELECT id FROM hotels WHERE nome = ?)',
            (room_number, nome_hotel)
        )
        conn.commit()

        return jsonify({
            "status": "success",
            "message": "Stanza eliminata con successo",
            "deleted_room": {
                "room_number": room_number,
                "hotel": nome_hotel
            }
        })
    except sqlite3.Error as e:
        return jsonify({
            "status": "error",
            "code": "DATABASE_ERROR",
            "message": f"Errore nel database: {str(e)}"
        }), 500
    finally:
        conn.close()

@app.route('/api/users/bookings', methods=['GET'])
@role_required(['guest', 'reception', 'admin'])  # Decoratore per controllare i permessi
def get_user_bookings():
    """
    Ottiene lo storico completo delle prenotazioni di un utente
    Parametri opzionali:
    - user_id: (solo admin/reception) ID dell'utente da cercare
    - status: filtra per stato (confirmed, canceled, completed)
    - limit: numero massimo di risultati
    - offset: paginazione
    """
    # Verifica permessi e ottieni user_id corretto
    if session['role'] in ['admin', 'reception'] and 'user_id' in request.args:
        user_id = request.args.get('user_id', type=int)
        
    else:
        user_id = session['user_id']

    conn = get_db_connection()
    try:
        query = '''
        SELECT b.id, b.check_in, b.check_out, b.total_price, b.status, b.created_at,
               r.room_number, r.room_type, r.description as room_description,
               h.name as hotel_name, h.address as hotel_address, h.city as hotel_city,
               CASE WHEN b.is_offer = 1 THEN 'yes' ELSE 'no' END as was_offer
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        JOIN hotels h ON r.hotel_id = h.id
        WHERE b.guest_id = ?
        '''
        bookings = conn.execute(query, [user_id]).fetchall()

        return jsonify({
            "status": "success",
            "data": {
                "bookings": [dict(booking) for booking in bookings],
                }
            })

    except Exception as e:
        return jsonify({
            "status": "error",
            "code": "SERVER_ERROR",
            "message": str(e)
        }), 500
        
    finally:
        conn.close()


@app.route('/api/bookings/<int:booking_id>/process', methods=['PUT'])
@role_required(['reception', 'admin'])
def process_booking(booking_id):
    data = request.get_json()
    action = data.get('action')  # 'approve' o 'reject'

    if action not in ['approve', 'reject']:
        return jsonify({"status": "error", "message": "Azione non valida"}), 400

    conn = get_db_connection()
    try:
        booking = conn.execute('''
        SELECT * FROM bookings WHERE id = ? AND status = 'pending'
        ''', (booking_id,)).fetchone()

        if not booking:
            return jsonify({"status": "error", "message": "Prenotazione non trovata o già processata"}), 404

        # Verifica che la stanza sia ancora disponibile (solo per approvazione)
        if action == 'approve':
            overlapping = conn.execute('''
            SELECT 1 FROM bookings 
            WHERE room_id = ? 
            AND status = 'confirmed'
            AND id != ?
            AND (
                (check_in < ? AND check_out > ?) OR
                (check_in >= ? AND check_in < ?) OR
                (check_out > ? AND check_out <= ?)
            )
            ''', (
                booking['room_id'],
                booking_id,
                booking['check_out'], booking['check_in'],
                booking['check_in'], booking['check_out'],
                booking['check_in'], booking['check_out']
            )).fetchone()

            if overlapping:
                return jsonify({
                    "status": "error",
                    "message": "La stanza non è più disponibile per le date richieste"
                }), 400

        # Aggiorna stato
        new_status = 'confirmed' if action == 'approve' else 'rejected'
        conn.execute('''
        UPDATE bookings 
        SET status = ?, reception_id = ?, processed_at = CURRENT_TIMESTAMP
        WHERE id = ?
        ''', (new_status, session['user_id'], booking_id))

        conn.commit()
        return jsonify({
            "status": "success",
            "message": f"Prenotazione {new_status}"
        })
    except Exception as e:
        conn.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        conn.close()
from math import radians, sin, cos, acos

@app.route('/api/hotels/nearby', methods=['GET'])
def get_nearby_hotels():
    try:
        lat_user = float(request.args.get('lat'))
        lng_user = float(request.args.get('lng'))
        radius_km = float(request.args.get('radius', 10))
    except (TypeError, ValueError):
        return jsonify({"status": "error", "message": "Coordinate non valide"}), 400

    conn = get_db_connection()
    try:
        # 1. Recupera TUTTI gli hotel con coordinate non nulle
        hotels = conn.execute('''
            SELECT id, name, address, city, latitude, longitude
            FROM hotels
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        ''').fetchall()

        # 2. Filtra in Python quelli nel raggio
        nearby_hotels = []
        for hotel in hotels:
            lat_hotel = hotel['latitude']
            lng_hotel = hotel['longitude']

            # Calcola distanza (formula di Haversine semplificata)
            distance = 6371 * acos(
                cos(radians(lat_user)) * cos(radians(lat_hotel)) * 
                cos(radians(lng_hotel) - radians(lng_user)) + 
                sin(radians(lat_user)) * sin(radians(lat_hotel))
            )

            if distance <= radius_km:
                nearby_hotels.append({
                    **dict(hotel),  # Include tutti i campi originali
                    "distance": distance
                })

        # 3. Ordina per distanza
        nearby_hotels.sort(key=lambda x: x['distance'])

        return jsonify({
            "status": "success",
            "data": {
                "hotels": nearby_hotels,
                "count": len(nearby_hotels)
            }
        })

    finally:
        conn.close()

@app.route('/api/rooms/<int:room_id>/availability', methods=['GET'])
def check_room_availability(room_id):
    check_in = request.args.get('check_in')
    check_out = request.args.get('check_out')

    conn = get_db_connection()
    try:
        query = '''
        SELECT CASE WHEN EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.room_id = ?
            AND b.status = 'confirmed'
            AND (
                (b.check_in < ? AND b.check_out > ?) OR
                (b.check_in >= ? AND b.check_in < ?)
            )
        ) THEN 0 ELSE 1 END as is_available
        '''
        result = conn.execute(query, (room_id, check_out, check_in, check_in, check_out)).fetchone()
        
        return jsonify({
            "status": "success",
            "data": {
                "room_id": room_id,
                "is_available": bool(result['is_available']),
                "check_in": check_in,
                "check_out": check_out
            }
        })
    finally:
        conn.close()


@app.route('/api/hotels/<int:hotel_id>/available-rooms', methods=['GET'])
def get_available_rooms(hotel_id):
    check_in = request.args.get('check_in')
    check_out = request.args.get('check_out')
    room_type = request.args.get('room_type')
    min_capacity = request.args.get('min_capacity', type=int)
    
    conn = get_db_connection()
    try:
        
        hotels= conn.execute('SELECT * FROM hotels WHERE id = ?', (hotel_id,)).fetchone()
        if not hotels:
            return jsonify({
                "status": "error",
                "code": "HOTEL_NOT_FOUND",
                "message": "Hotel non trovato"
            }), 404
        
        
        # Query base per tutte le stanze dell'hotel
        query = '''
        SELECT r.*, h.name as hotel_name
        FROM rooms r
        JOIN hotels h ON r.hotel_id = h.id
        WHERE r.hotel_id = ?
        '''
        params = [hotel_id]

        # Filtri opzionali
        if room_type:
            query += ' AND r.room_type = ?'
            params.append(room_type)
        
        if min_capacity:
            query += ' AND r.capacity >= ?'
            params.append(min_capacity)

        # Se sono specificate le date, filtra per disponibilità
        if check_in and check_out:
            query += '''
            AND NOT EXISTS (
                SELECT 1 FROM bookings b
                WHERE b.room_id = r.id
                AND b.status = 'confirmed'
                AND (
                    (b.check_in < ? AND b.check_out > ?) OR
                    (b.check_in >= ? AND b.check_in < ?) OR
                    (b.check_out > ? AND b.check_out <= ?)
                )
            )
            '''
            params.extend([check_out, check_in, check_in, check_out, check_in, check_out])

        rooms = conn.execute(query, params).fetchall()
        
        return jsonify({
            "status": "success",
            "data": {
                "hotel_id": hotel_id,
                "available_rooms": [dict(room) for room in rooms],
                "count": len(rooms)
            }
        })
    finally:
        conn.close()
        
        
@app.route('/api/bookings', methods=['POST'])
@role_required(['admin','guest', 'reception'])
def create_booking_request():
    data = request.get_json()
    
    print(data)
    
    required_fields = ['check_in', 'check_out']
    if not all(field in data for field in required_fields):
        return jsonify({"status": "error", "message": "Campi mancanti"}), 400

    conn = get_db_connection()
    try:
        
        if data.get('room_id'):
            
            room = conn.execute('SELECT * FROM rooms WHERE id = ?', (data['room_id'],)).fetchone()
            if not room:
                return jsonify({"status": "error", "message": "Stanza non trovata"}), 404
            data['room_id'] = room['id']
        
        if data.get('hotel_name') and data.get("room_number"):
            
            hotel_id = conn.execute('SELECT id FROM hotels WHERE name = ?', (data['hotel_name'],)).fetchone()
            if not hotel_id:
                return jsonify({"status": "error", "message": "Hotel non trovato"}), 404
            
            room = conn.execute('''
            SELECT * FROM rooms 
            WHERE room_number = ? AND hotel_id = ?
            ''', (data['room_number'], hotel_id['id'])).fetchone()
            if not room:
                return jsonify({"status": "error", "message": "Stanza non trovata per l'hotel specificato"}), 404
            data['room_id'] = room['id']
            
        
        
        # Verifica disponibilità stanza (controlla solo prenotazioni esistenti)
        overlapping = conn.execute('''
        SELECT 1 FROM bookings 
        WHERE room_id = ? 
        AND status = 'confirmed'
        AND (
            (check_in < ? AND check_out > ?) OR
            (check_in >= ? AND check_in < ?) OR
            (check_out > ? AND check_out <= ?)
        )
        ''', (
            data['room_id'],
            data['check_out'], data['check_in'], 
            data['check_in'], data['check_out'],  
            data['check_in'], data['check_out']   
        )).fetchone()

        if overlapping:
            return jsonify({"status": "error", "message": "Stanza non disponibile per le date selezionate"}), 400

        # Calcola prezzo e crea prenotazione
        room = conn.execute('SELECT price_per_night FROM rooms WHERE id = ?', 
                          (data['room_id'],)).fetchone()
        nights = (datetime.strptime(data['check_out'], '%Y-%m-%d') - 
                 datetime.strptime(data['check_in'], '%Y-%m-%d')).days
        total_price = nights * room['price_per_night']

        conn.execute('''
        INSERT INTO bookings (room_id, guest_id, check_in, check_out, total_price, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
        ''', (
            data['room_id'],
            session['user_id'],
            data['check_in'],
            data['check_out'],
            total_price
        ))

        conn.commit()
        return jsonify({
            "status": "success",
            "message": "Richiesta prenotazione inviata"
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        conn.close()
        
@app.route('/api/bookings/pending', methods=['GET'])
@role_required(['reception', 'admin', 'guest'])
def get_pending_bookings():
    """
    Ottiene tutte le prenotazioni in attesa di approvazione
    Parametri opzionali:
    - hotel_id: filtra per specifico hotel
    - from_date: filtra prenotazioni create dopo questa data (YYYY-MM-DD)
    - limit: numero massimo di risultati (default 50)
    """
    try:
        # Parametri di filtraggio
        hotel_id = request.args.get('hotel_id', type=int)
        from_date = request.args.get('from_date')
        limit = request.args.get('limit', default=50, type=int)
        
        conn = get_db_connection()
        
        user_role = session['role']
        user_hotel_id = None
        
        # Se è un receptionist, ottieni solo le prenotazioni del suo hotel
        if user_role == 'reception':
            user_hotel_id = conn.execute(
                'SELECT hotel_id FROM users WHERE id = ?', 
                (session['user_id'],)
            ).fetchone()['hotel_id']
        
        query = '''
        SELECT b.*, r.*, h.name as hotel_name
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        JOIN hotels h ON r.hotel_id = h.id
        WHERE b.status = 'pending'
        '''
        params = []
        
        if user_hotel_id:
            query += ' AND r.hotel_id = ?'
            params.append(user_hotel_id)
        

        if from_date:

            query += ' AND DATE(b.created_at) >= ?'
            params.append(from_date)


        # Esecuzione query
        pending_bookings = conn.execute(query, params).fetchall()

        return jsonify({
            "status": "success",
            "data": {
                "bookings": [dict(booking) for booking in pending_bookings],
            }
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Errore nel recupero prenotazioni: {str(e)}"
        }), 500
    finally:
        conn.close()
        
@app.route('/api/hotels/<int:hotel_id>/receptionists', methods=['GET'])
@role_required(['admin', 'reception'])
def get_hotel_receptionists(hotel_id):
    conn = get_db_connection()
    try:
        receptionists = conn.execute('''
            SELECT id, username, full_name, email, phone 
            FROM users 
            WHERE role = 'reception' AND hotel_id = ?
        ''', (hotel_id,)).fetchall()
        
        return jsonify({
            "status": "success",
            "data": {
                "receptionists": [dict(receptionist) for receptionist in receptionists],
                "count": len(receptionists)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Errore recupero receptionist: {str(e)}"
        }), 500
    finally:
        conn.close()



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)


