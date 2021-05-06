<?php

namespace App\Repository;

use App\Entity\CountyMonthData;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CountyMonthData|null find($id, $lockMode = null, $lockVersion = null)
 * @method CountyMonthData|null findOneBy(array $criteria, array $orderBy = null)
 * @method CountyMonthData[]    findAll()
 * @method CountyMonthData[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CountyMonthDataRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CountyMonthData::class);
    }

    // /**
    //  * @return CountyMonthData[] Returns an array of CountyMonthData objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CountyMonthData
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
