// Archivo: src/data/frasesMotivacionales.js
// Este archivo contiene 100 frases inspiradoras con su autor y siempre un campo `imagen`.


const frasesMotivacionales = [
  { texto: 'Cada día es una nueva oportunidad para comenzar de nuevo.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'Cree en ti mismo y todo será posible.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'No esperes el momento perfecto, toma el momento y hazlo perfecto.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.', autor: 'Robert Collier', imagen: '/1.jpg' },
  { texto: 'No cuentes los días, haz que los días cuenten.', autor: 'Muhammad Ali', imagen: '/1.jpg' },
  { texto: 'La única forma de hacer un gran trabajo es amar lo que haces.', autor: 'Steve Jobs', imagen: '/1.jpg' },
  { texto: 'Si puedes soñarlo, puedes lograrlo.', autor: 'Walt Disney', imagen: '/1.jpg' },
  { texto: 'El único límite es tu mente.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'La fuerza no viene de la capacidad física, sino de la voluntad indomable.', autor: 'Mahatma Gandhi', imagen: '/1.jpg' },
  { texto: 'No importa cuántas veces caigas, lo importante es cuántas veces te levantas.', autor: 'Vince Lombardi', imagen: '/1.jpg' },
  { texto: 'No dejes que el miedo te detenga; déjalo impulsarte hacia adelante.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'Lo que hoy parece un gran sacrificio será mañana tu gran victoria.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'El éxito es la mejor venganza.', autor: 'Kanye West', imagen: '/1.jpg' },
  { texto: 'Si quieres resultados diferentes, deja de hacer siempre lo mismo.', autor: 'Albert Einstein', imagen: '/1.jpg' },
  { texto: 'Atrévete a ser diferente.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'Convierte los obstáculos en oportunidades.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'Tus únicos límites son los que tú mismo te impones.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'Sé el cambio que quieres ver en el mundo.', autor: 'Mahatma Gandhi', imagen: '/1.jpg' },
  { texto: 'El futuro pertenece a quienes creen en la belleza de sus sueños.', autor: 'Eleanor Roosevelt', imagen: '/1.jpg' },
  { texto: 'El éxito no es casualidad; es trabajo duro, perseverancia y aprender del fracaso.', autor: 'Colin Powell', imagen: '/1.jpg' },
  { texto: 'No sueñes tu vida, vive tu sueño.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'Cada logro comienza con la decisión de intentarlo.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'No te preocupes por fracasar; preocúpate por las oportunidades que pierdes al no intentarlo.', autor: 'Jack Canfield', imagen: '/1.jpg' },
  { texto: 'La motivación te impulsa a comenzar, el hábito te mantiene en movimiento.', autor: 'Jim Ryun', imagen: '/1.jpg' },
  { texto: 'El dolor es temporal; rendirse es para siempre.', autor: 'Lance Armstrong', imagen: '/1.jpg' },
  { texto: 'No tienes que ser grande para empezar, pero tienes que empezar para ser grande.', autor: 'Zig Ziglar', imagen: '/1.jpg' },
  { texto: 'La vida es 10% lo que te sucede y 90% cómo reaccionas a ello.', autor: 'Charles R. Swindoll', imagen: '/1.jpg' },
  { texto: 'La diferencia entre lo ordinario y lo extraordinario es ese pequeño extra.', autor: 'Jimmy Johnson', imagen: '/1.jpg' },
  { texto: 'La perseverancia es la madre del éxito.', autor: 'Napoleón Hill', imagen: '/1.jpg' },
  { texto: 'Lo que no te mata, te hace más fuerte.', autor: 'Friedrich Nietzsche', imagen: '/1.jpg' },
  { texto: 'Cree que puedes y ya estás a medio camino.', autor: 'Theodore Roosevelt', imagen: '/1.jpg' },
  { texto: 'La felicidad no es algo hecho. Viene de tus propias acciones.', autor: 'Dalai Lama', imagen: '/1.jpg' },
  { texto: 'El éxito es tropezar de fracaso en fracaso sin perder el entusiasmo.', autor: 'Winston Churchill', imagen: '/1.jpg' },
  { texto: 'No mires el reloj; haz lo que él hace: sigue adelante.', autor: 'Sam Levenson', imagen: '/1.jpg' },
  { texto: 'El único lugar donde el éxito viene antes que el trabajo es en el diccionario.', autor: 'Vidal Sassoon', imagen: '/1.jpg' },
  { texto: 'No esperes a que las condiciones sean perfectas para empezar. Empezar hace perfectas las condiciones.', autor: 'Alan Cohen', imagen: '/1.jpg' },
  { texto: 'El mayor riesgo es no tomar ninguno.', autor: 'Mark Zuckerberg', imagen: '/1.jpg' },
  { texto: 'Lo que haces hoy puede mejorar todos tus mañanas.', autor: 'Ralph Marston', imagen: '/1.jpg' },
  { texto: 'Nunca es demasiado tarde para ser lo que podrías haber sido.', autor: 'George Eliot', imagen: '/1.jpg' },
  { texto: 'El éxito no consiste en no cometer errores, sino en nunca cometer el mismo dos veces.', autor: 'George Bernard Shaw', imagen: '/1.jpg' },
  { texto: 'La adversidad revela el genio, la prosperidad lo oculta.', autor: 'Horacio', imagen: '/1.jpg' },
  { texto: 'Quien tiene un porqué para vivir se puede enfrentar a todos los cómo.', autor: 'Friedrich Nietzsche', imagen: '/1.jpg' },
  { texto: 'La forma de empezar es dejar de hablar y comenzar a hacer.', autor: 'Walt Disney', imagen: '/1.jpg' },
  { texto: 'Caer siete veces, levantarse ocho.', autor: 'Proverbio japonés', imagen: '/1.jpg' },
  { texto: 'La diferencia entre lo imposible y lo posible radica en la determinación de una persona.', autor: 'Tommy Lasorda', imagen: '/1.jpg' },
  { texto: 'Tu tiempo es limitado, no lo gastes viviendo la vida de otro.', autor: 'Steve Jobs', imagen: '/1.jpg' },
  { texto: 'La mejor forma de predecir el futuro es creándolo.', autor: 'Peter Drucker', imagen: '/1.jpg' },
  { texto: 'Tú eres el dueño de tu destino. Tú eres el capitán de tu alma.', autor: 'William Ernest Henley', imagen: '/1.jpg' },
  { texto: 'No te detengas cuando estés cansado; detente cuando hayas terminado.', autor: 'Marilyn Monroe', imagen: '/1.jpg' },
  { texto: 'La clave del éxito es enfocarse en metas, no en obstáculos.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'Para triunfar, primero debes creer que puedes.', autor: 'Nikos Kazantzakis', imagen: '/1.jpg' },
  { texto: 'La vida comienza donde termina tu zona de confort.', autor: 'Neale Donald Walsch', imagen: '/1.jpg' },
  { texto: 'No importa lo lento que vayas, mientras no te detengas.', autor: 'Confucio', imagen: '/1.jpg' },
  { texto: 'La suerte favorece a la mente preparada.', autor: 'Louis Pasteur', imagen: '/1.jpg' },
  { texto: 'La confianza en uno mismo es el primer secreto del éxito.', autor: 'Ralph Waldo Emerson', imagen: '/1.jpg' },
  { texto: 'Si no te gusta algo, cámbialo; si no puedes cambiarlo, cambia tu actitud.', autor: 'Maya Angelou', imagen: '/1.jpg' },
  { texto: 'La inspiración existe, pero tiene que encontrarte trabajando.', autor: 'Pablo Picasso', imagen: '/1.jpg' },
  { texto: 'No midas tu riqueza por el dinero que tienes, mídela por aquellas cosas que no cambiarías por dinero.', autor: 'Paulo Coelho', imagen: '/1.jpg' },
  { texto: 'Vive como si fueras a morir mañana. Aprende como si fueras a vivir siempre.', autor: 'Mahatma Gandhi', imagen: '/1.jpg' },
  { texto: 'La grandeza no consiste en recibir honores, sino en merecerlos.', autor: 'Aristóteles', imagen: '/1.jpg' },
  { texto: 'Para tener éxito, primero debemos creer que podemos.', autor: 'Nikola Tesla', imagen: '/1.jpg' },
  { texto: 'Lo único imposible es aquello que no intentas.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'Si no das el primer paso, nunca sabrás lo lejos que podrías llegar.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'No importa lo fuerte que seas, siempre serás más fuerte si perseveras.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'Tú eres capaz de cosas increíbles, nunca lo olvides.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'El éxito consiste en vencer el miedo al fracaso.', autor: 'Charles F. Kettering', imagen: '/1.jpg' },
  { texto: 'La actitud es una pequeña cosa que hace una gran diferencia.', autor: 'Winston Churchill', imagen: '/1.jpg' },
  { texto: 'La vida no se trata de encontrarte a ti mismo, sino de crearte a ti mismo.', autor: 'George Bernard Shaw', imagen: '/1.jpg' },
  { texto: 'Nunca te rindas, pues ese es solo el lugar y la hora en que la marea va a cambiar.', autor: 'Harriet Beecher Stowe', imagen: '/1.jpg' },
  { texto: 'La clave para el éxito es empezar antes de estar listo.', autor: 'Marie Forleo', imagen: '/1.jpg' },
  { texto: 'Si no te esfuerzas al máximo, ¿cómo sabrás dónde está tu límite?', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'No importa cuántas veces te caigas, sino cuántas veces te levantes.', autor: 'Abraham Lincoln', imagen: '/1.jpg' },
  { texto: 'El fracaso es la oportunidad de comenzar de nuevo con más inteligencia.', autor: 'Henry Ford', imagen: '/1.jpg' },
  { texto: 'El éxito no es para los que piensan que pueden hacerlo, sino para los que lo hacen.', autor: 'Desconocido', imagen: '/1.jpg' },
  { texto: 'Haz de cada día tu obra maestra.', autor: 'John Wooden', imagen: '/1.jpg' },
  { texto: 'Si quieres volar, renuncia a todo lo que te pese.', autor: 'Toni Morrison', imagen: '/1.jpg' },
  { texto: 'La verdadera motivación viene de logro, desarrollo personal, satisfacción en el trabajo.', autor: 'Frederick Herzberg', imagen: '/1.jpg' },
  { texto: 'La mejor preparación para el mañana es hacer tu mejor trabajo hoy.', autor: 'H. Jackson Brown Jr.', imagen: '/1.jpg' },
  { texto: 'No es la montaña lo que conquistamos, sino a nosotros mismos.', autor: 'Sir Edmund Hillary', imagen: '/1.jpg' },
  { texto: 'Nunca es demasiado tarde para perseguir tus sueños.', autor: 'Les Brown', imagen: '/1.jpg' },
  { texto: 'La grandeza nace de pequeños comienzos.', autor: 'Rabindranath Tagore', imagen: '/1.jpg' },
  { texto: 'Cada momento es una segunda oportunidad.', autor: 'Salaam Remi', imagen: '/1.jpg' },
  { texto: 'El éxito no es el final, el fracaso no es fatal; lo que cuenta es el coraje para continuar.', autor: 'Winston Churchill', imagen: '/1.jpg' },
  { texto: 'Elige un trabajo que ames y no tendrás que trabajar ni un día de tu vida.', autor: 'Confucio', imagen: '/1.jpg' },
  { texto: 'La pasión es energía. Siente el poder que viene de concentrarte en lo que te excita.', autor: 'Oprah Winfrey', imagen: '/1.jpg' },
];

export default frasesMotivacionales;

