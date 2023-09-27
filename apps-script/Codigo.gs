function onFormSubmite(e) {
  const user_id = e.response.getItemResponses()[0].getResponse();
  const name = e.response.getItemResponses()[1].getResponse();
  const email = e.response.getRespondentEmail();
  const scriptProperties = PropertiesService.getScriptProperties();

  const NOTIFICATION_CHAT_ID = scriptProperties.getProperty('NOTIFICATION_CHAT_ID');
  const API_KEY = scriptProperties.getProperty('API_KEY');
  const CHAT_ID = scriptProperties.getProperty('CHAT_ID');
  const API_URL = scriptProperties.getProperty('API_URL');

  const params = {
    method: "POST",
    contentType: "application/json",
    muteHttpExceptions: true
  };

  const html =
    `Hola ${name}
  \nBinvenid@ al grupo de Telegram Asamblea de académicas y académicos FC.
  \nCódigo de validación: ${user_id}
  \nSaludos.`;

  const valid_email_msg =
    `Hola ${name}
  \nTu usuario ha sido validado correctamente.
  \nCódigo de validación: ${user_id}
  \nSaludos.`;

  const text = encodeURIComponent(email + '\n' + name + '\n' + user_id)

  // Send email
  GmailApp.sendEmail(email, 'Validación de usuario de Telegram', html, {noReply: true});
  // Approve join
  var r = UrlFetchApp.fetch(`${API_URL}/bot${API_KEY}/approveChatJoinRequest?chat_id=${CHAT_ID}&user_id=${user_id}`, params);
  if (r.getResponseCode() == 200) {
    // Send message of approve
    UrlFetchApp.fetch(`${API_URL}/bot${API_KEY}/sendMessage?chat_id=${user_id}&text=${encodeURIComponent(html)}`, params);
  } else if(r.getResponseCode() == 400) {
    UrlFetchApp.fetch(`${API_URL}/bot${API_KEY}/sendMessage?chat_id=${user_id}&text=${encodeURIComponent(valid_email_msg)}`, params);
  }

  // Send notification message
  UrlFetchApp.fetch(`${API_URL}/bot${API_KEY}/sendMessage?chat_id=${NOTIFICATION_CHAT_ID}&text=${text}`, params);
}
