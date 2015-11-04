 $(document).ready(function() {
     Tabletop.init({
         key: "1OhVbryeHBsPjJ3TjjVFlfM552pDKRjiUpTAXQJe9miA",
         callback: showInfo,
         parseNumbers: true
     });
 });



 var allRows = [];

 function showInfo(data, tabletop) {
     allRows = _.sortBy(tabletop.sheets("Completed Detailed Data").all(), "Department");

     var uri = new URI();
     var params = uri.search(true);

     if (params) {
         var filters = [];
         filters.push(buildDepartmentFilter(params["department"]));
         filters.push(buildDatatypeFilter(params["datatype"]));
         updateCards(allRows, _.compact(filters));
     } else {
         updateCards(allRows);
     }
 }

 function updateCards(rows, filters) {
     var filters = filters || [];
     var source = $("#card-template").html();
     var template = Handlebars.compile(source);

     _.chain(rows)
         .filter(function(row) {
                 return _.all(filters, function(filter) {
                     return filter(row);
                 });
        })
         .map(function(row) {

            row.online = row["Available online"];
            row.machine = row["Machine readable"];
            row.bulk = row["Available in bulk"];
            row.fresh = row["Up-to-date"];
                 

             row.onlineCaption = captions.online[row.online];
             row.machineCaption = captions.machine[row.machine];
             row.bulkCaption = captions.bulk[row.bulk];
             row.freshCaption = captions.fresh[row.fresh];

             var html = template(row);
            $("#cards").append(html);
            $('[data-toggle="tooltip"]').tooltip();  
        });
 }




 function buildDepartmentFilter(department) {
     if (!department) {
         return false;
     }
     return function(row) {
         return row["Department"] === department;
     }
 }

 function buildDatatypeFilter(datatype) {
     if (!datatype) {
         return false;
     }
     return function(row) {
         return row["Type of Data"] === datatype;
     }
 }

 function clearCards() {
     $("#cards").empty();
 }

 function filterByDepartment(department) {
     clearCards();
     updateCards(allRows, [buildDepartmentFilter(department)]);
 }

 function resetSearch() {
     clearCards();
     updateCards(allRows);
 }

 function filterByDatatype(datatype) {
     clearCards();
     updateCards(allRows, [buildDatatypeFilter(datatype)]);
 }

 function filterByMachineReadable(machineReadable) {
     clearCards();
     updateCards(_.filter(allRows, function(row) {
         return machineReadable ? row["Machine readable"] === "Yes" : row["Machine readable"] === "No";
     }))
 }