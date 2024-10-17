import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const MyProducts = lazy(() => import('../pages/MyProducts'))
const ApprovedProducts = lazy(() => import('../pages/ApprovedProducts'))
const PendingProducts = lazy(() => import('../pages/PendingProducts'))
const Forms = lazy(() => import('../pages/Forms'))
const Cards = lazy(() => import('../pages/Cards'))
const Charts = lazy(() => import('../pages/Charts'))
const Buttons = lazy(() => import('../pages/Buttons'))
const Modals = lazy(() => import('../pages/Modals'))
const DeliveredOrders = lazy(() => import('../pages/DeliveredOrders'))
const PendingOrders = lazy(() => import('../pages/PendingOrders'))
const Videos = lazy(() => import('../pages/Videos'))
const Messages = lazy(() => import('../pages/Messages'))
const DeliveryLocations = lazy(() => import('../pages/DeliveryLocations'))
const ManageCategories = lazy(() => import('../pages/ManageCategories'))
const ManageRegularUsers = lazy(() => import('../pages/ManageRegularUsers'))
const Events = lazy(() => import('../pages/Events'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/Blank'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/forms',
    component: Forms,
  },
  {
    path: '/cards',
    component: Cards,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/buttons',
    component: Buttons,
  },
  {
    path: '/modals',
    component: Modals,
  },
  {
    path: '/manage_regular_users',
    component: ManageRegularUsers,
  },
  {
    path: '/delivered_orders',
    component: DeliveredOrders,
  },
  {
    path: '/pending_orders',
    component: PendingOrders,
  },
  {
    path: '/approved_products',
    component: ApprovedProducts
  },
  {
    path: '/my_products',
    component: MyProducts
  },{
    path: '/pending_products',
    component: PendingProducts
  },
  {
    path: '/categories',
    component: ManageCategories
  },
  {
    path: '/locations',
    component: DeliveryLocations
  },
  {
    path: '/videos',
    component: Videos
  },
  {
    path: '/events',
    component: Events
  },
  {
    path: '/messages',
    component: Messages
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
]

export default routes
