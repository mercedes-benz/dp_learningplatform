const errors = {
  "[jwt_auth] invalid_username": "Bitte prüfen Sie Ihre Zugangsdaten.",
  "[jwt_auth] incorrect_password": "Bitte prüfen Sie Ihre Zugangsdaten.",
  "[jwt_auth] empty_password": "Bitte geben Sie Ihr Passwort ein.",
  "[jwt_auth] empty_username": "Bitte geben Sie Ihren Benutzernamen ein.",
  "[dps] access to library article not granted: you are not allowed to view this article": "Sie haben nicht die nötigen Berechtigungen, um diesen Artikel zu lesen.",
  "[dps] access to subcategory not granted: you are not allowed to view this subcategory": "Sie haben nicht die nötigen Berechtigungen, um auf dieses Unterkategorie zuzugreifen.",
  "[dps] access to academy article not granted: you are not allowed to view this article": "Sie haben nicht die nötigen Berechtigungen, um diesen Artikel zu lesen.",
  "[dps] access to module not granted: you are not allowed to view this module": "Sie haben nicht die nötigen Berechtigungen, um auf dieses Modul zuzugreifen.",
  "[dps] module does not exist: the requested module does not exist": "Das angeforderte Modul existiert nicht.",
  "[dps] page not found: the requested page does not exist": "Die angeforderte Seite existiert nicht.",
  "[dps] authentification required: you must be authenticated to view or request this page": "Sie müssen angemeldet sein, um diese Seite zu sehen.",
  "[dps] library article does not exist: the requested article does not exist": "Der angeforderte Artikel existiert nicht.",
  "[dps] comment_duplicate: Doppelter Kommentar wurde entdeckt. Es sieht stark danach aus, dass du das schon einmal geschrieben hast!": "Das haben Sie bereits kommentiert.",
  "[dps] comment_flood: Du schreibst die Kommentare zu schnell. Bitte etwas langsamer.": "Bitte lassen Sie etwas Zeit zwischen den Kommentaren."
}

export default (e) => {
  console.log(e);

  if (typeof errors[e.message] !== "undefined") return errors[e.message]
  else return e.message
}
