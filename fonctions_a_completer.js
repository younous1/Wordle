// Variables globales du jeu
let nbMotsTrouves = 0;
let meilleurNbEssais = null;
let motMystere;

/**
 * Fonction qui initialise le jeu
 * (Fonction appelée automatiquement au chargement de la page)
 * (FONCTION À COMPLÉTER)
 */
function init() {
  // Initialisation du mot mystère à retrouver
  motMystere = "ISHAK";
  definitionMot = "C'est une des personne les plus influentes et importante de Chambéry. Il se situe principalement sur Chambéry le Haut (ZUP)";
  //majMotMystere();
  cacheTousLesMessages();

  let btnsSupp = document.getElementById('bouton_effacer');
	btnsSupp.addEventListener('click', () => effaceCaseActive());

  window.addEventListener('keydown', (event) => handleKeyPress(event.key));

  // Association de clic sur les lettres
	let btnsLettres = document.querySelectorAll('.bouton_simple');

	for (let button of btnsLettres) {
    let d = button.textContent;
		button.addEventListener('click', () => actionne(d));
	}

  let btnsSpace = document.getElementById('space_button');
	btnsSpace.addEventListener('click', () => actionne(' '));

  let btnsValider = document.getElementById('bouton_valider');
	btnsValider.addEventListener('click', () => valideLeMot());

  let btnsNvPartie = document.getElementById('bouton_nouvelle_partie');
	btnsNvPartie.addEventListener('click', () => lanceNouvellePartie());
  
  nbMotsTrouves = parseInt(localStorage.getItem('nbMotsTrouves'));
  if(isNaN(nbMotsTrouves))    // si c'est la premiere partie sur le navigateur, dans localStorage la varaible sera à NaN, donc on initialise a 0 pour incrémenté quand le joueur gagnera une partie
  {
    localStorage.setItem('nbMotsTrouves', 0);
    nbMotsTrouves = parseInt(localStorage.getItem('nbMotsTrouves'));
  }
  nbMotsEssais = parseInt(localStorage.getItem('nbMotsEssais'));
  if(isNaN(nbMotsEssais))     // si c'est la premiere partie sur le navigateur, dans localStorage la varaible sera à NaN, donc on initialise a 1000 pour que lors de la victoire lors de la premiere partie, le nb d'essais qu'a eu le joueur soit enregistré comme le meilleur score .
  {
    localStorage.setItem('nbMotsEssais', 6);
    nbMotsEssais = parseInt(localStorage.getItem('nbMotsEssais'));
  }

  let spanMotsTrouves = document.getElementById('nb_mots_trouves');
  let spanMeilleurNbEssais = document.getElementById('meilleur_nb_essais');

  // Mise à jour du contenu des spans avec les valeurs du localStorage
  spanMotsTrouves.textContent = localStorage.getItem('nbMotsTrouves');
  spanMeilleurNbEssais.textContent = localStorage.getItem('nbMotsEssais');

}

/**
 * Fonction qui cache tous les messages de la section 
 * "zone_messages".
 * (FONCTION À COMPLÉTER)
 */
 function cacheTousLesMessages() {
  let zoneMess = document.querySelectorAll('.zone_messages');
  
  for (let dd of zoneMess) {
    dd.setAttribute('class', 'cache');
	}

  messAvert = document.getElementById('message_mot_incomplet');
  messAvert.style.visibility='hidden';

  messPerdu = document.getElementById('message_partie_perdue');
  messPerdu.style.visibility='hidden';

  messGagne = document.getElementById('message_partie_gagnee');
  messGagne.style.visibility='hidden';



}

/**
 * Fonction qui récupère la lettre présente sur le bouton passé en
 * paramètre, puis qui renseigne cette lettre dans la case active
 * et enfin décale la case active à droite (si cela est possible).
 * (Fonction qui se déclenche quand on clic sur un des
 * boutons du clavier du jeu)
 * @param bouton : Elément HTML correspondant au bouton à actionner
 * (FONCTION À COMPLÉTER)
 */
function actionne(bouton) {
  let caseAct = retourneCaseActive();
  let lettre = bouton;
  caseAct.setAttribute('value', lettre);
  decaleCaseActiveADroite();
}

/**
 * Fonction qui efface le contenu de la case active,
 * et qui décale ensuite la case active à gauche
 * (si le décalage est possible).
 * (FONCTION À COMPLÉTER)
 */
function effaceCaseActive() {
  let caseActive = retourneCaseActive();
  if(caseActive!=null)
  {
    caseActive.setAttribute('value', '');
  }
  decaleCaseActiveAGauche();
}

/**
 * Fonction qui retourne vrai si la ligne passée en paramètre est complète
 * (c'est-à-dire si les 5 cases <input> ont une lettre renseignée)
 * @param ligne : Élément HTML correspondant à la ligne à vérifier
 * @returns Un booléen indiquant si la ligne est complète ou non
 * (FONCTION À COMPLÉTER) 
 */
function verifieSiLigneComplete(ligne){
  let ligneActuelle = ligne.querySelectorAll('input');  // Utilise querySelectorAll avec le sélecteur 'input'
  let nbVide = 0;
  for (let input of ligneActuelle) {
    if (input.value === "") {
      nbVide++;
    }
  }

  if (nbVide > 0) {
    messAvert.style.visibility = 'visible';
    setTimeout(function () {
      messAvert.style.visibility = 'hidden';
    }, 3000);
    return false;
  } else {
    return true;
  }
}

/**
 * Fonction qui compare le mot inscrit dans la ligne passée en paramètre
 * au mot mystère que le joueur doit retrouver (aussi passé en paramètre)
 * et renvoie le nombre de lettres bien placées.
 * Et, selon la lettre et sa position, la fonction va aussi appliquer
 * une classe différente à la case.
 * (La fonction ne se base pas sur la case active de la grille,
 * et ne modifie pas quelle est cette case active)
 * @param ligne : Élément HTML correspondant à la ligne à vérifier
 * @param motMystere : Chaine de caractères correspondant au mot à trouver
 * @returns Le nombre de lettres bien placées dans le mot saisi
 * (FONCTION À COMPLÉTER) 
 */
function verifieLesLettresDeLaLigne(ligne, motMystere){
  let ligneActuelle = ligne.querySelectorAll('input');
  let nbBienPlacees = 0;
	for (let i = 0; i < ligneActuelle.length; i++) {
		if (motMystere.indexOf(ligneActuelle[i].value) !== -1){
      if(motMystere[i] === ligneActuelle[i].value)
      {
        ligneActuelle[i].setAttribute('class', 'bien_place');
        nbBienPlacees++;
      }else{
        ligneActuelle[i].setAttribute('class', 'pas_bien_place');
		  }
    }
    else{
      ligneActuelle[i].setAttribute('class', 'pas_dans_mot');
    }
	}

  
  // TODO Faire en sorte que la fonction retourne le nombre de lettres bien placées
  return nbBienPlacees;
}

/**
 * Fonction qui gère le cas où la partie est perdue
 * en affichant le message correspondant.
 * (FONCTION À COMPLÉTER)
 */
 function gerePartiePerdue(){
  messPerdu.style.visibility='visible';
}


/**
 * Fonction qui gère le cas où la partie est gagnée
 * en mettant à jour les différentes infos (variable globale
 * et LocalStorage) et en affichant le message correspondant.
 * (FONCTION À COMPLÉTER)
 */
function gerePartieGagnee(ligneDernierEssai){
  let essaisActuel = ligneDernierEssai.dataset.numEssai;
  let spanNbEssais = document.getElementById('nb_essais');
 spanNbEssais.textContent = essaisActuel;
 let spanMotMystere = document.getElementById('motMystere');
 spanMotMystere.textContent = motMystere;
 let spanDefinition = document.getElementById('definition');
 spanDefinition.textContent = definitionMot;
 if(essaisActuel<nbMotsEssais)
 {
  nbMotsEssais = essaisActuel;
 }
 nbMotsTrouves++;
 localStorage.setItem('nbMotsEssais', nbMotsEssais);
 localStorage.setItem('nbMotsTrouves', nbMotsTrouves);
 
 messGagne.style.visibility='visible';
 messDefinition.style.visibility='visible';
}

/**
 * Fonction qui réinitialise le jeu en cachant
 * tous les messages possiblement affichés
 * et en ré-initialisant la grille de jeu.
 * (FONCTION À COMPLÉTER)
 */
 function reinitialiseLeJeu() {
  cacheTousLesMessages();

  activePremiereCaseDeLaLigne(ligne);
}

/**
 * Fonction qui lance une nouvelle partie en ré-initialisant
 * le jeu et faisant un appel AJAX pour tirer au hasard
 * un nouveau mot mystère.
 * (FONCTION À COMPLÉTER)
 */
function lanceNouvellePartie() {
 let conf = confirm("voulez vous rejouer?");
 if(conf==true)
 {
  console.log("new game");
  location.reload();
 }else{

 }
}

/**
 * Fonction callback qui prend en paramètre la réponse de l'appel AJAX
 * et met à jour le mot mystère.
 * @param res : Chaine de caractères correspondant à ce que
 * renvoie l'appel AJAX
 * (FONCTION À COMPLÉTER)
 */
function majMotMystere() {
  fetch('mots.json')
        .then(response => response.json())
        .then(motsJSON => {
            // Générer un indice aléatoire
            const indiceAleatoire = Math.floor(Math.random() * motsJSON.length);

            // Récupérer le mot mystère et la définition correspondante
            motMystere = motsJSON[indiceAleatoire].mot;
            definitionMot = motsJSON[indiceAleatoire].definition;

            // Utiliser le motMystere comme vous le souhaitez dans le reste de votre jeu
            console.log("Mot mystère :", motMystere);
            console.log("Définition :", definitionMot);

            // ... On genere les cases en fonction du motMystere
            genererInputs();
        })
}

function genererInputs() {
  var grilleJeu = document.getElementById("grille_jeu");
  grilleJeu.innerHTML = '';

  // Boucle pour chaque ligne
  for (var i = 1; i <= 6; i++) {
      var ligne2 = document.createElement("div");
      ligne2.id = "ligne_" + i;
      ligne2.classList.add("essai");
      ligne2.setAttribute("data-num-essai", i);

      // Boucle pour chaque lettre dans le motMystere
      for (var j = 0; j < motMystere.length; j++) {
          var input = document.createElement("input");
          input.type = "text";
          input.disabled = true;
          input.autocomplete = "off";

          // Ajouter la classe "case_active" au premier input de la première ligne
          if (i === 1 && j === 0) {
              input.classList.add("case_active");
          }

          ligne2.appendChild(input);
      }

      grilleJeu.appendChild(ligne2);
  }
}

function handleKeyPress(key) {
  // Récupérer la case active
  let caseActive = retourneCaseActive();

  // Vérifier si la touche est une lettre et si une case est active
  if (/^[a-zA-Z]$/.test(key) && caseActive) {
    // Saisir la lettre dans la case active
    keyLetter = key.toUpperCase();

    // Décaler la case active à droite si possible
    actionne(keyLetter);
  } else if (key === 'Enter') {
    // Si la touche est "Entrée", valider le mot
    valideLeMot();
  } else if (key === 'Backspace') {
    // Si la touche est "Arrière" (ou "Supprimer"), effacer la case active
    effaceCaseActive();
  }
  else if (key === ' ') {
    actionne(' ');
  }
}

function showPopup(popupName) {
  console.log(popupName);
  var popup = document.getElementById(popupName);
  popup.style.display = 'block';
}

function closePopup(popupName) {
  console.log(popupName);
  var popup = document.getElementById(popupName);
  popup.style.display = 'none';
}