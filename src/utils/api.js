import axios from "axios";
import { API_BASE_URL } from "./config";

export async function createSet(payload) {
    try {
        return await axios.post(API_BASE_URL + "/sets", { payload }).then((response) => {
            console.log(response);
            return res
        })

    } catch (e) {
        console.log(e)
        throw (e);
    }
}

