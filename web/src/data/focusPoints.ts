// Timeline focus anchors: names of `focus-*` empty objects in glb, corresponding to resume entries in order (Resume.tsx).
// This is the single source of truth for "resume entry count / camera stop points" — Scene.tsx and Resume.tsx both read from here,
// when adding/removing resume entries only modify here + Resume.tsx entries, rest (node count M, frame ranges) automatically derived by Scene.tsx.
//
// Camera animation (CameraAction in glb) frame convention:
//   Frame 0           → Hero shot (hero anchor: `focus-start` or `focus-0`, both naming recognized)
//   Frame 50·k        → k-th timeline node (k = 1…M, corresponding to FOCUS_POINTS[k-1])
//   Last frame        → Works section shot (`focus-works`; if missing, automatically reuse last timeline node)
// i.e., each node separated by FRAMES_PER_NODE frames; between last node and works section is "works section" frame segment,
// length = camera animation total frames − 50·M, can be long or short (current me.glb is 100 frames of entrance+shift shot).
//
// Both naming schemes supported: repo-included glb uses meaningful slugs (below); intro3d one-click export glb uses unified numbering
// `focus-0`(hero) + `focus-1…M`(timeline), in which case replace below with ['focus-1','focus-2',…].
// ⚠️ Must correspond one-to-one with timeline focus empty object names in glb, and count = Resume.tsx entries count.
// Hero anchor focus-0 (or old name focus-start) + works section focus-works automatically recognized by Scene.tsx, not listed here.
// Current is unified naming 6-node glb (focus-1…6). When changing resume entry count, synchronously add/remove here + Resume.tsx entries.
export const FOCUS_POINTS = ['focus-1', 'focus-2', 'focus-3', 'focus-4'] as const

// Frames per timeline node in camera animation (node k falls on frame k·FRAMES_PER_NODE).
export const FRAMES_PER_NODE = 50
