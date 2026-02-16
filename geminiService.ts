
import { GoogleGenAI, Type } from "@google/genai";
import { SelectionState, LearningSituation } from "./types";
import { CDA_DATA, COMPETENCES } from "./constants";

export const generateLearningSituation = async (state: SelectionState): Promise<LearningSituation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const cycleData = CDA_DATA[state.cycle];
  
  const selectedCriteriaTexts = state.selectedCriteriaIds
    .map(id => {
      const c = cycleData.criteria.find(crit => crit.id === id);
      return c ? `[ID: ${c.id}] ${c.description}` : null;
    })
    .filter((val): val is string => val !== null);
  
  const selectedSaberTexts = state.selectedSaberIds
    .map(id => cycleData.sabers.find(s => s.id === id)?.description)
    .filter((val): val is string => !!val);

  const selectedCompTitles = state.selectedCompetenceIds
    .map(cid => COMPETENCES.find(c => c.id === cid)?.title)
    .filter(Boolean);

  const isFloorRobot = state.robot?.toLowerCase().includes('bot') || state.robot?.toLowerCase().includes('tale') || state.robot?.toLowerCase().includes('cubetto');

  const robotInfo = state.robot ? `IMPORTANT: El projecte s'ha de centrar en l'eina ${state.robot}. ${isFloorRobot ? "Robot de terra: seqüenciació amb botons físics o targetes." : "Robòtica amb blocs: detalla els blocs mBlock/Scratch."}` : "";

  const prompt = `
    ACTUA COM UN COORDINADOR PEDAGÒGIC EXPERT (ESTIL MENTORIA 4.0).
    Genera una Situació d'Aprenentatge (SdA) estructurada com un "REPTE" tecnològic real.
    
    DADES DEL GRUP:
    - TÍTOL: ${state.title}
    - CICLE: ${state.cycle} (Promoció: ${state.birthYear})
    - SESSIONS: ${state.sessions} de ${state.sessionDuration} min.
    - COMPETÈNCIES CDA: ${selectedCompTitles.join(", ")}
    ${robotInfo}

    CRITERIS CDA SELECCIONATS:
    ${selectedCriteriaTexts.join("\n")}

    REQUISIT CRUCIAL PER A "PROGRAMACIÓ":
    Si la sessió implica programació (especialment en CD5), has d'omplir l'objecte 'programacio' amb:
    - 'pistesAlumne': Un text curt engrescador que digui a l'alumne quins blocs ha d'explorar.
    - 'solucioDocent': Explicació tècnica detallada dels blocs i la seva configuració (ex: "Quan es premi A, repetir 10 vegades moure 50 passos").
    - 'blocsPrincipals': Una llista amb la categoria del bloc (Esdeveniment, Control, Moviment, Sensors, etc.) i el nom del bloc.

    FORMAT DE SORTIDA: JSON PUR segons l'esquema.
  `;

  const programacioSchema = {
    type: Type.OBJECT,
    properties: {
      pistesAlumne: { type: Type.STRING },
      solucioDocent: { type: Type.STRING },
      blocsPrincipals: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            categoria: { type: Type.STRING, description: "Ex: Esdeveniments, Control, Moviment, Ulls, Sensors" },
            nom: { type: Type.STRING }
          },
          required: ["categoria", "nom"]
        }
      }
    },
    required: ["pistesAlumne", "solucioDocent", "blocsPrincipals"]
  };

  const activitatSchema = {
    type: Type.OBJECT,
    properties: {
      sessio: { type: Type.INTEGER },
      titol: { type: Type.STRING },
      descripcio: { type: Type.STRING },
      pasAPas: { type: Type.ARRAY, items: { type: Type.STRING } },
      eines: { type: Type.ARRAY, items: { type: Type.STRING } },
      producte: { type: Type.STRING },
      programacio: programacioSchema
    },
    required: ["sessio", "titol", "descripcio", "pasAPas", "eines", "producte"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titol: { type: Type.STRING },
            descripcioContext: { type: Type.STRING },
            descripcioRepte: { type: Type.STRING },
            extensions: { type: Type.ARRAY, items: { type: Type.STRING } },
            materialsGlobals: { type: Type.ARRAY, items: { type: Type.STRING } },
            criterisAvaluacio: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  accio: { type: Type.STRING },
                  saber: { type: Type.STRING },
                  context: { type: Type.STRING }
                },
                required: ["id", "accio", "saber", "context"]
              }
            },
            activitats: {
              type: Type.OBJECT,
              properties: {
                inicials: { type: Type.ARRAY, items: activitatSchema },
                desenvolupament: { type: Type.ARRAY, items: activitatSchema },
                sintesi: { type: Type.ARRAY, items: activitatSchema },
                transferencia: { type: Type.ARRAY, items: activitatSchema }
              },
              required: ["inicials", "desenvolupament", "sintesi", "transferencia"]
            }
          },
          required: ["titol", "descripcioContext", "descripcioRepte", "activitats", "criterisAvaluacio", "materialsGlobals"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text content returned from API.");
    return JSON.parse(jsonText.trim());
  } catch (error: any) {
    console.error("Error Gemini:", error);
    throw error;
  }
};

export const generateSessionInfographic = async (
  sessionTitle: string, 
  activityDesc: string, 
  cycle: string, 
  robot: string | undefined
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isFloorRobot = robot?.toLowerCase().includes('bot') || robot?.toLowerCase().includes('tale') || robot?.toLowerCase().includes('cubetto');
  
  const prompt = `Infografia vertical 9:16 d'estil "Repte de Robòtica Escolar".
  Activitat: "${sessionTitle}". 
  Descripció: "${activityDesc}".
  Focus visual: ${isFloorRobot ? `Un robot ${robot} sobre una catifa de quadrícula a terra de l'aula.` : `L'entorn de mBlock o Scratch mostrant blocs colorits per al robot ${robot}.`}
  Estil: Multipanell (3 blocs), línies netes, personatges nens i nenes amb diversitat, icones de programació, fons de paper quadriculat. Pedagògic i modern.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "9:16" } }
    });

    // FIX: Iterate through all parts to find the image part as per guidelines
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error imatge:", error);
    throw error;
  }
};
