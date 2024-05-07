<?php

namespace App\Controller;

use App\Repository\MovieRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private SerializerInterface $serializer
    ) {}
    
    #[Route('/movies', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        //Vito Millozza
        $year = $request->query->get('year');
        $sort = $request->query->get('sort');

        $criteria = [];
        if ($year) {
            $criteria['year'] = $year;
        }

        $orderBy = [];
        if ($sort) {
            $sortParts = explode('_', $sort);
            if (count($sortParts) == 2) {
                $orderBy[$sortParts[0]] = $sortParts[1] === 'desc' ? 'DESC' : 'ASC';
            }
        }

        $movies = $this->movieRepository->findBy($criteria, $orderBy);
        $data = $this->serializer->serialize($movies, "json", ["groups" => "default"]);

        return new JsonResponse($data, json: true);
    }
}
