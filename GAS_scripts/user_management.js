/* 
Ensure these while using these scripts which are meant to manage user's data
* a sheet named creds is present
* scriptProperties have userdb_last_filled_row to get last filled row
* schema of creds is. 1st column is row. BCD are username, password and name
RESERVED keys creds (sheetname), username (column name), userdb_last_filled_row (scriptProps key)

*/
const creds_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('creds');

function login_tester() {
  // Logger.log(dbsheet.getRange(1,dbsheet.getLastColumn()).getValue())
  // Logger.log(JSON.stringify(login_get_all_users(true)))

  // // testing fore new_registration
  // Logger.log(login_new_registration({
  //   username: '=shivend',
  //   password: '2345',
  //   display_name: 'pending',
  //   email: 'abc@gmail.com',
  //   phone: '1234567890'
  // }))

    Logger.log(JSON.stringify(login_validateUserLogin("=shivend","2345")))
}

function login_new_registration(registration_details) {

  // check again for the valid user

  const requiredKeys = ["username", "password", "display_name", "email", "phone"];

  const allKeysPresent = requiredKeys.every(key => Object.hasOwn(registration_details, key));
  if (!allKeysPresent) { return { status: 'missing' } }



  const existing_users = creds_sheet.getRange(3, 2, creds_sheet.getLastRow() - 2, 1)
    .getValues()
    .map(row => row[0])
  if (existing_users.includes(registration_details.username)) {
    return { status: 'taken' }
  }
  else {
    // 
    const lock = LockService.getScriptLock(); // Get a script-wide lock
    try {
      lock.waitLock(5000); // Wait up to 5 seconds to acquire the lock


      // row	username	password	display_name	email	phone	db_col	role
      const newRow = [
        null, // row number
        `="${registration_details.username}"`,
        `="${registration_details.password}"`,
        `="${registration_details.display_name}"`,
        `="${registration_details.email}"`,
        `="${registration_details.phone}"`,
      ]
      creds_sheet.appendRow(newRow);
      return { status: 'success' }

    } catch (e) {
      Logger.log("Could not acquire lock: " + e.message);
      return { status: 'failed' }
    } finally {
      lock.releaseLock(); // Release lock after execution
    }

  }
}

function login_validateUserLogin(username, password) {

  const userCredentials = _login_get_user_credentials()

  // Check if the username exists

  if (!userCredentials[username]) {
    return { status: 'nouser', creds: {} };
  }
  else {
    // Get the user data for the given username
    const userData = userCredentials[username];

    // Check if the password matches
    if (userData.password.value !== password) {
      return { status: 'failed', creds: {} };
    }
    else if (userData.display_name.value === 'pending') {
      return { status: 'pending', creds: {} }
    }
    else {

      // Return success with the user's credentials
      return { status: 'success', creds: userData };
    }
  }
}



function _login_get_user_credentials() {
  // Open the sheet
  const data = creds_sheet
    .getDataRange()
    .getValues();


  // Extract header rows
  const columnIds = data[0]; // First header row with column IDs
  const fieldNames = data[1]; // Third header row with field names

  // Find the username column index
  const usernameColIndex = fieldNames.indexOf("username");

  // Initialize the user dictionary
  const userDict = {};

  // Iterate through rows starting from the 4th row (data rows)
  data.slice(2).forEach((row) => {
    const username = row[usernameColIndex];

    if (username) {
      const userData = {};

      fieldNames.slice(1).forEach((field_name, field_name_index) => {
        let new_field_name_index = field_name_index + 1 // to exclude the `row` column
        const field = field_name;
        const value = row[new_field_name_index];
        const range = `${columnIds[new_field_name_index]}${row[0]}`;

        userData[field] = { value: value, addr: range };
      });
      userDict[username] = userData;
    }
  });

  // Return the user dictionary
  return userDict;
}


function login_get_all_users(get_pending_only) {
  try {
    const alldata = _login_get_user_credentials()

    if (get_pending_only) {
      return {
        status: 'success',
        data: Object.fromEntries(
          Object.entries(alldata).filter(([username, userdata]) => userdata.display_name.value === "pending")
        )
      }
    }
    else {
      return { status: "success", data: alldata }
    }
  }
  catch (error) {
    Logger.log(error)
    return { status: "failed", data: {} }
  }
}


function login_verifyUserCreds(username, address, new_value) {

  try {
    // update the name in credential sheet
    creds_sheet
      .getRange(address)
      .setValue(`="${new_value}"`);
    
    // add the name in database
    dbsheet.getRange(1, dbsheet.getLastColumn() + 1)
      .setValue(`="${username}"`);
    return { status: "success" }
  }
  catch (error) {
    Logger.log(error);
    return { status: "failed" }
  }
}
