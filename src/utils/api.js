import axios from "axios";
import { getSession } from "next-auth/react";
import { API_BASE_URL } from "./config";
import { toast } from "react-toastify";

export async function signUp(data) {
  try {
    return await axios.post(API_BASE_URL + "/auth/signup", data).then((res) => {
      console.log(res);
      return res;
    });
  } catch (e) {
    throw e;
  }
}
export async function createSet(payload) {
  console.log(payload);
  try {
    return await axios.post(API_BASE_URL + "/sets", payload).then((res) => {
      console.log(res);
      return res;
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function editSet(payload, set_id) {
  console.log(payload);
  try {
    return await axios
      .post(API_BASE_URL + `/sets/${set_id}`, payload)
      .then((res) => {
        console.log(res);
        return res;
      });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function getSets() {
  try {
    return await axios.get(API_BASE_URL + "/sets").then((res) => {
      console.log(res);
      return res;
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function getSet(set_id) {
  try {
    return await axios.get(API_BASE_URL + "/sets/" + set_id);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getMySets(user_id) {
  const { token } = await getSession();

  try {
    return await axios
      .get(API_BASE_URL + `/sets_by_user?user_id=${user_id}`, { token })
      .then((res) => {
        console.log(res);
        return res;
      });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function startSession(user_id, sets_id) {
  try {
    return await axios
      .post(API_BASE_URL + `/session`, { sets_id, user_id })
      .then((res) => {
        return res.data;
      });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function endSession(user_id, sets_id) {
  try {
    return await axios
      .post(API_BASE_URL + `/session_end`, { sets_id, user_id })
      .then((res) => {
        return res.data;
      });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function joinSession(code, user_id) {
  try {
    return await axios
      .get(API_BASE_URL + `/session?code=${code}&user_id=${user_id}`)
      .then((res) => {
        return res.data;
      });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function leaveSession(payload) {
  try {
    return await axios
      .patch(API_BASE_URL + `/session_leave`, payload)
      .then((res) => {
        return res.data;
      });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function nextQuestion(user_id, sets_id) {
  try {
    return await axios
      .post(API_BASE_URL + `/next?user_id=${user_id}&sets_id=${sets_id}`)
      .then((res) => {
        return res.data;
      });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function postAnswer(payload) {
  try {
    return await axios.post(API_BASE_URL + `/response`, payload).then((res) => {
      return res.data;
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
