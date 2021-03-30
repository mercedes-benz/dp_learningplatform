import {ApplicationInsights} from "@microsoft/applicationinsights-web"

import env from "./env";

export default () => {
  if(!env.TRACKING_INSTRUMENTATION_KEY) return;

  const config = env.TRACKING_CONFIG ? env.TRACKING_CONFIG : {};

  const appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: env.TRACKING_INSTRUMENTATION_KEY,
      enableAutoRouteTracking: true,
      ...config
    }
  })

  appInsights.loadAppInsights()
  appInsights.trackPageView()
};
