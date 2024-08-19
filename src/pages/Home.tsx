import SurveyCard from "../components/Survey/SurveyCard";
import { Survey } from "../types/survey";

const surveys: Survey[] = [
  {
    id: 1,
    title: "Encuesta de Satisfacción",
    description: "Por favor, completa esta encuesta para ayudarnos a mejorar.",
    rating: 4.5,
    author: "Juan Pérez",
  },
  {
    id: 2,
    title: "Encuesta de Producto",
    description: "Queremos saber tu opinión sobre nuestro nuevo producto.",
    rating: 4.0,
    author: "María García",
  },
  {
    id: 3,
    title: "Encuesta de Servicio",
    description: "Ayúdanos a mejorar nuestro servicio.",
    rating: 4.2,
    author: "Carlos López",
  },
  {
    id: 4,
    title: "Encuesta de Calidad",
    description: "Tu opinión sobre la calidad es importante para nosotros.",
    rating: 4.8,
    author: "Ana Martínez",
  },
  {
    id: 5,
    title: "Encuesta de Experiencia",
    description: "Cuéntanos sobre tu experiencia con nuestro producto.",
    rating: 4.6,
    author: "Luis Rodríguez",
  },
];

const Home = () => {
  const handleAnswerSurvey = () => {
    console.log("Responder Encuesta");
  };

  const handleViewReviews = () => {
    console.log("Ver Reseñas");
  };

  const handleRateSurvey = () => {
    console.log("Valorar");
  };

  return (
    <div className="App flex flex-col items-center">
      <div className="flex flex-wrap justify-start">
        {surveys.map((survey, index) => (
          <div key={index} className="w-full sm:w-1/2 p-2">
            <SurveyCard
              survey={survey}
              onAnswerSurvey={handleAnswerSurvey}
              onViewReviews={handleViewReviews}
              onRateSurvey={handleRateSurvey}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;