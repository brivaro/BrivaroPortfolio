import bpy
import math
import mathutils
import random

# ---------------------------
# Parámetros de la red
# ---------------------------
num_capas = 4               # Número de capas
nodos_por_capa = [4, 6, 6, 3]  # Lista con la cantidad de nodos por cada capa
distancia_entre_capas = 3.0
distancia_vertical_nodos = 1.5
radio_nodo = 0.2
radio_conexion = 0.03

# Probabilidad de que se cree una conexión entre dos nodos
connection_probability = 0.5  # 50%

# Posición inicial en el espacio
pos_inicial_x = 0
pos_inicial_y = 0
pos_inicial_z = 0

# ---------------------------
# Funciones auxiliares
# ---------------------------

def crear_esfera(location, radio=0.2, nombre="Nodo"):
    """
    Crea una esfera en la ubicación dada con el radio especificado.
    Devuelve el objeto recién creado.
    """
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=radio,
        location=location
    )
    esfera = bpy.context.active_object
    esfera.name = nombre
    
    # Opcional: asignar un color aleatorio
    mat = bpy.data.materials.new(name="Mat_" + nombre)
    mat.diffuse_color = (
        random.random(),
        random.random(),
        random.random(),
        1
    )
    if esfera.data.materials:
        esfera.data.materials[0] = mat
    else:
        esfera.data.materials.append(mat)
    
    return esfera

def crear_cilindro_conexion(inicio, fin, radio=0.03, nombre="Conexion"):
    """
    Crea un cilindro que conecta dos puntos (inicio y fin).
    """
    distancia = (fin - inicio).length
    
    # Crear cilindro orientado en el eje +Z
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radio,
        depth=distancia,
        location=(0, 0, 0)
    )
    cilindro = bpy.context.active_object
    cilindro.name = nombre
    
    # Mover y rotar el cilindro
    punto_medio = (inicio + fin) / 2.0
    cilindro.location = punto_medio
    
    vec_direccion = fin - inicio
    up = mathutils.Vector((0, 0, 1))
    rot_quat = up.rotation_difference(vec_direccion.normalized())
    cilindro.rotation_euler = rot_quat.to_euler()
    
    return cilindro

# ---------------------------
# Crear la red neuronal
# ---------------------------

# Limpia la escena (opcional, pero útil para no duplicar objetos)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Almacenar la posición de cada nodo para conectarlos después
posiciones_nodos = []

for capa_index in range(num_capas):
    # Cantidad de nodos en la capa actual
    nodos_en_esta_capa = nodos_por_capa[capa_index]
    
    # Calcular la posición base en X para esta capa
    x_capa = pos_inicial_x + capa_index * distancia_entre_capas
    
    # Ajustar la posición vertical para centrar los nodos
    offset_vertical = (nodos_en_esta_capa - 1) * distancia_vertical_nodos / 2
    
    # Lista para guardar las posiciones de los nodos de la capa actual
    posiciones_capa_actual = []
    
    for nodo_index in range(nodos_en_esta_capa):
        y_nodo = pos_inicial_y + (nodo_index * distancia_vertical_nodos - offset_vertical)
        
        # Crear la esfera (nodo)
        nodo_location = (x_capa, y_nodo, pos_inicial_z)
        esfera = crear_esfera(nodo_location, radio_nodo, nombre=f"Nodo_C{capa_index}_N{nodo_index}")
        
        # Guardar la posición del nodo para las conexiones
        posiciones_capa_actual.append(mathutils.Vector(nodo_location))
    
    # Añadir las posiciones de la capa actual a la lista global
    posiciones_nodos.append(posiciones_capa_actual)

# Crear conexiones entre capas con probabilidad
for capa_index in range(num_capas - 1):
    capa_actual = posiciones_nodos[capa_index]
    capa_siguiente = posiciones_nodos[capa_index + 1]
    
    for nodo_inicio in capa_actual:
        for nodo_fin in capa_siguiente:
            # Solo creamos la conexión si el número aleatorio
            # es menor que la probabilidad configurada
            if random.random() < connection_probability:
                crear_cilindro_conexion(nodo_inicio, nodo_fin, radio_conexion)

print("Red neuronal 3D generada con conexiones probabilísticas.") 
