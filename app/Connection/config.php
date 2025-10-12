<?php
return [
    'env' => 'local', // Cambia a 'cloud' para usar la base en la nube
    'local' => [
        'DB_SERVER' => 'localhost',
        'DB_USER'   => 'root',
        'DB_PASS'   => 'admin',
        'DB_NAME'   => 'bdm',
        'DB_PORT'   => 3306
    ],
    'cloud' => [
        'DB_SERVER' => 'tramway.proxy.rlwy.net', // host público para tu máquina
        'DB_USER'   => 'root',
        'DB_PASS'   => 'wPdwuvnDPMxoVcdFHfMFnfWHRRWKyIgX',
        'DB_NAME'   => 'railway',
        'DB_PORT'   => 24351 // puerto de la URL pública
    ]
];
