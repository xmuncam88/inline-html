require(['N/record', 'N/email', 'N/search'], (record, email, search) => { 
              var customerSearchObj = search.create({
                type: "customer",
                filters: [
                    // Add any necessary filters here
                ],
                columns: [
                    search.createColumn({ name: "entityid", label: "ID" }),
                    search.createColumn({ name: "altname", label: "Name" }),
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
            
            // Fetch the top 10 results
            var results = customerSearchObj.run().getRange({ start: 0, end: 10 });
            var customersArray = [];
            
            results.forEach(function(result) {
                var customerObj = {};
                result.columns.forEach(function(col) {
                    // Use the column label if available; otherwise, use the name
                    var key = col.label || col.name;
                    customerObj[key] = result.getValue(col);
                });
                customersArray.push(customerObj);
            });
            
            // Convert results to JSON
            var jsonResults = JSON.stringify(customersArray);
            log.debug("Customer JSON", jsonResults);

            email.send({
                author: -5,
                recipients: 'xmunftw@gmail.com',
                subject: 'Latest 10 Customers JSON',
                body: jsonResults
            });

            console.log('done')
            console.log(record.load({type: 'salesorder', id: 16479 }))
});
