import * as THREE from "three";
import type { WorldNode } from "../content/portfolio-data";
import type { HotspotMesh } from "../world/portals";

export function createRaycaster() {
  return {
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2(99, 99),
    setPointer(event: PointerEvent) {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    pick(camera: THREE.Camera, hotspots: HotspotMesh[]): WorldNode | null {
      this.raycaster.setFromCamera(this.pointer, camera);
      const hitTargets = hotspots.flatMap((hotspot) => hotspot.children);
      const hits = this.raycaster.intersectObjects(hitTargets, false);
      const node = hits.find((hit) => hit.object.userData.node)?.object.userData.node;
      return node ?? null;
    },
  };
}
