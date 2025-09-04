/* eslint-disable react/no-unknown-property */
import { useRef, useEffect, Suspense, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// --- CONSTANTE MOVIDA FUERA DEL COMPONENTE ---
const ENABLE_MANUAL_DEBUG = false; 

// --- HOOK PERSONALIZADO PARA DETECTAR EL TAMAÑO DE LA VENTANA ---
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

function Model({ scaleMultiplier = 1, yOffset = 0, isOrbiting, isVisible }) {
  const gltf = useGLTF("/ia.glb");
  const modelRef = useRef();
  const { actions, mixer } = useAnimations(gltf.animations, modelRef);

  useEffect(() => {
    if (!mixer) return;
    // La animación se pausa (timeScale = 0) o reanuda (timeScale = 1) según el estado "activo"
    mixer.timeScale = isVisible ? 1 : 0;
  }, [isVisible, mixer]);

  useFrame((state) => {
    // El movimiento del modelo también se detiene si no es "activo"
    if (modelRef.current && isVisible) {
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15 - yOffset;
    }
  });

  // ... (el resto del componente Model no necesita cambios)
  useEffect(() => {
    if (!gltf?.scene || !modelRef.current) return;
    gltf.scene.traverse((child) => {
      if (child.isMesh && /ico?sphere/i.test(child.name)) {
        child.visible = false;
      }
      if (child.isMesh) {
        child.frustumCulled = false;
        if (child.material) {
          child.material.side = THREE.DoubleSide;
        }
      }
    });

    const box = new THREE.Box3();
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.visible) box.expandByObject(child);
    });

    const size = new THREE.Vector3(), center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const desiredMaxSize = 1.2;
    let autoScale = desiredMaxSize / maxAxis;
    if (!isFinite(autoScale) || autoScale <= 0) autoScale = 1;
    autoScale = Math.max(autoScale, 0.02);
    gltf.scene.position.sub(center);
    const finalScale = autoScale * scaleMultiplier;
    modelRef.current.scale.setScalar(finalScale);

    const welcomeAction = actions?.["Character|WELCOME"];
    const audioAction = actions?.["Character|Audio_1"];

    if (welcomeAction) {
      welcomeAction.reset().setLoop(THREE.LoopOnce, 0).play();
      welcomeAction.clampWhenFinished = true;
    }
    const onFinished = (e) => {
      if (welcomeAction && audioAction && e.action === welcomeAction) {
        welcomeAction.crossFadeTo(audioAction, 0.5, false);
        audioAction.reset().setLoop(THREE.LoopRepeat, Infinity).play();
      }
    };
    if (mixer && welcomeAction && audioAction) mixer.addEventListener("finished", onFinished);
    return () => {
      if (mixer && welcomeAction && audioAction) mixer.removeEventListener("finished", onFinished);
    };
  }, [actions, mixer, gltf, scaleMultiplier]);

  useEffect(() => {
    const walkAction = actions?.["Character|WALK"];
    const audioAction = actions?.["Character|Audio_1"];

    if (!walkAction || !audioAction) return;

    if (isOrbiting) {
      audioAction.crossFadeTo(walkAction, 0.25);
      walkAction.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    } else {
      walkAction.crossFadeTo(audioAction, 0.25);
      audioAction.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    }
  }, [isOrbiting, actions]);


  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      position={[0,0,0]}
    />
  );
}

Model.propTypes = {
  scaleMultiplier: PropTypes.number,
  yOffset: PropTypes.number,
  isOrbiting: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

function CameraController({ activeCameraState, manualControlsEnabled, onOrbitStart, onOrbitStop, isVisible }) {
  const { camera, clock } = useThree();
  const controlsRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);
  const orbitAnim = useRef({
    active: false,
    startTime: 0,
    duration: 4,
    initialPos: new THREE.Vector3(),
    initialTarget: new THREE.Vector3()
  });
  const intervalTimer = useRef(0);

  useFrame((state, delta) => {
    // En modo debug, este `isVisible` será `true`, permitiendo que el bucle se ejecute.
    if (!isVisible) return;
    
    // Si los controles manuales están activados, solo actualizamos los controles y salimos.
    if (manualControlsEnabled) {
      controlsRef.current.update();
      return;
    }

    if (!isInitialized) return;

    // ... (el resto de la lógica de useFrame se mantiene igual)
    if (orbitAnim.current.active) {
      const elapsedTime = clock.getElapsedTime() - orbitAnim.current.startTime;

      if (elapsedTime >= orbitAnim.current.duration) {
        camera.position.copy(orbitAnim.current.initialPos);
        orbitAnim.current.active = false;
        intervalTimer.current = 0;
        onOrbitStop();
      } else {
        const progress = elapsedTime / orbitAnim.current.duration;
        var angle = progress * Math.PI * 2;
        if (orbitAnim.current.initialPos.x < 0) angle = - angle;
        const offset = new THREE.Vector3().subVectors(orbitAnim.current.initialPos, orbitAnim.current.initialTarget);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        camera.position.copy(orbitAnim.current.initialTarget).add(offset);
      }
      
      controlsRef.current.update();
      return;
    }

    state.camera.position.lerp(activeCameraState.pos, 0.05);
    controlsRef.current.target.lerp(activeCameraState.target, 0.05);
    controlsRef.current.update();

    intervalTimer.current += delta;
    
    if (intervalTimer.current >= 8) {
      orbitAnim.current.active = true;
      orbitAnim.current.startTime = clock.getElapsedTime();
      orbitAnim.current.initialPos.copy(camera.position);
      orbitAnim.current.initialTarget.copy(controlsRef.current.target);
      intervalTimer.current = 0;
      onOrbitStart();
    }
  });

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    camera.position.copy(activeCameraState.pos);
    controls.target.copy(activeCameraState.target);
    controls.update();
    setIsInitialized(true);

    const logCameraAndTarget = () => {
      console.log(`pos: new THREE.Vector3(${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}),`);
      console.log(`target: new THREE.Vector3(${controls.target.x.toFixed(2)}, ${controls.target.y.toFixed(2)}, ${controls.target.z.toFixed(2)})`);
    };
    controls.addEventListener("end", logCameraAndTarget);

    return () => {
      controls.removeEventListener("end", logCameraAndTarget);
    };
  }, [activeCameraState, camera]);

  return <OrbitControls ref={controlsRef} enabled={manualControlsEnabled} />;
}

CameraController.propTypes = {
    activeCameraState: PropTypes.object.isRequired,
    manualControlsEnabled: PropTypes.bool.isRequired,
    onOrbitStart: PropTypes.func.isRequired,
    onOrbitStop: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
};

const CAMERA_STATES = {
    desktopLG: { pos: new THREE.Vector3(-1.29, -1.43, 5.06), target: new THREE.Vector3(4.51, -0.17, -0.76) },
    desktopMD: { pos: new THREE.Vector3(-1.17, 0.19, 5.94), target: new THREE.Vector3(4.20, 0.15, -0.43) },
    tablet: { pos: new THREE.Vector3(0.70, 0.42, 6.54), target: new THREE.Vector3(-4.20, 0.73, -1.28) },
    mobileLG: { pos: new THREE.Vector3(1.71, -0.13, 8.71), target: new THREE.Vector3(-4.23, 2.38, -2.05) },
    mobileSM: { pos: new THREE.Vector3(0.83, 0.76, 9.21), target: new THREE.Vector3(-2.18, 1.83, -2.28) },
};

function IA3D({ isVisible }) { 
  const [width] = useWindowSize();
  const isMobile = width < 768;
  const modelPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const [isOrbiting, setIsOrbiting] = useState(false);

  const manualControlsEnabled = useMemo(() => ENABLE_MANUAL_DEBUG && !isMobile, [isMobile]);
  
  // --- SOLUCIÓN: Creamos una variable "isActive" ---
  // El componente se considerará "activo" si es visible O si el modo debug está habilitado.
  // Esto asegura que en modo debug, el componente siempre esté visible y operativo.
  const isActive = useMemo(() => isVisible || ENABLE_MANUAL_DEBUG, [isVisible]);

  const activeCameraState = useMemo(() => {
    if (width > 1280) return CAMERA_STATES.desktopLG;
    if (width > 1024) return CAMERA_STATES.desktopMD;
    if (width > 768) return CAMERA_STATES.tablet;
    if (width > 520) return CAMERA_STATES.mobileLG;
    return CAMERA_STATES.mobileSM;
  }, [width]);

  return (
    <div className="absolute top-0 h-[calc(100%+18rem)] w-[99vw] left-1/2 -translate-x-1/2"
        // --- SOLUCIÓN: Usamos "isActive" para controlar los estilos ---
        // En modo debug, el canvas siempre será visible e interactivo.
        // En modo normal, dependerá de la optimización del Intersection Observer.
        style={{ 
            visibility: isActive ? 'visible' : 'hidden',
            pointerEvents: isActive ? 'auto' : 'none',
          }}
    >
      <Canvas 
        camera={{ position: CAMERA_STATES.desktopLG.pos.toArray(), fov: 50, near: 0.1, far: 200 }}
        // Lógica mejorada para el scroll en móvil:
        // En modo debug, se deshabilita el scroll para controlar la cámara (`none`).
        // En modo normal, se permite el scroll (`auto`).
        style={isMobile ? { touchAction: manualControlsEnabled ? 'none' : 'auto' } : {}}
      >
        <ambientLight color="blue" intensity={0.1} />
        <ambientLight color="skyblue" intensity={0.3} />
        <directionalLight color="white" position={[0, 0, 5]} intensity={10}/>
        
        <group position={modelPos}>
          <Suspense fallback={null}> 
            <Model 
              scaleMultiplier={0.5} 
              yOffset={1.6} 
              isOrbiting={isOrbiting}
              isVisible={isActive}
            />
          </Suspense>
        </group>

        <CameraController 
          activeCameraState={activeCameraState} 
          manualControlsEnabled={manualControlsEnabled}
          onOrbitStart={() => setIsOrbiting(true)}
          onOrbitStop={() => setIsOrbiting(false)}
          isVisible={isActive}
        />
      </Canvas>
    </div>
  );
}

IA3D.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default IA3D;