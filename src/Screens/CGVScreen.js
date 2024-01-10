import React from 'react';
import { ScreenContainer } from "../Components/ScreenContainer"
import { Text, ScrollView, StyleSheet, View, Linking, TouchableOpacity } from 'react-native';



export const CGVScreen = () =>{
    return (
        <ScreenContainer>
            <ScrollView style={{padding:10}}>
   
                    <View style={styles.container}>
                        <Text style={styles.title}>CONDITIONS GENERALES DE VENTE</Text>

                        <Text style={styles.paragraph}>
                            Préambule
                        </Text>
                        <Text style={styles.paragraph}>
                            Les présentes Conditions Générales de Vente (CGV) ont pour objet de définir les droits et obligations
                            des parties à la vente de l'application « Mystère », proposée en ligne par le canal de Google à l’aide du
                            lien suivant play.google.com/store/apps et notamment par l’intermédiaire de la plateforme de vente «
                            Play Store » par l'auto entreprise Locus immatriculée au RCS de Lisieux sous le n° 953 022 019 SIRET:
                            95302201900012 adresse 137 Rue Grande 14290 Orbec (dénommée ci-après l’« entreprise »).</Text>
                        <Text style={styles.paragraph}>Les présentes CGV sont applicables dès la mise en ligne de l’application.
La commande de l’application et sa validation entraînent l'acceptation sans restrictions ni réserves des
présentes CGV qui ont valeur contractuelle.</Text>
                        <Text style={styles.paragraph}>Il ne pourra être dérogé aux présentes conditions sauf accord de l’entreprise.</Text>
                        <Text style={styles.paragraph}>La souscription à une application payante est quant à elle limitée aux utilisateurs d'au moins 18 ans. Si
un utilisateur n'a pas encore atteint l'âge minimum requis, l'offre payante devra être souscrite par le biais
d'une personne majeure en qualité de représentant légal. Il convient de préciser que le titulaire de
l'autorité parentale du mineur sera responsable du respect par le mineur des CGU ainsi que des
présentes CGV.</Text>
                        <Text style={styles.paragraph}>L’acquisition et l’utilisation par un mineur de moins de 15 ans de la présente application nécessitent un
accord parental.</Text>
                        <Text style={styles.paragraph}>Si un utilisateur n'a pas encore atteint l'âge minimum requis, l'offre payante devra être souscrite par le
biais d'une personne majeure en qualité de représentant légal.</Text>

                        <Text style={styles.heading}>Article 1 - Description du produit:</Text>
                        <Text style={styles.listItem}>L'Application « Mystère » inclut les fonctionnalités suivantes:</Text>
                        <Text style={styles.listItem}>- Dans accueil, des propositions aléatoires de lieux.</Text>
                        <Text style={styles.listItem}>- Recherche géographique par région via la carte des départements métropolitains.</Text>
                        <Text style={styles.listItem}>- Recherche d’un lieu précis par mot clé via la fonction « rechercher »</Text>
                        <Text style={styles.listItem}>- Dans menu, l'alerte à proximité d'un lieu via « notification »</Text>
                        <Text style={styles.paragraph}>
                            L’entreprise se réserve la possibilité d’apporter des modifications à la présente application sans toutefois porter atteinte à ses fonctionnalités.
                        </Text>

                          <Text style={styles.paragraph}>Par ailleurs, l’entreprise se réserve le droit, sans préavis ni indemnité, de suspendre temporairement l'accès au
service pour des raisons légales ou réglementaires, ou pour assurer des opérations de maintenance, de réparation,
d'entretien ou de mise à jour, liées à l'évolution technologique, ou nécessaires à la continuité de ces fonctionnalités.
Les modifications ou suspensions visées dans les deux alinéas précédents ne sauraient donner lieu à des recours
de la part de l’utilisateur.</Text>
  <Text style={styles.paragraph}>Les interruptions temporaires du service pour les causes ci-dessus mentionnées seront, indiquées sur l'application
avec préavis de 24 (vingt-quatre) heures, sauf urgence.</Text>
 <Text style={styles.paragraph}>Pour bénéficier des mises à jour sur son smartphone l’utilisateur devra les télécharger sur le Play Store.</Text>

                        <Text style={styles.heading}>Article 2 - Durée des services:</Text>
                        <Text style={styles.paragraph}>
                           L’utilisation de la présente application est prévue pour une durée indéterminée sans que pour autant l’entreprise
puisse en garantir une pérennité absolue.
                        </Text>
                      

                        <Text style={styles.heading}>Article 3 - Remboursement:</Text>

                        <Text style={styles.paragraph}>Le remboursement de l’acquisition de la présente application ne pourra être consenti que dans les conditions prévues à la rubrique visée à cet effet accessible au lien suivant: 
                          <TouchableOpacity onPress={()=>{Linking.openURL('https://support.google.com/googleplay/answer/7659581?ctx=dj.mixer.pro&visit_id=638167273709963015-3160763323&p=details_refundpolicy&rd=1&fbclid=IwAR2xVOXVZN1ato5ySeLggH6dQq6zqz4nKY0_8zW2fgprmT-UMbp0Q6htYZ4#zippy=%2Capplications-et-jeux-sur-google-play')}}>
                            <Text style={{textDecorationLine: 'underline', color:'#FFF', fontWeight:'bold'}}>
                              Conditions de remboursement
                            </Text>
                          </TouchableOpacity> 
                        </Text>

                      
                        <Text style={styles.heading}>Article 4 - Prix et Conditions de paiement:</Text>

                        <Text style={styles.paragraph}>Les prix sont ceux en vigueur sur le Site et/ou sur l'Application Play Store au jour de la validation de la commande. </Text>
                        <Text style={styles.paragraph}>Au moment de la validation de la commande, le prix à payer s'entend du prix Toutes Taxes Comprises (TTC) et non
Hors Taxes (HT).</Text>
                        <Text style={styles.paragraph}>En revanche, les frais de télécommunication inhérents à l'accès au Site et/ou sur l'application Play Store restent à
la charge exclusive du Client.</Text>
  <Text style={styles.paragraph}>Vos coordonnées bancaires pourront également être conservées par un prestataire de services de paiement
sécurisés en ligne, indépendant de l’entreprise.</Text>
  <Text style={styles.paragraph}>Le paiement fait l'objet d'un règlement intégral lors de la commande, il s'agit d'un achat ponctuel. La transaction est
immédiatement débitée sur la carte bancaire enregistrée sur votre compte Play Store ou sur les services suivants
enregistrés: paypal- paysafecard - carte cadeau - votre facture mobile.</Text>


                        <Text style={styles.heading}>Article 5 - Droit de rétractation:</Text>

                        <Text style={styles.paragraph}>Conformément à l’article L221-28 du Code de la consommation ci-après reproduit, cela sans préjudice
                            de l’application des dispositions de l’article 3 des présentes CGV : {'/n'}
                            Le droit de rétractation ne peut être exercé pour les contrats : {'/n'}
                            De fourniture d'un contenu numérique sans support matériel dont l'exécution a commencé avant la fin du
                            délai de rétractation et, si le contrat soumet le consommateur à une obligation de payer, lorsque : {'/n'}
                            a- Il a donné préalablement son consentement exprès pour que l'exécution du contrat commence avant
                            l'expiration du délai de rétractation ; et {'/n'}
                            b- Il a reconnu qu'il perdra son droit de rétractation ; et {'/n'}
                            c- Le professionnel a fourni une confirmation de l'accord du consommateur conformément aux dispositions du
                            deuxième l'alinéa de l'article L. 221-13.</Text>
                                                
                        <Text style={styles.heading}>Article 6 - Garantie et Responsabilité:</Text>

                        <Text style={styles.paragraph}>L’entreprise est soumise aux conditions de garanties légales prévues aux articles L. 217-4, L. 217-5, L. 217-12, et
L. 211-1 du Code de la consommation.</Text>
 <Text style={styles.paragraph}>  L'application Mystère est livrée par la Société Google via l'application Play Store</Text>

            <Text style={styles.listItem}>L'application Mystère doit être utilisée selon les indications figurant dans les CGU.</Text>
            <Text style={styles.paragraph}>Le Client déclare être informé des contraintes et des limites des réseaux Internet et Internet mobile. En
conséquence, l’entreprise ne pourra en aucun cas être tenue responsable de dysfonctionnements dans l'accès aux
services, des vitesses d'ouverture et de consultation des pages, de l'inaccessibilité temporaire ou définitive des
services.</Text>
  <Text style={styles.paragraph}>L’entreprise ne peut être tenue responsable:</Text>
        <Text style={styles.listItem}>- De toute forme d’altération ou d’intrusion dans le matériel informatique de l’utilisateur résultant d’un accès
viral.</Text>
        <Text style={styles.listItem}>- D’incompatibilité de l’application avec l’installation informatique et les équipement de l’utilisateur.</Text>
        <Text style={styles.listItem}>- Et de manière générale de tout dysfonctionnement ou de toute détérioration du matériel de l’utilisateur.</Text>
        <Text style={styles.paragraph}>Le Client est seul responsable de l'utilisation qu'il fait des services externes à l'application.</Text>
        <Text style={styles.paragraph}>Le Client s'engage par ailleurs à faire son affaire personnelle de toute réclamation, revendication, ou opposition et
plus généralement de toute procédure formée contre l’entreprise émanant d'un tiers qui serait liée à son utilisation
des services.</Text>


                    <Text style={styles.heading}>Article 7 - Données personnelles:</Text>

                    <Text style={styles.paragraph}>La confidentialité des informations personnelles de nos utilisateurs est très importante pour nous et nous faisons
tout notre possible pour la préserver, c’est pourquoi nous garantissons un niveau de protection des données
conforme aux normes en vigueur en France.</Text> 
                    <Text style={styles.paragraph}>L'application Mystère ne détient aucune donnée personnelle relative à ses utilisateurs (nom, prénom, adresse,
                    numéro de téléphone, date de naissance, photo, localisation précise).</Text>
                    <Text style={styles.paragraph}>L'application Mystère n'utilise aucun pixel de site tiers à des fins statistiques et de mesures d’audience.</Text>
                    <Text style={styles.paragraph}>L'application Mystère utilise des outils et services de Google, régis par leurs propres conditions d’utilisation.</Text>

                        <Text style={styles.heading}>Article 8 - Modifications des cgv:</Text>

                        <Text style={styles.paragraph}>
                            Les CGV valables sont celles en vigueur au jour de l’acquisition de l’application. L’entreprise se réserve toutefois le
droit d’y apporter des modifications sans que celles-ci puissent être applicables au contrat déjà souscrit.
                        </Text>

                        <Text style={styles.heading}>Article 9 - Loi applicable et attribution de juridiction:</Text>

                        <Text style={styles.paragraph}>
                            Les juridictions compétentes pour statuer sur un litige concernant la présente application et ses CGU sont celles
                            déterminées par les dispositions du Code de procédure civile français. {'\n'}
                            Vous avez également la possibilité de saisir un médiateur de la consommation à vos frais dont les coordonnées
                            figurent ci-dessous:{'\n'}{'\n'}
                            Le Groupement des commissaires médiateurs{'\n'}
                            9 rue des Colonnes - 75002 Paris{'\n'}
                            gncm.contact@gmail.com
                        </Text>

                        <Text style={styles.heading}>Article 10 - Éléments concernant la garantie légale de conformité et la
garantie légale des vices cachés:</Text>

                        <Text style={styles.paragraph}>Le présent contrat est également soumis aux dispositions des articles 1641 du Code civil relatifs aux vices cachés.
Quant à la conformité de l’application elle obéit aux dispositions de l’article 217-3 du code de la consommation.</Text>

                </View>
            </ScrollView>
        </ScreenContainer>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
  },
  paragraph: {
    marginBottom: 12,
    color: '#FFF',
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#FFF',
  },
  listItem: {
    marginLeft: 16,
    marginBottom: 8,
    color: '#FFF',
  },
});
