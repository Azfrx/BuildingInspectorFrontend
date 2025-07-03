import {
    setFrontPhoto
} from "@/utils/writeNew";
import {
    getFrontPhoto
} from "@/utils/readJsonNew.js";
export async function setFrontPhotoCommited(userName, buildingId){
    const data = await getFrontPhoto(userName, buildingId);
    data.commitType = 1;
    await setFrontPhoto(userName, buildingId, data);
}
export async function setFrontPhotoUnCommited(userName, buildingId){
    const data = await getFrontPhoto(userName, buildingId);
    data.commitType = 0;
    await setFrontPhoto(userName, buildingId, data);
}
export async function isPhotoCommmitted(userName, buildingId){
    const data = await getFrontPhoto(userName, buildingId);
    return data.commitType;
}