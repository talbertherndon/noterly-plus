import axios from "axios";
import { getSession } from "next-auth/react";
import { API_BASE_URL } from "./config";
import { toast } from "react-toastify";

export async function signUp(data) {
    try {
        return await axios.post(API_BASE_URL + "/auth/signup", data).then((res) => {
            console.log(res);
            return res
        })
    } catch (e) {
       

        throw (e);
    }
}
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
    const { token } = await getSession();

    try {
        return await axios.get(API_BASE_URL + "/sets", { token }).then((res) => {
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