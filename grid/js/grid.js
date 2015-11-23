 $(document).ready(function() {
     Tabletop.init({
         key: "1OhVbryeHBsPjJ3TjjVFlfM552pDKRjiUpTAXQJe9miA",
         callback: showInfo,
         parseNumbers: true
     });

    $(document).ready(function() {
        $('.table-responsive').doubleScroll();
    });

 });


 var rawData = [];

 function showInfo(data, tabletop) {

     var stateTemplate = Handlebars.compile($("#state-template").html());

     rawData = tabletop.sheets("Census Data").all()
     var allTypes = _.chain(rawData).map(function(row) {
             return row["Type of Data"]
         })
         .unique()
         .value();


     setupDatatypes(allTypes);

     var rows = _.chain(rawData)
         .groupBy("State")
         .map(function(datasets, state) {
             var row = {
                 state: state,
                 state: datasets[0]["State"],
                 stateHref: URI().filename("datasets.html").search({
                     "state": state
                 }).toString(),
                 datasets: []
             }

             _.each(allTypes, function(type) {
                 var foundDataset = _.find(datasets, function(dataset) {
                     return dataset["Type of Data"] === type;
                 })
                 if (foundDataset) {
                     var gridData = {
                         exists: foundDataset["Exists"],
                         digitized: foundDataset["Digitized"],
                         isPublic: foundDataset["Public"], // "public" is reserved in JS
                         free: foundDataset["Free"],
                         online: foundDataset["Online"],
                         machine: foundDataset["Machine readable"],
                         bulk: foundDataset["Available in bulk"],
                         openLicense: foundDataset["No restrictions"],
                         fresh: foundDataset["Up-to-date"],
                         inRepo: foundDataset["In the state repository"],
                         verifiable: foundDataset["Verifiable"],
                         complete: foundDataset["Complete"],
                         grade: foundDataset["Grade"],
                         score: foundDataset["Score"],
                         datasetHref: URI().filename("datasets.html").search({
                             "state": row["state"],
                             "datatype": foundDataset["Type of Data"]
                         })
                     }

                     for(var index in gridData) {
                        if (!gridData[index]) {
                            gridData[index] = "DNE";
                        }
                     }

                     gridData.existsCaption = captions.exists[gridData.exists];
                     gridData.digitizedCaption = captions.digitized[gridData.digitized];
                     gridData.isPublicCaption = captions.isPublic[gridData.isPublic];
                     gridData.freeCaption = captions.free[gridData.free];
                     gridData.onlineCaption = captions.online[gridData.online];
                     gridData.machineCaption = captions.machine[gridData.machine];
                     gridData.bulkCaption = captions.bulk[gridData.bulk];
                     gridData.openLicenseCaption = captions.openLicense[gridData.openLicense];
                     gridData.freshCaption = captions.fresh[gridData.fresh];
                     gridData.inRepoCaption = captions.inRepo[gridData.inRepo];
                     gridData.verifiableCaption = captions.verifiable[gridData.verifiable];
                     gridData.completeCaption = captions.complete[gridData.complete];
                     row["datasets"].push(gridData).toString()
                 } else {
                     row["datasets"].push({
                         exists: "DNE",
                         digitized: "DNE",
                         isPublic: "DNE",
                         free: "DNE",
                         online: "DNE",
                         machine: "DNE",
                         bulk: "DNE",
                         openLicense: "DNE",
                         fresh: "DNE",
                         inRepo: "DNE",
                         verifiable: "DNE",
                         complete: "DNE",
                         datasetHref: "https://github.com/opendata/Open-Data-Census/issues/new?title=Missing+Data:&amp;body=STATE%3A%20%0ADATASET%3A%20%0AURL%3A%20%0A%0ADESCRIPTION%2FCOMMENTS%3A%0A%0A%5BHere%20you%20might%20describe%20the%20quality%20of%20the%20data%2C%20rate%20it%20using%20the%20census%27%20metrics%2C%20suggest%20changes%20to%20an%20existing%20dataset%2C%20etc.%5D"
                     });
                 }
             });
             return row;
         })
         .sortBy("state")
         .each(function(row) {
             var html = stateTemplate(row);
             $("#states").append(html);
         })

     .value();

     $('[data-toggle="tooltip"]').tooltip()
 }




 function setupDatatypes(allTypes) {
     var datatypes = _.chain(allTypes).map(function(type) {
             return {
                 "datatype": type,
                 "datatypeHref": URI().filename(type.replace(/ /g, '') + ".html").toString()
             }
         })
         .unique()
         .value();
     var datasetTemplate = Handlebars.compile($("#dataset-template").html());
     var datasetHtml = datasetTemplate(datatypes);
     $("#datasets").append(datasetHtml);
 }