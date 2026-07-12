// Shared Three.js helpers used by the companion and the playground.
// =================================================================
// Small, dependency-light utilities that were previously copy-pasted into both
// scene modules (and the loader): GPU-resource disposal and model framing.

import { Box3, Vector3 } from 'three';

// Free a single mesh's GPU resources: its geometry, and every material plus any
// textures the material references. Safe to call on non-mesh nodes' children —
// each accessor is optional-chained so a partial rig disposes without throwing.
export function disposeMesh(node) {
	node.geometry?.dispose?.();
	const mats = Array.isArray(node.material) ? node.material : [node.material];
	for (const m of mats) {
		if (!m) continue;
		for (const v of Object.values(m)) if (v && v.isTexture) v.dispose();
		m.dispose?.();
	}
}

// Traverse an object (a loaded model, a rig, or a whole scene) and dispose the
// GPU resources of every mesh under it. Used both after a live avatar swap and
// during scene teardown so an abandoned load never leaks meshes/textures.
export function disposeObject(obj) {
	obj?.traverse?.((n) => {
		if (n.isMesh) disposeMesh(n);
	});
}

// Uniformly scale a model so its bounding-box height matches `px` world units.
export function scaleModelToHeight(model, px) {
	const box = new Box3().setFromObject(model);
	const h = box.getSize(new Vector3()).y;
	model.scale.setScalar(px / Math.max(0.001, h));
}

// Center a model on its X/Z footprint and drop its feet to the floor (y = 0),
// so it stands at the rig origin. Returns the model's bounding-box size, which
// callers use to frame a camera (height) or size a shadow (half-width).
export function centerModelOnFloor(model) {
	const box = new Box3().setFromObject(model);
	const size = box.getSize(new Vector3());
	const center = box.getCenter(new Vector3());
	model.position.x -= center.x;
	model.position.z -= center.z;
	model.position.y -= box.min.y;
	return size;
}
