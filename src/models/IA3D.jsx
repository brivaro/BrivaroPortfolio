/* eslint-disable react/no-unknown-property */
import { useRef, useEffect, Suspense, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

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

function Model({ scaleMultiplier = 1, yOffset = 0, isOrbiting }) {
  const gltf = useGLTF("/ia.glb");
  const modelRef = useRef();
  
  const { actions, mixer } = useAnimations(gltf.animations, modelRef);
  //console.log(gltf.animations);

  useFrame((state) => {
      if (modelRef.current) {
        modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15 - yOffset;
      }
  });
  
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
    const audioAction = actions?.["Character|Audio_1"]; // Animación a la que volver

    if (!walkAction || !audioAction) return;

    if (isOrbiting) {
      // Comienza la órbita: hacer un fundido a la animación de caminar
      audioAction.crossFadeTo(walkAction, 0.25);
      walkAction.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    } else {
      // Termina la órbita: hacer un fundido de vuelta a la animación de audio/idle
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
  isOrbiting: PropTypes.bool.isRequired, // Nuevo prop
};

// --- COMPONENTE PARA CONTROLAR LA CÁMARA (MODIFICADO) ---
function CameraController({ activeCameraState, manualControlsEnabled, onOrbitStart, onOrbitStop }) {
  const { camera, clock } = useThree();
  const controlsRef = useRef();

  const orbitAnim = useRef({
    active: false,
    startTime: 0,
    duration: 4, // Duración de la órbita en segundos
    initialPos: new THREE.Vector3(),
    initialTarget: new THREE.Vector3(),
  });
  const intervalTimer = useRef(0);

  useFrame((state, delta) => {
    if (manualControlsEnabled) {
      controlsRef.current.update();
      return;
    }

    if (orbitAnim.current.active) {
      const elapsedTime = clock.getElapsedTime() - orbitAnim.current.startTime;

      if (elapsedTime >= orbitAnim.current.duration) {
        camera.position.copy(orbitAnim.current.initialPos);
        orbitAnim.current.active = false;
        intervalTimer.current = 0;
        onOrbitStop(); // << Notificamos al padre que la órbita ha terminado
      } else {
        const progress = elapsedTime / orbitAnim.current.duration;
        var angle = progress * Math.PI * 2;
        if (orbitAnim.current.initialPos.x < 0) angle = - angle; // Cambia la dirección si la cámara empieza a la izquierda
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
      onOrbitStart(); // << Notificamos al padre que la órbita ha comenzado
    }
  });

  // (Efectos de depuración sin cambios)
  useEffect(() => {
    if (manualControlsEnabled && controlsRef.current) {
        camera.position.copy(activeCameraState.pos);
        controlsRef.current.target.copy(activeCameraState.target);
    }
  }, [manualControlsEnabled, activeCameraState, camera]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const logCameraAndTarget = () => {
      console.log(`pos: new THREE.Vector3(${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}),`);
      console.log(`target: new THREE.Vector3(${controls.target.x.toFixed(2)}, ${controls.target.y.toFixed(2)}, ${controls.target.z.toFixed(2)})`);
    };
    controls.addEventListener("end", logCameraAndTarget);
    return () => controls.removeEventListener("end", logCameraAndTarget);
  }, [camera]);


  return <OrbitControls ref={controlsRef} enabled={manualControlsEnabled} />;
}

CameraController.propTypes = {
    activeCameraState: PropTypes.object.isRequired,
    manualControlsEnabled: PropTypes.bool.isRequired,
    onOrbitStart: PropTypes.func.isRequired,
    onOrbitStop: PropTypes.func.isRequired,
};

// --- CONSTANTES DE CÁMARA ---
const CAMERA_STATES = {
    desktopLG: { pos: new THREE.Vector3(-0.63, -1.08, 4.64), target: new THREE.Vector3(4.61, 0.06, -0.61) },
    desktopMD: { pos: new THREE.Vector3(-1.17, 0.19, 5.94), target: new THREE.Vector3(4.20, 0.15, -0.43) },
    tablet: { pos: new THREE.Vector3(0.70, 0.42, 6.54), target: new THREE.Vector3(-4.20, 0.73, -1.28) },
    mobileLG: { pos: new THREE.Vector3(1.71, -0.13, 8.71), target: new THREE.Vector3(-4.23, 2.38, -2.05) },
    mobileSM: { pos: new THREE.Vector3(0.83, 0.76, 9.21), target: new THREE.Vector3(-2.18, 1.83, -2.28) },
};

// --- COMPONENTE PRINCIPAL (MODIFICADO) ---
function IA3D() {
  const ENABLE_MANUAL_DEBUG = false; 
  
  const [width] = useWindowSize();
  const isMobile = width < 768; // Breakpoint para que el canvas no bloquee en moviles
  const modelPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  
  // << CAMBIO CLAVE: El estado de la órbita vive aquí
  const [isOrbiting, setIsOrbiting] = useState(false);

  const activeCameraState = useMemo(() => {
    if (width > 1280) return CAMERA_STATES.desktopLG;
    if (width > 1024) return CAMERA_STATES.desktopMD;
    if (width > 768) return CAMERA_STATES.tablet;
    if (width > 520) return CAMERA_STATES.mobileLG;
    return CAMERA_STATES.mobileSM;
  }, [width]);

  return ( //border-4 border-blue-500
    <div className="absolute w-full h-1/6 top-20">
      <Canvas 
        camera={{ position: CAMERA_STATES.desktopLG.pos.toArray(), fov: 50, near: 0.1, far: 200 }}
        style={isMobile ? { touchAction: "auto" } : {}}
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
            />
          </Suspense>
        </group>

        <CameraController 
          activeCameraState={activeCameraState} 
          manualControlsEnabled={ENABLE_MANUAL_DEBUG && !isMobile}
          onOrbitStart={() => setIsOrbiting(true)}
          onOrbitStop={() => setIsOrbiting(false)}
        />
      </Canvas>
    </div>
  );
}

export default IA3D;