<?php

    $db_server="localhost";
    $db_user="root";
    $db_pass=""; 
    $db_name="bdm";

    $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);

    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
        exit();
    }else{
        echo "Conectado a la base de datos";
    }
    
?>