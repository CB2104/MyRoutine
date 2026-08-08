import type {
  ExerciseDefinition,
  WorkoutDayDefinition,
  WorkoutDayId,
} from "../types/workout";

const RAW_BASE =
  "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";

type VisualReference = Pick<
  ExerciseDefinition,
  "gifUrl" | "referenceName" | "instructions"
>;

function visual(
  gifPath: string,
  referenceName: string,
  instructions: readonly string[],
): VisualReference {
  return {
    gifUrl: `${RAW_BASE}${gifPath}`,
    referenceName,
    instructions,
  };
}

const visuals = {
  legPress: visual(
    "videos/1463-2Qh2J1e.gif",
    "sled 45° leg press (side pov)",
    [
      "Ajusta el asiento para que las rodillas queden cerca de 90° al apoyar los pies.",
      "Mantén la espalda contra el respaldo y los pies al ancho de los hombros.",
      "Extiende las piernas sin bloquear bruscamente las rodillas.",
      "Baja la plataforma de forma controlada y repite.",
    ],
  ),
  hipThrust: visual("videos/1409-qKBpF7I.gif", "barbell glute bridge", [
    "Apoya la espalda y coloca la carga de forma estable sobre las caderas.",
    "Activa abdomen y glúteos antes de elevar la cadera.",
    "Sube hasta alinear rodillas, caderas y hombros; pausa arriba.",
    "Baja con control y conserva la tensión en los glúteos.",
  ]),
  splitSquat: visual(
    "videos/0410-qx4fgX7.gif",
    "dumbbell single leg split squat",
    [
      "Coloca el pie delantero firme y eleva el pie trasero sobre un banco.",
      "Desciende flexionando rodilla y cadera mientras mantienes el torso estable.",
      "Empuja con el pie delantero para volver a la posición inicial.",
      "Completa las repeticiones y cambia de pierna.",
    ],
  ),
  legExtension: visual(
    "videos/0585-my33uHU.gif",
    "lever leg extension",
    [
      "Ajusta asiento, respaldo y rodillo a tu cuerpo.",
      "Extiende las rodillas levantando el peso sin despegar la espalda.",
      "Pausa arriba y baja lentamente hasta la posición inicial.",
    ],
  ),
  hipAbduction: visual(
    "videos/0597-CHpahtl.gif",
    "lever seated hip abduction",
    [
      "Ajusta el asiento y apoya la espalda de forma estable.",
      "Empuja las piernas hacia afuera activando los abductores.",
      "Pausa al final del recorrido y regresa lentamente.",
    ],
  ),
  calfRaise: visual(
    "videos/1253-C9LuR4A.gif",
    "lever donkey calf raise",
    [
      "Apoya el antepié en la plataforma y deja libres los talones.",
      "Eleva los talones usando las pantorrillas y pausa arriba.",
      "Desciende lentamente hasta sentir un estiramiento cómodo.",
    ],
  ),
  latPulldown: visual(
    "videos/2330-LEprlgG.gif",
    "cable lat pulldown full range of motion",
    [
      "Sujeta la barra algo más abierta que el ancho de los hombros.",
      "Mantén el pecho elevado y lleva la barra hacia la parte superior del pecho.",
      "Junta los omóplatos, pausa y vuelve lentamente al inicio.",
    ],
  ),
  seatedRow: visual("videos/0180-hvV79Si.gif", "cable low seated row", [
    "Siéntate con pies apoyados, rodillas suaves y espalda neutra.",
    "Lleva el agarre hacia el cuerpo mientras juntas los omóplatos.",
    "Pausa en la contracción y extiende los brazos con control.",
  ]),
  inclinePress: visual(
    "videos/0047-3TZduzM.gif",
    "barbell incline bench press",
    [
      "Ajusta el banco inclinado y mantén ambos pies firmes en el suelo.",
      "Baja la barra hacia la parte alta del pecho con los codos controlados.",
      "Pausa brevemente y empuja hasta volver a la posición inicial.",
    ],
  ),
  shoulderPress: visual(
    "videos/0405-znQUdHY.gif",
    "dumbbell seated shoulder press",
    [
      "Siéntate con el torso estable y lleva las mancuernas a los hombros.",
      "Presiona hacia arriba hasta extender los brazos sin perder el control.",
      "Baja lentamente las mancuernas hasta la altura de los hombros.",
    ],
  ),
  lateralRaise: visual(
    "videos/0311-AQ0mC4Y.gif",
    "dumbbell full can lateral raise",
    [
      "Mantén el torso estable, el abdomen activo y los codos ligeramente flexionados.",
      "Eleva los brazos hacia los lados hasta quedar cerca de la línea de los hombros.",
      "Pausa y baja lentamente sin soltar la tensión.",
    ],
  ),
  tricepsPushdown: visual(
    "videos/0241-gAwDzB3.gif",
    "cable triceps pushdown (v-bar)",
    [
      "Sujeta el accesorio con los codos cerca de los costados.",
      "Extiende los antebrazos hasta contraer los tríceps.",
      "Pausa abajo y regresa lentamente sin mover los brazos superiores.",
    ],
  ),
  romanianDeadlift: visual(
    "videos/0085-wQ2c4XD.gif",
    "barbell romanian deadlift",
    [
      "Mantén la espalda neutra y una flexión ligera de rodillas.",
      "Lleva la cadera hacia atrás mientras la barra baja cerca del cuerpo.",
      "Detente al perder tensión útil y extiende la cadera para volver.",
      "Aprieta los glúteos al completar el movimiento.",
    ],
  ),
  legCurl: visual("videos/0582-nnmCTLN.gif", "lever kneeling leg curl", [
    "Ajusta la máquina y estabiliza el torso antes de empezar.",
    "Flexiona la rodilla llevando el apoyo hacia los glúteos.",
    "Pausa en la contracción y vuelve lentamente al inicio.",
  ]),
  reverseLunge: visual("videos/0381-SSsBDwB.gif", "dumbbell rear lunge", [
    "Da un paso hacia atrás y desciende manteniendo el torso estable.",
    "Controla la rodilla delantera y conserva el pie completamente apoyado.",
    "Empuja con el talón delantero para volver y alterna la pierna.",
  ]),
  assistedPullup: visual("videos/0017-kiJ4Z2K.gif", "assisted pull-up", [
    "Ajusta la asistencia y sujeta las agarraderas con los brazos extendidos.",
    "Inicia el movimiento con la espalda y lleva el cuerpo hacia arriba.",
    "Pausa cerca de la parte alta y desciende lentamente.",
  ]),
  oneArmRow: visual(
    "videos/1330-ZIViNh1.gif",
    "dumbbell reverse grip incline bench one arm row",
    [
      "Apoya una mano y una rodilla en el banco; mantén la espalda neutra.",
      "Lleva la mancuerna hacia el torso con el codo cerca del cuerpo.",
      "Pausa arriba, baja con control y completa ambos lados.",
    ],
  ),
  reverseFly: visual(
    "videos/0602-myfUsKf.gif",
    "lever seated reverse fly",
    [
      "Apoya el pecho y sujeta las asas con los brazos ligeramente flexionados.",
      "Lleva los brazos hacia atrás mientras juntas los omóplatos.",
      "Pausa en la contracción y vuelve lentamente.",
    ],
  ),
  bicepsCurl: visual("videos/0294-NbVPDMW.gif", "dumbbell biceps curl", [
    "Mantén los brazos superiores fijos y las palmas hacia delante.",
    "Flexiona los codos hasta contraer por completo los bíceps.",
    "Pausa y baja las mancuernas lentamente.",
  ]),
  tricepsExtension: visual(
    "videos/0149-Gchi5Tr.gif",
    "cable alternate triceps extension",
    [
      "Mantén el brazo superior estable y el codo flexionado.",
      "Extiende el antebrazo hasta contraer por completo el tríceps.",
      "Regresa con control y completa ambos brazos.",
    ],
  ),
  cableHipExtension: visual(
    "videos/0228-Kpajagk.gif",
    "cable standing hip extension",
    [
      "Coloca la tobillera en una polea baja y estabiliza el torso.",
      "Extiende la pierna hacia atrás apretando el glúteo.",
      "Pausa, vuelve con control y completa ambos lados.",
    ],
  ),
  plank: visual("videos/3665-hCjGsRQ.gif", "power point plank", [
    "Colócate en plancha con el cuerpo alineado de cabeza a pies.",
    "Activa el abdomen y los glúteos sin dejar caer la cadera.",
    "Respira con normalidad y mantén la posición el tiempo indicado.",
  ]),
} as const;

type ExerciseInput = Omit<
  ExerciseDefinition,
  "gifUrl" | "referenceName" | "instructions" | "unit"
> & {
  unit?: ExerciseDefinition["unit"];
  media: VisualReference;
};

function exercise({ media, unit = "reps", ...definition }: ExerciseInput) {
  return { ...definition, unit, ...media } satisfies ExerciseDefinition;
}

export const routine = [
  {
    id: "lower-a",
    short: "Lun",
    weekday: "Lunes",
    title: "Lower A",
    focus: "Cuádriceps + glúteos",
    note: "Compuestos: 2–3 min de descanso. Aislamientos: 60–90 s. No sacrifiques rango de movimiento por peso.",
    exercises: [
      exercise({ id: "lower-a-leg-press", name: "Prensa inclinada", target: "Cuádriceps + glúteos", equipment: "Trineo", sets: 3, minReps: 8, maxReps: 12, media: visuals.legPress }),
      exercise({ id: "lower-a-hip-thrust", name: "Hip thrust", target: "Glúteos", equipment: "Barra / Smith", sets: 4, minReps: 8, maxReps: 12, media: visuals.hipThrust }),
      exercise({ id: "lower-a-split-squat", name: "Sentadilla búlgara", target: "Glúteos + cuádriceps", equipment: "Mancuernas", sets: 3, minReps: 8, maxReps: 12, prescriptionNote: "cada pierna", media: visuals.splitSquat }),
      exercise({ id: "lower-a-leg-extension", name: "Extensión de piernas", target: "Cuádriceps", equipment: "Máquina", sets: 3, minReps: 10, maxReps: 15, media: visuals.legExtension }),
      exercise({ id: "lower-a-abduction", name: "Abducción de cadera", target: "Glúteo medio", equipment: "Máquina", sets: 3, minReps: 15, maxReps: 20, media: visuals.hipAbduction }),
      exercise({ id: "lower-a-calves", name: "Elevación de pantorrillas", target: "Pantorrillas", equipment: "Máquina", sets: 3, minReps: 10, maxReps: 15, media: visuals.calfRaise }),
    ],
  },
  {
    id: "upper-a",
    short: "Mar",
    weekday: "Martes",
    title: "Upper A",
    focus: "Espalda + pecho",
    note: "Mantén el pecho estable en remos y jalones. En press, controla la bajada y evita rebotar.",
    exercises: [
      exercise({ id: "upper-a-pulldown", name: "Jalón al pecho", target: "Dorsales", equipment: "Polea", sets: 3, minReps: 8, maxReps: 12, media: visuals.latPulldown }),
      exercise({ id: "upper-a-row", name: "Remo sentado", target: "Espalda media", equipment: "Polea", sets: 3, minReps: 8, maxReps: 12, media: visuals.seatedRow }),
      exercise({ id: "upper-a-incline-press", name: "Press inclinado de pecho", target: "Pectoral superior", equipment: "Barra / mancuernas", sets: 3, minReps: 8, maxReps: 12, media: visuals.inclinePress }),
      exercise({ id: "upper-a-shoulder-press", name: "Press de hombros", target: "Deltoides", equipment: "Mancuernas / máquina", sets: 3, minReps: 8, maxReps: 12, media: visuals.shoulderPress }),
      exercise({ id: "upper-a-lateral-raise", name: "Elevaciones laterales", target: "Deltoide lateral", equipment: "Mancuernas / polea", sets: 3, minReps: 12, maxReps: 20, media: visuals.lateralRaise }),
      exercise({ id: "upper-a-triceps", name: "Tríceps en polea", target: "Tríceps", equipment: "Polea", sets: 3, minReps: 10, maxReps: 15, media: visuals.tricepsPushdown }),
    ],
  },
  {
    id: "lower-b",
    short: "Jue",
    weekday: "Jueves",
    title: "Lower B",
    focus: "Femorales + glúteos",
    note: "En el rumano, cadera hacia atrás y espalda neutra. Detén la bajada cuando pierdas tensión útil en femoral.",
    exercises: [
      exercise({ id: "lower-b-rdl", name: "Peso muerto rumano", target: "Femoral + glúteos", equipment: "Barra / mancuernas", sets: 3, minReps: 8, maxReps: 10, media: visuals.romanianDeadlift }),
      exercise({ id: "lower-b-hip-thrust", name: "Hip thrust", target: "Glúteos", equipment: "Barra / Smith", sets: 3, minReps: 8, maxReps: 12, media: visuals.hipThrust }),
      exercise({ id: "lower-b-leg-curl", name: "Curl femoral", target: "Isquiotibiales", equipment: "Máquina", sets: 3, minReps: 10, maxReps: 15, media: visuals.legCurl }),
      exercise({ id: "lower-b-reverse-lunge", name: "Zancada hacia atrás", target: "Glúteos + cuádriceps", equipment: "Mancuernas / peso corporal", sets: 3, minReps: 8, maxReps: 12, prescriptionNote: "cada pierna", media: visuals.reverseLunge }),
      exercise({ id: "lower-b-abduction", name: "Abducción de cadera", target: "Glúteo medio", equipment: "Máquina", sets: 3, minReps: 15, maxReps: 25, media: visuals.hipAbduction }),
      exercise({ id: "lower-b-calves", name: "Pantorrillas", target: "Pantorrillas", equipment: "Máquina", sets: 3, minReps: 12, maxReps: 20, media: visuals.calfRaise }),
    ],
  },
  {
    id: "upper-b",
    short: "Vie",
    weekday: "Viernes",
    title: "Upper B",
    focus: "Espalda + hombros + brazos",
    note: "El objetivo es calidad de repeticiones, no añadir ejercicios. Mantén 1–2 RIR excepto algún aislamiento final.",
    exercises: [
      exercise({ id: "upper-b-pulldown", name: "Jalón / dominada asistida", target: "Dorsales", equipment: "Máquina / polea", sets: 3, minReps: 8, maxReps: 12, media: visuals.assistedPullup }),
      exercise({ id: "upper-b-one-arm-row", name: "Remo unilateral", target: "Espalda", equipment: "Mancuerna / polea", sets: 3, minReps: 8, maxReps: 12, prescriptionNote: "cada lado", media: visuals.oneArmRow }),
      exercise({ id: "upper-b-lateral-raise", name: "Elevaciones laterales", target: "Deltoide lateral", equipment: "Polea / mancuernas", sets: 4, minReps: 12, maxReps: 20, media: visuals.lateralRaise }),
      exercise({ id: "upper-b-reverse-fly", name: "Reverse fly", target: "Deltoide posterior", equipment: "Máquina / mancuernas", sets: 3, minReps: 12, maxReps: 20, media: visuals.reverseFly }),
      exercise({ id: "upper-b-biceps", name: "Curl de bíceps", target: "Bíceps", equipment: "Mancuernas / polea", sets: 3, minReps: 10, maxReps: 15, media: visuals.bicepsCurl }),
      exercise({ id: "upper-b-triceps", name: "Extensión de tríceps", target: "Tríceps", equipment: "Polea", sets: 3, minReps: 10, maxReps: 15, media: visuals.tricepsExtension }),
    ],
  },
  {
    id: "special",
    short: "Sáb",
    weekday: "Sábado",
    title: "Especialización",
    focus: "Glúteos + deltoides",
    note: "Día deliberadamente menos pesado. Mantén ~2 RIR y evita convertirlo en un tercer lower completo.",
    exercises: [
      exercise({ id: "special-glute-bridge", name: "Glute bridge", target: "Glúteos", equipment: "Barra / peso corporal", sets: 3, minReps: 10, maxReps: 15, media: visuals.hipThrust }),
      exercise({ id: "special-kickback", name: "Patada de glúteo en polea", target: "Glúteos", equipment: "Polea", sets: 3, minReps: 12, maxReps: 20, prescriptionNote: "cada pierna", media: visuals.cableHipExtension }),
      exercise({ id: "special-abduction", name: "Abducción de cadera", target: "Glúteo medio", equipment: "Máquina", sets: 3, minReps: 15, maxReps: 25, media: visuals.hipAbduction }),
      exercise({ id: "special-lateral-raise", name: "Elevaciones laterales", target: "Deltoide lateral", equipment: "Polea / mancuernas", sets: 3, minReps: 15, maxReps: 20, media: visuals.lateralRaise }),
      exercise({ id: "special-reverse-fly", name: "Reverse fly", target: "Deltoide posterior", equipment: "Máquina / mancuernas", sets: 3, minReps: 15, maxReps: 20, media: visuals.reverseFly }),
      exercise({ id: "special-plank", name: "Plancha", target: "Core", equipment: "Peso corporal", sets: 3, minReps: 30, maxReps: 45, unit: "seconds", media: visuals.plank }),
    ],
  },
] as const satisfies readonly WorkoutDayDefinition[];

export const workoutDayIds = routine.map((day) => day.id);

export function findWorkoutDay(dayId: WorkoutDayId) {
  return routine.find((day) => day.id === dayId) ?? routine[0];
}

export function isWorkoutDayId(value: unknown): value is WorkoutDayId {
  return typeof value === "string" && workoutDayIds.some((id) => id === value);
}
