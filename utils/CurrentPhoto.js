import { getObjectUL } from "./readUL";
import { setObject } from "./writeNew";
export async function setCommit0(username, buildingId){
	const data = await getObjectUL(username,buildingId)
	data.commit = 0;
	await setObject(username, buildingId, data);
}
export async function setCommit1(username, buildingId){
	const data = await getObjectUL(username,buildingId)
	data.commit = 1;
	await setObject(username, buildingId, data);
}
export async function readCommit(username, buildingId){
	const data = await getObjectUL(username,buildingId)
	return data.commit;
}
