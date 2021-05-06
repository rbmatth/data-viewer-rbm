<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\CountyMonthData;

class DownloadController extends AbstractController {
    private $appToken = "I5W8xNVF2574XW2tK1D03YOte";
    private $endpoint = "http://data.cdc.gov/resource/n8mc-b4w4.json";
    private $pageSize = 10000;
    private $caseMonth;
    private $keyColumn = 'res_county';
    private $selectColumns = ['case_month', 'res_county', 'age_group', 'sex', 'race'];
    private $statsColumns = ['age_group', 'sex', 'race'];
    private $allStats;

    function download($caseMonth) {
        echo "Downloading case_month: $caseMonth\n";
        $this->caseMonth = $caseMonth;
        $currentPage = 0;
        $totalResults = 0;
        $resultsCount = 0;
        $selectParam = '$select=' . implode(',', $this->selectColumns);
        $filtersParam = '$where=' . urlencode("res_state='NC' AND case_month='$caseMonth'");
        $limitParam = '$limit=' . $this->pageSize;
        $this->allStats = new \stdClass();

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Accept: application/json",
            "X-App-Token: $this->appToken"
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

        do {
            $offset = $currentPage * $this->pageSize;
            echo "Starting at offset $offset. ";
            $offsetParam = '$offset=' . ($offset);
            $urlParams = implode('&', [$selectParam, $filtersParam, $limitParam, $offsetParam]);
            curl_setopt($ch, CURLOPT_URL, $this->endpoint . "?" . $urlParams);
            $json = curl_exec($ch);
            $results = json_decode($json);
            $resultsCount = count($results);
            $totalResults += $resultsCount;
            $this->aggregateResults($results);
            $currentPage += 1;
            echo "Fetched $resultsCount results.\n";
        } while($resultsCount == $this->pageSize);

        curl_close($ch);
        $this->persistResults();
        echo "$totalResults stored in database.\n";
    }

    function aggregateResults($results) {
        foreach ($results as $case) {
            $countyName = $case->{$this->keyColumn};

            if (!property_exists($this->allStats, $countyName)) {
                $this->allStats->$countyName = new \stdClass();
                $this->allStats->$countyName->stats = new \stdClass();
                $this->allStats->$countyName->total_cases = 1;
            } else {
                $this->allStats->$countyName->total_cases += 1;
            }
            //echo "$countyName : {$this->allStats->$countyName->total_cases}\n";

            foreach ($this->statsColumns as $column) {
                $value = $case->$column;

                if (!property_exists($this->allStats->$countyName->stats, $column)) {
                    $this->allStats->$countyName->stats->$column = new \stdClass();
                }

                if (!property_exists($this->allStats->$countyName->stats->$column, $value)) {
                    $this->allStats->$countyName->stats->$column->$value = 1;
                } else {
                    $this->allStats->$countyName->stats->$column->$value += 1;
                }
            }
        }
    }

    function persistResults() {
        $entityManager = $this->getDoctrine()->getManager();
        $repository = $this->getDoctrine()->getRepository(CountyMonthData::class);

        foreach ($this->allStats as $countyName => $county) {
            $countyMonthData = $repository->findOneBy([
                'case_month' => $this->caseMonth,
                'res_county' => $countyName
            ]);
            if (is_null($countyMonthData)) {
                $countyMonthData = new CountyMonthData();
            }
            //var_dump($countyMonthData); exit;
            //echo "$countyName : {$this->allStats->$countyName->total_cases}\n";
            $countyMonthData->setCaseMonth($this->caseMonth);
            $countyMonthData->setResCounty($countyName);
            $countyMonthData->setTotalCases($county->total_cases);
            $countyMonthData->setStats(json_encode($county->stats));
            $entityManager->persist($countyMonthData);
        }

        $entityManager->flush();
    }
}