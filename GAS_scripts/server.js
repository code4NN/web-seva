function doGet(e) {

    // Default HTML file to serve
    let htmlFile = 'main';
  
    // Check if any parameters are provided
    // if (e.parameters && Object.keys(e.parameters).length > 0) {
    //   // Log all parameters for debugging
    //   // console.log("Query Parameters:", JSON.stringify(e.parameters));
  
    //   // Get the 'page' parameter if it exists
    //   const page = e.parameter.target;
  
    //   // Decide the HTML file to serve based on the 'page' parameter
    //   if (page === 'mquiz') {
    //     htmlFile = 'create_quiz';
    //   } else if (page === 'quiz') {
    //     htmlFile = 'quiz_result'
    //   }
    // }
  
    // Serve the selected HTML file
    return HtmlService.createHtmlOutputFromFile(htmlFile)
      .setTitle("SPORT")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      // .setFaviconUrl()
  }
  
  
  
  // function doGet() {
  //   return HtmlService.createHtmlOutputFromFile('index');
  // }
  
  
  // // Function to validate username and password
  // function checkUserCredentials(username, password) {
  
  //   Logger.log(`username: ${username}, passowrd: ${password}`)
  //   // username = "shiven";
  //   // password = 'gaur';
  //   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("creds")
  //   var data = sheet.getRange("B1:C5").getValues(); // Get all data from the sheet
  
  //   var userExists = false;
  //   var isValidUser = false;
  
  //   // Loop through the data to check if the username exists and if the password matches
  //   for (var i = 1; i < data.length; i++) {  // Skip header row
  //     if (data[i][0] === username) {
  //       userExists = true;
  //       if (data[i][1] === password) {
  //         isValidUser = true;
  //       }
  //       break;
  //     }
  //   }
  
  //   // Return an object with userExists and isValidUser properties
  //   var response = '';
  //   var response_msg = '';
  //   if (!userExists) {
  //     response_msg = "invalid user"
  //   }
  //   else if (!isValidUser) { response_msg = "wrong password" }
  //   else { response = 'valid'; }
  //   Logger.log(`${username}, ${password}, ${response}, ${response_msg}`)
  
  //   return {
  //     userExists: userExists,
  //     isValidUser: isValidUser,
  //     "result": response,
  //     "result_msg": response_msg
  //   };
  // }  