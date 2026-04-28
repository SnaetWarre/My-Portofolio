import type { NodeId, WorldNode } from "../scene/content/portfolio-data";

export function bindNodeButtons(nodes: WorldNode[], onSelect: (node: WorldNode) => void) {
  const byId = new Map<NodeId, WorldNode>(nodes.map((node) => [node.id, node]));
  document.addEventListener("click", (event) => {
    const element = (event.target as HTMLElement).closest<HTMLElement>("[data-node-link]");
    if (!element) return;
    event.preventDefault();
    const nodeId = element.dataset.nodeLink as NodeId | undefined;
    const node = nodeId ? byId.get(nodeId) : null;
    if (node) onSelect(node);
  });
}
