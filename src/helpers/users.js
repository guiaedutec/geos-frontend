export function isAdminCountry(user = {}) {
  return user._profile === "admin_country";
}

export function isAdmin(user = {}) {
  return (
    user._profile === "admin" ||
    user._profile === "admin_state" ||
    user._profile === "monitor_state" ||
    user._profile === "monitor_state_regional" ||
    user._profile === "admin_city" ||
    user._profile === "monitor_city" ||
    user._profile === "monitor_city_regional"
  );
}

export function isStateAdmin(user = {}) {
  return (
    user._profile === "admin_state" ||
    user._profile === "monitor_state" ||
    user._profile === "monitor_state_regional"
  );
}

export function isCityAdmin(user = {}) {
  return (
    user._profile === "admin_city" ||
    user._profile === "monitor_city" ||
    user._profile === "monitor_city_regional"
  );
}

export function isMonitor(user = {}) {
  return (
    user._profile === "monitor_state" ||
    user._profile === "monitor_state_regional" ||
    user._profile === "monitor_city" ||
    user._profile === "monitor_city_regional"
  );
}

export function isAdminVisitor(user = {}) {
  return user._profile === "admin_visitor";
}

export function isAdminStateCity(user = {}) {
  return user._profile === "admin_state" || user._profile === "admin_city";
}

export function isDirector(user = {}) {
  return user._profile === "principal";
}

export function isDirectorOrTeacher(user = {}) {
  return user._profile === "principal" || user._profile === "teacher";
}

export function isTeacher(user = {}) {
  return user._profile === "teacher";
}

export function isOther(user = {}) {
  return user._profile === "other";
}

export function isHaveSchoolInUser(user = {}) {
  let haveSchool = false;
  if (user.school_id) {
    haveSchool = true;
  }
  return haveSchool;
}

export function isHaveCityInUser(user = {}) {
  let haveCity = false;

  if (user._profile === "admin_city" && user.city_id) {
    haveCity = true;
  }
  if (user._profile === "admin_state") {
    haveCity = true;
  }

  return haveCity;
}

export function isAdminUser(user = {}) {
  return user._profile === "admin";
}

export function hasMainPanel(user = {}) {
  return (
    (user.institution_id !== null &&
      (isAdminStateCity(user) || isMonitor(user))) ||
    isAdminUser(user)
  );
}

export function diagnosisSchoolMenu(user = {}) {
  var page = window.location.href.substring(
    window.location.href.lastIndexOf("/")
  );
  var pages = [
    "/diagnostico-escola",
    "/criar-escola",
    "/customizar-devolutiva",
    "/criar-contato",
    "/listar-contatos",
    "/criar-conta",
    "/spreadsheet_school",
    "/listar-atividades",
    "/editar-footer-feedback",
    "/spreadsheet_manager",
    "/acompanhamento-respostas",
    "/resultado",
    "/resultado-detalhes",
  ];
  {
    !isMonitor(user)
      ? pages.push(
          "/listar-escolas",
          "/criar-pergunta",
          "/listar-devolutiva",
          "/listar-tecnicos",
          "/periodo-questionario"
        )
      : null;
  }
  return (
    (isAdminStateCity(user) || isMonitor(user)) && pages.indexOf(page) >= 0
  );
}

export function diagnosisTeacherMenu(user = {}) {
  var splited = window.location.href.split("/");
  var page = "/" + splited[splited.length - 1];
  var pages = ["/mapeamento-professor", "/divulgacao", "/resultados"];
  {
    !isMonitor(user) ? pages.push("/frequencia") : null;
  }
  return (
    (isAdminStateCity(user) || isMonitor(user)) &&
    pages.indexOf(page) >= 0 &&
    splited.indexOf("mapeamento-professor") >= 0
  );
}

export function redirectDefaultPageByUser(user = {}) {
  var url = "/";
  if (
    isAdmin(user) ||
    isMonitor(user) ||
    isAdminVisitor(user) ||
    isAdminCountry(user)
  ) {
    url = "/painel";
  } else {
    if (isDirectorOrTeacher(user)) {
      url = "/recursos";
    }
  }
  //console.log('url: ', url);
  return url;
}
