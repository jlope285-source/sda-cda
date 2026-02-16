
import { EducationalCycle, CDACompetence, CDACriteria, CDASaber } from './types';

export const COMPETENCES: CDACompetence[] = [
  { id: 'C1', title: 'Alfabetització informacional', description: 'CD1. Fer cerques i tractament digital de la informació amb una actitud crítica.' },
  { id: 'C2', title: 'Creació de continguts', description: 'CD2. Crear, integrar i reelaborar continguts digitals en diferents formats respectant la propietat intel·lectual.' },
  { id: 'C3', title: 'Participació i col·laboració en línia', description: 'CD3. Participar en activitats o projectes escolars mitjançant eines o plataformes virtuals.' },
  { id: 'C4', title: 'Seguretat', description: 'CD4. Conèixer els riscos i adoptar mesures preventives per protegir dispositius, dades i salut.' },
  { id: 'C5', title: 'Desenvolupament de solucions digitals', description: 'CD5. Iniciar-se o desenvolupar solucions digitals senzilles i sostenibles per resoldre problemes.' }
];

export const CDA_DATA: Record<EducationalCycle, { criteria: CDACriteria[], sabers: CDASaber[] }> = {
  [EducationalCycle.INICIAL]: {
    criteria: [
      { id: '1.1', competenceId: 'C1', description: '1.1. Trobar, de manera guiada, dades, informació i continguts a través d’una cerca en entorns digitals.' },
      { id: '2.1', competenceId: 'C2', description: '2.1. Crear i editar documents i presentacions pròpies utilitzant eines de format en activitats dirigides.' },
      { id: '2.2', competenceId: 'C2', description: '2.2. Crear vídeos, imatges i àudios (sense edició) i programes informàtics senzills.' },
      { id: '3.1', competenceId: 'C3', description: '3.1. Reconèixer diferents maneres de comunicació digital en situacions quotidianes.' },
      { id: '3.2', competenceId: 'C3', description: '3.2. Reconèixer diferents maneres de col·laboració digital en situacions quotidianes.' },
      { id: '4.1', competenceId: 'C4', description: '4.1. Adoptar mesures de seguretat dels comptes i dispositius generant contrasenyes simples.' },
      { id: '4.4', competenceId: 'C4', description: '4.4. Prendre consciència de la necessitat de mantenir una postura saludable.' },
      { id: '4.6', competenceId: 'C4', description: '4.6. Aplicar, de manera guiada, accions per preservar la sostenibilitat (apagar dispositius).' },
      { id: '5.1', competenceId: 'C5', description: '5.1. Programar, amb l’orientació del docent, seqüències simples amb dispositius digitals per resoldre un repte.' }
    ],
    sabers: [
      { id: 'S1.1', competenceId: 'C1', category: 'Navegadors i motors de cerca', description: 'Identificació de les icones i botons dels navegadors. Cerca a partir d\'una paraula.' },
      { id: 'S1.2', competenceId: 'C1', category: 'Criteris de validesa', description: 'Introducció del concepte de font fiable.' },
      { id: 'S2.1', competenceId: 'C2', category: 'Creació de documents', description: 'Ús del teclat i eines bàsiques de format (negreta, colors, alineació).' },
      { id: 'S2.2', competenceId: 'C2', category: 'Creació multimèdia', description: 'Identificació de dispositius per crear vídeos, fotos i àudios.' },
      { id: 'S3.1', competenceId: 'C3', category: 'Comunicació digital', description: 'Identificació de formes de comunicació (correu, videotrucades, blogs).' },
      { id: 'S3.2', competenceId: 'C3', category: 'Entorns virtuals', description: 'Funcions bàsiques dels EVA (accés, consulta i entrega de tasques).' },
      { id: 'S4.1', competenceId: 'C4', category: 'Protecció de dispositius', description: 'Mesures de protecció (contrasenya, PIN) i tancament de sessió.' },
      { id: 'S4.2', competenceId: 'C4', category: 'Benestar', description: 'Postures ergonòmiques saludables i distància al dispositiu.' },
      { id: 'S5.1', competenceId: 'C5', category: 'Pensament computacional', description: 'Estructures bàsiques (instruccions seqüencials, bucles i condicionals).' },
      { id: 'S5.2', competenceId: 'C5', category: 'Robòtica educativa', description: 'Ús de robots compactes amb polsadors per descoberta.' }
    ]
  },
  [EducationalCycle.MITJA]: {
    criteria: [
      { id: '1.1', competenceId: 'C1', description: '1.1. Utilitzar, de manera guiada, cercadors genèrics fent ús d’opcions i d’estratègies senzilles.' },
      { id: '1.2', competenceId: 'C1', description: '1.2. Identificar, de manera guiada, criteris de validesa (font, autoria, data) per verificar la informació.' },
      { id: '1.3', competenceId: 'C1', description: '1.3. Utilitzar, de manera guiada, recursos digitals organitzant i emmagatzemant la informació.' },
      { id: '2.1', competenceId: 'C2', description: '2.1. Crear i editar documents i presentacions pròpies incorporant taules en activitats en context real.' },
      { id: '2.2', competenceId: 'C2', description: '2.2. Crear i editar, amb guia, vídeos, imatges, àudios i programes informàtics senzills.' },
      { id: '2.3', competenceId: 'C2', description: '2.3. Indicar la font dels textos i les imatges utilitzades.' },
      { id: '3.1', competenceId: 'C3', description: '3.1. Comunicar-se a través del correu electrònic amb companys i docents usant funcions bàsiques.' },
      { id: '3.2', competenceId: 'C3', description: '3.2. Utilitzar les funcions de col·laboració de les aplicacions en les produccions digitals.' },
      { id: '4.1', competenceId: 'C4', description: '4.1. Adoptar mesures de seguretat (contrasenyes segures i privades) i tancament de sessions.' },
      { id: '4.4', competenceId: 'C4', description: '4.4. Evitar els riscos físics mantenint una postura saludable a partir de criteris ergonòmics.' },
      { id: '5.1', competenceId: 'C5', description: '5.1. Programar, amb orientació, seqüències simples amb programació per blocs per resoldre un repte.' },
      { id: '5.2', competenceId: 'C5', description: '5.2. Identificar els elements que formen els robots i plaques (sensors i actuadors).' }
    ],
    sabers: [
      { id: 'S1.1', competenceId: 'C1', category: 'Navegadors i motors de cerca', description: 'Estratègies senzilles (paraules clau), ús de menús (imatges, vídeos) i hipervincles.' },
      { id: 'S1.2', competenceId: 'C1', category: 'Criteris de validesa', description: 'Identificació de validesa i fiabilitat (autoria, font, data).' },
      { id: 'S2.1', competenceId: 'C2', category: 'Creació de documents', description: 'Inserció de multimèdia i taules. Ús d\'hipervincles. Organització d\'arxius en carpetes.' },
      { id: 'S2.2', competenceId: 'C2', category: 'Creació multimèdia', description: 'Edició bàsica de vídeo (retallar, inserir àudio) i d\'imatge (redimensionar, girar).' },
      { id: 'S3.1', competenceId: 'C3', category: 'Comunicació digital', description: 'Elements bàsics del correu i adjunció d\'arxius des del núvol i local.' },
      { id: 'S3.2', competenceId: 'C3', category: 'Producció col·laborativa', description: 'Funcions de col·laboració (comentaris, edició compartida) en textos i presentacions.' },
      { id: 'S4.1', competenceId: 'C4', category: 'Protecció de dispositius', description: 'Creació de contrasenyes alfanumèriques segures.' },
      { id: 'S4.2', competenceId: 'C4', category: 'Sostenibilitat', description: 'Estalvi energètic i optimització de l\'espai al núvol.' },
      { id: 'S5.1', competenceId: 'C5', category: 'Pensament computacional', description: 'Descomposició de reptes, reconeixement de patrons i ús d\'esdeveniments.' },
      { id: 'S5.2', competenceId: 'C5', category: 'Robòtica educativa', description: 'Identificació de sensors i actuadors en robots educatius.' }
    ]
  },
  [EducationalCycle.SUPERIOR]: {
    criteria: [
      { id: '1.1', competenceId: 'C1', description: '1.1. Utilitzar de forma autònoma cercadors genèrics fent ús d’opcions i d’estratègies senzilles.' },
      { id: '1.2', competenceId: 'C1', description: '1.2. Verificar, de manera guiada, la validesa i la fiabilitat de la informació en relació amb el repte.' },
      { id: '1.3', competenceId: 'C1', description: '1.3. Organitzar i emmagatzemar, de manera guiada, la informació trobada amb una actitud crítica.' },
      { id: '2.1', competenceId: 'C2', description: '2.1. Seleccionar el format (text, taula, imatge, vídeo, esquemes) més adient per a les produccions.' },
      { id: '2.2', competenceId: 'C2', description: '2.2. Crear i editar produccions digitals senzilles de manera autònoma en activitats de l’escola.' },
      { id: '2.3', competenceId: 'C2', description: '2.3. Citar l’autoria en l’elaboració de produccions, pròpia o d\'altres persones.' },
      { id: '3.2', competenceId: 'C3', description: '3.2. Realitzar productes digitals de manera col·laborativa per a creacions i organització de grup.' },
      { id: '3.3', competenceId: 'C3', description: '3.3. Fer servir els entorns virtuals per interactuar amb companys i docents a través de fòrums.' },
      { id: '4.1', competenceId: 'C4', description: '4.1. Adoptar mesures de seguretat (actualització de programari, no cedir dades sensibles).' },
      { id: '4.5', competenceId: 'C4', description: '4.5. Evitar els riscos emocionals prevenint conductes addictives i d’assetjament.' },
      { id: '5.1', competenceId: 'C5', description: '5.1. Desenvolupar algorismes senzills amb programació per blocs per resoldre problemes.' },
      { id: '5.2', competenceId: 'C5', description: '5.2. Dissenyar i implementar construccions i estructures senzilles a través de la robòtica.' }
    ],
    sabers: [
      { id: 'S1.1', competenceId: 'C1', category: 'Navegadors i motors de cerca', description: 'Estratègies per dates, lloc o idioma. Ús de bancs d\'imatges i sons amb llicència lliure.' },
      { id: 'S1.2', competenceId: 'C1', category: 'Emmagatzematge', description: 'Organització de la informació (marcadors, historial) pel propi alumnat.' },
      { id: 'S2.1', competenceId: 'C2', category: 'Creació de documents', description: 'Dreceres de teclat (Ctrl+C/V/X). Ús d\'animacions, transicions i eines de correcció.' },
      { id: 'S2.2', competenceId: 'C2', category: 'Creació multimèdia', description: 'Importació de fitxers i ús d\'aplicacions per a la creació de mapes conceptuals.' },
      { id: 'S3.1', competenceId: 'C3', category: 'Comunicació digital', description: 'Funcions avançades de correu (còpia oculta, signatura automàtica, etiquetes).' },
      { id: 'S3.2', competenceId: 'C3', category: 'Producció col·laborativa', description: 'Seguiment de l\'historial de canvis i assignació de permisos d\'edició/visualització.' },
      { id: 'S4.1', competenceId: 'C4', category: 'Protecció de dispositius', description: 'Contrasenyes amb símbols i ús de gestors de contrasenyes.' },
      { id: 'S4.2', competenceId: 'C4', category: 'Benestar emocional', description: 'Detecció de signes d\'alerta en conductes addictives i prevenció del ciberassetjament.' },
      { id: 'S5.1', competenceId: 'C5', category: 'Pensament computacional', description: 'Diagrames de flux, modificació de valors a variables i ús de procediments/funcions.' },
      { id: 'S5.2', competenceId: 'C5', category: 'Robòtica educativa', description: 'Ús de sensors i actuadors integrats en plaques programables educatives.' }
    ]
  },
  [EducationalCycle.ESO_1]: {
    criteria: [
      { id: '1.1', competenceId: 'C1', description: '1.1. Utilitzar cercadors genèrics fent ús d’opcions i d’estratègies avançades a Internet.' },
      { id: '1.2', competenceId: 'C1', description: '1.2. Verificar, de manera autònoma, la validesa, la qualitat, l’actualitat i la fiabilitat de la informació.' },
      { id: '2.1', competenceId: 'C2', description: '2.1. Seleccionar i configurar l’eina i el format més adequat en la creació de continguts digitals.' },
      { id: '2.2', competenceId: 'C2', description: '2.2. Crear i editar produccions digitals avançades de manera guiada en tasques de l\'escola.' },
      { id: '3.1', competenceId: 'C3', description: '3.1. Seleccionar la plataforma de comunicació més adequada en funció de les necessitats.' },
      { id: '3.2', competenceId: 'C3', description: '3.2. Realitzar productes digitals de manera col·laborativa seleccionant les eines més adequades.' },
      { id: '4.1', competenceId: 'C4', description: '4.1. Adoptar mesures de seguretat avançades (detectar enllaços maliciosos, evitar descàrregues).' },
      { id: '4.3', competenceId: 'C4', description: '4.3. Fer un ús responsable de la identitat digital, respectant la dels altres.' },
      { id: '5.1', competenceId: 'C5', description: '5.1. Programar, amb orientació, aplicacions senzilles per a diferents dispositius emprant elements apropiats.' }
    ],
    sabers: [
      { id: 'S1.1', competenceId: 'C1', category: 'Navegadors i motors de cerca', description: 'Operadors lògics (cometes, -and, not, or). Ús de xatbots i navegació en mode incògnit.' },
      { id: 'S1.2', competenceId: 'C1', category: 'Criteris de validesa', description: 'Citació de fonts (referències bibliogràfiques) i coneixement de la desinformació (fake news).' },
      { id: 'S2.1', competenceId: 'C2', category: 'Creació de documents', description: 'Fórmules en fulls de càlcul (sumar, mitjana) i generació de gràfics (barres, sectors).' },
      { id: 'S2.2', competenceId: 'C2', category: 'Creació multimèdia', description: 'Edició avançada de vídeo (velocitat, croma, filtres) i d\'imatge (ajustos de saturació, contrast).' },
      { id: 'S3.1', competenceId: 'C3', category: 'Comunicació digital', description: 'Criteris d\'adequació de canals (fòrums vs xats) i ús de grups de correu.' },
      { id: 'S3.2', competenceId: 'C3', category: 'Entorns virtuals', description: 'Publicació en xarxes restringides i gestió de la propietat intel·lectual de la producció.' },
      { id: 'S4.1', competenceId: 'C4', category: 'Protecció de dispositius', description: 'Autenticació de dos factors. Realització de còpies de seguretat i actualització del SO.' },
      { id: 'S4.2', competenceId: 'C4', category: 'Benestar', description: 'Identificació de ciberdelictes (ciberbullying, smishing, sèxting).' },
      { id: 'S5.1', competenceId: 'C5', category: 'Pensament computacional', description: 'Llenguatges de programació textuals. Disseny d\'interfícies responsives.' },
      { id: 'S5.2', competenceId: 'C5', category: 'Robòtica educativa', description: 'Ús de plaques d\'extensió i connectivitat wifi en projectes robòtics.' }
    ]
  },
  [EducationalCycle.ESO_2]: {
    criteria: [
      { id: '1.1', competenceId: 'C1', description: '1.1. Utilitzar cercadors genèrics i específics fent ús d’opcions avançades i estratègies eficients.' },
      { id: '1.2', competenceId: 'C1', description: '1.2. Seleccionar, de manera autònoma, la informació trobada amb actitud crítica.' },
      { id: '2.1', competenceId: 'C2', description: '2.1. Seleccionar i configurar l’eina i el format de manera autònoma en la creació de continguts.' },
      { id: '3.1', competenceId: 'C3', description: '3.1. Aplicar diferents normes de comportament cívic i coneixements tècnics en la interacció.' },
      { id: '4.1', competenceId: 'C4', description: '4.1. Garantir la seguretat dels comptes i dels dispositius a partir d’accions avançades.' },
      { id: '4.6', competenceId: 'C4', description: '4.6. Fer un ús eficient i sostenible dels dispositius promovent la reutilització i el reciclatge.' },
      { id: '5.1', competenceId: 'C5', description: '5.1. Programar aplicacions senzilles per a diferents dispositius (mòbils i altres) de manera autònoma.' },
      { id: '5.2', competenceId: 'C5', description: '5.2. Dissenyar i implementar construccions i estructures complexes amb solucions creatives.' }
    ],
    sabers: [
      { id: 'S1.1', competenceId: 'C1', category: 'Validesa de la informació', description: 'Fact-checking i coneixement del desordre informatiu. Ús de webs de verificació.' },
      { id: 'S1.2', competenceId: 'C1', category: 'Emmagatzematge', description: 'Eines per organitzar i categoritzar enllaços web de manera avançada.' },
      { id: 'S2.1', competenceId: 'C2', category: 'Creació de documents', description: 'Conversió entre formats (PDF, docx, odt). Columnes, interlineat i taules de contingut.' },
      { id: 'S2.2', competenceId: 'C2', category: 'Creació multimèdia', description: 'Inserció de càirons i subtítols. Canvi de resolució i selecció automàtica d\'objectes.' },
      { id: 'S3.1', competenceId: 'C3', category: 'Entorns virtuals', description: 'Gestió de l\'empremta digital, la personalitat i el benestar digital a la xarxa.' },
      { id: 'S4.1', competenceId: 'C4', category: 'Protecció de dades', description: 'Drets ARCO (accés, rectificació, supressió, oposició) i polítiques de privacitat.' },
      { id: 'S4.2', competenceId: 'C4', category: 'Sostenibilitat', description: 'Valoració de l\'obsolescència programada i criteris de desenvolupament social.' },
      { id: 'S5.1', competenceId: 'C5', category: 'Programació', description: 'Eines de programació textual i disseny d\'apps funcionals.' },
      { id: 'S5.2', competenceId: 'C5', category: 'Robòtica educativa', description: 'Implementació de solucions robòtiques creatives i complexes per a problemes reals.' }
    ]
  }
};
