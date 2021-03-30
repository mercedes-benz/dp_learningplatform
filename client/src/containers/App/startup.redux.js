/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  STARTUP: "STARTUP",
  STARTUP_ROUTER_LOCATION: "STARTUP_ROUTER_LOCATION"
}

/*
 * action creators
 */
const Creators = {
  startup: () => {
    return {
      type: Types.STARTUP
    }
  },

  startupLocation: () => {
    return {
      type: Types.STARTUP_ROUTER_LOCATION
    }
  }
}

export const StartupTypes = Types
export default Creators
