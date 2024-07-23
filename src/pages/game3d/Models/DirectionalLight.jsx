import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import {
  selectTheme,
  selectNextTheme
} from '../../../store/reducers/gameSlice';

const DirectionalLight = () => {
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const lightRef = useRef();
  const [transitionStartTime, setTransitionStartTime] = useState(null);
  const [localTheme, setLocalTheme] = useState(theme);
  const [localNextTheme, setLocalNextTheme] = useState(nextTheme);
  const [transitionComplete, setTransitionComplete] = useState(false);

  useEffect(() => {
    if (!nextTheme.theme) return;
    setLocalNextTheme(nextTheme);
    setTransitionStartTime(null); // Reset the transition start time
  }, [nextTheme.theme]);

  useEffect(() => {
    if (theme.id !== localTheme.id) {
      setLocalTheme(theme);
    }
  }, [transitionComplete]);

  useFrame((state) => {
    if (!transitionStartTime) {
      setTransitionStartTime(state.clock.getElapsedTime());
    }

    if (transitionStartTime && localNextTheme.theme && !transitionComplete) {
      const elapsed = state.clock.getElapsedTime() - transitionStartTime;
      const delay = 1; // seconds of delay
      const duration = 2.4; // Duration of the color transition in seconds

      if (elapsed > delay) {
        const t = Math.min((elapsed - delay) / duration, 1);
        const startColor = new THREE.Color(localTheme.colors.directionalLight);
        const endColor = new THREE.Color(
          localNextTheme.theme.colors.directionalLight
        );
        const r = THREE.MathUtils.lerp(startColor.r, endColor.r, t);
        const g = THREE.MathUtils.lerp(startColor.g, endColor.g, t);
        const b = THREE.MathUtils.lerp(startColor.b, endColor.b, t);
        lightRef.current.color.setRGB(r, g, b);

        // Intensity transition
        const startIntensity = localTheme.directionalLightIntensity;
        const endIntensity = localNextTheme.theme.directionalLightIntensity;
        const intensity = THREE.MathUtils.lerp(startIntensity, endIntensity, t);
        lightRef.current.intensity = intensity;

        if (t >= 1) {
          setTransitionComplete(true); // Mark the transition as complete
        }
      }
    }
  });

  return (
    <directionalLight
      ref={lightRef}
      position={[1, 1, 1]}
      intensity={localTheme.directionalLightIntensity}
      color={localTheme.colors.directionalLight}
    />
  );
};

export default DirectionalLight;
