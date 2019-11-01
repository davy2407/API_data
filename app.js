
var page = 1;
var pageRayon = 1;


// carte leaflet
let mymap = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
	maxZoom: 18,
	
}).addTo(mymap);


// function permettant la recherche par rayon geo

async function rayonLocalisation(){
    
    const ville = recupVille(); // fonction qui recupere le nom de ville demandé par l'utilisateur. 
    const naf = recupCodeNaf(); // fonction recupere le secteur d'activité demandé dans le menu déroulant 
    const rayon = recupRayon(); // fonction recupere le rayon de recherche demandé par utilisateur

    // utilisation de l'API adresse.data.gouv pour avoir accès aux coordonnées GPS de la ville demandée
    let loc = await fetch('https://api-adresse.data.gouv.fr/search/?q='+ville).then( resultat => resultat.json()).then(json => json.features[0].geometry.coordinates)
    
    async function radiusEntreprise(){
        // trouve les entreprises dans un rayon de recherche
        // lat/long parametre: radius 5km de base 
        // affiche la deuxieme page 
        // 10 resultats par pages par default (per_page = ) pour modifier
        const radius = await fetch('https://entreprise.data.gouv.fr/api/sirene/v1/near_point/?lat='+loc[1]+'&long='+loc[0]+'&activite_principale='+naf+'&radius='+rayon+'&per_page=100&page='+pageRayon).then(resultat => resultat.json()).then(json => json)
        console.log('affiche les entreprises de la ville demandée dans un rayon de '+rayon+' km ')
        console.log(radius);
        debutActivite(radius.etablissements);
    }
    radiusEntreprise();
   
}


// function capitalize , recupere une chaine STR et la modifie pour que la première lettre soit en MAJ

function capitalize(str){
    return str[0].toUpperCase() + str.slice(1);
}





///function recup la ville utilisateur


function recupVille(){
    const ville = document.getElementById('rechercheVille').value;
    if (ville =="") {
        alert('renseigner une ville');
        
    }else {
    capitalize(ville);
    return ville;}
}

// function recup le code naf (secteur d'activtés ) demandé

function recupCodeNaf(){
    const naf = document.getElementById('naf').value;
    return naf;
}

// function recup le rayon demandé par utilisateur pour la recherche

function recupRayon(){
    const rayon =  document.getElementById('rayon').value;
    return rayon;
}

// function recup taille demandé par utilisateur

function recupTaille(){
    const taille = document.getElementById('taille').value;
    return taille;
}

// function version 1 recherche par taille entreprise


// NN   Unité non employeuse
// 00	0 salarié (n'ayant pas d'effectif au 31/12 mais ayant employé des salariés au cours de l'année de référence)
// 01	1 ou 2 salariés
// 02	3 à 5 salariés
// 03	6 à 9 salariés
// 11	10 à 19 salariés
// 12	20 à 49 salariés
// 21	50 à 99 salariés
// 22	100 à 199 salariés
// 31	200 à 249 salariés
// 32	250 à 499 salariés
// 41	500 à 999 salariés
// 42	1 000 à 1 999 salariés
// 51	2 000 à 4 999 salariés
// 52	5 000 à 9 999 salariés
// 53	10 000 salariés et plus

async function rechercheTaille(){
    const ville = recupVille();
    const taille = recupTaille(); // fonction recupère la taille d'entreprise demandé par l'utilisateur via le menu déroulant
    const naf = recupCodeNaf();
	
	const recherche = await fetch('https://entreprise.data.gouv.fr/api/sirene/v1/full_text/'+ville+'?activite_principale='+naf+'&tranche_effectif_salarie_entreprise='+taille+'&per_page=100&page='+page).then( resultat => resultat.json()).then( json => json )
    console.log(recherche);
    for (let i = 0; i < recherche.etablissement.length; i++) {
        // console.log(recherche.etablissement[i].latitude);
        // console.log(recherche.etablissement[i].longitude);
        
    }
    addElement(recherche.etablissement);
    
    debutActivite(recherche.etablissement);
    
}
// function recup date debut activité et compare à la date demandé

function debutActivite(tabDebutActivite){
    for (let i = 0; i < tabDebutActivite.length; i++) {
        var dateTest = format(tabDebutActivite[i].date_debut_activite);
        recupDateUtilisateur(dateTest);

        
    }
    
}

// function converti date activité au bon format pour comparaison

function format(date){
    var debut = [];
    debut[0] = date.substr(0,4);
    debut[1] = date.substr(4,2);
    debut[2] = date.substr(6);
    return debut;
}
// function charge page suivante

function pageSuivanteRayon(){
    pageRayon +=1;
}



function pageSuivante(){
    page +=1;
}

// function page précédente 

function pagePrecedenteRayon(){
    if (pageRayon == 1) {
        pageRayon = 1;
        
    } else {
        pageRayon-=1;
    }
}


function pagePrecedente(){
    if (page == 1) {
        page = 1;
        
    } else {
        page -=1;
    }
}


// test comparaison date


// function compare date

function compareDate(objet1,objet2){
    var d1 = new Date(objet1[0],objet1[1],objet1[2]);
    var d2 = new Date(objet2[0],objet2[1],objet2[2]);
    if (d1 > d2) { 
        console.log("entreprise pas affiché", objet1);
        // l'entreprise est trop récente
    } else if (d1 < d2) { 
        console.log("entreprise affiché", objet1); 
        // l'entreprise respect la date d'ancienneté 
    } else {
        console.log("pas de date renseigné");
    }
}
 

// var d1 = new Date(2019,11,27); 
// // Miseenplacedelasecondedate 
// var d2 = new Date(2019, 11, 28);
// if (d1 > d2) { 
//     alert("d1estaprèsd2");
// } else if (d1 < d2) { 
//     alert("d1estavantd2"); 
// } else {
//     alert("d1etd2sontlamêmedate"); 
// }

function recupDateUtilisateur(debutACTi){
    var date1 = document.getElementById('premiereDate').value;
    // var date2 = document.getElementById('deuxiemeDate').value;
    date1 = date1.split('-');
    // date2 = date2.split('/');
 
    compareDate(debutACTi,date1);
    
}

//addeventlist
// document.getElementById('compareDate').addEventListener('click', recupDateUtilisateur);
document.getElementById('bouttonTaille').addEventListener('click',  rechercheTaille);
document.getElementById('chargerPage').addEventListener('click',  pageSuivante  );
document.getElementById('chargerPage').addEventListener('click',  rechercheTaille  );
document.getElementById('pagePrecedente').addEventListener('click', pagePrecedente);
document.getElementById('pagePrecedente').addEventListener('click', rechercheTaille);





document.getElementById('boutton').addEventListener('click', rayonLocalisation);
document.getElementById('chargerPageRayon').addEventListener('click', pageSuivanteRayon );
document.getElementById('chargerPageRayon').addEventListener('click', rayonLocalisation);
document.getElementById('pagePrecedenteRayon').addEventListener('click', pagePrecedenteRayon);
document.getElementById('pagePrecedenteRayon').addEventListener('click',rayonLocalisation )






// function entrainement




function addElement (liste) {
    for (let i = 0; i <= liste.length; i++) {
        var newDiv = document.createElement("div");
        newDiv.classList.add("listeElement");
        
        var lat = liste[i].latitude;
        var long = liste[i].longitude;
        newDiv.setAttribute("lat", lat);
        newDiv.setAttribute("long", long);
            
        

        // newDiv.setAttribute("lat", liste[i].latitude);
        // newDiv.setAttribute("long", liste[i].id);

        var newContent = document.createTextNode(liste[i].nom_raison_sociale);

        newDiv.appendChild(newContent);
        var currentDiv = document.querySelector(".list");
        currentDiv.appendChild(newDiv);
        
        
    }
//     // crée un nouvel élément div
//     // var newDiv = document.createElement("div");
//     // newDiv.classList.add("listeElement");
//     newDiv.setAttribute("lat",listeLatLong[i].latitude);
//     newDiv.setAttribute("long",listeLatLong[i].longitude);
//     // et lui donne un peu de contenu
//     var newContent = document.createTextNode('Hi there and greetings!');
//     // ajoute le nœud texte au nouveau div créé
//     newDiv.appendChild(newContent);
    
//     // ajoute le nouvel élément créé et son contenu dans le DOM
//     var currentDiv = document.querySelector(".list");
//     currentDiv.appendChild(newDiv);
//   }

// //   for (let i = 0; i < 10; i++) {
// //      addElement();
      
}