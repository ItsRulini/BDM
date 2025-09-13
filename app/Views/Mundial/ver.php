<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Detalles del Mundial</title>
    <link rel="stylesheet" href="/css/style.css"> 
    <link rel="stylesheet" href="/css/index.css">
</head>
<body>
    <main class="main-content">
        <h1>Página de Detalles del Mundial</h1>
        
        <h2>
            Mostrando información para el Mundial con ID: <?php echo htmlspecialchars($id); ?>
        </h2>

        <p>
            En esta página, mostrarías toda la información relevante de este mundial, 
            como el ganador, los premios, momentos icónicos, etc.
        </p>

        <a href="index.php?controller=home&action=categorias">Volver a Categorías</a>
    </main>
    
</body>
</html>