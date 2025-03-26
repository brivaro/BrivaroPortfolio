import bpy
import mathutils
import random

# ---------------------------------------------------------------------
# CONFIGURACIÓN DE LA RED
# ---------------------------------------------------------------------

# Matriz de entrada (por ejemplo 3x2: 3 filas, 2 columnas)
input_matrix = [
    [1, 2],
    [3, 4],
    [5, 6]
]

# Definimos las capas ocultas como "matrices" (cada tupla indica filas x columnas)
# Por ejemplo, dos capas ocultas: 4x3 y 3x2
hidden_layers = [
    (4, 3),
    (3, 2)
]

# Matriz de salida (por ejemplo 2x2)
output_matrix = [
    [0, 1],
    [1, 0]
]

# Parámetros de espaciamiento
distancia_entre_capas = 3.0
distancia_filas = 1.5
distancia_columnas = 1.5

# Tamaño de nodos y conexiones
radio_nodo = 0.2
radio_conexion = 0.03

# Posición inicial en X de la primera capa
x_inicial = 0

# Probabilidad de conexión
connection_prob = 0.3  

# ---------------------------------------------------------------------
# FUNCIONES AUXILIARES
# ---------------------------------------------------------------------

def limpiar_escena():
    """Elimina todos los objetos de la escena."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)


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
    
    # Asignar un color aleatorio para distinguir los nodos
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
    # Calcular la distancia entre los puntos
    vec_inicio = mathutils.Vector(inicio)
    vec_fin = mathutils.Vector(fin)
    distancia = (vec_fin - vec_inicio).length
    
    # Crear cilindro orientado en el eje +Z
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radio,
        depth=distancia,
        location=(0, 0, 0)
    )
    cilindro = bpy.context.active_object
    cilindro.name = nombre
    
    # Mover y rotar el cilindro
    punto_medio = (vec_inicio + vec_fin) / 2.0
    cilindro.location = punto_medio
    
    # Alinear el cilindro con la línea que une inicio y fin
    up = mathutils.Vector((0, 0, 1))
    direccion = (vec_fin - vec_inicio).normalized()
    rot_quat = up.rotation_difference(direccion)
    cilindro.rotation_euler = rot_quat.to_euler()
    
    return cilindro


def crear_capa(matrix, x_pos, layer_name="Capa"):
    """
    Crea una capa de nodos basada en una matriz (filas x columnas).
    Devuelve una lista de posiciones de nodos para futuras conexiones.
    - matrix: lista de listas, solo se usa para tomar dimensiones (len y len[0]).
    - x_pos: posición en el eje X donde colocar la capa.
    """
    num_filas = len(matrix)
    num_columnas = len(matrix[0])
    
    # Para centrar la capa según filas y columnas
    offset_filas = (num_filas - 1) * distancia_filas / 2
    offset_columnas = (num_columnas - 1) * distancia_columnas / 2
    
    posiciones_nodos = []
    
    for i in range(num_filas):
        fila_posiciones = []
        for j in range(num_columnas):
            y_pos = (j * distancia_columnas - offset_columnas)
            z_pos = (i * distancia_filas - offset_filas)
            
            nodo_location = (x_pos, y_pos, z_pos)
            nombre_nodo = f"{layer_name}_({i},{j})"
            
            crear_esfera(nodo_location, radio=radio_nodo, nombre=nombre_nodo)
            fila_posiciones.append(nodo_location)
        posiciones_nodos.append(fila_posiciones)
    
    return posiciones_nodos


def conectar_capas(posiciones_capa1, posiciones_capa2, connection_prob=0.5):
    """
    Conecta los nodos de la capa1 con los nodos de la capa2 de manera probabilística.
    - posiciones_capa1 y posiciones_capa2 son listas bidimensionales (filas x columnas).
    - connection_prob (float): probabilidad de que exista una conexión entre dos nodos.
    """
    import random
    for fila1 in posiciones_capa1:
        for nodo1 in fila1:
            for fila2 in posiciones_capa2:
                for nodo2 in fila2:
                    # Conectar solo si el valor aleatorio es menor que connection_prob
                    if random.random() < connection_prob:
                        crear_cilindro_conexion(nodo1, nodo2, radio_conexion)


# ---------------------------------------------------------------------
# SCRIPT PRINCIPAL
# ---------------------------------------------------------------------

def main():
    # 1) Limpiar la escena
    limpiar_escena()
    
    # 2) Crear la capa de entrada
    x_actual = x_inicial
    posiciones_entrada = crear_capa(input_matrix, x_actual, layer_name="Entrada")
    
    # 3) Crear capas ocultas
    posiciones_ocultas = []
    
    for idx, (filas, cols) in enumerate(hidden_layers):
        x_actual += distancia_entre_capas
        # Para crear la "matriz" de la capa oculta, inventamos datos con la dimensión dada
        # (lo importante es la forma filas x cols)
        dummy_matrix = [[0]*cols for _ in range(filas)]
        capa_name = f"Oculta{idx+1}"
        pos_capa = crear_capa(dummy_matrix, x_actual, layer_name=capa_name)
        posiciones_ocultas.append(pos_capa)
    
    # 4) Crear la capa de salida
    x_actual += distancia_entre_capas
    posiciones_salida = crear_capa(output_matrix, x_actual, layer_name="Salida")
    
    # 5) Conectar capa de entrada con la primera capa oculta (o con salida si no hay ocultas)
    if len(posiciones_ocultas) > 0:
        conectar_capas(posiciones_entrada, posiciones_ocultas[0], connection_prob)
        # Conectar capas ocultas entre sí
        for i in range(len(posiciones_ocultas) - 1):
            conectar_capas(posiciones_ocultas[i], posiciones_ocultas[i+1], connection_prob)
        # Conectar última capa oculta con la capa de salida
        conectar_capas(posiciones_ocultas[-1], posiciones_salida, connection_prob)
    else:
        # Sin capas ocultas, conectar directamente entrada y salida
        conectar_capas(posiciones_entrada, posiciones_salida, connection_prob)
    
    print("Red neuronal 3D (con matrices) generada con éxito.")


# Ejecutar la función principal
main()
