// Post-process ripple distortion shader
uniform sampler2D tDiffuse;
uniform float uRippleStrength;
uniform float uRippleRadius;
uniform vec2 uRippleCenter;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec2 delta = uv - uRippleCenter;
    float dist = length(delta);

    // Ring-shaped distortion that expands outward
    float ringWidth = 0.08;
    float ring = smoothstep(uRippleRadius - ringWidth, uRippleRadius, dist)
               - smoothstep(uRippleRadius, uRippleRadius + ringWidth, dist);

    // Distort UVs along the radial direction
    vec2 dir = normalize(delta + vec2(0.0001));
    float distortion = ring * uRippleStrength * 0.04;
    uv += dir * distortion;

    // Second harmonic for visual richness
    float ring2 = smoothstep(uRippleRadius * 0.6 - ringWidth * 0.5, uRippleRadius * 0.6, dist)
                - smoothstep(uRippleRadius * 0.6, uRippleRadius * 0.6 + ringWidth * 0.5, dist);
    uv += dir * ring2 * uRippleStrength * 0.015;

    gl_FragColor = texture2D(tDiffuse, uv);
}
