import bpy
import math
import mathutils
import random

# ----------------------------------------------------------------------------------
# PARÁMETROS PRINCIPALES
# ----------------------------------------------------------------------------------

# Cantidad de filas y columnas en la malla
GRID_ROWS = 10
GRID_COLS = 10

# Separación entre las esferas
SPACING = 1.5

# Radio de cada esfera
SPHERE_RADIUS = 0.2

# ----------------------------------------------------------------------------------
# ANIMACIÓN
# ----------------------------------------------------------------------------------

# Modos de animación disponibles: "wave", "organic", "mixed"
# - "wave": Movimiento ondulatorio con funciones seno/coseno
# - "organic": Movimiento "aleatorio/fluido" con velocidades diferentes
# - "mixed": Combina la idea "wave" pero con velocidades random para cada esfera
ANIMATION_MODE = "mixed"

# Amplitud de las ondas o del movimiento
AMPLITUDE = 0.8

# Velocidad base de animación
BASE_SPEED = 1.0

# Si quieres que cada esfera tenga un factor aleatorio adicional
# (solo se aplica en "organic" o "mixed")
USE_RANDOM_SPEED_FACTOR = True

# ----------------------------------------------------------------------------------
# MATERIALES
# ----------------------------------------------------------------------------------

# Colores metálicos disponibles (r, g, b, a)
METALLIC_COLORS = {
    "blue":  (0.0, 0.3, 0.8, 1.0),
    "pink":  (1.0, 0.2, 0.7, 1.0),
    "green": (0.0, 1.0, 0.4, 1.0)
}

# Elige uno de los keys arriba ("blue", "pink", "green", etc.)
CHOSEN_COLOR = "blue"

# Nombre de la colección donde guardaremos los objetos
COLLECTION_NAME = "MallaDeDatos"

# ----------------------------------------------------------------------------------
# LIMPIEZA (OPCIONAL)
# ----------------------------------------------------------------------------------
# Descomenta estas líneas si deseas iniciar la escena vacía cada vez.

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

for coll in bpy.data.collections:
    bpy.data.collections.remove(coll)

# ----------------------------------------------------------------------------------
# CREACIÓN DE LA COLECCIÓN
# ----------------------------------------------------------------------------------

malla_collection = bpy.data.collections.new(COLLECTION_NAME)
bpy.context.scene.collection.children.link(malla_collection)

# ----------------------------------------------------------------------------------
# CREAR MATERIAL METÁLICO
# ----------------------------------------------------------------------------------

def crear_material_metalico(color_rgba):
    """
    Crea y devuelve un material con el Principled BSDF ajustado
    a un color metálico (Metallic = 1).
    """
    mat = bpy.data.materials.new(name="MaterialMetal")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color_rgba  # Color base
        bsdf.inputs["Metallic"].default_value = 1.0           # 100% metálico
        bsdf.inputs["Roughness"].default_value = 0.2          # Reflexión nítida
    return mat

color_rgba = METALLIC_COLORS.get(CHOSEN_COLOR, (0.0, 0.3, 0.8, 1.0))
mat_metal = crear_material_metalico(color_rgba)

# ----------------------------------------------------------------------------------
# CREAR LA MALLA DE ESFERAS
# ----------------------------------------------------------------------------------

grid_objects = []
original_positions = []
random_speeds = []  # para almacenar factor de velocidad aleatoria por esfera

offset_x = (GRID_COLS - 1) * SPACING * 0.5
offset_y = (GRID_ROWS - 1) * SPACING * 0.5

for i in range(GRID_ROWS):
    for j in range(GRID_COLS):
        # Coordenadas base
        x = j * SPACING - offset_x
        y = i * SPACING - offset_y
        z = 0.0

        # Crear esfera
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=SPHERE_RADIUS,
            location=(x, y, z)
        )
        sphere = bpy.context.active_object
        sphere.name = f"Esfera_{i}_{j}"

        # Asignar material metálico
        if not sphere.data.materials:
            sphere.data.materials.append(mat_metal)
        else:
            sphere.data.materials[0] = mat_metal

        # Añadir a la colección personalizada
        malla_collection.objects.link(sphere)
        bpy.context.scene.collection.objects.unlink(sphere)

        # Guardar referencias
        grid_objects.append(sphere)
        original_positions.append((x, y, z))

        # Asignar un factor de velocidad aleatoria (entre 0.5 y 1.5, por ejemplo)
        speed_factor = random.uniform(0.5, 1.5) if USE_RANDOM_SPEED_FACTOR else 1.0
        random_speeds.append(speed_factor)

# ----------------------------------------------------------------------------------
# FUNCIÓN DE ANIMACIÓN (FRAME HANDLER)
# ----------------------------------------------------------------------------------

def actualizar_malla(scene):
    """
    Se llama en cada frame para animar las esferas según el ANIMATION_MODE.
    """
    frame = scene.frame_current
    fps = scene.render.fps
    t = frame / fps  # tiempo en segundos

    for idx, obj in enumerate(grid_objects):
        ox, oy, oz = original_positions[idx]
        speed_factor = random_speeds[idx]

        if ANIMATION_MODE == "wave":
            # Movimiento ondulatorio (similar a olas)
            desplazamiento_z = AMPLITUDE * math.sin((ox + oy) * 0.5 + t * BASE_SPEED)
            obj.location = (ox, oy, oz + desplazamiento_z)

        elif ANIMATION_MODE == "organic":
            # Movimiento "orgánico": cada esfera con velocidad distinta
            # Ejemplo simple: combinamos seno y coseno con un factor aleatorio
            desplazamiento_z = AMPLITUDE * math.sin((ox + t * BASE_SPEED * speed_factor)) \
                                           * math.cos((oy + t * BASE_SPEED * speed_factor))
            obj.location = (ox, oy, oz + desplazamiento_z)

        elif ANIMATION_MODE == "mixed":
            # Mezcla de onda + factor aleatorio
            # Se usa la onda base, pero con un factor de velocidad distinto
            desplazamiento_z = AMPLITUDE * math.sin((ox + oy) * 0.5 + t * BASE_SPEED * speed_factor)
            obj.location = (ox, oy, oz + desplazamiento_z)

        else:
            # Si se especifica un modo desconocido, no animar
            obj.location = (ox, oy, oz)

# ----------------------------------------------------------------------------------
# REGISTRAR EL HANDLER
# ----------------------------------------------------------------------------------

# Elimina cualquier handler anterior con el mismo nombre
for h in bpy.app.handlers.frame_change_pre:
    if h.__name__ == 'actualizar_malla':
        bpy.app.handlers.frame_change_pre.remove(h)

bpy.app.handlers.frame_change_pre.append(actualizar_malla)

print("Script completado. Ajusta ANIMATION_MODE y CHOSEN_COLOR, luego mueve la línea de tiempo para ver la animación.")
