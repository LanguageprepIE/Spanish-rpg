(function () {
  "use strict";
  window.SpanishRPG = window.SpanishRPG || {};

  SpanishRPG.DATA = {
    version: 1,
    title: "El misterio de Salamanca",
    characters: [
      { id: "explorer", mark: "A", name: "La exploradora", trait: "Observadora: empiezas con una pista extra." },
      { id: "speaker", mark: "D", name: "El diplomático", trait: "Persuasivo: recibes 2 monedas extra." },
      { id: "detective", mark: "I", name: "La investigadora", trait: "Metódica: empiezas con 5 XP." }
    ],
    intro: [
      "Salamanca, 18:05. Has llegado para pasar una semana de intercambio. La Plaza Mayor está llena de gente, pero tu profesora, Elena Ruiz, no aparece.",
      "Tu móvil vibra. Un mensaje desconocido dice: «Tengo la carpeta azul. Si quieres recuperarla, encuentra a la persona correcta antes de las 18:30». La carpeta contiene los billetes de todo el grupo.",
      "En la fuente te espera Lucía, una estudiante de la universidad. Quizá ella sepa por dónde empezar."
    ],
    locations: {
      plaza: { name: "Plaza Mayor", subtitle: "La fuente y tres desconocidos", unlocked: true },
      cafe: { name: "Café Niebla", subtitle: "Menú, rumores y un recibo", unlocked: false },
      bookshop: { name: "Librería Atlas", subtitle: "Libros usados y otra pista", unlocked: false }
    },
    dialogue: {
      luciaStart: {
        speaker: "Lucía",
        text: "Por fin llegas. He visto a una persona con una carpeta azul, pero había mucha gente. ¿Quieres que te ayude?",
        choices: [
          { text: "Sí. ¿Puedes decirme qué has visto, por favor?", next: "luciaHelpful" },
          { text: "Dame la información ahora.", next: "luciaRude" },
          { text: "No necesito ayuda.", next: "luciaRefuse" }
        ]
      },
      luciaRude: { speaker: "Lucía", text: "Un poco de educación ayuda cuando pides un favor.", feedback: "Busca una petición educada.", choices: [{ text: "Perdona. ¿Puedes ayudarme, por favor?", next: "luciaHelpful" }] },
      luciaRefuse: { speaker: "Lucía", text: "Sin pistas será imposible distinguir a la persona correcta.", feedback: "Puedes cambiar de decisión.", choices: [{ text: "Tienes razón. Necesito tu ayuda.", next: "luciaHelpful" }] },
      luciaHelpful: {
        speaker: "Lucía",
        text: "Llevaba una prenda roja. No era una camiseta. Después entró en el Café Niebla. Pregunta por Sara y enséñale este mensaje.",
        complete: "startQuest",
        choices: [{ text: "Entendido. Voy al café.", close: true }]
      },
      saraStart: {
        speaker: "Sara",
        text: "Sí, recuerdo la carpeta. La persona dejó un recibo, pero necesito atender un pedido. Quiere algo sin carne y una bebida. Tiene un máximo de cinco euros.",
        choices: [
          { text: "Puedo preparar el pedido.", action: "openShop" },
          { text: "¿Qué significa «sin carne»?", next: "saraGloss" },
          { text: "No tengo tiempo para esto.", next: "saraWait" }
        ]
      },
      saraGloss: { speaker: "Sara", text: "Que no lleva jamón, pollo ni otros tipos de carne. Mira bien los ingredientes y el precio.", choices: [{ text: "Vale, preparo el pedido.", action: "openShop" }] },
      saraWait: { speaker: "Sara", text: "Y yo no tengo tiempo para buscar el recibo mientras hay clientes esperando.", feedback: "Ayudar a Sara te permitirá conseguir la pista.", choices: [{ text: "De acuerdo, te ayudo.", action: "openShop" }] },
      saraDone: { speaker: "Sara", text: "Perfecto. Aquí tienes el recibo: 18:20, mesa 7. La persona llevaba gafas redondas. Guarda el recibo; demuestra que estuvo aquí.", choices: [{ text: "Gracias. Seguiré investigando.", close: true }] },
      tomasStart: {
        speaker: "Tomás",
        text: "Buscas a la persona de la carpeta, ¿verdad? Salió del café y vino aquí. Me preguntó cómo llegar a la fuente de la Plaza Mayor.",
        choices: [
          { text: "¿Qué aspecto tenía?", next: "tomasDescription" },
          { text: "¿Dónde está la Plaza Mayor?", next: "tomasDirections" },
          { text: "¿Era un hombre con barba?", next: "tomasNo" }
        ]
      },
      tomasNo: { speaker: "Tomás", text: "No. Era una mujer joven y no llevaba sombrero.", choices: [{ text: "¿Puedes describirla mejor?", next: "tomasDescription" }] },
      tomasDirections: { speaker: "Tomás", text: "La plaza está enfrente de la librería. Para llegar a la fuente, cruza la plaza y gira a la derecha después del quiosco.", choices: [{ text: "¿Y cómo era la persona?", next: "tomasDescription" }] },
      tomasDescription: { speaker: "Tomás", text: "Era una mujer joven. Llevaba abrigo rojo y gafas. No tenía sombrero. Tenía prisa, pero fue amable.", complete: "bookshopClue", choices: [{ text: "Ya puedo identificarla.", close: true }] }
    },
    shop: [
      { id: "a", name: "Bocadillo de jamón + agua", detail: "Lleva carne", price: 4.60, correct: false },
      { id: "b", name: "Tortilla española + agua", detail: "Sin carne", price: 4.80, correct: true },
      { id: "c", name: "Tostada con tomate + zumo", detail: "Sin carne", price: 5.70, correct: false }
    ],
    suspects: [
      { id: "mario", mark: "M", name: "Mario", description: "Abrigo verde · barba · 18:20" },
      { id: "elena", mark: "E", name: "Elena", description: "Abrigo rojo · gafas redondas · 18:20" },
      { id: "dani", mark: "D", name: "Dani", description: "Abrigo rojo · sombrero · 18:10" }
    ],
    glossary: {
      "prenda": "item of clothing", "abrigo": "coat", "gafas": "glasses", "recibo": "receipt",
      "fuente": "fountain", "enfrente": "opposite / in front of", "carne": "meat", "pista": "clue"
    }
  };
})();
