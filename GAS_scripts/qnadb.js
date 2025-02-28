const dbsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("qnadb");
const sorted_dbsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("qnadb_sorted_versions");
const full_workbook = SpreadsheetApp.getActiveSpreadsheet();

function qna_tester() {

  // Logger.log(qna_upload_question(`1740145332|2025-02-21|Feb 21, Fri`,
  //   JSON.stringify({
  //     question: "how are you Pr?",
  //     jaiHO: "Hare Krishna",
  //   })))

  // Logger.log(JSON.stringify(qna_get_qnadb_2d()))

}

function qna_upload_question(question_date_id, question_dict_json) {

  try {
    const new_row = parseInt(dbsheet.getRange("B2").getValue(), 10) + 1;

    dbsheet.getRange(new_row, 3, 1, 4)
      .setValues([[
        `=EN_QUOTE(INDIRECT("E"&D${new_row}))&":"& EN_BRACKET(JOIN(",", {EN_QUOTE("question_data")&":"&INDIRECT("F"&D${new_row}),
      EN_QUOTE("edit_row")&":"&D${new_row},
      EN_QUOTE("answer_by_user")&":"& EN_BRACKET(JOIN(",", ARRAYFORMULA(EN_DICT_KD(INDIRECT($B$13), ARRAYFORMULA( EMBED_STATUS( INDIRECT(SUBSTITUTE($B$13,"1",D${new_row}))))))))}))`,
        null,
        question_date_id,
        question_dict_json]
      ])
    return { status: "success" }
  }
  catch (error) {
    Logger.log(error)
    return { status: "failed" }
  }
}

function qna_modify_quiz(payload, target_row) {
  try {
    dbsheet.getRange(target_row, 6)
      .setValue(payload)
    return { status: "success" }
  }
  catch (error) {
    Logger.log(error)
    return { status: "failed" }
  }
}
function qna_upload_to_cell(payload, target_row, target_col) {
  try {
    dbsheet.getRange(target_row, target_col)
      .setValue(payload)
    return { status: "success" }
  }
  catch (error) {
    Logger.log(error)
    return { status: "failed" }
  }
}


function qna_get_qnadb_2d() {
  try {
    const num_existing_row = parseInt(dbsheet.getRange("B2").getValue(), 10) - 1;
    if (num_existing_row > 0) {
      const num_rows = Math.min(num_existing_row, 5);
      // Logger.log(`A2:A${1 + num_rows}`)

      const data = sorted_dbsheet.getRange(`A2:A${1 + num_rows}`)
        .getValues();

      // Logger.log(data); // View the result in logs
      // return
      var jsonString = "{" + data.flat().join(",") + "}";

      // Logger.log(jsonString); // View the result in logs

      var mergedDict = JSON.parse(jsonString); // Convert to JSON
      // Logger.log(mergedDict); // View the result in logs
      // return mergedDict;



      return {
        status: "success",
        fulldb: mergedDict,
        creator: full_workbook.getRangeByName("q_creator").getValue()
      }
    }
    else {
      return {
        status: "success",
        fulldb: {},
        creator: full_workbook.getRangeByName("q_creator").getValue()
      }
    }


  }
  catch (error) {
    Logger.log(error);
    return { status: "failed" }
  }
}


// function qna_get_qnadb_2d() {
//   try {
//     const sorted_lastcol = sorted_dbsheet.getLastColumn()-1;
//     const num_rows = Math.min(sorted_dbsheet.getLastRow(),5);

//     const alldb = sorted_dbsheet.getRange(1,2,num_rows,sorted_lastcol)
//       .getValues();
//     // Logger.log(alldb)

//     const skip_cols = 3;
//     // basically after 3 columns user's data start
//     let all_data_date_wise = {}
//     let user_list = alldb[0].slice(skip_cols);

//     // iterating for each date
//     alldb.slice(1).forEach(row => {
//       if (row[1].trim().length > 0) {
//         let current_date_editrow = row[0];
//         let current_date_dateKEY = row[1];
//         let current_date_qna = JSON.parse(row[2].replace(/(\r\n|\r|\n)/g, "\\n"));

//         let user_answer_dict = {}
//         // iterate through all users for this date
//         row.slice(skip_cols).forEach((cell, cell_index) => {
//           // save the answers for this date
//           let answer = { status: "pending" };
//           if (cell != "") {
//             // user have answered
//             // Logger.log(cell)
//             answer = {
//               ...JSON.parse(cell.replace(/(\r\n|\r|\n)/g, "\\n")),
//               status: 'done'
//             };
//           }
//           user_answer_dict[user_list[cell_index]] = answer
//         });

//         // push the current date's data with key as long_date_key
//         all_data_date_wise[current_date_dateKEY] = {
//           question_data: current_date_qna,
//           edit_row: current_date_editrow,
//           answer_by_user: user_answer_dict
//         }
//       }
//     })
//     return {
//       status: "success",
//       fulldb: all_data_date_wise,
//       creator: full_workbook.getRangeByName("q_creator").getValue()
//     }


//   }
//   catch (error) {
//     Logger.log(error);
//     return { status: "failed" }
//   }
// }