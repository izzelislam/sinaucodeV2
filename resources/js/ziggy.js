import { route as ziggyRoute } from 'ziggy-js';

export function route(name, params, absolute) {
    return ziggyRoute(name, params, absolute, window.Ziggy);
}
