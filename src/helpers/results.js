export function resultTxt(result){
  var intResult = Math.round(result);
  switch(intResult) {
    case 1:
      return('Nível Emergente: ' + parseFloat(result).toFixed(1));
    case 2:
      return('Nível Básico: ' + parseFloat(result).toFixed(1));
    case 3:
      return('Nível Intermediário: ' + parseFloat(result).toFixed(1));
    case 4:
      return('Nível Avançado: ' + parseFloat(result).toFixed(1));
    default:
      return('');
  }
}
