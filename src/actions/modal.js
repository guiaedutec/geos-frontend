export const TOGGLE_INFRASTRUCTURE_MODAL = "modal/TOGGLE_INFRASTRUCTURE_MODAL";
export const TOGGLE_CENSUS_MODAL = "modal/TOGGLE_CENSUS_MODAL";

export function toggleInfrastructureModal() {
  return { type: TOGGLE_INFRASTRUCTURE_MODAL };
}

export function toggleCensusModal() {
  return { type: TOGGLE_CENSUS_MODAL };
}
