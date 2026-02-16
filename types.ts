
export enum EducationalCycle {
  INICIAL = 'Cicle Inicial',
  MITJA = 'Cicle Mittjà',
  SUPERIOR = 'Cicle Superior',
  ESO_1 = '1r Cicle ESO (1r, 2n i 3r)',
  ESO_2 = '2n Cicle ESO (4t)'
}

export type ClassGroup = 'A' | 'B' | 'C';

export interface StudentEvaluation {
  id: string;
  name: string;
  scores: Record<string, string>; // Record<criteriaId, scoreLevel>
}

export interface CDASaber {
  id: string;
  competenceId: string; // "C1", "C2", etc.
  category: string;
  description: string;
}

export interface CDACriteria {
  id: string;
  competenceId: string; // "C1", "C2", etc.
  description: string;
}

export interface CDACompetence {
  id: string;
  title: string;
  description: string;
}

export interface SelectionState {
  title: string;
  cycle: EducationalCycle;
  sessions: number;
  sessionDuration: number;
  birthYear: number;
  classGroup: ClassGroup;
  robot?: string;
  selectedCompetenceIds: string[];
  selectedCriteriaIds: string[];
  selectedSaberIds: string[];
}

export interface ProgramacioDetallada {
  pistesAlumne: string;
  solucioDocent: string;
  blocsPrincipals: { categoria: string; nom: string }[];
}

export interface ActivitatDetallada {
  sessio: number;
  titol: string;
  descripcio: string;
  pasAPas: string[];
  eines: string[];
  producte: string;
  programacio?: ProgramacioDetallada; // Opcional, només per activitats CD5
}

export interface LearningSituation {
  titol: string;
  curs?: string;
  area?: string;
  descripcioContext: string;
  descripcioRepte: string;
  extensions: string[];
  materialsGlobals: string[];
  competenciesEspecificas?: string[];
  objectius?: {
    capacitat: string;
    saber: string;
    finalitat: string;
  }[];
  criterisAvaluacio: {
    id: string;
    accio: string;
    saber: string;
    context: string;
  }[];
  sabers?: string[];
  desenvolupament?: {
    estrategies: string;
    agrupaments: string;
    materials: string;
  };
  activitats: {
    inicials: ActivitatDetallada[];
    desenvolupament: ActivitatDetallada[];
    sintesi: ActivitatDetallada[];
    transferencia: ActivitatDetallada[];
  };
  vectors?: string[];
}
