function API(){
	
	
	const recherche = fetch('https://entreprise.data.gouv.fr/api/sirene/v1/full_text/*?activite_principale=6201Z&code_postal=76000&per_page=50').then( resultat => resultat.json()).then( json => json )
	console.log(recherche);
}

API();


async function testLocalisation(){
    const ville = recupVille();

    let loc = await fetch('https://api-adresse.data.gouv.fr/search/?q='+ville).then( resultat => resultat.json()).then(json => json.features[0].geometry.coordinates)
    
    function radiusEntreprise(){
        // trouve les entreprises dans un rayon de recherche
        // lat/long parametre: radius 5km de base 
        // affiche la deuxieme page 
        // 10 resultats par pages par default (per_page = ) pour modifier
        const radius = fetch('https://entreprise.data.gouv.fr/api/sirene/v1/near_point/?lat='+loc[1]+'&long='+loc[0]+'&activite_principale=6201Z&radius=20&page=1').then(resultat => resultat.json()).then(json => json)
        console.log("affiche les entreprises de la ville demandée dans un rayon de 20 km ")
        console.log(radius);
    }
    radiusEntreprise();
   
}














///function recup la ville utilisateur


function recupVille(){
    const ville = document.getElementById('rechercheVille').value;
    return ville;
}

document.getElementById('boutton').addEventListener('click', testLocalisation);



