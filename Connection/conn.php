<?php

    $db_server="localhost";
    $db_user="root";
    $db_pass="admin";
    $db_name="bdm";

    $conn=mysqli_connect(hostname: $db_server,
           username: $db_user,
           password: $db_pass,
           database: $db_name);


    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
        exit();
    }else{
        echo "Conectado a la base de datos";
    }
    
?>