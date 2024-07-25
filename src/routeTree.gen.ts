/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LinearImport } from './routes/linear'
import { Route as BinaryImport } from './routes/binary'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const LinearRoute = LinearImport.update({
  path: '/linear',
  getParentRoute: () => rootRoute,
} as any)

const BinaryRoute = BinaryImport.update({
  path: '/binary',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/binary': {
      id: '/binary'
      path: '/binary'
      fullPath: '/binary'
      preLoaderRoute: typeof BinaryImport
      parentRoute: typeof rootRoute
    }
    '/linear': {
      id: '/linear'
      path: '/linear'
      fullPath: '/linear'
      preLoaderRoute: typeof LinearImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  BinaryRoute,
  LinearRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/binary",
        "/linear"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/binary": {
      "filePath": "binary.tsx"
    },
    "/linear": {
      "filePath": "linear.tsx"
    }
  }
}
ROUTE_MANIFEST_END */