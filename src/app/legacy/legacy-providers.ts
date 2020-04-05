// role service
function roleServiceFactory($injector) {
  return $injector.get("rolesService");
}

export const RoleServiceProvider = {
  provide: "rolesService",
  useFactory: roleServiceFactory,
  deps: ["$injector"]
}
