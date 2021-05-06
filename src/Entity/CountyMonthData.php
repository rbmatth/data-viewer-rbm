<?php

namespace App\Entity;

use App\Repository\CountyMonthDataRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=CountyMonthDataRepository::class)
 */
class CountyMonthData
{
    /**
     * @ORM\Id
     * @ORM\Column(type="string", length=7)
     */
    private $case_month;

    /**
     * @ORM\Id
     * @ORM\Column(type="string", length=255)
     */
    private $res_county;

    /**
     * @ORM\Column(type="integer")
     */
    private $total_cases;

    /**
     * @ORM\Column(type="text")
     */
    private $stats;

    public function getCaseMonth(): ?string
    {
        return $this->case_month;
    }

    public function setCaseMonth(string $case_month): self
    {
        $this->case_month = $case_month;

        return $this;
    }

    public function getResCounty(): ?string
    {
        return $this->res_county;
    }

    public function setResCounty(string $res_county): self
    {
        $this->res_county = $res_county;

        return $this;
    }

    public function getTotalCases(): ?int
    {
        return $this->total_cases;
    }

    public function setTotalCases(int $total_cases): self
    {
        $this->total_cases = $total_cases;

        return $this;
    }

    public function getStats(): ?string
    {
        return $this->stats;
    }

    public function setStats(string $stats): self
    {
        $this->stats = $stats;

        return $this;
    }
}
