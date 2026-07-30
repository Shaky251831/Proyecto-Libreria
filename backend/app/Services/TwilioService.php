<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Twilio\Rest\Client;

class TwilioService
{
    protected ?Client $client = null;

    public function __construct()
    {
        $sid   = config('services.twilio.sid');
        $token = config('services.twilio.auth_token');

        if ($sid && $token) {
            $this->client = new Client($sid, $token);
        }
    }

    public function enviarSms(string $telefonoDestino, string $mensaje): bool
    {
        if (!$this->client) {
            Log::warning('Twilio no está configurado, se omitió el envío de SMS.');
            return false;
        }

        try {
            $this->client->messages->create($telefonoDestino, [
                'from' => config('services.twilio.sms_from'),
                'body' => $mensaje,
            ]);
            return true;
        } catch (\Throwable $e) {
            Log::error('Error al enviar SMS con Twilio: ' . $e->getMessage());
            return false;
        }
    }

    public function enviarWhatsapp(string $telefonoDestino, string $mensaje): bool
    {
        try {
            $instance = config('services.ultramsg.instance');
            $token = config('services.ultramsg.token');

            $response = Http::asForm()->post(
                "https://api.ultramsg.com/{$instance}/messages/chat",
                [
                    'token' => $token,
                    'to'    => $telefonoDestino,
                    'body'  => $mensaje,
                    'priority' => 10,
                ]
            );

            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('Error al enviar WhatsApp con UltraMsg: ' . $e->getMessage());
            return false;
        }
    }
}
