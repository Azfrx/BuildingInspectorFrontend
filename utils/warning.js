import { getObjectUL } from "./readUL";
import { setObject } from "./writeNew";
export async function setWarning(username, buildingId){
	const data = await getObjectUL(username,buildingId)
	data.warning = true;
	await setObject(username, buildingId, data);
}
export async function readWarning(username, buildingId){
	const data = await getObjectUL(username,buildingId)
	if(data.warning === true){
		return true;
	}else{
		return false;
	}
}
