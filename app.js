function API(){
	
	
	const recherche = fetch('https://entreprise.data.gouv.fr/api/sirene/v1/full_text/*?activite_principale=1071C&code_postal=76000&per_page=50').then( resultat => resultat.json()).then( json => json )
	console.log(recherche);
}

API();


function testLocalisation(){

    const loc = fetch('https://api-adresse.data.gouv.fr/search/?q=Montville').then( resultat => resultat.json()).then(json => json.features[0].geometry.coordinates[0])
    return loc;    
}

var test = testLocalisation();

console.log(test);




function radiusEntreprise(){
    // trouve les entreprises dans un rayon de recherche
    // lat/long parametre: radius 5km de base 
    // affiche la deuxieme page 
    // 10 resultats par pages par default (per_page = ) pour modifier
    const radius = fetch('https://entreprise.data.gouv.fr/api/sirene/v1/near_point/?lat=49.543856&long=1.082285&activite_principale=1071C&radius=5&page=2').then(resultat => resultat.json()).then(json => json.etablissements)
    console.log(radius);
}

radiusEntreprise();

