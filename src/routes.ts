
/**
* ces routes ne requiert pas d'authentication
* elles sont accessible à tous les utilisateurs connectés et non connectés
* @type {string[]}
**/
export const publicRoutes = [
    '/',
    '/forgot-password',
    '/new-password',
    '/new-verification'
];


/**
* ces routes nécessitent une authentication
* elles sont accessible uniquement aux utilisateurs connectés
* @type {string[]}
**/
export const authRoutes: string[] = [
    '/connexion',
    '/inscription',
    '/error',
]


/**
* prefixe des routes API pour les utilisateurs connectés
* pour les routes API pour les utilisateurs
* @type {string}
**/
export const apiAuthPrefix: string = '/api/auth'



/*
* route par défaut lorsqu'un utilisateur est connecté
* @type {string}
*/
export const DEFAULT_LOGIN_REDIRECT: string = '/settings'