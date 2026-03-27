import {createRouter, createWebHistory} from 'vue-router';

import auth from '../middleware/auth';
import log from '../middleware/log';

import Login from "../views/Auth/Login/Login.vue";
import Tables from '../views/Table/Index.vue'
import Order from '../views/Order/index.vue'
import Bill from '../views/Bill/index.vue'
import Menu from "../views/Menu/index.vue"
import NotFound from '../views/404.vue';


const routes = [

    {
        path: '/restaurant/:restaurantId/table/:tableId',
        name: 'Login',
        component: Login,
        props: route => ({
            restaurantId: route.params.restaurantId,
            tableId: route.params.tableId,
        }),
        meta: {
            title: 'Restaurant Girişi',
        }
    },
    {
      path: '/menu',
      name: 'Menu',
      component: Menu,
      meta: {
          title: 'Menü',
          auth: [1],
          middleware: [auth]
      }
    },
    {
        path: '/tables',
        name: 'Tables',
        template: `<router-view />`,
        meta: {
            headerClass: 'header',
            sidebarClass: '',
            title: 'Masalar',
            middleware: [auth, log]
        },
        children: [
            {
                path: "",
                component: Tables,
                meta: {
                    auth: [1, 3],
                }
            },
            {
                path: ":id",
                template: `<router-view />`,
                children: [
                    {
                        path: "",
                        component: Order,
                        meta: {
                            auth: [1, 3],
                        }
                    },
                    {
                        path: "bill",
                        component: Bill,
                        meta: {
                            auth: [1],
                        }
                    }
                ]
            }
        ]
    },

    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }, // 404 Route
];


const router = createRouter({
    history: createWebHistory('/'),
    linkActiveClass: 'active',
    routes,
});

const default_title = 'GoAdisyon QR Menü';
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || default_title;
    next();
});

function nextFactory(context, middleware, index) {

    const subsequentMiddleware = middleware[index];

    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {

        context.next(...parameters);

        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({...context, next: nextMiddleware});
    }
}

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware)
            ? to.meta.middleware
            : [to.meta.middleware];

        const context = {
            from,
            next,
            router,
            to,
        };
        const nextMiddleware = nextFactory(context, middleware, 1);

        return middleware[0]({...context, next: nextMiddleware});
    }

    return next();
});


export default router;



