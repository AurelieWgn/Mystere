import React from 'react';
import {ScreenContainer} from '../Components/ScreenContainer';
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';

export const CGUScreen = () => {
  return (
    <ScreenContainer>
      <ScrollView style={{padding: 10}}>
        <View style={styles.container}>
          <Text style={styles.title}>CONDITIONS GÉNÉRALES D’UTILISATION</Text>

          <Text style={styles.paragraph}>Préambule</Text>
          <Text style={styles.paragraph}>
            Les présentes « conditions générales d’utilisation » ont pour objet
            l’encadrement juridique de l’application Mystère, gérée par
            l'auto-entreprise Locus et son utilisation par l’utilisateur. Les
            conditions générales d’utilisation doivent être acceptées par tout
            utilisateur souhaitant accéder à l’application. Elles constituent le
            contrat entre l’Application et l’Utilisateur. L’accès à
            l’Application par l’utilisateur signifie son acceptation des
            présentes conditions générales d’utilisation. Éventuellement, en cas
            de non-acceptation des conditions générales d’utilisation stipulées
            dans le présent contrat, l’utilisateur se doit de renoncer à l’accès
            au service proposé par l’application.
          </Text>

          <Text style={styles.paragraph}>
            Retrouvez l'ensemble des conditions générales d'utilisation de
            l'application Mystère en suivant:{' '}
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://docdro.id/LHSTT0U');
              }}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  color: '#FFF',
                  fontWeight: 'bold',
                }}>
                ce lien
              </Text>
            </TouchableOpacity>{' '}
          </Text>

          <Text style={styles.heading}>
            Article 1 - L’application propose à l’utilisateur:
          </Text>
          <Text style={styles.listItem}>
            L'Application « Mystère » inclut les fonctionnalités suivantes:
          </Text>
          <Text style={styles.listItem}>
            - Dans accueil, des propositions aléatoires de lieux.
          </Text>
          <Text style={styles.listItem}>
            - Recherche géographique par région via la carte des départements
            métropolitains.
          </Text>
          <Text style={styles.listItem}>
            - Recherche d’un lieu précis par mot clé via la fonction «
            rechercher »
          </Text>
          <Text style={styles.listItem}>
            - Dans menu, l'alerte à proximité d'un lieu via « notification »
          </Text>
          <Text style={styles.paragraph}>
            L’entreprise se réserve la possibilité d’apporter des modifications
            à la présente application sans toutefois porter atteinte à ses
            fonctionnalités.
          </Text>

          <Text style={styles.heading}>Article 2 - L'accès aux services:</Text>
          <Text style={styles.paragraph}>
            L’application fonctionne exclusivement sur les smartphones équipés
            d'un système d'exploitation Android doté de la fonction localisation
            (GPS).
          </Text>
          <Text style={styles.paragraph}>
            L’application est téléchargeable sur le Play Store de Google, un
            compte client chez le fournisseur de l'application est nécessaire.
          </Text>
          <Text style={styles.paragraph}>
            L’application est accessible aux personnes disposant de la pleine
            capacité juridique pour s’engager au titre des présentes «
            conditions générales d’utilisation »
          </Text>
          <Text style={styles.paragraph}>
            La personne physique qui ne dispose pas de la pleine capacité
            juridique ne peut accéder à l’application et aux services qu’avec
            l’accord de son représentant légal.
          </Text>
          <Text style={styles.paragraph}>
            Tous les frais supportés par l’utilisateur pour accéder au service
            (matériel informatique, logiciels, connexion Internet, etc.) sont à
            sa charge.
          </Text>
          <Text style={styles.paragraph}>
            L’entreprise met en œuvre tous les moyens mis à sa disposition pour
            assurer un accès de qualité à ses services, l'accès étant fourni par
            un hébergeur indépendant, l’entreprise n’engage pas sa
            responsabilité de ce fait.
          </Text>
          <Text style={styles.paragraph}>
            Tout événement dû à un cas de force majeure ayant pour conséquence
            un dysfonctionnement du réseau ou du serveur n’engage pas la
            responsabilité de l’entreprise
          </Text>
          <Text style={styles.paragraph}>
            L’accès aux services de l’application peut à tout moment faire
            l’objet d’une interruption, d’une suspension, d’une modification
            moyennant un préavis de 24 heures sauf urgence pour une maintenance
            ou pour tout autre cas d’origine technique, l'utilisateur
            s’obligeant à ne réclamer aucune indemnisation.
          </Text>
          <Text style={styles.paragraph}>
            Dans un souci d’amélioration, l’entreprise se réserve le droit à
            tout moment de modifier les caractéristiques ou le contenu de
            l’application, est peut également restreindre l'accès à certaines
            rubriques et ce, sans avertissement préalable.
          </Text>
          <Text style={styles.paragraph}>
            L’utilisateur a la possibilité de contacter l’entreprise par
            messagerie électronique à l’adresse: appmystere@gmail.com
          </Text>

          <Text style={styles.heading}>
            Article 3 - Règles de confidentialité:
          </Text>
          <Text style={styles.heading}>Données personnelles</Text>

          <Text style={styles.paragraph}>
            Soucieuse de la protection de votre vie privée, l'application
            Mystère s’engage à assurer le meilleur niveau de protection de vos
            données personnelles conformément à la loi Informatique et libertés
            nᵒ 78-17 du 6 janvier 1978 modifiée par l'article 33 de la loi n°
            2022-52 du 24 janvier 2022. Notre politique de protection de la vie
            privée vous permet d’en savoir plus sur la collecte et le traitement
            de vos données personnelles par l'application Mystère ainsi que sur
            vos droits. Vous pouvez consulter la liste des traitements vous
            concernant ci dessous, ou nous adresser un courrier à l’adresse
            suivante : Mystère 137 rue grande 14290 Orbec, ou par e-mail à
            l’adresse suivante : appmystere@gmail.com Pour mieux connaître vos
            droits et vos devoirs, vous pouvez également consulter le site de la
            Commission Nationale de l’Informatique et des Libertés www.cnil.fr{' '}
          </Text>

          <Text style={styles.heading}>
            Identité du responsable du traitement
          </Text>

          <Text style={styles.paragraph}>
            Les données personnelles sont collectées par: {'\n'}
            L'auto entreprise Locus immatriculée au RCS de Lisieux sous le n°
            953 022 019 SIRET: 95302201900012 adresse 137 Rue Grande 14290 Orbec
          </Text>

          <Text style={styles.heading}>
            Les traitements relatifs à vos données personnelles
          </Text>
          <Text style={styles.paragraphBold}>Quelles données ? </Text>

          <Text style={styles.paragraph}>
            En utilisant les Services proposés sur l’application mobile Mystère
            (ci-après désignée « l’application »), vous acceptez la collecte,
            l’utilisation et le transfert de vos données personnelles dans les
            limites et le cadre définis ci-après. Nous ne collectons aucun donné
            relatif à vos listes de contacts, noms, prénoms, numéros de
            téléphones, adresses postales, adresse électronique mais également
            aucune donnée sur vos origines raciale ou ethnique, ou vos opinions
            politiques, philosophiques ou religieuses ou votre appartenance
            syndicale, ou qui sont relatives à votre santé ou à votre vie
            sexuelle à des fins commerciales ou pour le compte de tiers. Par
            ailleurs, avec votre consentement, l’application Mystère collecte
            est traite des données de localisation de manière sécurisée et
            anonyme pour le bon fonctionnement du service (localisation
            approximatif, recherche d’itinéraires, notifications.) des données
            de géolocalisation sont également demandées lors de l’utilisation de
            l’application, et lorsque celle-ci est en veille (en fonction des
            choix que vous aurez exprimé dans le menu). Les données ainsi
            collectées ont pour objet essentiel d’assurer le bon fonctionnement
            de nos services. Si vous autorisez cette collecte de données de
            géolocalisation, vous pouvez changer d’avis après coup, vous aurez
            toujours la possibilité de vous y opposer en modifiant les
            paramètres de votre terminal.
          </Text>

          <Text style={styles.paragraphBold}>Quand ?</Text>
          <Text style={styles.paragraph}>
            Nous collectons vos données notamment quand :
          </Text>
          <Text style={styles.listItem}>Vous naviguez sur l’application. </Text>
          <Text style={styles.listItem}>L’application est en veille.</Text>

          <Text style={styles.paragraphBold}>Quelles finalités ?</Text>
          <Text style={styles.paragraph}>
            Nous utilisons vos données personnelles pour:
          </Text>
          <Text style={styles.listItem}>
            vous permettre d’utiliser l’application et les fonctionnalités
            associées (localisation approximatif, recherche d’itinéraires,
            notifications){' '}
          </Text>

          <Text style={styles.paragraphBold}>
            Quelle durée de conservation ?
          </Text>
          <Text style={styles.listItem}>
            Vos données de localisation ne sont pas conservées par l'application
            Mystère.
          </Text>
          <Text style={styles.listItem}>
            Les informations concernant votre navigation sont anonymes et ne
            sont pas conservées par l'application Mystère.
          </Text>

          <Text style={styles.paragraphBold}>Quels destinataires ?</Text>
          <Text style={styles.listItem}>
            Les données collectées sur l’application Mystère sont exclusivement
            destinées à l’application Mystère.
          </Text>

          <Text style={styles.paragraphBold}>Quels sont vos droits ?</Text>
          <Text style={styles.paragraph}>
            Collecte de vos données de géolocalisation. Sur Android : Vous
            pouvez désactivez la géolocalisation dans vos paramètres, ou sur
            l'écran d’accueil avec un simple balayage vers le bas de votre écran
            en cliquant sur l’icône correspondant. Si vous activez ce
            paramétrage, l’application ne sera plus en mesure d'utiliser vos
            données de géolocalisation. Vous pouvez également autoriser ou
            refuser le traitement de vos données de localisation par
            l’application Mystère, en vous rendant dans les Paramètres de vos
            applications. Vous pourrez alors déterminer les finalités pour
            lesquelles vous autorisez la collecte de vos données. Vous avez
            également le droit de faire une réclamation à notre encontre auprès
            des autorités voir Article 8.
          </Text>

          <Text style={styles.paragraphBold}>Vues immersives</Text>
          <Text style={styles.paragraph}>
            Conformément à la loi Informatique et Libertés du 6 janvier 1978
            modifiée, vous pouvez nous signaler un contenu inapproprié ou nous
            demander de « flouter » une image si vous arrivez à vous reconnaître
            ou à reconnaître un membre de votre famille. Par ailleurs, tout
            résident, locataire ou propriétaire, lorsqu’il est seul occupant
            d’un immeuble ou d’une maison ainsi que l’ensemble des
            copropriétaires d’un immeuble peuvent demander la suppression d’une
            vue immersive de cet immeuble ou maison sous réserve de fournir un
            justificatif de domicile. Vous pouvez exercer les droits décrits
            ci-dessus en utilisant l'adresse e-mail suivante
            appmystere@gmail.com ou en écrivant à Mystère – Réclamation, 137 rue
            grande 14290 Orbec, en nous indiquant la localisation exacte de la
            prise de vue.
          </Text>

          <Text style={styles.paragraphBold}>Les Notifications</Text>
          <Text style={styles.paragraph}>
            Par défaut, notre l’application est paramétrée pour vous donner le
            choix d'accepter ou non les notifications. Néanmoins, vous pouvez à
            tout moment décider de ne pas voir s’afficher ces notifications.
            L'utilisation de la fonctionnalité notification de l'application
            nécessite le consentement préalable de l'utilisateur. Pour cela,
            l'utilisateur doit autoriser l'application "Mystère" à lui envoyer
            des notifications. Cette fonctionnalité peut à tout moment être
            désactivée ou activée dans le Menu de l’application. En autorisant
            les "notifications", l'utilisateur peut recevoir des messages (sous
            forme de texte) à caractère informatif, même si l'application est
            fermée.
          </Text>

          <Text style={styles.heading}>
            Article 4 - Propriété intellectuelle:
          </Text>

          <Text style={styles.paragraph}>
            L’entreprise est propriétaire exclusive des droits intellectuels
            afférents à cette application article L112-2 du code de la propriété
            intellectuelle.{' '}
          </Text>
          <Text style={styles.paragraph}>
            En conséquence, la reproduction, la copie, la diffusion,
            l'enregistrement, la cession, la représentation et l'altération d'un
            des éléments quelconques de l'application sont strictement
            interdits, sauf autorisation express et préalable de l’entreprise.{' '}
          </Text>
          <Text style={styles.paragraph}>
            L'utilisation à des fins commerciales est strictement interdite et
            pourra faire l’objet de poursuites judiciaires. Toute infraction à
            ces dispositions exposerait son auteur à des sanctions civiles et
            pénales.{' '}
          </Text>

          <Text style={styles.heading}>
            Article 5 - Limitations de responsabilité:
          </Text>

          <Text style={styles.paragraph}>
            L’entreprise décline toute responsabilité quant à l’utilisation qui
            pourrait être faite des informations et contenus présents sur
            l’application Mystère, vous êtes seul responsable des dommages et
            préjudices, directs ou indirects, matériels ou immatériels dès lors
            qu'ils auraient pour cause, fondement ou origine un usage de
            l’application par vous-même ou par toute personne autorisée par vous
            à utiliser l’application. Par usage, il convient d'entendre tout
            usage de l’application quel qu'il soit.
          </Text>
          <Text style={styles.paragraph}>
            L’entreprise ne saurait être tenue responsable des risques ou
            conséquences des risques pouvant résulter de la situation ou de
            l’état des lieux recommandés tels que garde-fou, chutes de pierre
            etc... Il appartient à l’utilisateur de se renseigner sur les
            risques et dangers auxquels pourrait l’exposer la situation ou
            l’état des lieux visités.
          </Text>

          <Text style={styles.heading}>Article 6 - Liens et sites tiers:</Text>

          <Text style={styles.paragraph}>
            L’entreprise ne peut garantir la véracité des informations qu’elle
            ne maîtrise pas telles qu’issues de liens hypertextes exploités
            provenant de tiers.
          </Text>
          <Text style={styles.paragraph}>
            L’entreprise ne pourra en aucun cas être tenue pour responsable de
            la disponibilité technique de sites internet ou d’applications
            mobiles exploités par des tiers auxquels l’utilisateur accéderait
            par l’intermédiaire de l’application.
          </Text>
          <Text style={styles.paragraph}>
            L’entreprise n’endosse aucune responsabilité au titre des contenus,
            publicités, produits et/ou services disponibles sur de tels sites et
            applications mobiles tiers dont il est rappelé qu’ils sont régis par
            des conditions d’utilisation qui leurs sont propres.
          </Text>

          <Text style={styles.heading}>
            Article 7 - Durée des services, désinstallation:
          </Text>

          <Text style={styles.paragraph}>
            L’utilisation de la présente application est prévue pour une durée
            indéterminée sans que pour autant l’entreprise puisse en garantir
            une pérennité absolue.{'\n'}
            L’utilisateur peut désinstaller l'application à tout moment.
          </Text>

          <Text style={styles.heading}>
            Article 8 - Loi applicable et attribution de juridiction:
          </Text>

          <Text style={styles.paragraph}>
            Les juridictions compétentes pour statuer sur un litige concernant
            la présente application et ses CGU sont celles déterminées par les
            dispositions du Code de procédure civile français. {'\n'}
            Vous avez également la possibilité de saisir un médiateur de la
            consommation à vos frais dont les coordonnées figurent ci-dessous:
            {'\n'}
            {'\n'}
            Le Groupement des commissaires médiateurs{'\n'}9 rue des Colonnes -
            75002 Paris{'\n'}
            gncm.contact@gmail.com
          </Text>

          <Text style={styles.heading}>Article 9 - Géolocalisation:</Text>

          <Text style={styles.paragraph}>
            Pour être activée, l’application demandera à l’utilisateur de lui
            donner la possibilité de le géolocaliser. Elle ne fonctionnera que
            sous cette condition.
          </Text>
          <Text style={styles.paragraph}>
            L’application tient également compte de l'article L34-1-V du code
            des postes et des communications électroniques.
          </Text>
          <Text style={styles.paragraph}>
            L’utilisateur peut à tout moment et sans aucuns frais désactiver la
            fonction localisation via son terminal.
          </Text>
          <Text style={styles.paragraph}>
            L’entreprise ne conserve aucune information liée à la localisation
            des utilisateurs.
          </Text>
          <Text style={styles.paragraph}>
            L’utilisateur accepte d’utiliser des services tiers de
            géolocalisation externes à l’application. L’entreprise décline toute
            responsabilité quant à la fiabilité des tiers externes choisis.
          </Text>
          <Text style={styles.paragraph}>
            L’utilisateur choisi par ses propres moyens un système de
            géolocalisation fourni par des tiers et régis par leurs propres
            conditions d’utilisation.
          </Text>

          <Text style={styles.heading}>
            Article 10 - Photographies et descriptions:
          </Text>

          <Text style={styles.paragraph}>
            Les photographies et descriptions présentes sur l’application n’ont
            aucun caractère contractuel.
          </Text>

          <Text style={styles.heading}>Article 11 – Cookies:</Text>

          <Text style={styles.paragraph}>
            L'application Mystère n'utilise aucun pixel de site tiers à des fins
            statistiques et de mesures d’audience.
          </Text>

          <Text style={styles.paragraphBold}>
            Ces informations ont été publiées le 17 juillet 2023.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

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
  paragraphBold: {
    marginBottom: 12,
    color: '#FFF',
    fontWeight: 'bold',
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
