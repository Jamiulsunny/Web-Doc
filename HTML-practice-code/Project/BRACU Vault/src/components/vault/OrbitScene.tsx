// Browser-only 3D scene. Import lazily (React.lazy) — three.js must never load during SSR.
import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { OrbitData, OrbitNode } from "@/lib/vault-data";

function Core() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = 0.08 * s.clock.elapsedTime;
    ref.current.scale.setScalar(1 + 0.03 * Math.sin(1.2 * s.clock.elapsedTime));
  });
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color="#C17A2B" emissive="#C17A2B" emissiveIntensity={1} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh scale={1.55}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial color="#E8E1D9" wireframe transparent opacity={0.16} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2.2} distance={32} color="#ffca73" />
    </group>
  );
}

function Ring({ radius, color, dim }: { radius: number; color: string; dim: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 8, 160]} />
      <meshBasicMaterial color={color} transparent opacity={dim ? 0.08 : 0.3} />
    </mesh>
  );
}

function Planet({ node, selectedCode, highlightCode, visible, onSelect, appearDelay }: {
  node: OrbitNode; selectedCode: string | null; highlightCode: string | null; visible: boolean; onSelect: (n: OrbitNode) => void; appearDelay: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const [hover, setHover] = useState(false);
  const start = useRef<number | undefined>(undefined);
  const selected = selectedCode === node.code;
  const highlighted = highlightCode === node.code;
  const others = !!selectedCode && !selected;
  const lit = hover || selected || highlighted;

  useFrame((s) => {
    if (start.current === undefined) start.current = s.clock.elapsedTime;
    const appeared = s.clock.elapsedTime - start.current > appearDelay;
    const m = mesh.current;
    if (m) {
      const base = appeared ? (visible ? 1 : 0.55) : 0;
      m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, base * (lit ? 1.7 : 1), 0.16));
      m.position.y = 0.06 * Math.sin(0.45 * s.clock.elapsedTime + node.angle);
    }
    if (mat.current) {
      mat.current.opacity = THREE.MathUtils.lerp(mat.current.opacity, visible ? (others ? 0.14 : 1) : 0.06, 0.1);
      mat.current.emissiveIntensity = THREE.MathUtils.lerp(mat.current.emissiveIntensity, visible ? (lit ? 1.5 : others ? 0.1 : 0.5) : 0.05, 0.1);
    }
  });

  return (
    <group position={[node.x, 0, node.z]}>
      <mesh
        ref={mesh}
        scale={0}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          if (!visible) return;
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (!visible) return;
          e.stopPropagation();
          onSelect(node);
        }}
      >
        <sphereGeometry args={[0.24, 18, 18]} />
        <meshStandardMaterial ref={mat} color={node.color} emissive={node.color} emissiveIntensity={0.5} metalness={0.3} roughness={0.4} transparent />
      </mesh>
      {lit && visible && (
        <Html center position={[0, 0.62, 0]} style={{ pointerEvents: "none" }} zIndexRange={[60, 0]}>
          <div className="glass-strong -translate-y-1 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold text-fg shadow-glow">
            {node.code}
            {hover && <span className="ml-1.5 font-normal text-accent">{node.fileCount}</span>}
          </div>
        </Html>
      )}
    </group>
  );
}

function CameraRig({ selectedCode, nodes }: { selectedCode: string | null; nodes: OrbitNode[] }) {
  const target = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const lift = useMemo(() => new THREE.Vector3(0, 2.6, 0), []);
  useFrame((s) => {
    const controls = s.controls as unknown as OrbitControlsImpl | null;
    if (!controls) return;
    const node = selectedCode ? nodes.find((n) => n.code === selectedCode) : undefined;
    if (node) {
      target.set(node.x, 0, node.z);
      controls.target.lerp(target, 0.08);
      dir.copy(target).normalize();
      camPos.copy(target).addScaledVector(dir, 5.2).add(lift);
      s.camera.position.lerp(camPos, 0.06);
    } else {
      controls.target.lerp(target.set(0, 0, 0), 0.05);
    }
  });
  return null;
}

export default function OrbitScene({ data, selectedCode, highlightCode, visibleCodes, onSelect }: {
  data: OrbitData; selectedCode: string | null; highlightCode: string | null; visibleCodes: Set<string> | null; onSelect: (n: OrbitNode | null) => void;
}) {
  const [interacted, setInteracted] = useState(false);
  const autoRotate = !interacted && !selectedCode;
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 7, 18], fov: 50 }} gl={{ antialias: true, alpha: true }} onPointerMissed={() => onSelect(null)}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 8]} intensity={0.5} color="#E8E1D9" />
      <Core />
      {data.rings.map((r) => {
        const dim = !!visibleCodes && !data.nodes.some((n) => n.category === r.category && visibleCodes.has(n.code));
        return <Ring key={r.category} radius={r.radius} color={r.color} dim={dim} />;
      })}
      {data.nodes.map((n, i) => (
        <Planet key={n.code} node={n} selectedCode={selectedCode} highlightCode={highlightCode} visible={!visibleCodes || visibleCodes.has(n.code)} onSelect={onSelect} appearDelay={0.1 + 0.02 * i} />
      ))}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.8}
        autoRotate={autoRotate}
        autoRotateSpeed={0.25}
        minDistance={3}
        maxDistance={30}
        minPolarAngle={0.12 * Math.PI}
        maxPolarAngle={0.85 * Math.PI}
        onStart={() => setInteracted(true)}
      />
      <CameraRig selectedCode={selectedCode} nodes={data.nodes} />
    </Canvas>
  );
}
