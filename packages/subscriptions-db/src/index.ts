import Fuse from "fuse.js";
import { SERVICE_TEMPLATES, type ServiceTemplate } from "./services";

export type { ServiceTemplate, BillingCycle, Category } from "./services";
export { SERVICE_TEMPLATES } from "./services";

let fuse: Fuse<ServiceTemplate> | null = null;

function getFuse(): Fuse<ServiceTemplate> {
  if (!fuse) {
    fuse = new Fuse(SERVICE_TEMPLATES, {
      keys: [
        { name: "name", weight: 0.6 },
        { name: "keywords", weight: 0.4 },
      ],
      threshold: 0.35,
      minMatchCharLength: 2,
    });
  }
  return fuse;
}

export function searchServices(query: string): ServiceTemplate[] {
  if (!query || query.trim().length < 2) return [];
  const results = getFuse().search(query.trim());
  return results.slice(0, 5).map((r) => r.item);
}

export function getServiceById(id: string): ServiceTemplate | undefined {
  return SERVICE_TEMPLATES.find((s) => s.id === id);
}

export function getServiceByDomain(domain: string): ServiceTemplate | undefined {
  return SERVICE_TEMPLATES.find((s) =>
    domain.toLowerCase().includes(s.domain.split("/")[0].toLowerCase())
  );
}
