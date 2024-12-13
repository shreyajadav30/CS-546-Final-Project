import { ObjectId } from 'mongodb';

const isValidBoolean = (bool, paramName = 'Parameter') => {
	if (typeof bool !== 'boolean') {
		throw new Error(`${paramName} must be a boolean value`);
	}
};

const isValidString = (
	str,
	paramName = 'String param',
	returnTrimValue = true
) => {
	if (!str) throw new Error(`You must provide a ${paramName}`);
	if (typeof str !== 'string')
		throw new Error(`${paramName} should be of type of string`);
	if (!str.trim())
		throw new Error(
			`${paramName} cannot be an empty string or just spaces`
		);
	return returnTrimValue ? str.trim() : str;
};

const isValidNumber = (num, paramName = 'Number', throwError = true) => {
	const isValid = typeof num === 'number' && !isNaN(num);
	if (throwError && !isValid)
		throw new Error(`${paramName} should be a valid number`);
	return isValid;
};

const isValidWholeNumber = (num, paramName = 'Number') => {
	isValidNumber(num, paramName);
	let isValid = typeof num === 'number' && !isNaN(num);
	if (!isValid) throw new Error(`${paramName} should be a valid number`);
	isValid = Number.isInteger(num) && num >= 0;
	if (!isValid) throw new Error(`${paramName} should be a whole number`);
	return isValid;
};

const isValidArray = (arr, paramName = 'Array') => {
	if (!arr) throw new Error(`You must provide ${paramName}`);
	if (typeof arr !== 'object' || !Array.isArray(arr))
		throw new Error(
			`Invalid ${paramName}, ${paramName} should be an array`
		);
	if (!arr.length)
		throw new Error(`${paramName} argument should have at least one value`);
};

const isValidObject = (obj, paramName = 'Object', checkKeyLength = true) => {
	if (!obj) throw new Error(`You must provide a ${paramName}`);
	if (typeof obj !== 'object')
		throw new Error(`${paramName} should be of type object`);
	if (typeof obj === 'object') {
		if (Array.isArray(obj)) {
			throw new Error(`${paramName} cannot be an array`);
		} else {
			if (checkKeyLength && !Object.keys(obj).length)
				throw new Error(`${paramName} cannot be an empty object`);
		}
	}
};

const isValidObjectId = (id, paramName = 'ID') => {
	id = isValidString(id, paramName);
	if (!ObjectId.isValid(id)) throw new Error(`Invalid ${paramName}`);
	return ObjectId.createFromHexString(id);
};

const validationMethods = {
	isValidBoolean,
	isValidString,
	isValidNumber,
	isValidWholeNumber,
	isValidArray,
	isValidObject,
	isValidObjectId,
};

const saltRounds = 16;

export { validationMethods, saltRounds };
