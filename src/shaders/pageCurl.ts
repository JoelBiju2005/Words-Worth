import * as THREE from 'three';

export const pageCurlVertexShader = `
uniform float uCurlPosition;  // Crease position along X (moves from PageWidth down to -PageWidth)
uniform float uCurlRadius;    // Cylinder radius (tightness of the roll)
uniform float uPageWidth;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;

const float PI = 3.14159265358979323846;

void main() {
  vec3 pos = position;
  vec3 norm = normal; // Initial normal is (0.0, 0.0, 1.0)
  
  float dist = pos.x - uCurlPosition;
  float R = max(uCurlRadius, 0.001);
  float halfCirc = PI * R;

  if (dist <= 0.0) {
    // Zone 1: Flat on the right side
    pos.x = pos.x;
    pos.z = pos.z;
    norm = vec3(0.0, 0.0, 1.0);
  } else if (dist <= halfCirc) {
    // Zone 2: Curving around the cylinder
    float theta = dist / R;
    pos.x = uCurlPosition + R * sin(theta);
    pos.z = pos.z + R * (1.0 - cos(theta));
    
    // Analytical normal: derivative of position rotated by 90 degrees
    norm = normalize(vec3(-sin(theta), 0.0, cos(theta)));
  } else {
    // Zone 3: Flat on the left side (wrapped around)
    float excess = dist - halfCirc;
    pos.x = uCurlPosition - excess;
    pos.z = pos.z + 2.0 * R;
    norm = vec3(0.0, 0.0, -1.0);
  }

  // Slight natural paper droop along Y towards outer corners for organic realism
  float cornerFactor = clamp(pos.x / uPageWidth, 0.0, 1.0) * (abs(pos.y) / 0.6);
  pos.z += sin(dist * 2.0) * 0.015 * cornerFactor;

  vNormal = normalize(normalMatrix * norm);
  vUv = uv;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const pageCurlFragmentShader = `
uniform sampler2D uFrontTexture;
uniform sampler2D uBackTexture;
uniform vec3 uCandlePos;
uniform float uCandleIntensity;
uniform float uAmbientIntensity;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  // Determine if viewing front or back of the page
  bool isFront = gl_FrontFacing;
  vec3 normalDir = normalize(vNormal) * (isFront ? 1.0 : -1.0);

  // Dynamic candlelight calculation synced with Scene candle PointLight
  vec3 lightVector = uCandlePos - vWorldPosition;
  float distToLight = length(lightVector);
  vec3 lightDir = normalize(lightVector);

  // Candle attenuation
  float attenuation = 1.0 / (1.0 + 0.35 * distToLight + 0.2 * distToLight * distToLight);
  float diff = max(dot(normalDir, lightDir), 0.0);

  // Candle warm golden tint + live flicker intensity
  vec3 candleColor = vec3(1.0, 0.72, 0.38);
  vec3 diffuseLight = candleColor * diff * attenuation * (uCandleIntensity * 1.8);

  // Soft ambient room light
  vec3 ambientLight = vec3(0.2, 0.15, 0.12) * uAmbientIntensity;
  vec3 totalLight = ambientLight + diffuseLight;

  // Sample appropriate texture
  vec4 texColor;
  if (isFront) {
    texColor = texture2D(uFrontTexture, vUv);
  } else {
    // Invert X on back face so text isn't backwards if textured
    vec2 backUv = vec2(1.0 - vUv.x, vUv.y);
    texColor = texture2D(uBackTexture, backUv);
  }

  gl_FragColor = vec4(texColor.rgb * totalLight, texColor.a);
}
`;

export interface PageCurlUniforms {
  uCurlPosition: { value: number };
  uCurlRadius: { value: number };
  uPageWidth: { value: number };
  uFrontTexture: { value: THREE.Texture | null };
  uBackTexture: { value: THREE.Texture | null };
  uCandlePos: { value: THREE.Vector3 };
  uCandleIntensity: { value: number };
  uAmbientIntensity: { value: number };
}

export function createPageCurlMaterial(
  frontTexture: THREE.Texture,
  backTexture: THREE.Texture,
  pageWidth = 1.25,
  candlePos = new THREE.Vector3(-1.8, 1.4, 0.2)
): THREE.ShaderMaterial {
  const uniforms: PageCurlUniforms = {
    uCurlPosition: { value: pageWidth * 1.5 }, // Start flat
    uCurlRadius: { value: 0.18 },
    uPageWidth: { value: pageWidth },
    uFrontTexture: { value: frontTexture },
    uBackTexture: { value: backTexture },
    uCandlePos: { value: candlePos },
    uCandleIntensity: { value: 1.0 },
    uAmbientIntensity: { value: 0.7 },
  };

  return new THREE.ShaderMaterial({
    vertexShader: pageCurlVertexShader,
    fragmentShader: pageCurlFragmentShader,
    uniforms: uniforms as unknown as { [uniform: string]: THREE.IUniform },
    side: THREE.DoubleSide,
    transparent: false,
    depthWrite: true,
  });
}
