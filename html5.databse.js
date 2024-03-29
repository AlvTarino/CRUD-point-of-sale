    // Create database 
    var mywebdb = openDatabase('websql_db', '1.0', 'db example', 2 * 1024 * 1024);
    createTable();  // It will create tables.
    showSavedUserDetails(); // It will show saved records.

    // Create table
    function createTable() 
    { 
        mywebdb.transaction(function(tx) 
        {
            tx.executeSql("CREATE TABLE IF NOT EXISTS user_details (user_id INTEGER PRIMARY KEY AUTOINCREMENT, product_name TEXT, product_Quantity INT, product_type TEXT, unit_Cost INT, total_Cost INT)", []);
        });
    }

    // Insert user details.
    function saveUserDetails()
    {
        var pname = $.trim($("#pname").val()); //document.getElementById
        var pQuantity = $.trim($("#pQuantity").val());
		var ptype = $.trim($("#ptype").val()); //document.getElementById
        var uCost = $.trim($("#uCost").val());
		var totalCost = $.trim($("#totalCost").val());
		
        if(pname == '')
        {
          alert("Please enter product name."); 
          $("#pname").focus(); return false; 
        }
		if(pQuantity == '')
        {
          alert("Please enter the Product Quantity."); 
          $("#pQuantity").focus(); return false; 
        }
		if(ptype == '')
        {
          alert("Please enter the type of Product."); 
          $("#name").focus(); return false; 
        }
		if(uCost == '')
        {
          alert("Please enter the unit cost."); 
          $("#uCost").focus(); return false; 
        }
        
        if(pname !=''&& pQuantity!=''&& ptype !=''&& uCost!='')
        {
            mywebdb.transaction(function (tx) 
            {
                tx.executeSql("INSERT INTO user_details (product_name, product_Quantity, product_type, unit_Cost, total_Cost) VALUES (?, ?, ?, ?, ?);", 
                [pname, pQuantity, ptype, uCost, totalCost],showSavedUserDetails(), onError);
            });
        }

    }

    // Select user details.
    function showSavedUserDetails()
    {
       //document.forms['add_form'].reset();
       var show_data_append = '';
       mywebdb.transaction(function (tx) 
       {
              tx.executeSql('SELECT user_id, pname, pQuantity, ptype, uCost, totalCost FROM user_details', [], function (tx, results) 
              {
                   var total_rec = results.rows.length;
                   //alert("Total record  =  " +total_rec);
                   var header_ui = '<thead><tr style="border: 1px solid black;">'     
                                 +'<th style="padding:8px;border: 1px solid black;width:30%;" >Name</th>'
                                 +'<th style="padding:8px;border: 1px solid black;width:30%;"  >Email</th>'
                                 +'<th style="padding:8px;border: 1px solid black;width:40%;" >Action&nbsp;&nbsp;<button type="button" class="btn btn-danger" onclick="dropTables();" style="cursor:pointer;"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;Drop Table</button></th>'
                                 +'</tr></thead>';

                   if(total_rec >= 1)             
                   {
                       for (i = 0; i < total_rec; i++)
                       {
                         var record_data =  results.rows.item(i);
                         show_data_append += '<tr style="border: 1px solid black;" >' 
                            + '<td style="padding:8px;border: 1px solid black;" >' + record_data.name + '</td>' 
                            + '<td style="padding:8px;border: 1px solid black;" >' + record_data.email + '</td>' 
                            + '<td style="padding:8px;border: 1px solid black;" >'

                            + '<button type="button" class="btn btn-danger" onclick="deleteUserRecord('+ record_data.user_id + ');"  id="save_record_div" style="cursor:pointer;"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;Delete</button>'
                            + '&nbsp;&nbsp;<button type="button" class="btn btn-info" onclick="editUserRecord('+ record_data.user_id + ');"  id="save_record_div" style="cursor:pointer;"><span class="glyphicon glyphicon-pencil"></span>&nbsp;&nbsp;Edit</button>'
                            + '</tr>';
                       }
                   }
                   else
                   {
                        show_data_append += '<tr style="border: 1px solid black;" ><td style="padding:8px;border: 1px solid black; text-align:center;" colspan="3"> No record found !</td></tr>';
                   }

                   var footer_ui = '</table>';
                   var complete_ui = header_ui+show_data_append+footer_ui;
                   $("#save_record_div").show();
                   $("#update_record_div").hide();
                   $("#show_edit_part").html(complete_ui);
             }, null);

      });

    }

    // Edit user details.
    function editUserRecord(user_id)
    {
        mywebdb.transaction(function (tx) 
        {
              tx.executeSql('SELECT user_id, pname, pQuantity, ptype, uCost, totalCost FROM user_details WHERE user_id = "'+ user_id+ '"', [], function (tx, results) 
              {
                    var record_data =  results.rows.item(0);
                    $("#save_record_div").hide();
                    $("#update_record_div").show();
                    $("#edit_user_id").val(record_data.user_id);
                    $("#pname").val(record_data.pname);
                    $("#pQunatity").val(record_data.pQunatity);
					$("#ptype").val(record_data.ptype);
                    $("#uCost").val(record_data.uCost);
					$("#totalCost").val(record_data.totalCost);
              }, null);
        });
    }

    // Update user details.
    function updateUserDetails() 
    {

        var pname = $.trim($("#pname").val()); //document.getElementById
        var pQuantity = $.trim($("#pQuantity").val());
		var ptype = $.trim($("#ptype").val()); //document.getElementById
        var uCost = $.trim($("#uCost").val());
		var totalCost = $.trim($("#totalCost").val());
        var update_user_id = $.trim($("#edit_user_id").val());

         if(pname == '')
        {
          alert("Please enter product name."); 
          $("#pname").focus(); return false; 
        }
		if(pQuantity == '')
        {
          alert("Please enter the Product Quantity."); 
          $("#pQuantity").focus(); return false; 
        }
		if(ptype == '')
        {
          alert("Please enter the type of Product."); 
          $("#name").focus(); return false; 
        }
		if(uCost == '')
        {
          alert("Please enter the unit cost."); 
          $("#uCost").focus(); return false; 
        }
        
        if(pname !=''&& pQuantity!=''&& ptype !=''&& uCost!='')
        {
            mywebdb.transaction(function(tx) 
            {
                tx.executeSql("UPDATE user_details SET name = ?, email = ? WHERE user_id = ?", 
                [name_val,email_val, update_user_id],showSavedUserDetails(), onError);
            }); 
        }
    }

    // Delete user details.
    function deleteUserRecord(delete_user_id) 
    { 
        var do_it = confirm("Do you really want to delete this record ? ");
        if (do_it) 
        {
            mywebdb.transaction(function(tx) 
            {
                 tx.executeSql('DELETE FROM user_details WHERE user_id = "'+delete_user_id+'" ');
            });

            showSavedUserDetails();
        }
    }

    // It will show query error if something is wrong with query.
    function onError(tx, error) 
    {
      alert(error.message);
      //$('#SyncProgress').html(error.message).css("color","red");
    }

    // drop tables.
    function dropTables() 
    {
       mywebdb.transaction(function(tx) 
       {
          tx.executeSql("DROP TABLE user_details", []); 
       });

    }