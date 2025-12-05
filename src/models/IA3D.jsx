/* eslint-disable react/no-unknown-property */
import { useRef, useEffect, Suspense, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// --- CONFIGURACIÓN ---
const ENABLE_MANUAL_DEBUG = false; 

// --- HOOKS AUXILIARES ---
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  
  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      // Optimización: Debounce para no recalcular en cada frame del resize
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize([window.innerWidth, window.innerHeight]);
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);
  
  return size;
}

// --- COMPONENTE MODEL ---
function Model({ scaleMultiplier = 1, yOffset = 0, isOrbiting, isVisible }) {
  const gltf = useGLTF("/ia.glb");
  const modelRef = useRef();
  const { actions, mixer } = useAnimations(gltf.animations, modelRef);

  // OPTIMIZACIÓN: Si no es visible, pausamos el mixer de animación (timeScale = 0)
  useEffect(() => {
    if (!mixer) return;
    mixer.timeScale = isVisible ? 1 : 0;
  }, [isVisible, mixer]);

  useFrame((state) => {
    // OPTIMIZACIÓN: Si no es visible, no calculamos posición
    if (!isVisible || !modelRef.current) return;
    modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15 - yOffset;
  });

  useEffect(() => {
    if (!gltf?.scene || !modelRef.current) return;
    
    // Optimizaciones de geometría
    gltf.scene.traverse((child) => {
      if (child.isMesh && /ico?sphere/i.test(child.name)) {
        child.visible = false;
      }
      if (child.isMesh) {
        child.frustumCulled = false; // Mantenemos false para evitar parpadeos, pero controlamos el render con frameloop
        if (child.material) {
          child.material.side = THREE.DoubleSide;
        }
      }
    });

    // Escalado automático
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

    // Configuración inicial de animaciones
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

  // Transiciones entre Orbitar y Estático
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

// --- COMPONENTE CAMERACONTROLLER ---
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
    // OPTIMIZACIÓN: Si el canvas está pausado (frameloop="never"), esto no se ejecuta,
    // pero si por alguna razón sigue activo, cortamos la lógica aquí.
    if (!isVisible) return;
    
    if (manualControlsEnabled) {
      controlsRef.current.update();
      return;
    }

    if (!isInitialized) return;

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
      // Debug helper
      if(ENABLE_MANUAL_DEBUG) {
          console.log(`pos: new THREE.Vector3(${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}),`);
          console.log(`target: new THREE.Vector3(${controls.target.x.toFixed(2)}, ${controls.target.y.toFixed(2)}, ${controls.target.z.toFixed(2)})`);
      }
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

// --- COMPONENTE PRINCIPAL ---
function IA3D({ isVisible }) { 
  const [width] = useWindowSize();
  const isMobile = width < 768;
  const modelPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const [isOrbiting, setIsOrbiting] = useState(false);

  const manualControlsEnabled = useMemo(() => ENABLE_MANUAL_DEBUG && !isMobile, [isMobile]);
  
  // Determinamos si el canvas debe estar activo.
  // En modo debug siempre activo, si no, depende del prop isVisible (IntersectionObserver)
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
        style={{ 
            pointerEvents: isActive ? 'auto' : 'none',
            zIndex: -1 
          }}
    >
      <Canvas 
        // 1. OPTIMIZACIÓN: DPR Limitado
        // Limitamos la densidad de píxeles a máximo 1.5 para móviles de alta resolución
        dpr={[1, 1.5]}
        
        // 2. OPTIMIZACIÓN: Frameloop
        // "never" detiene completamente el renderizado cuando isActive es false
        frameloop={isActive ? "always" : "never"}

        // 3. OPTIMIZACIÓN: WebGL
        gl={{ 
            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
            depth: true 
        }}

        camera={{ position: CAMERA_STATES.desktopLG.pos.toArray(), fov: 50, near: 0.1, far: 200 }}
        style={isMobile ? { touchAction: manualControlsEnabled ? 'none' : 'auto' } : {}}
      >
        <ambientLight color="blue" intensity={0.1} />
        <ambientLight color="skyblue" intensity={0.3} />
        <directionalLight color="white" position={[0, 0, 5]} intensity={10}/>
        
        <group position={modelPos}>
          <Suspense fallback={null}> 
            {/* Solo montamos el modelo si está activo para ahorrar memoria inicial,
                aunque frameloop="never" ya hace el trabajo pesado de CPU */}
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