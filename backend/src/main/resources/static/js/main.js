import { initLogin }
from './auth/login.js';

import { initRegister }
from './auth/register.js';

import { initLogout }
from './auth/logout.js';

document.addEventListener(
    'DOMContentLoaded',
    () => {

        initLogin();

        initRegister();

        initLogout();

        console.log(
            'Airport Management System Initialized'
        );
    }
);