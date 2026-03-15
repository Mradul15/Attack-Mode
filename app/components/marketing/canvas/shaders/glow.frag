// Radial glow background shader
uniform float uGlow;
uniform vec2 uResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 center = vec2(0.5);
    float dist = distance(uv, center);

    // Dark background
    vec3 bg = vec3(0.02, 0.027, 0.05);

    // Orange radial glow
    vec3 glowColor = vec3(0.976, 0.451, 0.086);
    float glowFalloff = smoothstep(0.6, 0.0, dist);
    float glowStrength = glowFalloff * uGlow * 0.35;

    // Warm vignette
    float vignette = 1.0 - smoothstep(0.3, 0.85, dist) * 0.6;

    vec3 color = bg + glowColor * glowStrength;
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
}
