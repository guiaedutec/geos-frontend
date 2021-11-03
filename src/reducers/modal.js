import {
  TOGGLE_INFRASTRUCTURE_MODAL,
  TOGGLE_CENSUS_MODAL,
} from "~/actions/modal";

export default (
  state = {
    modal: { isCensusModalActive: false, isInfrastructureModalActive: false },
  },
  action
) => {
  switch (action.type) {
    case TOGGLE_CENSUS_MODAL:
      return {
        ...state,
        modal: { isCensusModalActive: !state.modal.isCensusModalActive },
      };

    case TOGGLE_INFRASTRUCTURE_MODAL:
      return {
        ...state,
        modal: {
          isInfrastructureModalActive: !state.modal.isInfrastructureModalActive,
        },
      };
    default:
      return Object.assign({}, state);
  }
};
