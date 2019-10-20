


async function testLocalisation(){
    const ville = recupVille();
    const naf = recupCodeNaf();
    const rayon = recupRayon();

    let loc = await fetch('https://api-adresse.data.gouv.fr/search/?q='+ville).then( resultat => resultat.json()).then(json => json.features[0].geometry.coordinates)
    
    function radiusEntreprise(){
        // trouve les entreprises dans un rayon de recherche
        // lat/long parametre: radius 5km de base 
        // affiche la deuxieme page 
        // 10 resultats par pages par default (per_page = ) pour modifier
        const radius = fetch('https://entreprise.data.gouv.fr/api/sirene/v1/near_point/?lat='+loc[1]+'&long='+loc[0]+'&activite_principale='+naf+'&radius='+rayon+'&page=1').then(resultat => resultat.json()).then(json => json)
        console.log('affiche les entreprises de la ville demandée dans un rayon de '+rayon+' km ')
        console.log(radius);
    }
    radiusEntreprise();
   
}








// function capitalize

function capitalize(str){
    return str[0].toUpperCase() + str.slice(1);
}





///function recup la ville utilisateur


function recupVille(){
    const ville = document.getElementById('rechercheVille').value;
    capitalize(ville);
    return ville;
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

function rechercheTaille(){
    const ville = recupVille();
    const taille = recupTaille();
    const naf = recupCodeNaf();
	
	const recherche = fetch('https://entreprise.data.gouv.fr/api/sirene/v1/full_text/'+ville+'?activite_principale='+naf+'&tranche_effectif_salarie_entreprise='+taille).then( resultat => resultat.json()).then( json => json )
	console.log(recherche);
}

document.getElementById('bouttonTaille').addEventListener('click', rechercheTaille);





document.getElementById('boutton').addEventListener('click', testLocalisation);



