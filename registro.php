<?php
header('Content-Type: application/json');
include 'conexion.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $correo = $_POST['correo'];

    // Verificar si el correo ya existe
    $check_sql = "SELECT * FROM usuarios WHERE correo = ?";
    $check_stmt = $conn->prepare($check_sql);
    if (!$check_stmt) {
        die("Error en la preparación de la consulta de verificación: " . $conn->error);
    }

    $check_stmt->bind_param("s", $correo);
    $check_stmt->execute();
    $check_stmt->store_result();

    if ($check_stmt->num_rows > 0) {
        $response['message'] = "El correo ya está registrado.";
        $response['type'] = "error";
    } else {
        // Preparar la consulta de inserción
        $sql = "INSERT INTO usuarios (nombre, apellido, correo) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            die("Error en la preparación de la consulta de inserción: " . $conn->error);
        }

        $stmt->bind_param("sss", $nombre, $apellido, $correo);

        if ($stmt->execute()) {
            $response['message'] = "Registro exitoso";
            $response['type'] = "success";
        } else {
            $response['message'] = "Error: " . $stmt->error;
            $response['type'] = "error";
        }

        $stmt->close();
    }

    $check_stmt->close();
    $conn->close();
}

echo json_encode($response);
?>
