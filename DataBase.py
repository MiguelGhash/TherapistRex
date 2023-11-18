from flask import Flask, render_template, request, redirect, jsonify
from flask import sessions

import firebase_admin
from firebase_admin import credentials, firestore, exceptions
import logging

# Agrega esto al inicio de tu script
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__, template_folder='templates', static_folder='static')

# Configuración de Firebase
cred_path = "JSON/therapist-rex-fda64-firebase-adminsdk-enyzp-07ae43a82d.json"

try:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except exceptions.FirebaseError as e:
    app.logger.error(f"Error al inicializar Firebase: {e}")

@app.route('/')
def index():
    return render_template('index.html')

global_user_email = ""

@app.route('/login', methods=['POST'])
def login():
    global global_user_email  # Accede a la variable global

    email = request.form['logMail']
    password = request.form['logPass']

    # Validación de datos de entrada
    if not email or not password:
        return "Por favor, ingrese correo y contraseña"

    try:
        # Consultar Firestore para verificar las credenciales
        user_ref = db.collection("Usuarios").where("Correo", "==", email).where("Clave", "==", password).limit(1)
        user_data = list(user_ref.stream())

        if len(user_data) > 0:
            user_data = user_data[0].to_dict()

            # Almacena el correo en la variable global
            global_user_email = email

            # Imprime información para depuración
            logging.debug(f"Datos del usuario: {user_data}")

            # Verificar si el campo 'Tipo' está presente
            if 'Tipo' in user_data and user_data['Tipo']:
                # Redirigir según el tipo de usuario
                if user_data['Tipo'] == 'Paciente':
                    return redirect('/loged_paciente')
                elif user_data['Tipo'] == 'Terapeuta':
                    return redirect('/loged_terapeuta')
                else:
                    raise ValueError("Tipo de usuario no reconocido")
            else:
                raise ValueError("Campo 'Tipo' no encontrado o vacío en Firestore para este usuario")

        else:
            raise ValueError("Usuario no encontrado en Firestore")

    except Exception as e:
        app.logger.error(f"Error de autenticación: {e}")
        return "Error de autenticación. Por favor, inténtalo de nuevo más tarde."

    except exceptions.FirebaseError as e:
        app.logger.error(f"Error al acceder a Firestore: {e}")
        return "Error al acceder a Firestore. Por favor, inténtalo de nuevo más tarde."
    
    # ... (código existente)


from flask import jsonify

@app.route('/check_email', methods=['POST'])
def check_email():
    try:
        correo = request.form['txtMail']
        app.logger.debug(f"Correo recibido en el servidor: {correo}")

        # Verificar si el correo existe en la base de datos
        user_ref = db.collection("Usuarios").where("Correo", "==", correo).limit(1)
        user_data = list(user_ref.stream())

        # Imprimir para depuración
        print(f"Cantidad de resultados: {len(user_data)}")

        # Devolver la respuesta adecuada
        if user_data:
            print("Existe")
            return jsonify({"status": "existe"})
        
        # Si no hay resultados, imprimir y devolver la respuesta correspondiente
        print("No existe")
        return jsonify({"status": "no_existe"})

    except KeyError:
        # Maneja el error si 'correo' no está presente en los datos del formulario
        return jsonify({"status": "error", "message": "No se proporcionó el correo en la solicitud"})

    except Exception as e:
        # Maneja cualquier otro error que pueda ocurrir
        print(f"Error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)})






@app.route('/get_user_data', methods=['GET'])
def get_user_data():
    global global_user_email

    # Obtener los datos correspondientes al correo almacenado en la variable global
    user_ref = db.collection("Usuarios").where("Correo", "==", global_user_email).limit(1)
    user_data = list(user_ref.stream())

    if len(user_data) > 0:
        user_data = user_data[0].to_dict()
        datos_usuario = {
            "nombre": user_data.get("Nombre", ""),
            "correo": user_data.get("Correo", ""),
            "ciudad": user_data.get("Ciudad", ""),
            "telefono": user_data.get("Telefono", "")
        }

        return jsonify({"datos_usuario": datos_usuario})

    return jsonify({"datos_usuario": {}})  # Devuelve un JSON con un diccionario vacío si el usuario no se encuentra


@app.route('/loged_paciente')
def loged_paciente():
    return render_template('LogedPaciente.html')

@app.route('/loged_terapeuta')
def loged_terapeuta():
        return render_template('LogedTerapeuta.html')


@app.route('/acerca_de')
def acerca_de():
    return render_template('AcercaDe.html')



@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        correo = request.form['txtMail']
        print(f"Correo recibido en el servidor: {correo}")

        # Aquí puedes realizar cualquier otra lógica necesaria para el registro

        # Por ahora, solo devolvemos un mensaje de éxito como ejemplo
        return "¡Registro exitoso!"

    return render_template('Registro.html')

@app.route('/registrar_usuario', methods=['POST'])
def registrar_usuario():
    try:
        # Obtener datos del formulario
        nombre = request.form['nombre']
        pais = request.form['pais']
        correo = request.form['correo']
        contrasena = request.form['contrasena']
        tipo_opcion = request.form['tipo']  # Nuevo campo 'tipo_opcion'
        
        # Mapear la opción del usuario a la cadena completa
        tipo = "Terapeuta" if tipo_opcion == "Terap" else "Paciente" if tipo_opcion == "Pacient" else tipo_opcion
        
        # Otros campos del formulario

        # Verificar si el correo ya existe en la base de datos
        user_ref = db.collection("Usuarios").where("Correo", "==", correo).limit(1)
        user_data = list(user_ref.stream())

        if len(user_data) > 0:
            return jsonify({"status": "correo_existente"})

        # Crear un nuevo documento en la colección Usuarios
        nuevo_usuario = {
            "Nombre": nombre,
            "Pais": pais,
            "Correo": correo,
            "Clave": contrasena,
            "Tipo": tipo,  # Nuevo campo 'Tipo'
            # Otros campos del formulario
        }

        db.collection("Usuarios").add(nuevo_usuario)

        return jsonify({"status": "exito"})

    except KeyError:
        return jsonify({"status": "error", "message": "Faltan campos en la solicitud"})

    except Exception as e:
        app.logger.error(f"Error en el registro de usuario: {e}")
        return jsonify({"status": "error", "message": "Error en el registro. Inténtalo de nuevo más tarde."})

    except exceptions.FirebaseError as e:
        app.logger.error(f"Error al acceder a Firestore: {e}")
        return jsonify({"status": "error", "message": "Error al acceder a Firestore. Inténtalo de nuevo más tarde."})
@app.route('/agregar_terapia', methods=['POST'])
def agregar_terapia():
    try:
        nombre_terapia = request.form.get('nombreTerapia')
        descripcion_terapia = request.form.get('descripcionTerapia')
        descripcion_sobre_mi = request.form.get('descripcionSobreMi')

        # Validar que los campos no estén vacíos
        if not nombre_terapia or not descripcion_terapia or not descripcion_sobre_mi:
            return jsonify({"status": "error", "message": "Por favor, complete todos los campos del formulario."})

        # Aquí puedes simular la acción de agregar la terapia sin interactuar con la base de datos
        # Simplemente devuelve un mensaje de éxito
        return jsonify({"status": "success", "message": "Terapia agregada correctamente."})

    except Exception as e:
        return jsonify({"status": "error", "message": f"Error al agregar la terapia: {str(e)}"})
@app.route('/get_terapias_terapeuta', methods=['GET'])
def get_terapias_terapeuta():
    global global_user_email

    # Obtener las terapias correspondientes al correo almacenado en la variable global
    terapias_ref = db.collection("TerapiaOf").where("CorreoTerapeuta", "==", global_user_email)
    terapias_data = terapias_ref.stream()

    terapias_list = []

    for terapia in terapias_data:
        terapia_data = terapia.to_dict()
        terapias_list.append({
            "nombreTerapia": terapia_data.get("NombreTerapia", ""),
            "descripcionTerapia": terapia_data.get("Descripcion", ""),  # Corregir el nombre del campo
            "descripcionSobreMi": terapia_data.get("sobreTerapeuta", ""),  # Corregir el nombre del campo
        })

    return jsonify({"terapias": terapias_list})


# ... (código existente)



resultados = []
search_term = ""

# Ruta para buscar terapia (POST)
@app.route('/buscar_terapia', methods=['POST'])
def buscar_terapia():
    global resultados
    global search_term

    try:
        # Obtener el término de búsqueda del formulario
        search_term = request.form.get('txtBuscar')

        # Realizar la búsqueda en la base de datos
        terapias_ref = db.collection("TerapiaOf").where("NombreTerapia", "==", search_term).stream()

        # Almacenar los resultados en la variable global
        resultados = [terapia.to_dict() for terapia in terapias_ref]

        # Imprimir resultados y término de búsqueda
        print("Estos son resultados de buscar terapia")
        print(resultados)
        print( search_term)

        # Devolver una respuesta
        return jsonify({"status": "success", "message": "Búsqueda realizada con éxito"})

    except Exception as e:
        return jsonify({"status": "error", "message": f"Error al buscar terapia: {str(e)}"})
# Ruta para mostrar los resultados (GET)
@app.route('/busqueda_disponibles', methods=['GET'])
def busqueda_disponibles():
    global resultados
    print("Estos son resultados del dispinibles")
    print(resultados)
    try:
        # Crear el HTML para los resultados
        resultados_html = ""
        if resultados:
            for terapia in resultados:
                resultados_html += f"<div class='resultado-terapia'><p>Nombre terapia: {terapia['NombreTerapia']}</p><p>Descripción terapia: {terapia['Descripcion']}</p><p>Terapeuta: {terapia['Terapeuta']}</p><p>Teléfono: {terapia['Telefono']}</p><p>Correo del terapeuta: {terapia['CorreoTerap']}</p><p>Sobre el terapeuta: {terapia['sobreTerapeuta']}</p></div>"

        else:
            resultados_html = "<p>No se encontraron terapias.</p>"
        print(resultados_html)
        # Devolver los resultados como HTML
        return jsonify({"resultados_html": resultados_html})

    except Exception as e:
        return jsonify({"status": "error", "message": f"Error al mostrar resultados: {str(e)}"})


@app.route('/redireccionar')
def redireccionar():
    return render_template('BuscarTerapias.html')






if __name__ == '__main__':
    app.run(debug=True)
