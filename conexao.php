<?php


$host = "localhost";       // Significa que o banco está na mesma máquina
$banco = "house_pet";       // O nome do banco que você criou no SQL
$usuario = "root";          // O usuário padrão do MySQL (ou o que você configurou)
$senha = "sua_senha_aqui";  // Troque pelo texto da senha do seu banco no Ubuntu

try {
    $pdo = new PDO("mysql:host=$host;dbname=$banco;charset=utf8mb4", $usuario, $senha);
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $erro) {
    die("Erro ao conectar ao banco de dados: " . $erro->getMessage());
}
?>