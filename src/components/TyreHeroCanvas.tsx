import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOutQuart = (value: number) => 1 - Math.pow(1 - value, 4);
const settledYaw = -0.42;
const settledPitch = 0.08;
// Reduced startX / stopX so the tyre lands in the right-center of the
// viewport instead of the far-right edge. Also lowered stopY slightly
// to sit closer to the vertical centre of the hero.
const startX = 5.2;
const stopX = 1.55;
const stopY = 0.42;

export function TyreHeroCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.18, 6.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(2.8, 4.2, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd2243a, 1.15);
    rimLight.position.set(-4, 1.5, -2);
    scene.add(rimLight);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a0a10, 1.4));

    const wheelRig = new THREE.Group();
    const wheelPivot = new THREE.Group();
    wheelRig.add(wheelPivot);
    scene.add(wheelRig);
    const wheelBounds = new THREE.Box3();
    const wheelWorldCenter = new THREE.Vector3();
    const wheelLocalCenter = new THREE.Vector3();

    const loader = new GLTFLoader();
    let modelReady = false;
    let disposed = false;

    loader.load(
      "/car_tyre.glb",
      (gltf) => {
        if (disposed) return;

        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        // Reduced from 2.9 → 2.5 so the tyre is proportionate to the hero
        // and stays fully visible within the viewport on all screen sizes.
        const scale = 2.5 / maxAxis;

        model.position.sub(center);
        model.scale.setScalar(scale);
        model.rotation.set(0, 0, 0);

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        wheelPivot.add(model);
        modelReady = true;
      },
      undefined,
      (error) => {
        console.error("Failed to load tyre model", error);
      },
    );

    const reducedMotion = prefersReducedMotion();

    // Pointer/device-driven responsiveness
    const pointer = {
      x: stopX,
      yaw: settledYaw,
      pitch: settledPitch,
    };

    const target = {
      spin: 0,
      x: stopX,
      y: stopY,
      yaw: 0,
      pitch: settledPitch,
    };

    const current = {
      spin: 0,
      x: reducedMotion ? target.x : startX,
      y: target.y,
      yaw: settledYaw,
      pitch: settledPitch,
    };
    let rafId = 0;
    const introDuration = 1500;
    const autoSpinDuration = 5000;
    const autoSpinRate = 0.006;
    const introStart = performance.now();
    let introComplete = reducedMotion;
    let introEndSpin = 0;
    let autoSpinStart = reducedMotion ? 0 : introStart + introDuration;
    let scrollStartY = window.scrollY;
    let smoothedScrollDistance = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (!introComplete || reducedMotion || !mount) return;
      const rect = mount.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const ratioX = THREE.MathUtils.clamp((event.clientX - centerX) / (rect.width / 2), -1, 1);
      const ratioY = THREE.MathUtils.clamp((event.clientY - centerY) / (rect.height / 2), -1, 1);

      pointer.x = THREE.MathUtils.lerp(stopX, stopX + 0.28, ratioX);
      pointer.yaw = THREE.MathUtils.lerp(settledYaw, settledYaw + ratioX * 0.22, Math.abs(ratioX));
      pointer.pitch = THREE.MathUtils.lerp(settledPitch, settledPitch - ratioY * 0.1, 0.55);
    };

    const handlePointerLeave = () => {
      pointer.x = stopX;
      pointer.yaw = settledYaw;
      pointer.pitch = settledPitch;
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!introComplete || reducedMotion) return;
      const gamma = e.gamma ?? 0; // left-right tilt (-90..90)
      const beta = e.beta ?? 0; // front-back tilt (-180..180)
      const ratioX = THREE.MathUtils.clamp(gamma / 30, -1, 1);
      const ratioY = THREE.MathUtils.clamp((beta - 10) / 30, -1, 1);

      pointer.x = THREE.MathUtils.lerp(stopX, stopX + 0.28, ratioX);
      pointer.yaw = THREE.MathUtils.lerp(settledYaw, settledYaw + ratioX * 0.22, Math.abs(ratioX));
      pointer.pitch = THREE.MathUtils.lerp(settledPitch, settledPitch - ratioY * 0.12, 0.55);
    };

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (!introComplete) {
        const introProgress = THREE.MathUtils.clamp((performance.now() - introStart) / introDuration, 0, 1);
        const easedProgress = easeOutQuart(introProgress);

        target.x = THREE.MathUtils.lerp(startX, stopX, easedProgress);
        target.y = stopY;
        target.spin = -easedProgress * Math.PI * 7.2;
        target.yaw = settledYaw;
        target.pitch = settledPitch;

        if (introProgress >= 1) {
          introComplete = true;
          introEndSpin = target.spin;
          autoSpinStart = performance.now();
          scrollStartY = window.scrollY;
          smoothedScrollDistance = 0;
          target.x = stopX;
          target.y = stopY;
          current.x = stopX;
          current.y = stopY;
        }
      } else if (!reducedMotion) {
        const scrollDistance = window.scrollY - scrollStartY;
        const autoSpinElapsed = THREE.MathUtils.clamp(performance.now() - autoSpinStart, 0, autoSpinDuration);
        const autoSpinEaseDuration = 1800;
        const autoSpinLinearDuration = autoSpinDuration - autoSpinEaseDuration;
        const autoSpin =
          autoSpinElapsed <= autoSpinLinearDuration
            ? -autoSpinElapsed * autoSpinRate
            : -(
                autoSpinLinearDuration * autoSpinRate +
                autoSpinEaseDuration *
                  autoSpinRate *
                  easeOutQuart((autoSpinElapsed - autoSpinLinearDuration) / autoSpinEaseDuration)
              );

        smoothedScrollDistance = THREE.MathUtils.lerp(smoothedScrollDistance, scrollDistance, 0.055);
        target.spin = introEndSpin + autoSpin - smoothedScrollDistance * 0.011;

        // blend in pointer/device-driven offsets when available
        target.x = THREE.MathUtils.lerp(stopX, pointer.x, 0.28);
        target.y = stopY;
        target.yaw = THREE.MathUtils.lerp(settledYaw, pointer.yaw, 0.42);
        target.pitch = THREE.MathUtils.lerp(settledPitch, pointer.pitch, 0.5);
      }

      current.spin = THREE.MathUtils.lerp(current.spin, target.spin, introComplete ? 0.08 : 0.14);
      current.x = introComplete ? stopX : THREE.MathUtils.lerp(current.x, target.x, 0.12);
      current.y = introComplete ? stopY : THREE.MathUtils.lerp(current.y, target.y, 0.12);
      current.yaw = settledYaw;
      current.pitch = settledPitch;

      wheelRig.position.set(current.x, current.y, 0);
      wheelRig.rotation.y = current.yaw;
      wheelRig.rotation.z = 0;
      wheelRig.rotation.x = current.pitch;

      if (modelReady) {
        wheelPivot.position.set(0, 0, 0);
        wheelPivot.rotation.x = current.spin;
        wheelPivot.rotation.y = 0;
        wheelPivot.rotation.z = 0;

        scene.updateMatrixWorld(true);
        wheelBounds.setFromObject(wheelPivot);
        wheelBounds.getCenter(wheelWorldCenter);
        wheelLocalCenter.copy(wheelWorldCenter);
        wheelRig.worldToLocal(wheelLocalCenter);
        wheelPivot.position.set(-wheelLocalCenter.x, -wheelLocalCenter.y, -wheelLocalCenter.z);
      }

      renderer.render(scene, camera);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    // Capture pointer and device orientation for interactivity
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointercancel", handlePointerLeave);
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleDeviceOrientation as EventListener);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointercancel", handlePointerLeave);
      if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        window.removeEventListener("deviceorientation", handleDeviceOrientation as EventListener);
      }
      renderer.dispose();
      renderer.domElement.remove();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="tyre-hero-canvas pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    >
      <div className="tyre-smoke">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
