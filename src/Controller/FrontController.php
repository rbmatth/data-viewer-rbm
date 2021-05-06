<?php


namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FrontController extends AbstractController
{
    /**
     * @Route("index.html")
     */
    public function index(): Response {
        $templatePath = dirname(__DIR__, 2) . '/templates/index.html';
        return new Response(file_get_contents($templatePath));
    }
}