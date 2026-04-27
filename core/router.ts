import type { CustomRequest } from "./http/custom-request.ts";
import type { CustomResponse } from "./http/custom-response.ts";

export type Handler = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

export type Middleware = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

type Routes = {
  [method: string]: {
    [path: string]: {
      handler: Handler;
      middlewares: Middleware[]
    }
  }
}

export class Router {
  routes: Routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    HEAD: {}
  };
  
  get(route: string, handler: Handler, middlewares: Middleware[] = []) {
    this.routes["GET"][route] = {handler, middlewares};
  }

  post(route: string, handler: Handler, middlewares: Middleware[] = []) {
    this.routes["POST"][route] = {handler, middlewares};
  }

  put(route: string, handler: Handler, middlewares: Middleware[] = []) {
    this.routes["PUT"][route] = {handler, middlewares};
  }
   
  delete(route: string, handler: Handler, middlewares: Middleware[] = []) {
    this.routes["DELETE"][route] = {handler, middlewares};
  } 

  head(route: string, handler: Handler, middlewares: Middleware[] = []) {
    this.routes["HEAD"][route] = {handler, middlewares};
  }

  find(method: string, pathname: string) {
    const routesByMethod = this.routes[method];
   
    if(!routesByMethod) return null // Não encontrou rota com método chamado

    const matchedRoute = routesByMethod[pathname];
    if (matchedRoute) return {route: matchedRoute, params: {}} // Encontrou a rota

    const reqParts = pathname.split("/").filter(Boolean) // Rotas Cadastradas

    for(const route of Object.keys(routesByMethod)) {
      if(!route.includes(":")) continue

      const routeParts = route.split("/").filter(Boolean) // Rota da requisição
      if(reqParts.length !== routeParts.length) continue // Verifica se existe alguma rota cadastrada com tamanho diferente da rota da requisição

      if(reqParts[0] !== routeParts[0]) continue // Encontrou a rota pois a primeira parte da rota não é dinamica

      const params: Record<string, string> = {}
      let ok = true
      for (let i = 0; i < reqParts.length; i++) {
        const segment = routeParts[i]
        const value = reqParts[i]
        
        if(segment.startsWith(":")) {
            params[segment.slice(1)] = value
        } else if (segment !== value) {
            ok = false  
            break // rota errada
        }
      }

      if (ok) {
        return { route: routesByMethod[route], params}
      }
    }

    return null
  }
}
