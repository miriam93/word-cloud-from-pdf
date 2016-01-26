const cloud_size = 14;
const cloud_max_size = 17;

function emptyWord(word) {
	if (word.length <= 2)
		return true;
	var prefix = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '(', '-', '_'];
	for (var i = 0; i < prefix.length; i++)
		if (word.charAt(0) == prefix[i])
			return true;
	var emptyWords = ["de", "horas", "del", "todas", "ii", "grado", "", "las", "ese", "durante",
					"ejercicios", "los", "iii", "evaluar", "â€¢", "trabajo", "sera", "resto",
					"teoricas", "otras", "calificacion", "con", "sin", "para", "evaluables",
					"por", "and", "final", "curso",	"una", "practicas", "que", "dirigidas",
					"muy", "asignatura", "mas", "cual",	"director",	"docente", "valorar",
					"firma", "departamento", "fecha", "complutense", "madrid", "decanato",
					"dia", "facultad", "junio",	"aula", "septiembre", "pruebas", "competencias",
					"jun", "parcial", "realizadas", "febrero", "nota", "podrán", "coordinador",
					"evaluación", "prueba",	"feb", "estas", "alumno", "comunes", "generales",
					"comun", "todos", "misma", "universidad", "complutens", "ficha", "personas",
					"incluir", "mismo", "uno", "profesores", "clases", "adrid", "sep", "plazo",
					"podra", "minima", "parciales", "cada", "optativas", "ECTS", "org", "mediante",
					"laboratorio", "examen", "obligatorias", "siendo", "tiene",
					"evaluacion", "actividades", "grupos", "realizacion",
					"detallado", "examenes", "docencia", "materia", "the"];
	for (var i = 0; i < emptyWords.length; i++)
		if (word == emptyWords[i])
			return true;
	return false;	
}

function getWords(fileName) {
	var filePath = "fichas_docentes/" + fileName + ".pdf";
	var extract = require('pdf-text-extract'); 
	var fs = require('fs');

	extract(filePath, { splitPages: false }, function (err, text) {
	  if (err)
		throw err;
	  else {
		var allText = text[0];
		for (var i = 1; i < text.length; i++)
			allText = allText.concat(text[i]);
		var cleanedText = allText.replace(/[áàä]/gi,"a").replace(/[éèë]/gi,"e").replace(/[íìï]/gi,"i").replace(/[óòö]/gi,"o")
								 .replace(/[úùu]/gi,"u").replace(/ñ/gi,"n").replace(/ç/gi,"c").replace(/o©/g,"e")
								 .replace(/Ã¡/g,"a").replace(/oI�/g,"o").replace(/ódulo/g,"modulo").replace(/[()³.:,\n\t\r]/g,"")
								 .replace(/\]/g,"").toLowerCase();
		var allWords = cleanedText.split(" ");
		var wordsCount = {};
		for (var word in allWords) {
			if (!emptyWord(allWords[word]))
				if (wordsCount[allWords[word]] == undefined)
					wordsCount[allWords[word]] =  1;
				else
					wordsCount[allWords[word]]++;
		}
		allWords = [];
		for (var word in wordsCount)
			allWords.push({"text": word, "weight": wordsCount[word]});
		allWords.sort(function(a, b){return b.weight - a.weight});
		
		var max = allWords[0].weight;
		for (var word in allWords)
			allWords[word].weight = Math.round(allWords[word].weight * cloud_max_size * 100 / max) / 100;
		
		fs.writeFile("palabras_asignaturas/" + fileName + ".txt", JSON.stringify(allWords.slice(0,cloud_size)), function (err) {
		  if (err)
			throw err;
		});
	  }
	})
}

getWords(process.argv[2]);