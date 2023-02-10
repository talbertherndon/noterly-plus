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

export async function editSet(payload, set_id) {
    console.log(payload);
    try {
        return await axios.post(API_BASE_URL + `/sets/${set_id}`, payload).then((res) => {
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
export async function getSet(set_id) {
    try {
        return await axios.get(API_BASE_URL + '/sets/' + set_id)
    } catch (e) {
        console.log(e);
        throw (e);
    }
}

export async function getMySets(user_id) {
    const { token } = await getSession();

    try {
        return await axios.get(API_BASE_URL + `/sets_by_user?user_id=${user_id}`, { token }).then((res) => {
            console.log(res);
            return res
        })

    } catch (e) {
        console.log(e)
        throw (e);
    }
}