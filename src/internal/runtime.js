// Shared animation runtime.
// ==========================
// The retargeting engine (AnimationManager + animation-retarget +
// glb-canonicalize) is the rig-agnostic clip system: it takes the shared
// Mixamo/VRM-canonical clip library and replays it on ANY humanoid skeleton
// (Ready Player Me, Mixamo, VRM, custom). It ships as its own package,
// @three-ws/retarget, and this file is the only seam that pulls it in. The
// publish build (`build.mjs`, esbuild with `three` external) bundles it into a
// self-contained `dist/`, so npm consumers get one standalone file with
// nothing to resolve.

export { AnimationManager } from '@three-ws/retarget';
