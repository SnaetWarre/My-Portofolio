import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const accretionFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float ring(vec2 uv, float radius, float width) {
    float d = abs(length(uv) - radius);
    return smoothstep(width, 0.0, d);
  }

  void main() {
    vec2 uv = vUv - 0.5;
    uv.x *= 2.62;
    float angle = atan(uv.y, uv.x);
    float dist = length(uv);
    float swirlA = sin(angle * 23.0 + uTime * 4.2 + dist * 39.0);
    float swirlB = sin(angle * 9.0 - uTime * 3.1 + dist * 96.0);
    float turbulence = swirlA * 0.024 + swirlB * 0.016;
    float mainBand = ring(uv, 0.36 + turbulence, 0.145);
    float innerCut = smoothstep(0.19, 0.31, dist);
    float outerFade = 1.0 - smoothstep(0.45, 0.67, dist);
    float diskMask = 1.0 - smoothstep(0.52, 0.68, dist);
    float hotEdge = ring(uv, 0.43 + turbulence * 0.45, 0.021);
    float doppler = smoothstep(-0.55, 0.75, cos(angle - 0.35));
    float streak = pow(max(swirlA * 0.5 + 0.5, 0.0), 2.2);
    float alpha = ((mainBand * innerCut * outerFade * (0.2 + doppler * 0.52 + streak * 0.24)) + hotEdge * 0.68) * diskMask;
    vec3 ember = vec3(1.0, 0.18, 0.03);
    vec3 orange = vec3(1.0, 0.48, 0.10);
    vec3 whiteHot = vec3(1.0, 0.56, 0.22);
    vec3 color = mix(ember, orange, doppler);
    color = mix(color, whiteHot, clamp(hotEdge + streak * 0.28, 0.0, 1.0));
    color *= 0.34 + doppler * 0.82 + hotEdge * 1.1;
    if (alpha < 0.018) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const lensFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    float halo = (1.0 - smoothstep(0.29, 0.56, dist)) - (1.0 - smoothstep(0.04, 0.22, dist));
    float photonRing = smoothstep(0.305, 0.285, abs(dist - 0.29));
    float shimmer = sin(angle * 18.0 - uTime * 2.9) * 0.05;
    vec3 color = mix(vec3(0.08, 0.18, 0.55), vec3(0.95, 0.38, 0.12), dist + shimmer);
    color += vec3(1.0, 0.42, 0.18) * photonRing * 0.75;
    float alpha = halo * 0.14 + photonRing * 0.24;
    if (alpha < 0.012) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

export type BlackHoleSystem = {
  group: THREE.Group;
  update: (delta: number, elapsed: number) => void;
};

export function createBlackHole(): BlackHoleSystem {
  const group = new THREE.Group();

  const voidSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.58, 128, 128),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
  );

  const eventHorizon = new THREE.Mesh(
    new THREE.SphereGeometry(1.72, 128, 128),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.92,
      blending: THREE.NormalBlending,
    }),
  );

  const accretion = new THREE.Mesh(
    new THREE.RingGeometry(1.72, 5.25, 256, 8),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: accretionFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
    }),
  );
  accretion.scale.y = 0.36;
  accretion.rotation.x = -0.21;
  accretion.rotation.z = -0.08;

  const backRing = accretion.clone();
  backRing.scale.setScalar(1.11);
  backRing.scale.y *= 0.36;
  backRing.position.z = -0.32;
  backRing.material = accretion.material.clone();

  const lensHalo = new THREE.Mesh(
    new THREE.RingGeometry(1.58, 3.45, 192, 4),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: lensFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
    }),
  );
  lensHalo.scale.y = 0.88;
  lensHalo.position.z = 0.08;

  group.add(backRing, lensHalo, accretion, eventHorizon, voidSphere);

  return {
    group,
    update: (delta, elapsed) => {
      group.rotation.y += delta * 0.09;
      group.rotation.x = Math.sin(elapsed * 0.35) * 0.035;
      accretion.rotation.z += delta * 0.16;
      backRing.rotation.z -= delta * 0.11;
      (accretion.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
      (backRing.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed * 1.18;
      (lensHalo.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
    },
  };
}
