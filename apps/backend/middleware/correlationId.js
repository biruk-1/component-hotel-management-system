'use strict';
const { randomUUID } = require('crypto');

function correlationId(req, _res, next) {
  const incoming = req.get('x-request-id');
  req.correlationId = incoming && String(incoming).trim().length ? String(incoming).trim() : randomUUID();
  next();
}

module.exports = correlationId;
