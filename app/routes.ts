import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/dashboard-layout.tsx", [
    index("routes/home.tsx"),
    route("floor/:floorId", "routes/structure/floor.tsx"),
    route("alerts", "routes/alerts.tsx"),
    route("cameras", "routes/cameras.tsx"),
  ]),
] satisfies RouteConfig;
