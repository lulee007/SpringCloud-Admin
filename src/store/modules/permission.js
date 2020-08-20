import { asyncRoutes, constantRoutes } from '@/router'
import { validatenull, validateURL } from '@/utils/validate'
import { GetMenu } from '@/api/menu'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  ADD_ROUTERS: (state, addRouters) => {
    state.routers = constantRoutes.concat(addRouters)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  GetMenu({ commit }) {
    return new Promise(resolve => {
      GetMenu().then((res) => {
        const data = res.data
        data.forEach(ele => {
          if (ele.children) {
            ele.children.forEach(child => {
              if (!validatenull(child.component)) {
                if (validateURL(child.path)) {
                  child.path = `${child.path}`
                } else {
                  child.path = `${ele.path}/${child.path}`
                }
              }
            })
          }
        })
        commit('SET_ROUTERS', data)
        resolve(data)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
