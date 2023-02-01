import axios from "axios";
import { API_BASE_URL } from "./config";

export async function createSet(payload) {
    console.log(payload);
    try {
        return await axios.post(API_BASE_URL + "/sets", payload).then((res) => {
            console.log(res);
            return res
        })

    } catch (e) {
        console.log(e)
        throw (e);
    }
}

export async function getSets() {

    try {
        return await axios.get(API_BASE_URL + "/sets").then((res) => {
            console.log(res);
            return res
        })

    } catch (e) {
        console.log(e)
        throw (e);
    }
}


export async function getMySets(user_id) {

    try {
        return await axios.get(API_BASE_URL + `/sets_by_user?user_id=${user_id}`).then((res) => {
            console.log(res);
            return res
        })

    } catch (e) {
        console.log(e)
        throw (e);
    }
}