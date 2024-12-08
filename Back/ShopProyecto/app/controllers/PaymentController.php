<?php

use App\Services\PaymentService;

class PaymentController
{
    protected $paymentService;

    public function __construct()
    {

        $this->paymentService = new PaymentService();
    }

    public function createPaymentIntent()
    {
        header("Content-Type: application/json");

        try {
            $json = json_decode(file_get_contents("php://input"), true);

            $response = $this->paymentService->createPaymentIntent($json["amount"]);

            echo json_encode($response);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}
