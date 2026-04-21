import type { CustomRequest } from "./http/custom-request.ts";
import type { CustomResponse } from "./http/custom-response.ts";

type Handler = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

export class Router {
  routes: Record<any, any> = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    HEAD: {}
  };
  get(route: string, handler: Handler) {
    this.routes["GET"][route] = handler;
  }

  post(route: string, handler: Handler) {
    this.routes["POST"][route] = handler;
  }

  put(route: string, handler: Handler) {
    this.routes["PUT"][route] = handler;
  }
   
  delete(route: string, handler: Handler) {
    this.routes["DELETE"][route] = handler;
  } 

  head(route: string, handler: Handler) {
    this.routes["HEAD"][route] = handler;
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
