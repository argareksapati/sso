export type ServiceEntry = {
  id: string;
  name: string;
  description: string;
  category: string;
  href: string;
};

export async function listConfiguredServices(): Promise<ServiceEntry[]> {
  // No services are shown until the integration inventory is approved.
  return [];
}
