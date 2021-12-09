import register from 'preact-custom-element';
import SwButton from './web-components/sw-button/sw-button.jsx';
import SwTextInput from './web-components/sw-text-input/sw-text-input.jsx';
import SwDatetimeInput from './web-components/sw-datetime-input/sw-datetime-input.jsx';
import SwLoader from './web-components/sw-loader/sw-loader.jsx';
import SwPagination from './web-components/sw-pagination/sw-pagination.jsx';
import './web-components/sw-select/sw-select.ts';
import SwTable from './web-components/sw-table/sw-table.jsx';
import SwNumberInput from './web-components/sw-number-input/sw-number-input';

import * as routerOriginal from './utils/router/router';
export var router = routerOriginal;

import trOriginal from './utils/tr';
export var tr = trOriginal;

export * from './utils/flash-message/flash-message.ts';
export * from './utils/modal/modal.jsx';
export * as stateMgr from './utils/state-mgr/state-mgr';
export * as dates from './utils/dates';
export * as strings from './utils/strings';


window.router = routerOriginal;

const areElementsRegistered = !!customElements.get('sw-button');

if (!areElementsRegistered) {
    register(
        SwButton,
        'sw-button',
        ['icon', 'disabled', 'href'],
        { shadow: true },
    );
    register(
        SwDatetimeInput,
        'sw-datetime-input',
        ['name', 'required', 'placeholder', 'disabled', 'value', 'step', 'show-label'],
        { shadow: true },
    );
    register(
        SwLoader,
        'sw-loader',
        [],
        { shadow: true },
    );
    register(SwNumberInput,
        'sw-number-input',
        ['name', 'required', 'placeholder', 'disabled', 'value', 'min', 'max', 'step', 'show-label'],
        { shadow: true },
    );
    register(SwPagination,
        'sw-pagination',
        ['current-page', 'number-of-pages', 'route-name'],
        { shadow: true },
    );
    register(
        SwTable,
        'sw-table',
        ['config'],
        { shadow: true },
    );
    register(
        SwTextInput,
        'sw-text-input',
        ['name', 'required', 'placeholder', 'disabled', 'value', 'show-label'],
        { shadow: true },
    );
}
