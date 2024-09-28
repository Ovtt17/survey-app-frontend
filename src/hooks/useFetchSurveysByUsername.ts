import { startTransition, useEffect, useState } from "react";
import { Survey } from "../types/survey";
import { getSurveysByUsername } from "../services/surveyService";

const useFetchSurveysByUsername = (username: string) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [openErrorTemplate, setOpenErrorTemplate] = useState(false);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const fetchedSurvey = await getSurveysByUsername(username);
        setSurveys(fetchedSurvey);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        startTransition(() => {
          setErrorMessage(errorMessage);
          setOpenErrorTemplate(true);
        });
      }
    };

    fetchSurveys();
  }, []);

  return { surveys, errorMessage, openErrorTemplate, setSurveys, setOpenErrorTemplate };
};

export default useFetchSurveysByUsername;