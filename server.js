var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

var mydb;

app.post("/api/visitors", function (request, response) {
    debugger;
    var RequestNumber = request.body.RequestNumber;
    var CONumber = request.body.ChangeOrderNumber;
    var Description = request.body.Description;
    var Category = request.body.Category;
    var Status = request.body.Status;
    var Priority = request.body.Priority;
    var Impact = request.body.Impact;
    var ChangeType = request.body.ChangeType;
    var Assignee = request.body.Assignee;
    var OpenDate = request.body.OpenDate;
    var FunctionalTester = request.body.FunctionalTester;
    var recordid = request.body.id;
    var recordRev = request.body.rev;


  if(!mydb) {
    console.log("No database.");
    response.send("Hello " + Description + " " + Description+"!");
    return;
  }
  mydb.insert({
      "RequestNumber": RequestNumber, "CONumber": CONumber, "Description": Description, "Category": Category
      , "Status": Status, "Priority": Priority, "Impact": Impact, "ChnageType": ChangeType, "Assignee": Assignee, "OpenDate": OpenDate, "FunctionalTester": FunctionalTester, "_id": recordid, "_rev":recordRev }, function (err, body, header) {
    if (err) {
      return console.log('[mydb.insert] ', err.message);
    }
    response.send("Hello " + RequestNumber + " " + Description+ "! I added you to the database.");
  });
});

app.put("/api/visitors", function (request, response) {
    debugger;
    var RequestNumber = request.body.RequestNumber;
    var CONumber = request.body.ChangeOrderNumber;
    var Description = request.body.Description;
    var Category = request.body.Category;
    var Status = request.body.Status;
    var Priority = request.body.Priority;
    var Impact = request.body.Impact;
    var ChangeType = request.body.ChangeType;
    var Assignee = request.body.Assignee;
    var OpenDate = request.body.OpenDate;
    var FunctionalTester = request.body.FunctionalTester;
    var recordid = request.body.id;
    var recordRev = request.body.rev;

    var Analysis = request.body.Analysis;
    var DesignDevelopment = request.body.DesignDevelopment;
    var Testing = request.body.Testing;
    var UATSupport = request.body.UATSupport;
    var Training = request.body.Training;
    var Deployment = request.body.Deployment;
    var Remarks = request.body.Remarks;
    var ShortName = request.body.ShortName;
    var SubArea = request.body.SubArea;
    var ResourcePool = request.body.ResourcePool;


    if (!mydb) {
        console.log("No database.");
        response.send("Hello " + Description + " " + Description + "!");
        return;
    }
	if(recordid)
	{
    mydb.insert({
        "RequestNumber": RequestNumber, "CONumber": CONumber, "Description": Description, "Category": Category
        , "Status": Status, "Priority": Priority, "Impact": Impact, "ChnageType": ChangeType, "Assignee": Assignee, "OpenDate": OpenDate, "FunctionalTester": FunctionalTester,
        "Analysis": Analysis, "DesignDevelopment": DesignDevelopment, "Testing": Testing, "UATSupport": UATSupport, "Training": Training, "Deployment": Deployment,
        "Remarks": Remarks, "ShortName": ShortName, "SubArea": SubArea, "ResourcePool": ResourcePool,
        "_id": recordid, "_rev": recordRev
    }, function (err, body, header) {
        if (err) {
            return console.log('[mydb.insert] ', err.message);
        }
        response.send("Hello " + RequestNumber + " " + Description + "! I added you to the database.");
    });
	}
	
	else
	{
	mydb.insert({
        "RequestNumber": RequestNumber, "CONumber": CONumber, "Description": Description, "Category": Category
        , "Status": Status, "Priority": Priority, "Impact": Impact, "ChnageType": ChangeType, "Assignee": Assignee, "OpenDate": OpenDate, "FunctionalTester": FunctionalTester,
        "Analysis": Analysis, "DesignDevelopment": DesignDevelopment, "Testing": Testing, "UATSupport": UATSupport, "Training": Training, "Deployment": Deployment,
        "Remarks": Remarks, "ShortName": ShortName, "SubArea": SubArea, "ResourcePool": ResourcePool
    }, function (err, body, header) {
        if (err) {
            return console.log('[mydb.insert] ', err.message);
        }
        response.send("Hello " + RequestNumber + " " + Description + "! I added you to the database.");
    });
	}
	
});


app.delete("/api/visitors", function (request, response) {
    debugger;
    var recordid = request.body.id;;
    var recordRev = request.body.rev;


    if (!mydb) {
        console.log("No database.");
        response.send("Hello " + Description + " " + Description + "!");
        return;
    }
    //mydb.destroy(recordid, recordRev, function (er, body) {
    //    if (er) console.log('ERROR: %s', er)
    //    else console.log(body)
    //});
    mydb.destroy(recordid, recordRev, function (er, body)  {
        if (er) {
            return console.log(er);
        }
        response.send(body);
    });
});


app.get("/api/visitors", function (request, response) {
	//debugger;
  var names = [];
  if(!mydb) {
    response.json(names);
    return;
  }

  mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
        body.rows.forEach(function (row) {
            console.log(row);
          if (row.doc.RequestNumber)
            names.push(row.doc);
        });
        response.json(names);

    }
  });
});



var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (appEnv.services['cloudantNoSQLDB']) {
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  // Initialize database with credentials
  var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);

  //database name
  var dbName = 'mydb';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
  });

  // Specify the database we are going to use (mydb)...
  mydb = cloudant.db.use(dbName);
}

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));



var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
