/**
 * @file
 *
 * Contains help texts for modal windows in hejmdal
 */

/**
 *
 * @type {{login: {title: string, content: *[]}}}
 */

/* eslint-disable max-len */
const helpTexts = {
  cookies: {
    title: 'Cookies, formål og relevans',
    sections: [
      {
        texts: ['Vi benytter cookies til at gemme information om dine logins.']
      },
      {
        header: 'Valgte biblioteker',
        texts: [
          'Vi gemmer information om, hvilke biblioteker, der har været brugt ved login på denne computer, telefon, tablet osv. ' +
            'Det gør vi for at kunne tilbyde dig en liste over tidligere benyttede biblioteker, når du efterfølgende logger ind. ' +
            'Dermed kan vi give dig mulighed for et hurtigere login.'
        ]
      },
      {
        header: 'Login',
        texts: [
          'Vi gemmer information om, at du er logget ind og hvilket bibliotek, du er logget ind ved, således at du ikke skal logge ind mere end én gang. ' +
            'Denne information fjernes, når du enten logger ud eller lukker browseren.'
        ]
      },
      {
        header: 'Slå cookies fra i browseren ',
        texts: [
          'Bibliotekslogin virker ikke uden cookies. Du kan have ændret indstillingerne i din browser, så du ikke accepterer cookies. ' +
            'I så fald vil du få en fejlside, når du forsøger at benytte Bibliotekslogin.'
        ]
      },
      {
        texts: [
          'Alle browsere tillader, at du sletter dine cookies. Hvis du gør det, mens du er logget ind, kan du derfor også opleve fejl på siden.'
        ]
      },
      {
        header: 'Cookies hos andre hjemmesider',
        texts: [
          'Bibliotekslogin benytter ikke andre tjenester, der anvender cookies hos brugeren.'
        ]
      }
    ]
  },
  privacyPolicy: {
    title: 'Om vores brug af personoplysninger',
    sections: [
      {
        texts: [
          'Når du anvender dette login, bliver dine personoplysninger behandlet af det offentligt ejede aktieselskab, Dansk BiblioteksCenter (DBC). De bekræfter din identitet med et unikt brugernummer, som er tilfældigt og knyttet til dine login-oplysninger.',
          'Læs mere om behandlingen af dine personoplysninger og dine rettigheder nedenfor.'
        ]
      },
      {
        header: 'Formål med behandlingen',
        texts: [
          'Formålet med behandlingen er, at du skal have sikker adgang til de digitale folkebiblioteksløsninger og de muligheder, de tilbyder (reservation, lån mm.).'
        ]
      },
      {
        header: 'Hvilke oplysninger behandler vi',
        texts: [
          'Når du logger ind, behandler vi oplysningerne fra dit login, dit CPR-nummer, information om bopælskommune samt information om, hvilke biblioteker du er oprettet som låner på.',
          'Dit CPR henter vi fra dit login. Din hjemkommune henter vi via dit lokale bibliotek.'
        ]
      },
      {
        header: 'Hvem behandler dine personoplysninger?',
        texts: [
          'Dine oplysninger behandles af Dansk BiblioteksCenter, DBC på vegne af de danske folkebiblioteker. Det er de danske folkebiblioteker, som er dataansvarlige, og DBC som er databehandlere.',
          'KOMBIT kan kontaktes på vegne af de danske folkebiblioteker i forbindelse med spørgsmål til behandlingen (se nedenfor).'
        ]
      },
      {
        header: 'Retsgrundlag for behandling af dine personoplysninger',
        texts: [
          'Retsgrundlaget for behandlingen af personoplysningerne i login-funktionen er databeskyttelsesforordningens artikel 6, stk. 1, litra e om behandlinger, der er nødvendig af hensyn til udførelse af en opgave i samfundets interesse.'
        ]
      },
      {
        header: 'Dine rettigheder',
        texts: [
          'Det er Folkebibliotekerne i de enkelte kommuner, der er dataansvarlig for behandlingen af dine oplysninger. Du har altid mulighed for at kontakte dit folkebibliotek om indsigt i behandlingen af dine personoplysninger. Du kan anmode om berigtigelse eller sletning af dine personoplysninger samt om begrænsning af behandlingen af personoplysningerne. Du kan til enhver tid gøre indsigelse mod folkebiblioteket i din kommunes behandling af dine personoplysninger i forbindelse login-funktionen af grunde, der vedrører din særlige situation.'
        ]
      },
      {
        header: 'Kontakt om behandling af personoplysninger',
        texts: [
          'Har du spørgsmål til behandling af dine personoplysninger, kan du henvende dig til dit folkebibliotek.'
        ]
      },
      {
        header: 'Klagemulighed',
        texts: [
          'Hvis du ønsker at klage over behandlingen af dine personoplysninger, skal dette ske til Datatilsynet.'
        ]
      },
      {
        texts: [
          'Datatilsynets kontaktoplysninger er:',
          '<br>',
          'Datatilsynet',
          'Borgergade 28, 5',
          '1300 København K',
          'Telefon: 33 19 32 00'
        ]
      }
    ]
  },
  newUser: {
    title: 'Ny bruger',
    sections: [
      {
        header: '',
        texts: [
          'Du kan oprette dig online som bruger på dit lokale bibliotek med MitID. Vælg dit lokale bibliotek for at komme direkte til siden for brugeroprettelse.'
        ]
      }
    ]
  },
  login_borchk: {
    title: 'Hjælp til login',
    sections: [
      {
        header: 'Bibliotek',
        texts: [
          'Feltet Bibliotek er ofte valgt på forhånd, så du ikke kan ændre det. Hvis ikke, skal du finde dit bibliotek ved at søge på kommune, biblioteket ligger i eller ved at vælge et bibliotek fra listen. Vælg et bibliotek, hvor du er registreret som låner.'
        ]
      },
      {
        header: 'CPR- og lånernummer',
        texts: [
          'Du skal være oprettet som bruger på biblioteket for at kunne logge ind. Du kan skrive dit CPR- eller lånernummer i feltet. Dit lånernummer står på det lånerkort, du har fået udleveret på biblioteket, da du blev oprettet. Hvis du ikke er oprettet som låner, kan du se hvordan på bibliotekets hjemmeside eller oprette dig direkte ved at trykke på ’Opret bruger’ ved siden af log ind-knappen.'
        ]
      },
      {
        header: 'Pinkode',
        texts: [
          'Pinkoden er den kode, som du bruger, når du låner på biblioteket. Hvis du ikke kan huske din kode, kan du henvende dig på det bibliotek, hvor du er oprettet som låner. Alternativt kan du logge ind på dit lokale folkebibliotek med MitID og oprette en ny pinkode under brugerprofil.'
        ]
      }
    ]
  },
  login_nemlogin: {
    title: 'Hjælp til login med MitID',
    sections: [
      {
        header: 'MitID',
        texts: [
          'Vælg MitID, hvis du vil logge ind ved hjælp af MitID med brug af dit nøglekort. Du vil blive viderestillet til MitID. Når du er logget ind der, bliver du stillet tilbage til den side, du var ved at logge ind på.'
        ]
      }
    ]
  },
  login_unilogin: {
    title: 'Hjælp til login med UNI•Login',
    sections: [
      {
        header: 'UNI•Login',
        texts: [
          'Vælg UNI•Login, hvis du vil logge ind ved hjælp af dit UNI•Login.',
          'Du vil blive viderestillet til UNI•Login. ' +
            'Når du er logget ind der, bliver du stillet tilbage til Bibliotekslogin og vil være logget ind med både Bibliotekslogin og UNI•Login',
          'Du kan herefter bruge andre sider, der benytter Bibliotekslogin eller UNI•Login, uden at skulle logge ind igen.'
        ]
      }
    ]
  },
  login_wayf: {
    title: 'Hjælp til login med WAYF',
    sections: [
      {
        header: 'WAYF',
        texts: [
          'Vælg WAYF, hvis du vil logge ind ved hjælp af WAYF Single Sign-On.',
          'Du vil blive viderestillet til WAYF. ' +
            'Når du er logget ind der, bliver du stillet tilbage til Bibliotekslogin og vil være logget ind med både Bibliotekslogin og WAYF Single Sign-On.',
          'Du kan herefter bruge andre sider, der benytter Bibliotekslogin eller WAYF, uden at skulle logge ind igen.'
        ]
      }
    ]
  },
  login_customerService: {
    title: 'Kontakt kundeservice',
    sections: [
      {
        header: 'Kundeservice',
        texts: [
          'Oplever du fejl i forbindelse med login, kan du kontakte kundeservice.dbc.dk'
        ]
      }
    ]
  },
  default: {
    title: 'Cannot find helptext ',
    sections: []
  }
};
/* eslint-enable max-len */

/**
 * Creates the help text object from a list of keys (helpNames)
 *
 * Note that the help object is build using the sequence in helpTexts and not in helpNames
 *
 * @param helpNames {Array}
 * @param placeHolders {Array}
 * @param prefix {string}
 * @returns {boolean}
 */
export function getText(helpNames, placeHolders = false, prefix = '') {
  let helpObj = false;
  Object.keys(helpTexts).forEach(key => {
    if (helpNames.indexOf(key.replace(prefix, '')) !== -1) {
      if (helpObj) {
        helpObj.sections = helpObj.sections.concat(helpTexts[key].sections);
      } else {
        helpObj = Object.assign({}, helpTexts[key]);
      }
    }
  });

  if (placeHolders) {
    let helpstr = JSON.stringify(helpObj);
    if (placeHolders) {
      Object.keys(placeHolders).forEach(key => {
        helpstr = helpstr.replace(new RegExp(key, 'g'), placeHolders[key]);
      });
    }
    helpObj = JSON.parse(helpstr);
  }
  return helpObj;
}

/**
 * Set replacers for helpTexts if agency is defines. Defaults to empty strings
 *
 * @param agency {object}
 * @returns {string}
 */
export function setLoginReplacersFromAgency(agency) {
  const loginHelpReplacers = {
    __CREATE_LIBRARY_USER__:
      'Hvis du ikke er oprettet som låner, kan du se hvordan på bibliotekets hjemmeside.',
    __FORGOT_CODE_CONTACT_LIBRARY__: ''
  };
  if (agency) {
    if (agency.registrationFormUrl) {
      loginHelpReplacers.__CREATE_LIBRARY_USER__ =
        '<a href=\\"' +
        agency.registrationFormUrl +
        '\\">' +
        (agency.registrationFormUrlText
          ? agency.registrationFormUrlText
          : 'Opret dig som låner på ' + agency.agencyName) +
        '</a>';
    }
    if (agency.branchEmail) {
      loginHelpReplacers.__FORGOT_CODE_CONTACT_LIBRARY__ =
        '<a href=\\"mailto:' +
        escape(agency.branchEmail) +
        '\\">Kontakt biblioteket</a>';
    }
  }
  return loginHelpReplacers;
}
