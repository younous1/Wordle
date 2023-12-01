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
  motMystere = "CRANE";
  cacheTousLesMessages();

  let btnsSupp = document.getElementById('bouton_effacer');
	btnsSupp.addEventListener('click', () => effaceCaseActive());


  // Association de clic sur les lettres
	let btnsLettres = document.querySelectorAll('.bouton_simple');

	for (let button of btnsLettres) {
    let d = button.textContent;
		button.addEventListener('click', () => actionne(d));
	}

  let btnsValider = document.getElementById('bouton_valider');
	btnsValider.addEventListener('click', () => valideLeMot());

  nbMotsTrouves = parseInt(localStorage.getItem('nbMotsTrouves'));
  nbMotsEssais = parseInt(localStorage.getItem('nbMotsEssais'));


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

  var messGagne = document.getElementById('message_partie_gagnee');
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
	for (let i = 0; i < ligneActuelle.length; i++) {
		if (motMystere.indexOf(ligneActuelle[i].value) !== -1){
      if(motMystere[i] === ligneActuelle[i].value)
      {
        ligneActuelle[i].setAttribute('class', 'bien_place');
      }else{
        ligneActuelle[i].setAttribute('class', 'pas_bien_place');
		  }
    }
    else{
      ligneActuelle[i].setAttribute('class', 'pas_dans_mot');
    }
	}

  
  // TODO Faire en sorte que la fonction retourne le nombre de lettres bien placées
}

/**
 * Fonction qui gère le cas où la partie est perdue
 * en affichant le message correspondant.
 * (FONCTION À COMPLÉTER)
 */
 function gerePartiePerdue(){
 
}


/**
 * Fonction qui gère le cas où la partie est gagnée
 * en mettant à jour les différentes infos (variable globale
 * et LocalStorage) et en affichant le message correspondant.
 * (FONCTION À COMPLÉTER)
 */
function gerePartieGagnee(ligneDernierEssai){
 if(ligneDernierEssai<nbMotsEssais)
 {
  nbMotsEssais = ligneDernierEssai;
 }
 nbMotsTrouves++;
 localStorage.setItem('nbMotsEssais', nbMotsEssais);
 localStorage.setItem('nbMotsTrouves', nbMotsTrouves);

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
 if(confirm==true)
 {
  reinitialiseLeJeu();
  ajax_get_request(majMotMystere,"generation.php",true)
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
function majMotMystere(res) {
  let parsedRes = JSON.parse(res);

	mot_a_deviner = parsedRes.mots_possibles;
}
