<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificacionService
{
    /**
     * Enviar WhatsApp vía UltraMsg API
     * @param string $numeroLada Número con país (ej: +529511234567)
     * @param string $mensaje
     */
    public function enviarWhatsApp($numeroLada, $mensaje)
    {
        try {
            $instanceId = env('ULTRAMSG_INSTANCE_ID');
            $token = env('ULTRAMSG_TOKEN');

            $response = Http::asForm()->post("https://api.ultramsg.com/{$instanceId}/messages/chat", [
                'token' => $token,
                'to'    => $numeroLada,
                'body'  => $mensaje
            ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error("Error enviando WhatsApp: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Enviar SMS vía Twilio API
     */
    public function enviarSMS($numeroLada, $mensaje)
    {
        try {
            $sid = env('TWILIO_SID');
            $token = env('TWILIO_AUTH_TOKEN');
            $from = env('TWILIO_NUMBER');

            if (!$sid || !$token) return false;

            $response = Http::withBasicAuth($sid, $token)
                ->asForm()
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                    'To'   => $numeroLada,
                    'From' => $from,
                    'Body' => $mensaje,
                ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error("Error enviando SMS: " . $e->getMessage());
            return false;
        }
    }
}