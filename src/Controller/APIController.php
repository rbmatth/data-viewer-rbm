<?php
// src/Controller/APIController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\CountyMonthData;

/**
 * @Route("/api/")
 */
class APIController extends AbstractController {
    /**
     * @Route("number/")
     */
    public function number(): Response {
        $number = random_int(0, 100);

        return $this->json(['number' => $number]);
    }

    /**
     * @Route("month/{caseMonth}/") TODO: requirements
     * @param int $month 2-digit month
     * @return JsonResponse
     */
    public function month($caseMonth): Response {
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $this->getDoctrine()->getRepository(CountyMonthData::class);

        $data = new \stdClass();

        foreach ($repository->findBy(['case_month' => $caseMonth]) as $county) {
            $countyName = $county->getResCounty();
            $data->{$countyName} = new \stdClass();
            $data->{$countyName}->totalCases = $county->getTotalCases();
            $data->{$countyName}->stats = json_decode($county->getStats());
        }

        return $this->json($data);
    }
}