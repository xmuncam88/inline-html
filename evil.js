let rmm;
require(['N/record'], (rec) => { 
  const soId = rec.load({ type: 'salesorder', id: '16479' })
  log.debug('soid', soid)
});
