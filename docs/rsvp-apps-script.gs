/**
 * RSVP — Casamento Rafael & Vitória (confirmação livre)
 *
 * Qualquer nome digitado no site vira uma linha nova na aba "Convidados":
 *   A: Nome | B: Acompanhantes | C: Status | D: Confirmado em | E: Nome digitado
 * Não confere se o nome já existe na lista.
 */

var SHEET_NAME = 'Convidados';
var SPREADSHEET_ID = '1fbi2s2C-oeUkAud-d_yEfUyx_DfEFWKxrf5mvTIWWOY';
// E-mail que recebe o aviso (troque se quiser outro):
var NOTIFY_EMAIL = Session.getActiveUser().getEmail();

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || '{}');
    var nome = (data.nome || '').toString().trim().replace(/\s+/g, ' ');
    if (!nome) return json_({ ok: false, mensagem: 'Digite seu nome.' });
    if (nome.length > 120) return json_({ ok: false, mensagem: 'Nome muito longo.' });

    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return json_({ ok: false, mensagem: 'Lista indisponível. Avise os noivos.' });

    var agora = new Date();
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet.appendRow([nome, '', 'confirmado', agora, nome]);
    } finally {
      lock.releaseLock();
    }

    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'RSVP confirmado: ' + nome,
        body:
          'Presença confirmada!\n\n' +
          'Nome: ' + nome + '\n' +
          'Quando: ' + Utilities.formatDate(agora, 'America/Bahia', 'dd/MM/yyyy HH:mm') + '\n'
      });
    } catch (mailErr) {
      // confirma mesmo se o e-mail falhar
    }

    return json_({ ok: true, nome: nome, mensagem: '' });
  } catch (err) {
    return json_({ ok: false, mensagem: 'Ops, algo deu errado. Tente de novo.' });
  }
}

function doGet() {
  return ContentService.createTextOutput('RSVP ok').setMimeType(ContentService.MimeType.TEXT);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
