
    function addEvent(el, name, handler) {
        if (typeof window.addEventListener != "undefined") {
            el.addEventListener(name, handler, false);
        }
        else {
            el.attachEvent("on" + name, handler);
        }
    };

    addEvent(window, "load", function () {
        debugger;
        var productRows = document.getElementById("productRows");
        var clonedRow = productRows.getElementsByTagName("tr")[0].cloneNode(true);
        addEvent(document.getElementById("addProductRow"), "click", function () {
            if (productRows.children.length < 6) {
                productRows.appendChild(clonedRow.cloneNode(true));
            }
        });
        addEvent(document.getElementById("removeProductRow"), "click", function () {
            if (productRows.children.length > 1) {
                productRows.children[0].remove();
            }
        });

    });

    var ActiveRecordId = "";
    var ActiveRecordRev = "";
    function exportexcel() {
        $("#tableGrid").table2excel({
            name: "Table2Excel",
            filename: "myFileName",
            fileext: ".xls"
        });
    };


    function exportexcel() {
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('tableGrid');
        var table_html = table_div.outerHTML.replace(/ /g, '%40');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'exported_table_' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
        a.click();
    };


    function myFunction() {
        debugger;
        var RN = document.getElementById('RequestNumber').value;
        var CON = $('#ChangeOrderNumber').val();
        var Desc = $('#Description').val();
        var Category = $('#Category').val();
        var Status = $('#Status').val();
        var Priority = $('#Priority').val();
        var Impact = $('#Impact').val();
        var ChangeType = $('#ChangeType').val();
        var Assignee = $('#Assignee').val();
        var Opendate = $('#Opendate').val();
        var FunctionalTester = $('#FunctionalTester').val();
        var id = ActiveRecordId;
        var rev = ActiveRecordRev;

        if (RN.length > 0) {
            $.ajax({
                method: "PUT",
                url: "./api/visitors",
                contentType: "application/json",
                data: JSON.stringify({ RequestNumber: RN, ChangeOrderNumber: CON, Description: Desc, Category: Category, Status: Status, Priority: Priority, Impact: Impact, ChangeType: ChangeType, Assignee: Assignee, Opendate: Opendate, FunctionalTester: FunctionalTester, id: ActiveRecordId, rev: ActiveRecordRev })
            })
                .done(function (data) {
                    /*$('#response').html(AntiXSS.sanitizeInput(data));
                    $('#response').show();
                    $('#login-form').hide();*/
                    getNames();
                });
        }
    };
    function getNames() {
        debugger;
        $.get("./api/visitors")
            .done(function (data) {
                debugger;

                var tableData = '';
                $("#ibody").empty();
                $("#ibody").html("");
                var string1 = "aaaa";
                tableData = data.map((row) => {

                    var tr = '<tr>';
                    tr += '<td style="display:none;">' + row._id + '</td>';
                    tr += '<td><input type="hidden" name="row_requestId" class="row_requestId" value="' + row._id + '"> <a href="#" onClick="updateRecord(this)">' + row.RequestNumber + '</a></td>';
                    tr += '<td>' + row.CONumber + '</td>';
                    tr += '<td>' + row.Status + '</td>';
                    tr += '<td> <input type="hidden" name="row_requestIdToDelete" class="row_requestIdToDelete" value="' + row._id + '"> <input type= "hidden" name= "row_requestRevToDelete" class="row_requestRevToDelete" value= "' + row._rev + '" > <input type="hidden" name="row_requestNumberToDelete" class="row_requestNumberToDelete" value="' + row.RequestNumber + '"> <input type="button"  value="Delete" onclick="deleteRow(this)"> </td>';

                    tr += '<td>' + row.Description + '</td>';
                    tr += '<td>' + row.Track + '</td>';
                    tr += '<td>' + row.Category + '</td>';

                    tr += '<td>' + row.Priority + '</td>';
                    tr += '<td>' + row.Impact + '</td>';
                    tr += '<td>' + row.ChangeType + '</td>';

                    tr += '<td>' + row.Assignee + '</td>';
                    tr += '<td>' + row.OpenDate + '</td>';
                    tr += '<td>' + row.FunctionalTester + '</td>';


                    tr += '</tr>';
                    return tr;

                })

                $('#ibody').append(tableData);
                // alert(data); // show response from the php script.
            });
    };

    function updateRecord(e) {
        debugger;
        var id = $(e).parent().find('.row_requestId').val();

        $.get("./api/visitors")
            .done(function (data) {
                debugger;
                var filteredJsonOnRequestNumber = data.filter(function (row) {
                    if (row._id.toLowerCase().includes(id.toLowerCase())) {
                        return true
                    } else {
                        return false;
                    }
                });
                ActiveRecordId = id;
                ActiveRecordRev = filteredJsonOnRequestNumber[0]._rev;
                $('#ChangeOrderNumber').val(filteredJsonOnRequestNumber[0].CONumber);
                $('#RequestNumber').val(filteredJsonOnRequestNumber[0].RequestNumber);
                $('#Category').val(filteredJsonOnRequestNumber[0].Category)

            });

    }

    function deleteRow(e) {
        debugger;
        //alert("delete button clicked");
        var id = $(e).parent().find('.row_requestIdToDelete').val();
        var deleteRev = $(e).parent().find('.row_requestRevToDelete').val();
        var requestNumber = $(e).parent().find('.row_requestNumberToDelete').val();
        //alert(requestNumber + deleteRev);
        var answer = confirm("Do you really want to delete request " + requestNumber);

        if (answer) {

            if (id.length > 0) {
                $.ajax({
                    method: "DELETE",
                    url: "./api/visitors",
                    contentType: "application/json",
                    data: JSON.stringify({ id: id, rev: deleteRev })
                })
                    .done(function (data) {
                        debugger;
                        //alert("page refresh")
                        getNames();
                    });
            }
        }
        else { }
    }


    function SearchGridNames() {

        debugger;
        $.get("./api/visitors")
            .done(function (data) {
                debugger;
                var filteredJson = data.filter(function (row) {
                    if (row.RequestNumber.toLowerCase().includes($('#SearchBox').val().toLowerCase()) || row.CONumber.toLowerCase().includes($('#SearchBox').val().toLowerCase())
                        || row.Status.toLowerCase().includes($('#SearchBox').val().toLowerCase())
                        || row.Category.toLowerCase().includes($('#SearchBox').val().toLowerCase()) || row.Impact.toLowerCase().includes($('#SearchBox').val().toLowerCase())
                        || row.ChangeType.toLowerCase().includes($('#SearchBox').val().toLowerCase()) || row.Assignee.toLowerCase().includes($('#SearchBox').val().toLowerCase())
                        || row.OpenDate.toLowerCase().includes($('#SearchBox').val().toLowerCase()) || row.FunctionalTester.toLowerCase().includes($('#SearchBox').val().toLowerCase())
                        || row.Track.toLowerCase().includes($('#SearchBox').val().toLowerCase())
                    ) {
                        return true
                    } else {
                        return false;
                    }
                });


                var tableData = '';
                $("#ibody").empty();
                $("#ibody").html("");
                tableData = filteredJson.map((row) => {


                    var tr = '<tr>';
                    tr += '<td>' + row._id + '</td>';
                    tr += '<td><input type="hidden" name="row_requestNumber" class="row_requestNumber" value="' + row._id + '"> <a href="#" onClick="updateRecord(this)">' + row.RequestNumber + '</a></td>';
                    tr += '<td>' + row.CONumber + '</td>';
                    tr += '<td>' + row.Status + '</td>';

                    tr += '<td>' + row.Description + '</td>';
                    tr += '<td>' + row.Track + '</td>';
                    tr += '<td>' + row.Category + '</td>';

                    tr += '<td>' + row.Priority + '</td>';
                    tr += '<td>' + row.Impact + '</td>';
                    tr += '<td>' + row.ChangeType + '</td>';

                    tr += '<td>' + row.Assignee + '</td>';
                    tr += '<td>' + row.OpenDate + '</td>';
                    tr += '<td>' + row.FunctionalTester + '</td>';
                    tr += '</tr>';
                    return tr;


                })

                $('#ibody').append(tableData);
            })
    };

getNames();