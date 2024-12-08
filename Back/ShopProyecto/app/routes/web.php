<?php

use App\Controllers\CarritoController;
use App\Middlewares\AuthMiddleware;

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . "/../controllers/UsuarioController.php";
require_once __DIR__ . "/../controllers/CategoriaController.php";
require_once __DIR__ . "/../controllers/ProductoController.php";
require_once __DIR__ . "/../controllers/AuthController.php";
require_once __DIR__ . "/../controllers/PedidoController.php";
require_once __DIR__ . "/../controllers/PaymentController.php";
require_once __DIR__ . "/../controllers/ProductoImagenController.php";



header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
$router = new AltoRouter();

/**
 * Auth
 */
$router->map("POST", "/login", function () {
    $controller = new AuthController();
    $controller->login();
});
$router->map("POST", "/register", function () {
    $controller = new AuthController();
    $controller->register();
});

/**
 * Usuarios
 */
$router->map("GET", "/usuarios", function() {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new UsuarioController();
    $controller->listUsuarios();
});

$router->map("GET", "/usuario/[i:id]", function($id) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new UsuarioController();
    $controller->usuarioById($id);
});

$router->map("POST", "/usuarios", function() {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new UsuarioController();
    $controller->createUsuario();
});

$router->map("PUT|PATCH", "/usuario/[i:id]", function($id) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new UsuarioController();
    $controller->updateUsuario($id);
});

$router->map("DELETE", "/usuario/[i:id]", function($id) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole(["vendedor", ]);
    $controller = new UsuarioController();
    $controller->deleteUsuario($id);
});

$router->map("GET", "/totalUsuarios", function() {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new UsuarioController();
    $controller->totalUsuarios();
});  

/**
 * Categorias
 */
$router->map("GET", "/categorias", function() {
    AuthMiddleware::checkAuth();
    $controller = new CategoriaController();
    $controller->listCategorias();
});
$router->map("GET", "/categoria/[i:id]", function($id) {
    AuthMiddleware::checkAuth();
    $controller = new CategoriaController();
    $controller->categoriaById($id);
});
$router->map("POST", "/categorias", function() {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new CategoriaController();
    $controller->createCategoria();
});
$router->map("PUT|PATCH", "/categoria/[i:id]", function($id) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new CategoriaController();
    $controller->updateCategoria($id);
});
$router->map("DELETE", "/categoria/[i:id]", function($id) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new CategoriaController();
    $controller->deleteCategoria($id);
});
$router->map("GET", "/totalCategorias", function() {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new CategoriaController();
    $controller->totalCategorias();
});


/**
 * Productos
 */
$router->map("GET", "/productos",function() {
    AuthMiddleware::checkAuth(); 
    $controller = new ProductoController();
    $controller->listProductos(); 
});      
$router->map("GET", "/productos/vendedor", function () {
    AuthMiddleware::checkAuth(); 
    $controller = new ProductoController();
    $controller->productosByVendedor();
});
$router->map("GET", "/productos/categoria/[i:categoriaId]", function($categoriaId) {
    AuthMiddleware::checkAuth(); 
    $controller = new ProductoController();
    $controller->productosByCategoria($categoriaId);
});
$router->map("GET", "/productos/search/[a:query]", function($query) {
    AuthMiddleware::checkAuth(); 
    $controller = new ProductoController();
    $controller->searchProductos($query);
});
$router->map("GET", "/producto/[i:id]", function($id) {
    AuthMiddleware::checkAuth();
    $controller = new ProductoController();
    $controller->productoById($id);
});
$router->map("POST", "/productos", function() {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole(["vendedor", "administrador"]);
    $controller = new ProductoController();
    $controller->createProducto();
});
$router->map("PUT|PATCH", "/producto/[i:id]", function($id) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole(["vendedor", "administrador"]);
    $controller = new ProductoController();
    $controller->updateProducto($id);
});
$router->map("DELETE", "/producto/[i:id]", function($id) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole(["vendedor", "administrador"]);
    $controller = new ProductoController();
    $controller->deleteProducto($id);
});
$router->map("GET", "/totalProductos", function() {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new ProductoController();
    $controller->totalProductos();
});

/**
 * Carritos
 */
$router->map("GET", "/carrito/[i:userId]", function($userId) {
    AuthMiddleware::checkAuth();
    $controller = new CarritoController();
    $controller->getCart($userId);
});
$router->map("POST", "/carrito/add", function() {
    AuthMiddleware::checkAuth();
    $data = json_decode(file_get_contents("php://input"), true);
    $controller = new CarritoController();
    $controller->addProductToCart($data["userId"], $data["productoId"], $data["cantidad"]);
});
$router->map("DELETE", "/carrito/remove/[i:userId]/[i:productoId]", function($userId, $productoId) {
    AuthMiddleware::checkAuth();
    $controller = new CarritoController();
    $controller->removeProductFromCart($userId, $productoId);
});
$router->map("DELETE", "/carrito/clear/[i:userId]", function($userId) {
    AuthMiddleware::checkAuth();
    $controller = new CarritoController();
    $controller->clearCart($userId);
});
$router->map("POST", "/carrito/create/[i:userId]", function($userId) {
    AuthMiddleware::checkAuth();
    $controller = new CarritoController();
    $controller->createCart($userId);
});
$router->map("GET", "/carrito/count/[i:userId]", function($userId) {
    AuthMiddleware::checkAuth();
    $controller = new CarritoController();
    $controller->obtenerCantidadProductosCarrito($userId);
});
$router->map("PUT", "/carrito/update/[i:userId]/[i:productoId]", function($userId, $productoId) {
    AuthMiddleware::checkAuth();
    $controller = new CarritoController();
    $controller->updateProductQuantity($userId, $productoId);
});


/**
 * Payment
 */
$router->map("POST", "/createPaymentIntent", function () {
    AuthMiddleware::checkAuth();
    $controller = new PaymentController();
    $controller->createPaymentIntent();
});

/**
 * Pedidos
 */
$router->map("POST", "/createOrder", function () {
    AuthMiddleware::checkAuth();
    $controller = new PedidoController();
    $data = json_decode(file_get_contents("php://input"), true);
    $controller->createOrder($data["usuario_id"]);
});
$router->map("GET", "/pedidos", function () {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new PedidoController();
    $controller->getPedidos();
});
$router->map("GET", "/pedido/[i:id]", function ($id) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new PedidoController();
    $controller->getPedidoById($id);
});
$router->map("PUT", "/pedido/[i:id]", function ($id) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new PedidoController();
    $controller->updatePedido($id);
});
$router->map("DELETE", "/pedido/[i:id]", function ($id) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new PedidoController();
    $controller->deletePedido($id);
});
$router->map("GET", "/totalPedidos", function () {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new PedidoController();
    $controller->totalPedidos();
});
$router->map("GET", "/totalPedidosPendientes", function () {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole("administrador");
    $controller = new PedidoController();
    $controller->totalPedidosPendientes();
});


/**
 * Imagenes
 */
$router->map("POST", "/producto/[i:productoId]/imagenes", function ($productoId) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole(["vendedor", "administrador"]);
    $controller = new ProductoImagenController();
    $controller->uploadImages($productoId);
});
$router->map("GET", "/producto/[i:productoId]/imagenes", function ($productoId) {
    AuthMiddleware::checkAuth();
    $controller = new ProductoImagenController();
    $controller->listImages($productoId);
});
$router->map("DELETE", "/producto/imagenes/[i:imagenId]", function ($imagenId) {
    AuthMiddleware::checkAuth();
    AuthMiddleware::checkRole(["vendedor", "administrador"]);
    $controller = new ProductoImagenController();
    $controller->deleteImage($imagenId);
});



$match = $router->match();

if ($match) {
    if (is_callable($match["target"])) {
        call_user_func_array($match["target"], $match["params"]);
    } else {
        list($controller, $method) = explode("#", $match["target"]);

        if (is_callable([new $controller, $method])) {
            call_user_func_array([new $controller, $method], $match["params"]);
        } else {
            header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found");
            echo json_encode(["message" => "Método no encontrado"]);
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    header("HTTP/1.1 200 OK");
    exit();
}

?>
