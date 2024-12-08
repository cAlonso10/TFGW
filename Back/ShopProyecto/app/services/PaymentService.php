<?php

namespace App\Services;

use Stripe\Stripe;

class PaymentService
{
    public function __construct()
    {
        Stripe::setApiKey("sk_test_51NDVc9G22hZPLa1nJ3nym01zR0eY4cemjl4cIVoTxlvT5uRaLzioNtDCvzPrbLKVvmHvYPrr8C3ySeulvkGhOIW700vIlob3Bk"); 
    }

    public function createPaymentIntent($amount)
    {
        try {
            $paymentIntent = \Stripe\PaymentIntent::create([
                "amount" => $amount, 
                "currency" => "eur",
                "payment_method_types" => ["card"],
            ]);

            return ["clientSecret" => $paymentIntent->client_secret];
        } catch (\Stripe\Exception\ApiErrorException $e) {
            throw new \Exception($e->getMessage());
        }
    }
}
