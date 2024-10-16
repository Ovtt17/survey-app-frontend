import { useState, useEffect, startTransition } from "react";
import {SurveyResponse} from "../types/survey";
import { getSurveys } from "../services/surveyService";

const useFetchSurveys = (page: number, size: number) => {
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [openErrorTemplate, setOpenErrorTemplate] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const response = await getSurveys(page, size);
        setSurveys(response.surveys);
        setCurrentPage(response.page + 1);
        setTotalPages(response.totalPages);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        startTransition(() => {
          setErrorMessage(errorMessage);
          setOpenErrorTemplate(true);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [page]);

  return { surveys, errorMessage, openErrorTemplate, setOpenErrorTemplate, currentPage, totalPages, loading };
};

export default useFetchSurveys;
