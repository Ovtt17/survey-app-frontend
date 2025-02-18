import { AppError } from "../types/AppError";
import { Participation } from "../types/participation";
import { SurveyPagedResponse, SurveyResponse, SurveySubmission } from "../types/survey";
import { getToken } from "../utils/auth";
import { AnimationPaths } from "../constants/animationPaths";
import { handleErrorResponse } from "./handleErrorResponse";

const BASE_URL = `${import.meta.env.VITE_API_URL}/surveys`;

export const convertSurveyToFormData = (survey: SurveySubmission): FormData => {
  const formData = new FormData();
  formData.append('surveyRequest', new Blob([JSON.stringify({
    id: survey.id,
    title: survey.title,
    description: survey.description,
    pictureUrl: survey.pictureUrl,
    questions: survey.questions
  })], { type: 'application/json' }));
  if (survey.picture) {
    formData.append('picture', survey.picture);
  }
  return formData;
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

const fetchWithHandling = async (url: string, options: RequestInit, noSurveysMessage?: string) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      await handleErrorResponse(response);
    }
    if (response.status === 204) {
      throw new AppError(
        'Encuestas no encontradas.',
        noSurveysMessage || 'No se encontraron encuestas.',
        AnimationPaths.NoResultFound,
        'Volver al Inicio'.toLowerCase()
      );
    }
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new AppError(
        'Servidor no disponible',
        'No se pudo conectar con el servidor. Por favor, inténtelo de nuevo más tarde.',
        AnimationPaths.ServerUnavailable,
        'Volver al Inicio'.toLowerCase()
      );
    }
    console.error('Error during fetch operation:', error);
    throw error;
  }
};

export const createSurvey = async (survey: SurveySubmission): Promise<string> => {
  const formData = convertSurveyToFormData(survey);
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Hubo un error al guardar la encuesta.');
    }

    const message = await response.text();
    return message;
  } catch (error) {
    console.error('Error during fetch operation:', error);
    throw error;
  }
};

export const updateSurvey = async (survey: SurveySubmission): Promise<string> => {
  const formData = convertSurveyToFormData(survey);
  try {
    const response = await fetch(`${BASE_URL}/${survey.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Hubo un error al modificar la encuesta.');
    }

    const message = await response.text();
    return message;
  } catch (error) {
    console.error('Error during fetch operation:', error);
    throw error;
  }
};

export const deleteSurvey = async (id: number): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Hubo un error al eliminar la encuesta.');
    }

    const message = await response.text();
    return message;
  } catch (error) {
    console.error('Error during fetch operation:', error);
    throw error;
  }
};

export const getSurveys = async (page: number, size: number): Promise<SurveyPagedResponse> => {
  const adjustedPage = page - 1;
  const url = `${BASE_URL}?page=${adjustedPage}&size=${size}`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }
  const noSurveysMessage = 'No hay encuestas. ¡Crea una nueva encuesta para empezar!';
  return await fetchWithHandling(url, options, noSurveysMessage);
};

export const getSurveyByIdForSubmission = async (id: string): Promise<SurveySubmission> => {
  return await fetchWithHandling(`${BASE_URL}/${id}/submission`, {
    method: 'GET',
    headers: getHeaders()
  });
};

export const getSurveyByIdForOwner = async (id: string): Promise<SurveySubmission> => {
  return await fetchWithHandling(`${BASE_URL}/${id}/owner`, {
    method: 'GET',
    headers: getHeaders()
  });
};

export const getSurveyById = async (id: string): Promise<SurveyResponse> => {
  return await fetchWithHandling(`${BASE_URL}/${id}`, {
    method: 'GET',
    headers: getHeaders()
  });
};

export const getSurveysByCurrentUser = async (): Promise<SurveyResponse[]> => {
  return await fetchWithHandling(`${BASE_URL}/user`, {
    method: 'GET',
    headers: getHeaders()
  });
};

export const getSurveysByUsernameWithPaging = async (username: string, page: number, size: number): Promise<SurveyPagedResponse> => {
  const adjustedPage = page - 1;
  const url = `${BASE_URL}/user/${username}/paged?page=${adjustedPage}&size=${size}`;
  const options = {
    method: 'GET',
    headers: getHeaders()
  }
  const noSurveysMessage = `${username} no tiene encuestas.`;
  return await fetchWithHandling(url, options, noSurveysMessage);
};

export const getSurveyParticipants = async (id: string): Promise<Participation[]> => {
  return await fetchWithHandling(`${BASE_URL}/${id}/participants`, {
    method: 'GET',
    headers: getHeaders()
  });
};