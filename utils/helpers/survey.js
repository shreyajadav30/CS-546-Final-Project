export function checkString(strVal,varName){
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') 
        throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
        throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
      return strVal;
  }
  
  export function sDateValidate(startDate){
    const today = new Date();
    if(startDate < today){
      throw 'Error: Start date cannot be in the past!';
    }
    return startDate;
  }
  
  export function eDateValidate(startDate,endDate){
    if(endDate < startDate){
      throw 'Error: End Date must be on or after the Start Date!';
    }
    return endDate;
  }
  
  export function statusValid(status){
    if (!status || (status !== 'active' && status !== 'inactive')) {
      throw ('Error : Status must be either "active" or "inactive".');
  }
  return status;
  }