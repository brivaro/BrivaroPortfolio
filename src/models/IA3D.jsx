/* eslint-disable react/no-unknown-property */
import { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons";
import { useMediaQuery } from "react-responsive";
import { useAnimations } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const isMediumScreen = useMediaQuery({ minWidth: 641, maxWidth: 768 });
  const gltf = useLoader(GLTFLoader, "/ia.glb");
  const modelRef = useRef();
  
  const { actions, mixer } = useAnimations(gltf.animations, modelRef);
  console.log(gltf.animations);

  useFrame((state) => {
      if (modelRef.current) {
        // Animación: rotación y un leve movimiento vertical
        // modelRef.current.rotation.y += delta * 0.5; si quiero que gire poner delta en los parámetros de userFrame
        modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15 - 0.6;
      }
  });
  
  useEffect(() => {
    const welcomeAction = actions["Character|WELCOME"];
    const audioAction = actions["Character|Audio_1"];

    welcomeAction.reset();
    welcomeAction.setLoop(THREE.LoopOnce, 0);
    welcomeAction.clampWhenFinished = true;
    welcomeAction.play();

    // Escucha el evento 'finished' en el mixer
    const onFinished = (e) => {
      if (e.action === welcomeAction) {
        // Realiza un crossfade de 0.5 segundos entre welcomeAction y audioAction
        welcomeAction.crossFadeTo(audioAction, 0.5, false);
        audioAction.reset();
        audioAction.setLoop(THREE.LoopRepeat, Infinity);
        audioAction.play();
      }
    };

    mixer.addEventListener("finished", onFinished);

    // Limpieza del listener al desmontar el componente
    return () => {
      mixer.removeEventListener("finished", onFinished);
    };

  }, [actions, mixer]);

  let position = [0, 0, 0];
  if (isSmallScreen) {
    position = [0.5, 0, 1];
  }
  if (isMediumScreen) {
    position = [-1.5, 0, 1];
  }

  let scale = 0.01;
  if (isSmallScreen) {
    scale = 0.004;
  }
  if (isMediumScreen) {
    scale = 0.006;
  }

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={scale}
      position={position}
    />
  );
}

function IA3D() {
  return (
    <div className="absolute w-full h-1/3 z-[-1] md:right-80">
      <Canvas>
        <ambientLight color="blue" intensity={0.1} />
        <ambientLight color="red" intensity={0.3} />
        <directionalLight color="white" position={[0, 0, 5]} intensity={10}/>
        <Model />
      </Canvas>
    </div>
  );
}

export default IA3D;
