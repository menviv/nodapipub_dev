// DOM Ready =============================================================

var ListData = [];

var BillDay = moment().date();

var BillDateGroup;
    
    if (BillDay<5) {
        
        BillDateGroup="1";
        
    } else if (BillDay>4 && BillDay<8) {
        
        BillDateGroup="5";
        
    } else if (BillDay>7 && BillDay<11) {
        
        BillDateGroup="7";
        
    } else if (BillDay>10 && BillDay<13) {
        
        BillDateGroup="10";
        
    } else if (BillDay>12 && BillDay<16) {
        
        BillDateGroup="12";
        
    } else if (BillDay>15 && BillDay<20) {
       
       BillDateGroup="15"; 
        
    } else if (BillDay>19 && BillDay<25) {
        
        BillDateGroup="20";
        
    } else if (BillDay>24 && BillDay<26) {
        
        BillDateGroup="25";
        
    } else if (BillDay>26 && BillDay<31) {
        
        BillDateGroup="27";
        
    }

$(document).ready(function() {

    Login();
    
    LoadCurrentSettings(); 
    
    // Save Settings on button click
    $('#btnSaveSettings').on('click', SaveSettings); 

    // Perfom Login on button click
    $('#btnLogin').on('click', Login); 

    // open Reoccuring Builder on button click
    $('#openReoccuringBuilder').on('click', openReoccuringBuilder);  
    
    $('#closeReoccuringBuilder').on('click', closeReoccuringBuilder);  
    
    $('#openReoccuringList').on('click', getReoccuringList);  
   
    $('#closeReoccuringList').on('click', closeReoccuringList); 

});

// Functions =============================================================

// Open Reoccuring Builder

function openReoccuringBuilder(event) {
    
    $( "#Shading" ).fadeIn( "fast" );
    
    $( "#ReoccuringBuilder" ).fadeIn( "slow" );     
    
}


function closeReoccuringBuilder(event) {
    
    $( "#ReoccuringBuilder" ).fadeOut( "slow" );   
    
    $( "#Shading" ).fadeOut( "fast" );  
    
}


function closeReoccuringList(event) {
    
    $( "#Reoccuring" ).fadeOut( "slow" );  
        
    $( "#manage" ).fadeIn( "slow" );  
    
    $( "#Shading" ).fadeOut( "fast" ); 
    
}




// Add Settings
function SaveSettings(event) {
        
        var ObjID = $("#inputID").val();
        var Terminal = $("#inputTerminal").val();
        var UserName = $("#inputUserName").val();
        var LowProFileURL = $("#inputLowProFileURL").val();
        var AsimonURL = $("#inputAsimonURL").val();
        
        var Operation = $("#inputOperation").val();
        var DocTypeToCreate = $("#inputDocTypeToCreate").val();
        var ShowCardOwnerPhone = $("#inputShowCardOwnerPhone").val();
        var ShowCardOwnerEmail = $("#inputShowCardOwnerEmail").val();
        
        var SFDCLoginUser = $("#inputSFDCLoginUser").val();
        var SFDCLoginPass_Token = $("#inputSFDCLoginPass_Token").val();
        var SFDCEnvironmentURL = $("#inputSFDCEnvironmentURL").val();
        
        var Attempts = $("#inputAttempts").val();

        
        var SettingsObj = $.parseJSON(Terminal);
        
        var SettingsObj = {
            '_id': ObjID,
            'Terminal': Terminal,
            'UserName': UserName,
            'LowProFileURL': LowProFileURL,
            'AsimonURL': AsimonURL,
            'Operation': Operation,
            'DocTypeToCreate': DocTypeToCreate,
            'ShowCardOwnerPhone': ShowCardOwnerPhone,
            'ShowCardOwnerEmail': ShowCardOwnerEmail,
            'SFDCLoginUser': SFDCLoginUser,
            'SFDCLoginPass_Token': SFDCLoginPass_Token,
            'SFDCEnvironmentURL': SFDCEnvironmentURL,
            'Attempts': Attempts
        }        

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: SettingsObj,
            url: '/anno/changeSettings',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response) {

                LoadCurrentSettings();
                
                $("#status").html("Saved...");
                

            } else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });


};
    
    


// populate Current Settings on Page ready
function LoadCurrentSettings(event) {

    // jQuery AJAX call for JSON
    $.getJSON( '/anno/getSettings', function( data ) {
        
        console.log("populateCurrentSettings: ", data);

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            
            $("#inputID").val(this._id);
            $("#inputTerminal").val(this.Terminal);
            $("#inputUserName").val(this.UserName);
            $("#inputLowProFileURL").val(this.LowProFileURL);
            $("#inputAsimonURL").val(this.AsimonURL);
            $("#inputOperation").val(this.Operation);
            $("#inputDocTypeToCreate").val(this.DocTypeToCreate);
            $("#inputShowCardOwnerPhone").val(this.ShowCardOwnerPhone);
            $("#inputShowCardOwnerEmail").val(this.ShowCardOwnerEmail);
            $("#inputSFDCLoginUser").val(this.SFDCLoginUser);
            $("#inputSFDCLoginPass_Token").val(this.SFDCLoginPass_Token);
            $("#inputSFDCEnvironmentURL").val(this.SFDCEnvironmentURL);
            $("#inputAttempts").val(this.Attempts);

        });
        

    }); 
    

};

// Perform Login
function Login(event) {
    
    var loginStatus = localStorage.getItem("login");
    
    if (loginStatus!="true") {
        
        var userID = $("#userID").val();
        var Password = $("#password").val();
        
        var url = '/anno/Login/' + userID + '/' + Password;
    
        // jQuery AJAX call for JSON
        $.getJSON( url, function( data ) {
            
    
            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function(){
    
                if (this.login=="true") {
                    
                    $( "div#login" ).fadeOut( "slow" );
                    
                    $( "div#Menu" ).fadeIn( "slow" ); 
                    
                    $( "#manage" ).fadeIn( "slow" );
                    
                    localStorage.setItem("login","true");
                    
                }
    
            });
     
                 if (data.length<1) {
                    
                   $("div#loginmsg").fadeIn( "slow" );
                    
                }     
    
        }); 
        
        
    } else {

                    $( "div#login" ).fadeOut( "slow" );
                    
                    $( "#manage" ).fadeIn( "slow" );  
                    
                    $( "div#Menu" ).fadeIn( "slow" );       
        
    }
    
};


    
    
    
// Fill SFDC table with data
function getReoccuringList() {
  
    // Empty content string
    var tableContent = '';
    var url = '/anno/getReoccuringList/' + BillDateGroup;

    
    // jQuery AJAX call for JSON
    $.getJSON( url, function( data ) {
        
        console.log(data.records);

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data.records, function(){
        
            // Stick our user data array into a userlist variable in the global object
    		ListData = data.records;
            
        
            tableContent += '<tr>';
            tableContent += '<td><a href=https://eu6.salesforce.com/' + this.Id + ' target=_blank> Open </a></td>';
            tableContent += '<td>' + this.Amount__c + '</td>';
            tableContent += '<td>' + this.BillDateGroup__c + '</td>';
            tableContent += '<td>' + this.attempts__c + '</td>';
            tableContent += '<td>' + this.donarid__c + '</td>';
            tableContent += '<td>' + this.Status__c + '</td>';
            tableContent += '</tr>';            

        });
       
        $('#ReoccuringList').html(tableContent);
        
        $( "#Shading" ).fadeIn( "fast" ); 
        
        $( "#manage" ).fadeOut( "slow" );  
        
        $( "#Reoccuring" ).fadeIn( "slow" );  
        

        
        

    }); 
    

};

